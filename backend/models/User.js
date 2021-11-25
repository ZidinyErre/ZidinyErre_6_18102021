const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// Schéma qui permet un bon fonctionnement du côté de la base de donnée 
const userSchema = mongoose.Schema({
email: {type: String , require: true , unique: true},
password:{type: String , require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);