const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Load hospital data from JSON file
let hospitalData = [];
try {
  const data = fs.readFileSync('./hospitalData.json', 'utf8');
  hospitalData = JSON.parse(data);
} catch (err) {
  console.error('Error reading hospital data:', err);
}

// Route to get all hospitals
app.get('/hospitals', (req, res) => {
  res.json(hospitalData);
});

// Route to add a new hospital
app.post('/hospitals', (req, res) => {
  const newHospital = req.body;
  hospitalData.push(newHospital);
  saveHospitalData();
  res.json(newHospital);
});

// Route to update a hospital
app.put('/hospitals/:id', (req, res) => {
  const hospitalId = req.params.id;
  const updatedHospital = req.body;
  const index = hospitalData.findIndex(hospital => hospital.id === hospitalId);
  if (index !== -1) {
    hospitalData[index] = updatedHospital;
    saveHospitalData();
    res.json(updatedHospital);
  } else {
    res.status(404).json({ message: 'Hospital not found' });
  }
});

// Route to delete a hospital
app.delete('/hospitals/:id', (req, res) => {
  const hospitalId = req.params.id;
  const index = hospitalData.findIndex(hospital => hospital.id === hospitalId);
  if (index !== -1) {
    const deletedHospital = hospitalData.splice(index, 1);
    saveHospitalData();
    res.json(deletedHospital[0]);
  } else {
    res.status(404).json({ message: 'Hospital not found' });
  }
});

// Save hospital data to JSON file
function saveHospitalData() {
  try {
    const data = JSON.stringify(hospitalData, null, 2);
    fs.writeFileSync('./hospitalData.json', data, 'utf8');
  } catch (err) {
    console.error('Error saving hospital data:', err);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
