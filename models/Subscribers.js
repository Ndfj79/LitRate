const mongoose = require('mongoose');

const SubscribersSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    subscribers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true, collection: 'subscribers' });
const Subscribers = mongoose.model('Subscribers', SubscribersSchema);

module.exports = Subscribers;