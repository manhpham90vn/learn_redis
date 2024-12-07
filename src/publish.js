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
    port: 6382,
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
