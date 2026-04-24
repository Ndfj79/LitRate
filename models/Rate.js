const mongoose = require('mongoose');

const RateSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    books: {type:String, required: true},
    rate:{type:Number},
    comment:{type:String}
}, { timestamps: true });
const Rate = mongoose.model('Rate', RateSchema);

module.exports = Rate;