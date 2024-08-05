const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous que le chemin est correct

const secret = 'your_jwt_secret';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is missing');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, secret);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
