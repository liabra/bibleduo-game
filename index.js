const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./server/routes/userRoutes');
const sessionRoutes = require('./server/routes/sessionRoutes');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const mySecret = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(mySecret)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get('/api/test', (req, res) => {
  res.send('API works');
});

app.use('/api', userRoutes);
app.use('/api', sessionRoutes);

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});