const mongoose = require('mongoose');
const recommendation = require('./recommendation');

const BmiRecordSchema = new mongoose.Schema({
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    bmi: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    category: {type: String, required: true},
    recommendation: {type: String, required:  true}
});

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    records: [BmiRecordSchema], // Store BMI records as an array of objects
});

module.exports = mongoose.model('User', UserSchema);
