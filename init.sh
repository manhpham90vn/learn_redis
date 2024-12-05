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
  redis-cli -c -h "$IP" -p 6379 cluster nodes | grep "$IP" | awk '{print $1}'
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
  
  echo "[redis-cluster-init] Assigning $REPLICA_NODE as a replica of $PRIMARY_NODE"
  
  # Add the replica node to the cluster
  redis-cli --cluster add-node "$REPLICA_NODE" "$PRIMARY_NODE"
  
  # Get the NodeID of the primary node
  PRIMARY_NODE_ID=$(get_node_id "$PRIMARY_NODE")
  
  # Assign the replica node to the primary node
  redis-cli -c -h "$(echo "$REPLICA_NODE" | cut -d':' -f1)" -p 6379 cluster replicate "$PRIMARY_NODE_ID"

  # Check if the replica node was assigned successfully
  echo "[redis-cluster-init] Verifying $REPLICA_NODE is now a replica of $PRIMARY_NODE"
  redis-cli -c -h "$(echo "$REPLICA_NODE" | cut -d':' -f1)" -p 6379 cluster info | grep "role"
done

echo "[redis-cluster-init] Redis Cluster configuration is complete!"
