const Redis = require("ioredis");

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

cluster.on("error", (err) => {
  console.error("Cluster error: ", err);
});

cluster.on("ready", () => {
  console.log("Cluster is ready!");
});

cluster.on("connect", () => {
  console.log("Cluster is connecting...");
});

cluster.on("node error", (err, node) => {
  console.error(`Error on node ${node.options.host}:${node.options.port}`, err);
});


const testPrimaryWrite = async () => {
  try {
    console.log("cluster: ", cluster);

    const ping = await cluster.ping();
    console.log("response ping: ", ping);

    const result = await cluster.set("key", "value");
    console.log("response set: ", result);

    const resultGet = await cluster.get("key");
    console.log("response get: ", resultGet);
  } catch (error) {
    console.error("Error occurred: ", error);
  }
}

testPrimaryWrite()