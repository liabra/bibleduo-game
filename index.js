const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const mySecret = process.env['MONGO_URI'];

// Set strictQuery to false to adopt the upcoming default behavior in Mongoose 7
mongoose.set('strictQuery', false);

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mySecret, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Define your /api/test route
app.get('/api/test', (req, res) => {
  res.send('API works');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
