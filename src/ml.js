export function predictPrice(car) {
  // Placeholder ML algorithm
  const minPrice = car.price * 0.8;
  const maxPrice = car.price * 1.2;
  const predictedPrice = Math.random() * (maxPrice - minPrice) + minPrice;
  return predictedPrice;
}
