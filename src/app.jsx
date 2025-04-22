import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Footer from './components/Footer.jsx';
import { cars } from './data';
import { predictPrice } from './ml';
import Button from './components/Button.jsx';
import './styles.css';

function App() {
  const [predictedPrices, setPredictedPrices] = useState({});

  const handlePredictPrice = (car) => {
    const predictedPrice = predictPrice(car);
    setPredictedPrices({ ...predictedPrices, [car.id]: predictedPrice });
  };

  return (
    <div>
      <Header />
      <div>
        <Hero />
        <h2>Car Dataset</h2>
        <ul>
          {cars.map((car) => (
            <li key={car.id}>
              {car.make} {car.model} ({car.year}): ${car.price}
              <Button onClick={() => handlePredictPrice(car)}>
                Predict Price
              </Button>
              {predictedPrices[car.id] && (
                <div>Predicted Price: ${predictedPrices[car.id].toFixed(2)}</div>
              )}
            </li>
          ))}
        </ul>
        <Footer />
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
