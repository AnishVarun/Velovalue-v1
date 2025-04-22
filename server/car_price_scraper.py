import requests
from bs4 import BeautifulSoup
import json
import re
import time
import random
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Cache for storing scraped data to reduce repeated requests
price_cache = {}
cache_expiry = 3600  # Cache expiry in seconds (1 hour)

def get_car_price_data(make, model, year, condition='good', vehicle_type='car'):
    """
    Scrape car price data from Indian online sources
    """
    # Create a cache key
    cache_key = f"{vehicle_type}_{make}_{model}_{year}_{condition}"

    # Check if data is in cache and not expired
    if cache_key in price_cache:
        cache_time, data = price_cache[cache_key]
        if time.time() - cache_time < cache_expiry:
            print(f"Using cached data for {cache_key}")
            return data

    try:
        # Prepare search query for Indian websites
        query = f"{year} {make} {model} {condition} price India"

        # Try to scrape from specific Indian car websites
        indian_sites = [
            f"https://www.google.com/search?q={query.replace(' ', '+')}",
            f"https://www.cardekho.com/cars/{make}/{model}",
            f"https://www.carwale.com/search/?q={make}+{model}"
        ]

        # Set headers to mimic a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        }

        all_prices = []

        # Try each site
        for site_url in indian_sites:
            try:
                # Make the request
                response = requests.get(site_url, headers=headers, timeout=10)

                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')

                    # Extract price information - look for Indian Rupee format
                    # ₹ symbol followed by numbers, or Rs. followed by numbers
                    price_pattern = re.compile(r'[₹₨]\s*\d{1,3}(?:,\d{2,3})*(?:\.\d{2})?|Rs\.?\s*\d{1,3}(?:,\d{2,3})*(?:\.\d{2})?')
                    price_texts = soup.find_all(text=price_pattern)

                    for text in price_texts:
                        matches = price_pattern.findall(text)
                        all_prices.extend(matches)
            except Exception as e:
                print(f"Error scraping {site_url}: {e}")
                continue

        # Process the prices
        if all_prices:
            # Convert string prices to numeric values
            numeric_prices = []
            for price in all_prices:
                try:
                    # Clean up the price string
                    clean_price = price.replace('₹', '').replace('Rs.', '').replace('Rs', '').replace(' ', '').replace(',', '')
                    numeric_price = float(clean_price)

                    # Filter out unrealistic prices (in INR)
                    # For cars: between 1 lakh and 2 crore
                    # For bikes: between 50k and 30 lakh
                    min_price = 50000 if vehicle_type == 'bike' else 100000
                    max_price = 3000000 if vehicle_type == 'bike' else 20000000

                    if min_price <= numeric_price <= max_price:
                        numeric_prices.append(numeric_price)
                except ValueError:
                    continue

            if numeric_prices:
                # Calculate statistics
                avg_price = sum(numeric_prices) / len(numeric_prices)
                min_price = min(numeric_prices)
                max_price = max(numeric_prices)

                # Create result
                result = {
                    'make': make,
                    'model': model,
                    'year': year,
                    'condition': condition,
                    'vehicle_type': vehicle_type,
                    'average_price': round(avg_price, 2),
                    'min_price': round(min_price, 2),
                    'max_price': round(max_price, 2),
                    'sample_size': len(numeric_prices),
                    'confidence': min(0.9, 0.5 + (len(numeric_prices) / 20)),  # Higher confidence with more samples
                    'currency': 'INR',
                    'source': 'web_scraping'
                }

                # Cache the result
                price_cache[cache_key] = (time.time(), result)
                return result

        # If we couldn't find price data, use a fallback method
        return generate_fallback_price(make, model, year, condition)

    except Exception as e:
        print(f"Error scraping data: {e}")
        return generate_fallback_price(make, model, year, condition)

