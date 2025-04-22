const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample car data
const cars = [
  {
    id: 'car1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    price: 25000,
    mileage: 15000,
    condition: 'excellent',
    fuelType: 'gasoline',
    transmission: 'automatic',
  },
  {
    id: 'car2',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 23000,
    mileage: 5000,
    condition: 'excellent',
    fuelType: 'gasoline',
    transmission: 'automatic',
  },
  {
    id: 'car3',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    price: 35000,
    mileage: 20000,
    condition: 'good',
    fuelType: 'gasoline',
    transmission: 'automatic',
  },
  {
    id: 'car4',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 45000,
    mileage: 10000,
    condition: 'excellent',
    fuelType: 'electric',
    transmission: 'automatic',
  },
  {
    id: 'car5',
    make: 'BMW',
    model: '3 Series',
    year: 2022,
    price: 42000,
    mileage: 18000,
    condition: 'good',
    fuelType: 'gasoline',
    transmission: 'automatic',
  },
];

// Routes
app.get('/api/cars', (req, res) => {
  res.json(cars);
});

app.get('/api/cars/:id', (req, res) => {
  const car = cars.find(c => c.id === req.params.id);
  if (!car) {
    return res.status(404).json({ message: 'Car not found' });
  }
  res.json(car);
});

app.post('/api/predict-price', (req, res) => {
  const carData = req.body;
  
  // Simple price prediction algorithm
  const basePriceByMake = {
    'toyota': 25000,
    'honda': 23000,
    'ford': 35000,
    'tesla': 45000,
    'bmw': 42000,
    'audi': 40000,
    'mercedes': 50000,
    'lexus': 45000,
    'chevrolet': 30000,
    'nissan': 22000,
  };
  
  const make = carData.make.toLowerCase();
  const basePrice = basePriceByMake[make] || 25000;
  
  // Adjust for year
  const currentYear = new Date().getFullYear();
  const yearFactor = 1 - ((currentYear - carData.year) * 0.05);
  
  // Adjust for mileage
  const mileageFactor = 1 - (carData.mileage / 100000);
  
  // Adjust for condition
  const conditionFactors = {
    'excellent': 1.1,
    'good': 1.0,
    'fair': 0.9,
    'poor': 0.7,
  };
  
  // Adjust for fuel type
  const fuelTypeFactors = {
    'electric': 1.2,
    'hybrid': 1.1,
    'gasoline': 1.0,
    'diesel': 1.05,
  };
  
  // Calculate predicted price
  let predictedPrice = basePrice * 
    Math.max(0.5, yearFactor) * 
    Math.max(0.6, mileageFactor) * 
    (conditionFactors[carData.condition] || 1.0) *
    (fuelTypeFactors[carData.fuelType] || 1.0);
  
  // Add some randomness for realism
  predictedPrice = predictedPrice * (0.95 + Math.random() * 0.1);
  
  // Simulate processing delay
  setTimeout(() => {
    res.json({
      estimatedPrice: Math.round(predictedPrice),
      confidence: 0.85 + (Math.random() * 0.1),
      marketComparison: 'Average',
      priceRange: {
        low: Math.round(predictedPrice * 0.9),
        high: Math.round(predictedPrice * 1.1),
      },
    });
  }, 1000);
});

// User authentication routes (simplified for demo)
const users = [];

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In a real app, this would be hashed
  };
  
  users.push(newUser);
  
  // Return user data (without password)
  res.status(201).json({
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Return user data (without password)
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
