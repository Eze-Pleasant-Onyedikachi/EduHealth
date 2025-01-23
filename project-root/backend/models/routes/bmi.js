router.post('/calculate', async (req, res) => {
    const { userId, height, weight } = req.body;
    const bmiValue = (weight / (height * height)).toFixed(2);
    const category = bmiValue < 18.5 ? "Underweight" :
                    bmiValue < 24.9 ? "Normal weight" :
                    bmiValue < 29.9 ? "Overweight" : "Obese";
    const record = new BMIRecord({ userId, bmiValue, category });
    await record.save();
    res.json({ bmiValue, category });
});