def generate_fallback_price(make, model, year, condition, vehicle_type='car'):
    """
    Generate a fallback price when scraping fails - using Indian market prices
    """
    # Base prices for common makes in INR
    car_base_prices = {
        # Popular Indian car brands
        'maruti': 600000,      # 6 lakhs
        'hyundai': 800000,     # 8 lakhs
        'tata': 700000,        # 7 lakhs
        'mahindra': 1000000,   # 10 lakhs
        'toyota': 1200000,     # 12 lakhs
        'honda': 1000000,      # 10 lakhs
        'kia': 900000,         # 9 lakhs
        'mg': 1500000,         # 15 lakhs
        'ford': 1100000,       # 11 lakhs
        'volkswagen': 1200000, # 12 lakhs
        'skoda': 1300000,      # 13 lakhs
        'renault': 700000,     # 7 lakhs
        'nissan': 800000,      # 8 lakhs
        'jeep': 1800000,       # 18 lakhs
        # Luxury brands
        'mercedes': 5000000,   # 50 lakhs
        'bmw': 4500000,        # 45 lakhs
        'audi': 4000000,       # 40 lakhs
        'lexus': 5500000,      # 55 lakhs
        'jaguar': 5000000,     # 50 lakhs
        'land rover': 7000000, # 70 lakhs
        'volvo': 4000000,      # 40 lakhs
    }

    # Base prices for common bike makes in INR
    bike_base_prices = {
        # Popular Indian bike brands
        'hero': 80000,         # 80k
        'bajaj': 100000,       # 1 lakh
        'tvs': 90000,          # 90k
        'honda': 120000,       # 1.2 lakhs
        'yamaha': 130000,      # 1.3 lakhs
        'suzuki': 140000,      # 1.4 lakhs
        'royal enfield': 180000, # 1.8 lakhs
        'ktm': 200000,         # 2 lakhs
        'kawasaki': 300000,    # 3 lakhs
        'harley davidson': 1000000, # 10 lakhs
        'triumph': 800000,     # 8 lakhs
        'ducati': 1500000,     # 15 lakhs
        'bmw': 1800000,        # 18 lakhs
        'jawa': 170000,        # 1.7 lakhs
        'husqvarna': 220000,   # 2.2 lakhs
        'benelli': 250000,     # 2.5 lakhs
    }

    # Select the appropriate price dictionary based on vehicle type
    base_prices = bike_base_prices if vehicle_type == 'bike' else car_base_prices

    # Get base price or use average if make not found
    make_lower = make.lower()
    default_price = 100000 if vehicle_type == 'bike' else 800000  # Default: 1 lakh for bikes, 8 lakhs for cars
    base_price = base_prices.get(make_lower, default_price)

    # Adjust for year
    current_year = 2025  # Using a fixed year for consistency
    year_factor = 1 - ((current_year - int(year)) * 0.08)  # Depreciation is faster in India

    # Adjust for condition
    condition_factors = {
        'excellent': 1.15,
        'good': 1.0,
        'fair': 0.85,
        'poor': 0.65,
    }
    condition_factor = condition_factors.get(condition.lower(), 1.0)

    # Calculate price
    price = base_price * max(0.4, year_factor) * condition_factor

    # Add some randomness
    price = price * (0.95 + random.random() * 0.1)

    # Create result
    result = {
        'make': make,
        'model': model,
        'year': year,
        'condition': condition,
        'vehicle_type': vehicle_type,
        'average_price': round(price, 2),
        'min_price': round(price * 0.9, 2),
        'max_price': round(price * 1.1, 2),
        'sample_size': 1,
        'confidence': 0.7,
        'currency': 'INR',
        'source': 'fallback_algorithm'
    }

    # Cache the result
    cache_key = f"{vehicle_type}_{make}_{model}_{year}_{condition}"
    price_cache[cache_key] = (time.time(), result)
    return result

@app.route('/api/vehicle-price', methods=['GET'])
def get_vehicle_price():
    """
    API endpoint to get vehicle price data (cars or bikes)
    """
    make = request.args.get('make', '')
    model = request.args.get('model', '')
    year = request.args.get('year', '')
    condition = request.args.get('condition', 'good')
    vehicle_type = request.args.get('vehicle_type', 'car')  # Default to car if not specified

    if not make or not model or not year:
        return jsonify({
            'error': 'Missing required parameters: make, model, year'
        }), 400

    if vehicle_type not in ['car', 'bike']:
        return jsonify({
            'error': 'Invalid vehicle_type. Must be either "car" or "bike"'
        }), 400

    result = get_car_price_data(make, model, year, condition, vehicle_type)
    return jsonify(result)

# Keep the old endpoint for backward compatibility
@app.route('/api/car-price', methods=['GET'])
def get_car_price():
    """
    API endpoint to get car price data (legacy endpoint)
    """
    make = request.args.get('make', '')
    model = request.args.get('model', '')
    year = request.args.get('year', '')
    condition = request.args.get('condition', 'good')

    if not make or not model or not year:
        return jsonify({
            'error': 'Missing required parameters: make, model, year'
        }), 400

    result = get_car_price_data(make, model, year, condition, 'car')
    return jsonify(result)

@app.route('/api/bike-price', methods=['GET'])
def get_bike_price():
    """
    API endpoint to get bike price data
    """
    make = request.args.get('make', '')
    model = request.args.get('model', '')
    year = request.args.get('year', '')
    condition = request.args.get('condition', 'good')

    if not make or not model or not year:
        return jsonify({
            'error': 'Missing required parameters: make, model, year'
        }), 400

    result = get_car_price_data(make, model, year, condition, 'bike')
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'ok',
        'message': 'VelaValue Vehicle Price API is running',
        'version': '1.0.0',
        'supported_vehicles': ['car', 'bike'],
        'cache_size': len(price_cache),
        'developer': 'Varun Anish',
        'contact': 'anishvarun17@gmail.com',
        'institution': 'IFHE',
        'project': 'VelaValue - Special Project'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
