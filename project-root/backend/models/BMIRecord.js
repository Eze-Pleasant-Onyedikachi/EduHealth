const mongoose = require('mongoose');
const bmiRecordSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bmiValue: Number,
    category: String,
    timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('BMIRecord', bmiRecordSchema);
