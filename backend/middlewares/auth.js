const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware qui va permettre d'authentifié l'utilisateur et de le permettre d'agir ou non
module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw res.status(403).json({error: 'unauthorized request'});
          } else {
            next();
        }
    }catch (error){
        res.status(401).json({error: error | 'Requête non authentifié !'});
    }
};