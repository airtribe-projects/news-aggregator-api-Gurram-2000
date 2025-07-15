require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route handling
const authRoutes = require('./apiRoutes/apiroutes');
app.use('/', authRoutes);

// Server listener
app.listen(port, (error) => {
  if (error) {
    console.error('Server failed to start:', error);
    return;
  }
  console.log(`Server is running and listening on port ${port}`);
});

module.exports = app;
