const express = require('express');
const User = require('../user');
const Recommendation = require('../recommendation');
const router = express.Router();

// Helper function to classify BMI
const classifyBMI = (bmi) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi < 24.9) return 'Normal';
    if (bmi >= 25 && bmi < 29.9) return 'Overweight';
    return 'Obese';
};

// Fetch BMI records for a user
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({ records: user.records });
  } catch (error) {
      console.error('Error fetching BMI records:', error);
      res.status(500).json({ error: 'Failed to fetch BMI records' });
  }
});

// Save BMI record
router.post('/:userId/save-bmi', async (req, res) => {
  const { weight, height, bmi } = req.body;
  const userId = req.params.userId;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Classify BMI
      const category = classifyBMI(bmi);
      console.log('Classified BMI category:', category);

      // Fetch recommendations for the category
      const recommendation = await Recommendation.findOne({ category });
      // console.log('Fetched recommendation:', recommendation);

      if (!recommendation) {
          console.error('No recommendation found for category:', category);
          return res.status(404).json({ error: 'No recommendation found for this BMI category' });
      }

      // Add BMI record to user
      const newRecord = { weight, height, bmi, category, recommendation: recommendation.advice_text };
      console.log('New BMI record:', newRecord); // Debugging log
      user.records.push(newRecord);
      await user.save();

      res.status(200).json({ records: user.records });
  } catch (error) {
      console.error('Error saving BMI record:', error);
      res.status(500).json({ error: 'Failed to save BMI record' });
  }
});

// Delete BMI record
router.delete('/:userId/delete/:recordId', async (req, res) => {
  const userId = req.params.userId;
  const recordId = req.params.recordId;

  try {
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Find the index of the record to delete
      const recordIndex = user.records.findIndex(record => record._id.toString() === recordId);
      if (recordIndex === -1) {
          return res.status(404).json({ error: 'Record not found' });
      }

      // Remove the record from the array
      user.records.splice(recordIndex, 1);
      await user.save();

      res.status(200).json({ records: user.records });
  } catch (error) {
      console.error('Error deleting BMI record:', error);
      res.status(500).json({ error: 'Failed to delete BMI record' });
  }
});
module.exports = router;