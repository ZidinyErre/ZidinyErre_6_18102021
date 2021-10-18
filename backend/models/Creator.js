const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const creatorSchema = mongoose.Schema({
email: {type: String , require: true , unique: true},
password:{type: String , require: true}
});

creatorSchema.plugin(uniqueValidator);

module.exports = mongoose.model('creator', creatorSchema);