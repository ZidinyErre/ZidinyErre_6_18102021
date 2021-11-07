const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauces');

mongoose.connect('mongodb+srv://BruceWillis:billyboY44@thecluster.caibu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const corsOptions = {
    origin: process.env.CLIENT_URL,
    Credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'preflightContinue': false
}
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
//   });



app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static('images'));


app.use(express.urlencoded({ extended : true}));
app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;