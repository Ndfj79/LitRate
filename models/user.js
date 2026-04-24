const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    login: {type:String, required: true},
    parol: {type:String, required: true},
},  { timestamps: true});
const User = mongoose.model('User', userSchema);

module.exports=User;