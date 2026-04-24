const mongoose = require('mongoose');

const SubscriptionsSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    subscriptions: [{type:String}]
}, {timestamps: true});
const Subscriptions = mongoose.model('Subscriptions', SubscriptionsSchema);

module.exports = Subscriptions;