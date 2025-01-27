// models/recommendation.js
const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
    category: { type: String, required: true, unique: true }, // e.g., "Underweight", "Normal", "Overweight", "Obese"
    advice_text: { type: String, required: true }, // Health advice for this category
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);