const bcrypt = require ('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
          email: req.body.email,
          password: hash
      });
      user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({error: 'Utilisateur non sauvegardé ! L email est probablement déjà utilisé!'}));
    })
    .catch(error => res.status(500).json({error: 'Echec de l\'inscription !'}));
};

exports.login = (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
    bcrypt.compare(req.body.password, user.password)
      .then(valid => {
        if (!valid) {
          return res.status(401).json({ error: 'Mot de passe incorrect !' });
        }
        res.status(200).json({
          userId: user._id,
          token: jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '24h' }
          )
        });
      })
      .catch(error => res.status(500).json({ error: 'Problème lié à la connexion de l\'utilisateur !' }));
    })
    .catch(error => res.status(500).json({ error: 'Echec de l\'opération!' }));
};