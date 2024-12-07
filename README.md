# Redis

## Replica mode 

- This configuration sets up a Redis Replica Mode with 1 primary, 2 replicas, HAProxy for load balancing, and RedisInsight for management.

```shell
docker-compose -f docker-compose-replica.yaml up
```

```shell
docker-compose -f docker-compose-replica.yaml down -v
```

## Cluster mode

- This configuration sets up a 6-node Redis Cluster with RedisInsight for management and automatic cluster initialization.

```shell
docker-compose -f docker-compose-cluster.yaml up
```

```shell
docker-compose -f docker-compose-cluster.yaml down -v
```