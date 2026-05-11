const mongoose = require('mongoose');

const SubscriptionsSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    subscriptions: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {timestamps: true, collection: 'subscriptions' });
const Subscriptions = mongoose.model('Subscriptions', SubscriptionsSchema);

module.exports = Subscriptions;