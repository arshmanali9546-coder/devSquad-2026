require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const setupSwagger = require('./docs/swagger');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Set up Swagger API docs
setupSwagger(app);

// Routes
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port:${PORT}`);
});