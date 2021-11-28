const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

// Liaison entre la base de donnée et le serveur
mongoose.connect('mongodb+srv://BruceWillis:billyboY44@thecluster.caibu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
{ useNewUrlParser: true,
useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// helmet peut parer à beaucoup de problème de sécurité 
app.use(helmet());

// Empêche les attaques de force brut 
const limiter = rateLimit({
    windowMs: 40 * 60 * 1000,    // 15 minutes
    max: 100                     // 100 requests per IP
});
app.use(limiter);

// Gestion des headers et envoie d'un status ok
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    next();
});
app.options('/*', (_, res) => {
    res.sendStatus(200);
});
// Gestion de fichier statique 
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));
// Gère les requêtes JSON envoyé par le front
app.use(express.urlencoded({ extended : true}));
app.use(express.json());
// Routes qui utilise le middlewares d'authentification
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;