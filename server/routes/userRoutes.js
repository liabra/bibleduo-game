// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Route pour créer un utilisateur
// NOTE : le hash du mot de passe est géré uniquement par le hook pre-save de user.js
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    // On ne renvoie jamais le mot de passe dans la réponse
    const { password, ...safeUser } = user.toObject();
    res.status(201).send(safeUser);
  } catch (error) {
    res.status(400).send({ errorResponse: error });
  }
});

// Route pour récupérer tous les utilisateurs (sans les mots de passe)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
