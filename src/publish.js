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

// Publish a message to the "news" channel
redis.publish("news", "Hello, world!", (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log("message was send", result);
  }
});

// Get the number of subscribers to the "news" channel
redis.pubsub("numsub", "news", (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log("number of subscribers", result);
  }
});
