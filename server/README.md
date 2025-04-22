# Car Price Scraper API

A simple Flask API that scrapes car price data from the web.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the server:
   ```
   python car_price_scraper.py
   ```

## API Endpoints

### GET /api/car-price

Get price data for a specific car.

**Parameters:**
- `make` (required): Car manufacturer (e.g., Toyota, Honda)
- `model` (required): Car model (e.g., Camry, Civic)
- `year` (required): Car year (e.g., 2020)
- `condition` (optional): Car condition (excellent, good, fair, poor). Default: good

**Example Request:**
```
GET /api/car-price?make=Toyota&model=Camry&year=2020&condition=good
```

**Example Response:**
```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": "2020",
  "condition": "good",
  "average_price": 25000.0,
  "min_price": 22500.0,
  "max_price": 27500.0,
  "sample_size": 5,
  "confidence": 0.75,
  "source": "web_scraping"
}
```

### GET /api/health

Health check endpoint.

**Example Response:**
```json
{
  "status": "ok",
  "message": "Car price scraper API is running"
}
```
