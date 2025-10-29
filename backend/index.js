const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo_app';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'OK', service: 'backend', version: '1.0.0' });
});

// API routes
app.use('/api', authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

connectDB(MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});