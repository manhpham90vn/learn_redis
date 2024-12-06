#!/bin/bash
set -e  # Stop the script on any error

# Define primary and replica node IP addresses with ports
PRIMARY_NODES=("10.0.0.2:6379" "10.0.0.3:6379" "10.0.0.4:6379")
REPLICA_NODES=("10.0.0.5:6379" "10.0.0.6:6379" "10.0.0.7:6379")

# Function to wait for a Redis node to be ready
wait_for_node() {
  local NODE=$1
  local IP=$(echo "$NODE" | cut -d':' -f1)  # Extract the IP
  while ! redis-cli -h "$IP" -p 6379 PING > /dev/null 2>&1; do
    echo "[redis-cluster-init] Node $NODE is not ready, waiting for 1 second..."
    sleep 1
  done
}

# Function to get the NodeID of a Redis instance
get_node_id() {
  local NODE=$1
  local IP=$(echo "$NODE" | cut -d':' -f1)  # Extract the IP
  redis-cli -c -h "$IP" -p 6379 cluster nodes | awk -v ip="$IP" '$2 ~ ip":6379" {print $1}'
}

wait_for_replica() {
  local PRIMARY_IP=$1
  local REPLICA_IP=$2
  while ! redis-cli -h "$PRIMARY_IP" -p 6379 cluster nodes | grep -q "$REPLICA_IP"; do
    echo "[redis-cluster-init] Waiting for replica node $REPLICA_IP to be connected to primary node $PRIMARY_IP..."
    sleep 2
  done
}

replicate_node() {
  local PRIMARY_IP=$1
  local REPLICA_IP=$2
  local PRIMARY_NODE_ID=$3
  echo "[redis-cluster-init] Assigning replica node $REPLICA_IP to primary node with ID $PRIMARY_NODE_ID..."

  # Wait for the replica node to be fully ready
  wait_for_replica "$PRIMARY_IP" "$REPLICA_IP"

  # Run the replication command
  redis-cli -h "$REPLICA_IP" -p 6379 cluster REPLICATE "$PRIMARY_NODE_ID"
  
  # Verify if the replication was successful
  REPLICA_INFO=$(redis-cli -h "$REPLICA_IP" -p 6379 cluster nodes | grep "$REPLICA_IP")
  if echo "$REPLICA_INFO" | grep -q "slave" && echo "$REPLICA_INFO" | grep -q "$PRIMARY_NODE_ID"; then
    echo "[redis-cluster-init] SUCCESS: $REPLICA_IP is now a replica of $PRIMARY_NODE_ID."
  else
    echo "[redis-cluster-init] ERROR: $REPLICA_IP was not assigned as a replica of $PRIMARY_NODE_ID."
    exit 1
  fi
}

# Step 1: Wait for all nodes to be ready
echo "[redis-cluster-init] Waiting for all Redis nodes to be ready..."
for NODE in "${PRIMARY_NODES[@]}" "${REPLICA_NODES[@]}"; do
  wait_for_node "$NODE"
done
echo "[redis-cluster-init] All Redis nodes are ready."

# Step 2: Create a Redis cluster with primary nodes only
PRIMARY_NODE_ADDRESSES=$(IFS=" "; echo "${PRIMARY_NODES[*]}")
echo "[redis-cluster-init] Creating Redis Cluster with primary nodes: ${PRIMARY_NODES[*]}"
redis-cli --cluster create $PRIMARY_NODE_ADDRESSES --cluster-replicas 0 --cluster-yes

# Step 3: Add replica nodes and assign them to primary nodes
echo "[redis-cluster-init] Adding replica nodes to the cluster..."
for i in "${!REPLICA_NODES[@]}"; do
  PRIMARY_NODE=${PRIMARY_NODES[$i]}
  REPLICA_NODE=${REPLICA_NODES[$i]}
  PRIMARY_IP=$(cut -d':' -f1 <<< "$PRIMARY_NODE")
  REPLICA_IP=$(cut -d':' -f1 <<< "$REPLICA_NODE")
  
  echo "[redis-cluster-init] Assigning $REPLICA_NODE as a replica of $PRIMARY_NODE"
  
  # Add the replica node to the cluster
  redis-cli --cluster add-node "$REPLICA_NODE" "$PRIMARY_NODE"
  
  # Get the NodeID of the primary node
  PRIMARY_NODE_ID=$(get_node_id "$PRIMARY_NODE")
  
  # Replicate the replica node to the primary node
  replicate_node "$PRIMARY_IP" "$REPLICA_IP" "$PRIMARY_NODE_ID"
done

echo "[redis-cluster-init] Redis Cluster configuration is complete!"
