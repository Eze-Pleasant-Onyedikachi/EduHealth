// BMI calculation utility
const calculateBMI = (weight, height) => {
  return weight / (height * height);
};

// Toast notification system
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  const container = document.getElementById('toast-container');
  container.appendChild(toast);

  setTimeout(() => {
      toast.remove();
  }, 3000);
};

// Store BMI records
let bmiRecords = [];

// Initialize Chart.js
let bmiChart;
const initChart = () => {
  console.log('Initializing chart...');
  const ctx = document.getElementById('bmiChart').getContext('2d');
  bmiChart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: 'BMI',
              data: [],
              borderColor: 'rgb(37, 99, 235)',
              tension: 0.1
          }]
      },
      options: {
          responsive: true,
          scales: {
              y: {
                  beginAtZero: false
              }
          }
      }
  });
  console.log('Chart initialized successfully');
};

// Update chart with new data
const updateChart = () => {
  console.log('Updating chart with records:', bmiRecords);
  const data = bmiRecords.map(record => ({
      x: new Date(record.date).toLocaleDateString(),
      y: parseFloat(record.bmi.toFixed(1))
  }));

  bmiChart.data.labels = data.map(d => d.x);
  bmiChart.data.datasets[0].data = data.map(d => d.y);
  bmiChart.update();
};

// Render BMI records table
const renderTable = () => {
  const tbody = document.querySelector('#bmiTable tbody');
  tbody.innerHTML = '';

  if (bmiRecords.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5" class="text-center">No BMI records yet</td>';
      tbody.appendChild(tr);
      return;
  }

  bmiRecords.forEach(record => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${new Date(record.date).toLocaleDateString()}</td>
          <td>${record.weight}</td>
          <td>${record.height}</td>
          <td>${record.bmi.toFixed(1)}</td>
          <td>${record.category}</td>
          <td>${record.recommendation}</td>
          <td>
              <button class="delete-btn" data-id="${record._id}">Delete</button>
          </td>
      `;
      tbody.appendChild(tr);
  });
};

// Handle BMI calculation and saving
const handleCalculate = async () => {
  const weight = parseFloat(document.getElementById('weight').value);
  const height = parseFloat(document.getElementById('height').value);

  if (!weight || !height || weight <= 0 || height <= 0) {
      showToast('Please enter valid weight and height values.', 'error');
      return;
  }

  const bmi = calculateBMI(weight, height);
  const user = JSON.parse(localStorage.getItem('user'));

  try {
      console.log('Saving BMI record to server...', { weight, height, bmi });
      const response = await fetch(`http://localhost:3000/bmi/${user.id}/save-bmi`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ weight, height, bmi }),
      });

      const data = await response.json();
      console.log('Server response:', data); // Debugging log

      if (response.ok) {
          console.log('BMI record saved successfully:', data);

          updateChart();
          renderTable();

          // Display BMI category and recommendations
          const latestRecord = bmiRecords[bmiRecords.length - 1];
          console.log('Latest record:', latestRecord); // Debugging log
          document.getElementById('bmi-value').textContent = latestRecord.bmi.toFixed(2);
          document.getElementById('bmi-category').textContent = `Category: ${latestRecord.category}`;
          document.getElementById('bmi-recommendation').textContent = `Advice: ${latestRecord.recommendation}`;

          showToast('BMI record saved successfully!');

          // Reset form
          document.getElementById('weight').value = '';
          document.getElementById('height').value = '';
      } else {
          console.error('Failed to save BMI:', data.error);
          showToast(data.error || 'Failed to save BMI.', 'error');
      }
  } catch (error) {
      console.error('Error saving BMI:', error);
      showToast('An error occurred. Please try again later.', 'error');
  }
};

// Handle record deletion
const handleDelete = async (id) => {
  const user = JSON.parse(localStorage.getItem('user'));

  try {
      console.log('Deleting BMI record:', id);
      const response = await fetch(`http://localhost:3000/bmi/${user.id}/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (response.ok) {
          console.log('BMI record deleted successfully:', data);
          bmiRecords = data.records;
          updateChart();
          renderTable();
          showToast('Record deleted successfully!');
      } else {
          console.error('Failed to delete BMI record:', data.error);
          showToast(data.error || 'Failed to delete record.', 'error');
      }
  } catch (error) {
      console.error('Error deleting BMI record:', error);
      showToast('An error occurred while deleting the record.', 'error');
  }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing application...');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
      console.log('No user found, redirecting to login...');
      window.location.href = 'login.html';
      return;
  }

  // Update welcome message
  const welcomeMessage = document.getElementById('welcome-message');
  if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome, ${user.name}`;
  }

  // Initialize chart first
  console.log('Setting up initial chart...');
  initChart();

  try {
      console.log('Fetching user BMI records for user:', user.id);
      const response = await fetch(`http://localhost:3000/bmi/${user.id}`);
      console.log('Server response status:', response.status);

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response data:', data);

      if (response.ok) {
          console.log('BMI records fetched successfully:', data);
          bmiRecords = data.records || [];
          renderTable();
          updateChart();
      } else {
          console.error('Failed to fetch BMI records:', data.error);
          showToast(data.error || 'Failed to fetch BMI records.', 'error');
      }
  } catch (error) {
      console.error('Error loading BMI records:', error);
      console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
      });
      showToast('An error occurred while loading records.', 'error');
      // Even if the fetch fails, ensure we have an empty table and chart
      renderTable();
      updateChart();
  }

  // Add event listeners
  document.getElementById('calculate-btn').addEventListener('click', handleCalculate);

  // Add event listener for delete buttons using event delegation
  document.getElementById('bmiTable').addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
          const id = e.target.dataset.id;
          handleDelete(id);
      }
  });
});