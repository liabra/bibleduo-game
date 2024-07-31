const express = require('express');
const router = express.Router();

// Route de test
router.get('/test', (req, res) => {
  res.json({ message: 'API works!' });
});

module.exports = router;
