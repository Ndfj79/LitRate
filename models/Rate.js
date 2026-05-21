const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
    rate:{type:Number},
    comment:{type:String},
    like_count: {type: Number},
    isLiked: {type: Boolean},
    title: {type: String},
    liked_users: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
}, { timestamps: true , collection: 'rates' });
const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;