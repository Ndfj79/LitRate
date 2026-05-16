const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    mail: {type:String, required: true, unique: true},
    login: {type:String, required: true},
    password: {type:String, required: true},
},  { timestamps: true, collection: 'users' });
const User = mongoose.model('User', userSchema);

module.exports=User;