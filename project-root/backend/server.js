const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./models/routes/auth');
const bmiRoutes = require('./models/routes/bmi');

const app = express();

// Required for json data
app.use(express.json());

// app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the BMI Calculator API!');
});

// Required for form data
app.use(express.urlencoded({ extended: false}))
app.use(cors());
app.use('/auth', authRoutes);
app.use('/bmi', bmiRoutes);

mongoose.connect('mongodb+srv://ezepleasant001:Password@cluster0.sluni.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => app.listen(3000, () => console.log("Server running on http://localhost:3000")))
    .catch(err => console.error("Error connecting to MongoDB:", err));
