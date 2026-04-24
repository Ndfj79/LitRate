const mongoose = require('mongoose');

const User_autSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    authors: [{type:String}]
}, { timestamps: true });

const User_aut = mongoose.model('User_aut', User_autSchema);

module.exports = User_aut;
