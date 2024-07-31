const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const app = express();
const port = process.env.PORT || 3000;

const mongoURI = 'mongodb+srv://bilibila:bilibila07@bibleap.nzzuogr.mongodb.net/BibleAp?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(bodyParser.json()); // Ajouter le middleware body-parser
app.use(bodyParser.urlencoded({ extended: true })); // Ajouter le middleware body-parser pour les données URL-encoded

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
