const Redis = require("ioredis");

const redis = new Redis([
  {
    // Master (write)
    host: "redis",
    port: 6379,
  },
  {
    // Replica (read)
    host: "redis-replica",
    port: 6380,
  },
]);

const basic = async () => {
  // Set a key
  const result = await redis.set("key", "value");
  console.log("response set: ", result);

  // Get a key
  const value = await redis.get("key");
  console.log("response get: ", value);

  // Delete a key
  const deleted = await redis.del("key");
  console.log("response del: ", deleted);

  // Check if a key exists
  const exists = await redis.exists("key");
  console.log("response exists: ", exists);

  // Set a key with an expiration time in seconds
  const result2 = await redis.set("key2", "value", "EX", 60);
  console.log("response set with expiration time: ", result2);

  // Get the time to live for a key
  const ttl = await redis.ttl("key2");
  console.log("response ttl: ", ttl);

  // Set a key's time to live in seconds
  const expire = await redis.expire("key2", 10);
  console.log("response expire: ", expire);

  // Remove the expiration from a key
  const persist = await redis.persist("key2");
  console.log("response persist: ", persist);

  // key nameing convention
  const alice = await redis.set("user:1:name", "Alice");
  console.log("response set key nameing: ", alice);

  // Observer key expiration
  redis.subscribe("__keyevent@0__:expired", (err, count) => {
    if (err) {
      console.log("Error subscribing: ", err);
    } else {
      console.log("Subscribed to key expiration events");
    }
  });

  redis.on("message", (channel, message) => {
    console.log("message: ", channel, message);
  });
};

basic();
