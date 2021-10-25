const Sauce = require('../models/Sauce');


exports.getAllSauce = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error}));
};