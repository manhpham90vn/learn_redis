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

  const bod = await redis.set("user:2:name", "Bod");
  console.log("response set key nameing: ", bod);

  // key pattern matching
  const keys = await redis.keys("user:*");
  console.log("response keys pattern: ", keys);

  // Get all keys
  const allKeys = await redis.keys("*");
  console.log("response all keys: ", allKeys);

  // Rename a key
  const rename = await redis.rename("user:1:name", "user:1:username");
  console.log("response rename: ", rename);

  // Rename a key only if the new key does not exist
  const renamenx = await redis.renamenx("user:1:username", "user:1:name");
  console.log("response renamenx: ", renamenx);

  // Delete keys asynchronously (for large number of keys)
  const del = await redis.unlink("user:1:name", "user:2:name");
  console.log("response unlink: ", del);

  // Get the type of a key
  const type = await redis.type("key2");
  console.log("response type: ", type);

  // Observer key expiration
  redis.subscribe("__keyevent@0__:expired", (err, count) => {
    if (err) {
      console.log("Error subscribing: ", err);
    } else {
      console.log("Subscribed to key expiration events");
    }
  });

  // Observer key deletion
  redis.subscribe("__keyevent@0__:del", (err, count) => {
    if (err) {
      console.log("Error subscribing: ", err);
    } else {
      console.log("Subscribed to key deletion events");
    }
  });

  redis.on("message", (channel, message) => {
    console.log("message: ", channel, message);
  });
};

const stringBasic = async () => {
  // Count number increment
  const count = await redis.incr("count");
  console.log("response incr: ", count);

  // Count number decrement
  const count2 = await redis.decr("count");
  console.log("response decr: ", count2);

  // Count number increment floating point
  const count3 = await redis.incrbyfloat("count_float", 1.5);
  console.log("response incrbyfloat: ", count3);

  // Append a value to a key
  const append = await redis.append("key", "value");
  console.log("response append: ", append);

  // Get length of value
  const length = await redis.strlen("key");
  console.log("response strlen: ", length);

  // Set multiple keys
  const mset = await redis.mset("key1", "value1", "key2", "value2");
  console.log("response mset: ", mset);

  // Get multiple keys
  const mget = await redis.mget("key1", "key2");
  console.log("response mget: ", mget);

  // Set multiple keys only if none of the keys exist
  const msetnx = await redis.msetnx(
    "key1",
    "value11",
    "key2",
    "value22",
    "key3",
    "value33"
  );
  console.log("response msetnx: ", msetnx);

  // Getset a key
  const getset = await redis.getset("key", "new_value");
  console.log("response getset: ", getset);
  console.log("getset: ", await redis.get("key"));

  // Get range of value
  const range = await redis.getrange("key", 0, 3);
  console.log("response getrange: ", range);

  // Replace part of value
  const replace = await redis.setrange("key", 0, "000");
  console.log("response setrange: ", replace);

  // Set a key with an expiration time in seconds
  const setex = await redis.setex("key", 10, "value");
  console.log("response setex: ", setex);

  // Set a key with an expiration time in milliseconds
  const psetex = await redis.psetex("key", 10000, "value");
  console.log("response psetex: ", psetex);

  // Set a key only if it does not exist
  const setnx = await redis.setnx("key999", "value");
  console.log("response setnx: ", setnx);

  // serialize and deserialize
  const serialize = await redis.set("json", JSON.stringify({ key: "value" }));
  console.log("response serialize: ", serialize);

  const deserialize = await redis.get("json");
  console.log("response deserialize: ", JSON.parse(deserialize));

  // scan keys
  const scan = await redis.scan(0);
  console.log("response scan: ", scan);

  // scan all keys
  let cursor = 0;
  let allKeys = [];
  do {
    const [newCursor, keys] = await redis.scan(cursor);
    cursor = newCursor;
    allKeys = allKeys.concat(keys);
  } while (cursor !== "0");
  console.log("response all keys: ", allKeys);
};

stringBasic();
