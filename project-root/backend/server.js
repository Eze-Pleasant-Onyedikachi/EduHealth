const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const bmiRoutes = require('./routes/bmi');

const app = express();
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/bmi', bmiRoutes);

mongoose.connect('mongodb://localhost:27017/bmi-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(3000, () => console.log("Server running on http://localhost:3000")))
    .catch(err => console.log(err));
