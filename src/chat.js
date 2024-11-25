const Redis = require("ioredis");

const redis = new Redis([
  {
    // Master (write)
    host: "localhost",
    port: 6379,
  },
  {
    // Replica (read)
    host: "localhost",
    port: 6380,
  },
]);

const redisSubscriber = new Redis([
  {
    // Master (write)
    host: "localhost",
    port: 6379,
  },
  {
    // Replica (read)
    host: "localhost",
    port: 6380,
  },
]);

// Create set for store members
const users = redis.smembers("users", (err, result) => {
  console.log("users", result);
});

async function addUser(user) {
  const isUserExist = await redis.sismember("users", user);
  if (isUserExist) {
    return false;
  }
  const res = await redis.sadd("users", user);
  console.log("add user", res);
  return true;
}

async function removeUser(user) {
  const res = await redis.srem("users", user);
  console.log("remove user", res);
}

async function sendMessage(user, room, message) {
  const roomMessage = JSON.stringify({ user, message });
  await redis.lpush(`room:${room}`, roomMessage);
  await redis.publish(`room:${room}`, roomMessage);
  console.log(`Message sent to room ${room}: ${message}`);
}

async function getMessages(room) {
  const messages = await redis.lrange(`room:${room}`, 0, -1);
  console.log(`Messages in room ${room}: ${JSON.stringify(messages, null, 2)}`);
}

async function jsonRoom(room) {
  redisSubscriber.subscribe(`room:${room}`, (err, count) => {
    console.log(`Subscribed to ${count} channel`);
  });

  redisSubscriber.on(`room:${room}`, (channel, message) => {
    console.log(`Received message from ${channel}: ${message}`);
  });
}

async function main() {
  await addUser("user1");
  await addUser("user2");
  await getMessages("room1");
  jsonRoom("room1");
  setTimeout(() => {
    sendMessage("user1", "room1", "Hello room1 from user1");
    sendMessage("user2", "room1", "Hello room1 from user2");
  }, 1000);
  setTimeout(() => {
    getMessages("room1");
  }, 2000);
}

main();
