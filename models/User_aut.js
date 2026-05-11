const mongoose = require('mongoose');

const User_autSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authors: [{type: mongoose.Schema.Types.ObjectId, ref: 'Author'}]
}, { timestamps: true , collection: 'user_aut' });

const User_aut = mongoose.model('User_aut', User_autSchema);

module.exports = User_aut;
