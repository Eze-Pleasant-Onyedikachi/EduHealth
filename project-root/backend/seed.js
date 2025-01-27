const mongoose = require('mongoose');
const Recommendation = require('./models/recommendation');

mongoose.connect('mongodb+srv://ezepleasant001:Password@cluster0.sluni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const recommendations = [
    {
        category: 'Underweight',
        advice_text: 'You are underweight. Consider increasing your calorie intake with nutrient-rich foods like nuts, avocados, and whole grains. Consult a nutritionist for personalized advice.',
    },
    {
        category: 'Normal',
        advice_text: 'You are at a healthy weight. Maintain a balanced diet and regular exercise to stay fit. Focus on whole foods and avoid processed snacks.',
    },
    {
        category: 'Overweight',
        advice_text: 'You are overweight. Consider reducing calorie intake and increasing physical activity. Focus on a diet rich in fruits, vegetables, and lean proteins.',
    },
    {
        category: 'Obese',
        advice_text: 'You are obese. Seek medical advice for a structured weight loss plan. Incorporate regular exercise and a balanced diet to improve your health.',
    },
];

const seedDatabase = async () => {
    try {
        await Recommendation.deleteMany(); // Clear existing recommendations
        await Recommendation.insertMany(recommendations); // Insert new recommendations
        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();