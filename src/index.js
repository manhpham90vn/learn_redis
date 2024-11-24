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
  // The set command is used to set a key to a value.
  const result = await redis.set("key", "value");
  console.log("response set: ", result);

  // Get a key
  // The get command is used to get the value of a key.
  const value = await redis.get("key");
  console.log("response get: ", value);

  // Delete a key
  // The del command is used to delete a key.
  const deleted = await redis.del("key");
  console.log("response del: ", deleted);

  // Check if a key exists
  // The exists command is used to check if a key exists.
  const exists = await redis.exists("key");
  console.log("response exists: ", exists);

  // Set a key with an expiration time in seconds
  // The set command can be used to set a key with an expiration time in seconds.
  const result2 = await redis.set("key2", "value", "EX", 60);
  console.log("response set with expiration time: ", result2);

  // Get the time to live for a key
  // The ttl command is used to get the time to live for a key.
  const ttl = await redis.ttl("key2");
  console.log("response ttl: ", ttl);

  // Set a key's time to live in seconds
  // The expire command is used to set a key's time to live in seconds.
  const expire = await redis.expire("key2", 10);
  console.log("response expire: ", expire);

  // Remove the expiration from a key
  // The persist command is used to remove the expiration from
  const persist = await redis.persist("key2");
  console.log("response persist: ", persist);

  // key nameing convention
  // The key nameing convention is used to group keys.
  const alice = await redis.set("user:1:name", "Alice");
  console.log("response set key nameing: ", alice);

  const bod = await redis.set("user:2:name", "Bod");
  console.log("response set key nameing: ", bod);

  // key pattern matching
  // The keys command is used to get all keys matching a pattern.
  const keys = await redis.keys("user:*");
  console.log("response keys pattern: ", keys);

  // Get all keys
  // The keys command is used to get all keys.
  const allKeys = await redis.keys("*");
  console.log("response all keys: ", allKeys);

  // Rename a key
  // The rename command is used to rename a key.
  const rename = await redis.rename("user:1:name", "user:1:username");
  console.log("response rename: ", rename);

  // Rename a key only if the new key does not exist
  // The renamenx command is used to rename a key only if the new key does not exist.
  const renamenx = await redis.renamenx("user:1:username", "user:1:name");
  console.log("response renamenx: ", renamenx);

  // Delete keys asynchronously (for large number of keys)
  // The unlink command is used to delete keys asynchronously
  const del = await redis.unlink("user:1:name", "user:2:name");
  console.log("response unlink: ", del);

  // Get the type of a key
  // The type command is used to get the type of a key.
  const type = await redis.type("key2");
  console.log("response type: ", type);

  // Observer key expiration
  // The subscribe command is used to observer key expiration events.
  redis.subscribe("__keyevent@0__:expired", (err, count) => {
    if (err) {
      console.log("Error subscribing: ", err);
    } else {
      console.log("Subscribed to key expiration events");
    }
  });

  // Observer key deletion
  // The subscribe command is used to observer key deletion events.
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
  // The incr command is used to increment the number stored at key by one.
  const count = await redis.incr("count");
  console.log("response incr: ", count);

  // Count number decrement
  //
  const count2 = await redis.decr("count");
  console.log("response decr: ", count2);

  // Count number increment floating point
  // The incrbyfloat command is used to increment the number stored at key by a floating point number.
  const count3 = await redis.incrbyfloat("count_float", 1.5);
  console.log("response incrbyfloat: ", count3);

  // Append a value to a key
  // The append command is used to append a value to a key.
  const append = await redis.append("key", "value");
  console.log("response append: ", append);

  // Get length of value
  // The strlen command is used to get the length of the value stored at key.
  const length = await redis.strlen("key");
  console.log("response strlen: ", length);

  // Set multiple keys
  // The mset command is used to set multiple keys to their respective values.
  const mset = await redis.mset("key1", "value1", "key2", "value2");
  console.log("response mset: ", mset);

  // Get multiple keys
  // The mget command is used to get the values of multiple keys.
  const mget = await redis.mget("key1", "key2");
  console.log("response mget: ", mget);

  // Set multiple keys only if none of the keys exist
  // The msetnx command is used to set multiple keys to their respective values only if none of the keys exist.
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
  // The getset command is used to set a key to a value and return the old value.
  const getset = await redis.getset("key", "new_value");
  console.log("response getset: ", getset);
  console.log("getset: ", await redis.get("key"));

  // Get range of value
  // The getrange command is used to get a substring of the value stored at key.
  const range = await redis.getrange("key", 0, 3);
  console.log("response getrange: ", range);

  // Replace part of value
  // The setrange command is used to replace part of the value stored at key.
  const replace = await redis.setrange("key", 0, "000");
  console.log("response setrange: ", replace);

  // Set a key with an expiration time in seconds
  // The setex command is used to set a key with an expiration time in seconds.
  const setex = await redis.setex("key", 10, "value");
  console.log("response setex: ", setex);

  // Set a key with an expiration time in milliseconds
  // The psetex command is used to set a key with an expiration time in milliseconds.
  const psetex = await redis.psetex("key", 10000, "value");
  console.log("response psetex: ", psetex);

  // Set a key only if it does not exist
  // The setnx command is used to set a key only if it does not exist.
  const setnx = await redis.setnx("key999", "value");
  console.log("response setnx: ", setnx);

  // serialize and deserialize
  // The set command is used to set a key to a value.
  const serialize = await redis.set("json", JSON.stringify({ key: "value" }));
  console.log("response serialize: ", serialize);

  const deserialize = await redis.get("json");
  console.log("response deserialize: ", JSON.parse(deserialize));

  // scan keys
  // The scan command is used to scan keys.
  const scan = await redis.scan(0);
  console.log("response scan: ", scan);

  // scan all keys
  // The scan command is used to scan all keys.
  let cursor = 0;
  let allKeys = [];
  do {
    const [newCursor, keys] = await redis.scan(cursor);
    cursor = newCursor;
    allKeys = allKeys.concat(keys);
  } while (cursor !== "0");
  console.log("response all keys: ", allKeys);
};

