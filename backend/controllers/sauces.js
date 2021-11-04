const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.getAllSauce = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error: 'Sauces non trouvé !'}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({error: 'Sauce non trouvé !'}));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauces);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({message : 'Objet enregistré !'}))
    .catch(error => res.status(400).json({error: 'Objet non enregistré !'}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({_id: req.params.id},{ ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message : 'Objet modifié !'}))
    .catch(error => res.status(400).json({error: 'Objet non modifié !'}));

};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error: 'Objet non supprimé !' }));
        });
      })
    .catch(error => res.status(500).json({ error: 'Echec de l\'opération !' }));
};

exports.likesSauce = (req, res, next) => {
    let like = req.body.like;
    let userId = req.body.userId;
    let sauceId = req.params.id;
    switch (like) {
        case 1:
            Sauce.findOne({_id : sauceId})
            .then(Sauce => {
                if (Sauce.dislikes >= 0 && Sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({_id:sauceId},{$push: {usersLiked: userId}}, {$inc: {likes: +1}}, {$pull: {usersDisliked: userId}}, {$inc: {likes: -1}})
                } else {
                    Sauce.updateOne({_id:sauceId},{$push: {usersLiked: userId}}, {$inc: {likes: +1}})
                }
            })
            .then(() => res.status(200).json({ message: 'L\'utilisateur à liké la sauce'}))
            .catch(error => res.status(400).json({ error: 'Echec de l\'opération !' }));
            break;

        case 0:
            Sauce.findOne({_id : sauceId})
            .then(Sauce =>{
                if (Sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({_id:sauceId},{$pull: {usersLiked: userId}}, {$inc: {likes: -1}})
                    .then(() => res.status(200).json({ message: 'L\'utilisateur ne like plus cette sauce'}))
                    .catch(error => res.status(400).json({ error: 'Echec de l\'opération !' }));
                }
                else if (Sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({_id:sauceId},{$pull: {usersDisliked: userId}}, {$inc: {dislikes: -1}})
                    .then(() => res.status(200).json({ message: 'L\'utilisateur ne dislike plus cette sauce'}))
                    .catch(error => res.status(400).json({ error: 'Echec de l\'opération !' }));
                }
            })
            .catch(error => res.status(400).json({ error: 'Echec de l\'opération !' }));
            break;

        case -1:
            Sauce.findOne({_id : sauceId})
                .then(Sauce => {
                    if (Sauce.likes >= 0 && Sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne({_id:sauceId},{$push: {usersDisliked: userId}}, {$inc: {dislikes: +1}}, {$pull: {usersLiked: userId}}, {$inc: {dislikes: -1}})
                    } else {
                        Sauce.updateOne({_id:sauceId},{$push: {usersDisliked: userId}}, {$inc: {dislikes: +1}})
                    }
                })
                .then(() => res.status(200).json({ message: 'L\'utilisateur à disliké la sauce'}))
                .catch(error => res.status(400).json({ error: 'Echec de l\'opération !' }));
            break;

        default:
            break;
    }
};