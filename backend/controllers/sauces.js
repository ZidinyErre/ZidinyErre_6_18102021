const Sauce = require('../models/Sauce');
const fs = require('fs');


exports.getAllSauce = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error: 'Sauces non trouvé !'}));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id : req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error: 'Sauce non trouvé !'}));
};

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
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

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ?
    {
        ...JSON.parse(req.body.sauces),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};
    Sauce.updateOne({_id: req.params.id},{ ...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message : 'Objet modifié !'}))
    .catch(error => res.status(400).json({error: 'Objet non modifié !'}));

};

exports.deleteSauce = (req, res) => {
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

exports.likesSauce = (req, res) => {
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, {
          $set: { usersLiked: req.body.userId }, 
          $inc: { likes: 1 },
        })
          .then(() => res.status(200).json({ message: "L'utilisateur a liké la sauce !" }))
          .catch(error => res.status(400).json({ error }));
      }
      
      if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, {
          $set: { usersDisliked: req.body.userId }, 
          $inc: { dislikes: 1 }, 
        })
          .then(() => res.status(200).json({ message: "L'utilisateur a disliké la sauce !" }))
          .catch(error => res.status(400).json({ error }));
      }
      
      if (req.body.like === 0) {
        Sauce.findOne({ _id: req.params.id })
          .then(sauce => {
            const alreadyLiked = sauce.usersLiked.includes(req.body.userId); 
            
            if (alreadyLiked) {
              Sauce.updateOne({ _id: req.params.id }, {
                $pull: { usersLiked: req.body.userId }, 
                $inc: { likes: -1 }, 
              })
                .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son like !" }))
                .catch(error => res.status(400).json({ error }));
            
            } else {
              Sauce.updateOne({ _id: req.params.id }, {
                $pull: { usersDisliked: req.body.userId }, 
                $inc: { dislikes: -1 }, 
              })
                .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son dislike !" }))
                .catch(error => res.status(400).json({ error }));
            }
          })
          .catch(error => res.status(500).json({ error }));
      }
};