const listBasic = async () => {
  // Push a value to list in the head
  // The lpush command is used to push a value to a list in the head.
  const lpush = await redis.lpush("lpush", "value1", "value2", "value3");
  console.log("response lpush: ", lpush);

  // Push a value to list in the tail
  // The rpush command is used to push a value to a list in the tail.
  const rpush = await redis.rpush("rpush", "value4", "value5", "value6");

  // get value from list at index
  // The lindex command is used to get a value from a list at index.
  const lindex = await redis.lindex("lpush", 0);
  console.log("response lindex: ", lindex);

  // get value from list in range
  // The lrange command is used to get values from a list in range.
  const lrange = await redis.lrange("lpush", 0, -1);
  console.log("response lrange: ", lrange);

  // insert value before or after existing value
  // The linsert command is used to insert a value before or after an existing value in a list.
  const linsert = await redis.linsert("lpush", "BEFORE", "value1", "new_value");
  console.log("response linsert: ", linsert);

  // remove value in list at head
  // The lpop command is used to remove a value in a list at head.
  const lpop = await redis.lpop("lpush");
  console.log("response lpop: ", lpop);

  // remove value in list at tail
  // The rpop command is used to remove a value in a list at tail.
  const rpop = await redis.rpop("lpush");
  console.log("response rpop: ", rpop);

  // trim list
  // The ltrim command is used to trim a list.
  const ltrim = await redis.ltrim("lpush", 0, 1);
  console.log("response ltrim: ", ltrim);

  // update element in list
  // The lset command is used to update an element in a list.
  const lset = await redis.lset("lpush", 0, "new_value");
  console.log("response lset: ", lset);

  // get length of list
  // The llen command is used to get the length of a list.
  const llen = await redis.llen("lpush");
  console.log("response llen: ", llen);

  // find matching element in list
  // The lpos command is used to find the index of the first matching element in a list.
  const lpos = await redis.lpos("list", "value2", "COUNT", 1000);
  console.log("response lpos: ", lpos);

  // remove element in list
  // The lrem command is used to remove elements in a list.
  const lrem = await redis.lrem("list", 0, "value2");
  console.log("response lrem: ", lrem);

  // move element from list to another list
  // The lmove command is used to move an element from a list to another list.
  const lmove = await redis.lmove("list", "list3", "LEFT", "RIGHT");
  console.log("response lmove: ", lmove);
};

