const client = require("prom-client");

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
 
client.collectDefaultMetrics();


// Measure how long HTTP requests take

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
});

module.exports = {
  client,
  httpRequestDuration,
};
