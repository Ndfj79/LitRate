const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
    rate:{type:Number},
    comment:{type:String}
}, { timestamps: true , collection: 'rates' });
const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;