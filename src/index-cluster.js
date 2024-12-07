const Redis = require("ioredis");

const primaryWrite = new Redis.Cluster([
  {
    host: "localhost",
    port: 6385,
  },
]);

const reader = new Redis.Cluster([
  {
    host: "localhost",
    port: 6386,
  },
]);

const cluster = new Redis.Cluster([
  {
    host: "localhost",
    port: 6379,
  },
  {
    host: "localhost",
    port: 6380,
  },
  {
    host: "localhost",
    port: 6381,
  },
  {
    host: "localhost",
    port: 6382,
  },
  {
    host: "localhost",
    port: 6383,
  },
  {
    host: "localhost",
    port: 6384,
  },
]);
