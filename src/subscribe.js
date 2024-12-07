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

// Subscribe to the "news" channel
redis.subscribe("news", (err, count) => {
  console.log(`Subscribed to ${count} channel`);
});

// Unsubscribe from the "news" channel after 5 seconds
setTimeout(() => {
  redis.unsubscribe("news");
  console.log("Unsubscribed from channel");
}, 5000);

// Subscribe to all channels that start with "news"
redis.psubscribe("news.*", (err, count) => {
  console.log(`Subscribed to ${count} channel`);
});

// Log messages received from the "news" channel
redis.on("message", (channel, message) => {
  console.log(`Received message from ${channel}: ${message}`);
});
