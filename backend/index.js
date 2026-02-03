const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const todoRoutes = require('./src/routes/todoRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const { httpRequestDuration } = require("./metrics");
const { client } = require("./metrics");


dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

const app = express();

app.use(cors());
app.use(express.json());

// Metrics middleware to measure HTTP request durations

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.path,
  });

  res.on("finish", () => {
    end({ status: res.statusCode });
  });

  next();
});


app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'backend', version: '1.0.0' });
});


app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});


// API routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);
app.use('/api', todoRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});