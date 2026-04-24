const mongoose = require('mongoose');

const SubscribersSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    subscribers: [{type:String}]
}, {timestamps: true});
const Subscribers = mongoose.model('Subscribers', SubscribersSchema);

module.exports = Subscribers;