const hashBasic = async () => {
  // Set a field in the hash stored at key
  // The hset command is used to set a field in the hash stored at key.
  const hset = await redis.hset("hash", "field1", "value1");
  console.log("response hset: ", hset);

  // Get the value of a field in the hash stored at key
  // The hget command is used to get the value of a field in the hash stored at key.
  const hget = await redis.hget("hash", "field1");
  console.log("response hget: ", hget);

  // Get all the fields and values in the hash stored at key
  // The hgetall command is used to get all the fields and values in the hash stored at key.
  const hgetall = await redis.hgetall("hash");
  console.log("response hgetall: ", hgetall);

  // Set multiple fields at once
  // The hmset command is used to set multiple fields at once.
  const hmset = await redis.hmset(
    "hash",
    "field2",
    "value2",
    "field3",
    "value3"
  );
  console.log("response hmset: ", hmset);

  // Get multiple fields at once
  // The hmget command is used to get multiple fields at once
  const hmget = await redis.hmget("hash", "field1", "field2", "field3");
  console.log("response hmget: ", hmget);

  // Get length of fields in hash
  // The hlen command is used to get the length of fields in the hash stored at key.
  const hlen = await redis.hlen("hash");
  console.log("response hlen: ", hlen);

  // Delete fields from hash
  // The hdel command is used to delete fields from the hash stored at key.
  const hdel = await redis.hdel("hash", "field1", "field2");
  console.log("response hdel: ", hdel);

  // Check if field exists in hash
  // The hexists command is used to check if a field exists in the hash stored at key.
  const hexists = await redis.hexists("hash", "field3");
  console.log("response hexists: ", hexists);

  // Get all field names in hash
  // The hkeys command is used to get all field names in the hash stored at key.
  const hkeys = await redis.hkeys("hash");
  console.log("response hkeys: ", hkeys);

  // Get all values in hash
  // The hvals command is used to get all values in the hash stored at key.
  const hvals = await redis.hvals("hash");
  console.log("response hvals: ", hvals);

  // Count number increment in hash
  // The hincrby command is used to increment the number stored at field in the hash stored at key by one.
  const hincrby = await redis.hincrby("hash", "field4", 1);
  console.log("response hincrby: ", hincrby);

  // Count number increment floating point in hash
  // The hincrbyfloat command is used to increment the number stored at field in the hash stored at key by a floating point number.
  const hincrbyfloat = await redis.hincrbyfloat("hash", "field5", 1.5);
  console.log("response hincrbyfloat: ", hincrbyfloat);

  // Add new field to hash only if field does not exist
  // The hsetnx command is used to add a new field to the hash stored at key only if the field does not exist.
  const hsetnx = await redis.hsetnx("hash", "field6", "value6");
  console.log("response hsetnx: ", hsetnx);

  // Get random field from hash
  // The hrandfield command is used to get a random field from the hash stored at key.
  const hrandfield = await redis.hrandfield("hash");
  console.log("response hrandfield: ", hrandfield);
};

const setBasic = async () => {
  // Add member to set
  // The sadd command is used to add a member to a set.
  const sadd = await redis.sadd("set", "member1", "member2", "member3");
  console.log("response sadd: ", sadd);

  // Get all members in set
  // The smembers command is used to get all members in a set.
  const smembers = await redis.smembers("set");
  console.log("response smembers: ", smembers);

  // Get length of set
  // The scard command is used to get the length of a set.
  const scard = await redis.scard("set");
  console.log("response scard: ", scard);

  // Remove member from set
  // The srem command is used to remove a member from a set.
  const srem = await redis.srem("set", "member1");
  console.log("response srem: ", srem);

  // Remove random member from set
  // The spop command is used to remove a random member from a set.
  const spop = await redis.spop("set");
  console.log("response spop: ", spop);

  // Check if member exists in set
  // The sismember command is used to check if a member exists
  const sismember = await redis.sismember("set", "member2");
  console.log("response sismember: ", sismember);

  // Get random member from set
  // The srandmember command is used to get a random member
  const srandmember = await redis.srandmember("set");
  console.log("response srandmember: ", srandmember);

  // Move member from set to another set
  // The smove command is used to move a member from a set to another set.
  const smove = await redis.smove("set", "set2", "member2");
  console.log("response smove: ", smove);

  // Set operation (union)
  // Returns the members of the set resulting from the union of all the given sets.
  const sunion = await redis.sunion("set", "set2");
  console.log("response sunion: ", sunion);

  // Set operation (union store)
  // This command is equal to SUNION, but instead of returning the resulting set, it is stored in destination.
  const sunionstore = await redis.sunionstore("set3", "set", "set2");
  console.log("response sunionstore: ", sunionstore);

  // Set operation (intersection)
  // Returns the members of the set resulting from the intersection of all the given sets.
  const sinter = await redis.sinter("set", "set2");
  console.log("response sinter: ", sinter);

  // Set operation (intersection store)
  // This command is equal to SINTER, but instead of returning the resulting set, it is stored in destination.
  const sinterstore = await redis.sinterstore("set4", "set", "set2");
  console.log("response sinterstore: ", sinterstore);

  // Set operation (difference)
  // Returns the members of the set resulting from the difference between the first set and all the successive sets.
  const sdiff = await redis.sdiff("set", "set2");
  console.log("response sdiff: ", sdiff);

  // Set operation (difference store)
  // This command is equal to SDIFF, but instead of returning the resulting set, it is stored in destination.
  const sdiffstore = await redis.sdiffstore("set5", "set", "set2");
  console.log("response sdiffstore: ", sdiffstore);
};

setBasic();
