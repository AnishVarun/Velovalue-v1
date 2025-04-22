import requests
from bs4 import BeautifulSoup
import json
import re
import time
import random
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Gemini API key
GEMINI_API_KEY = "AIzaSyBkE1v8oEUU9yHsXHLjCPdhLt_R2bGL6rs"

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

# Cache for storing scraped data to reduce repeated requests
price_cache = {}
cache_expiry = 3600  # Cache expiry in seconds (1 hour)

def format_price_usd(price):
    """Format price in USD"""
    # Convert from INR to USD (approximate conversion rate)
    usd_price = price / 75.0  # Approximate INR to USD conversion
    return f"${usd_price:,.2f}"

def clean_price_string(price_str):
    """Clean price string and convert to numeric value"""
    # Remove all non-numeric characters except decimal point
    price_str = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(price_str)
    except ValueError:
        return None

def scrape_cardekho(make, model, year=None, vehicle_type='car'):
    """Scrape price data from CarDekho"""
    logger.info(f"Scraping CarDekho for {make} {model} {year}")

    prices = []

    try:
        # Format the URL based on vehicle type
        if vehicle_type == 'car':
            url = f"https://www.cardekho.com/cars/{make}/{model}"
            if year:
                url += f"/specs/{year}"
        else:  # bike
            url = f"https://www.bikedekho.com/{make.lower()}-bikes/{model.lower()}"
            if year:
                url += f"/specs/{year}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract price information
            if vehicle_type == 'car':
                # Look for price elements in CarDekho car pages
                price_elements = soup.select('.price span') or soup.select('.price-tag') or soup.select('.amount')

                for element in price_elements:
                    price_text = element.get_text().strip()
                    if 'Lakh' in price_text or 'Cr' in price_text or '₹' in price_text:
                        # Convert lakh/crore to numeric
                        if 'Lakh' in price_text:
                            value = clean_price_string(price_text)
                            if value:
                                prices.append(value * 100000)
                        elif 'Cr' in price_text:
                            value = clean_price_string(price_text)
                            if value:
                                prices.append(value * 10000000)
                        else:
                            value = clean_price_string(price_text)
                            if value:
                                prices.append(value)
            else:
                # Look for price elements in BikeDekho pages
                price_elements = soup.select('.price span') or soup.select('.price-tag') or soup.select('.amount')

                for element in price_elements:
                    price_text = element.get_text().strip()
                    if 'Lakh' in price_text or '₹' in price_text:
                        # Convert lakh to numeric
                        if 'Lakh' in price_text:
                            value = clean_price_string(price_text)
                            if value:
                                prices.append(value * 100000)
                        else:
                            value = clean_price_string(price_text)
                            if value:
                                prices.append(value)

            # Also try to extract specs and features
            specs = {}

            # Extract engine specs
            engine_elements = soup.select('.engine-specs li') or soup.select('.specs-list li')
            for element in engine_elements:
                text = element.get_text().strip()
                if ':' in text:
                    key, value = text.split(':', 1)
                    specs[key.strip()] = value.strip()

            return {
                'prices': prices,
                'specs': specs,
                'source': 'cardekho',
                'url': url
            }

    except Exception as e:
        logger.error(f"Error scraping CarDekho: {e}")

    return None

def scrape_carwale(make, model, year=None, vehicle_type='car'):
    """Scrape price data from CarWale"""
    logger.info(f"Scraping CarWale for {make} {model} {year}")

    prices = []

    try:
        # Format the URL based on vehicle type
        if vehicle_type == 'car':
            url = f"https://www.carwale.com/{make.lower()}-cars/{model.lower()}"
            if year:
                url += f"/{year}"
        else:  # bike
            url = f"https://www.bikewale.com/{make.lower()}/{model.lower()}"
            if year:
                url += f"/{year}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract price information
            price_elements = soup.select('.o-fzptER') or soup.select('.price-value') or soup.select('.price')

            for element in price_elements:
                price_text = element.get_text().strip()
                if 'Lakh' in price_text or 'Cr' in price_text or '₹' in price_text:
                    # Convert lakh/crore to numeric
                    if 'Lakh' in price_text:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value * 100000)
                    elif 'Cr' in price_text:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value * 10000000)
                    else:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value)

            # Extract specs and features
            specs = {}

            # Extract key specs
            spec_elements = soup.select('.o-cpnuEd') or soup.select('.key-specs li')
            for element in spec_elements:
                text = element.get_text().strip()
                if ':' in text:
                    key, value = text.split(':', 1)
                    specs[key.strip()] = value.strip()

            return {
                'prices': prices,
                'specs': specs,
                'source': 'carwale',
                'url': url
            }

    except Exception as e:
        logger.error(f"Error scraping CarWale: {e}")

    return None

def scrape_zigwheels(make, model, year=None, vehicle_type='car'):
    """Scrape price data from ZigWheels"""
    logger.info(f"Scraping ZigWheels for {make} {model} {year}")

    prices = []

    try:
        # Format the URL based on vehicle type
        if vehicle_type == 'car':
            url = f"https://www.zigwheels.com/{make.lower()}-cars/{model.lower()}"
            if year:
                url += f"/{year}"
        else:  # bike
            url = f"https://www.zigwheels.com/bikes/{make.lower()}/{model.lower()}"
            if year:
                url += f"/{year}"

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        }

        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')

            # Extract price information
            price_elements = soup.select('.price-value') or soup.select('.zw-cmn-price')

            for element in price_elements:
                price_text = element.get_text().strip()
                if 'Lakh' in price_text or 'Cr' in price_text or '₹' in price_text:
                    # Convert lakh/crore to numeric
                    if 'Lakh' in price_text:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value * 100000)
                    elif 'Cr' in price_text:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value * 10000000)
                    else:
                        value = clean_price_string(price_text)
                        if value:
                            prices.append(value)

            # Extract specs and features
            specs = {}

            # Extract key specs
            spec_elements = soup.select('.key-specs-list li') or soup.select('.zw-key-specs li')
            for element in spec_elements:
                text = element.get_text().strip()
                if ':' in text:
                    key, value = text.split(':', 1)
                    specs[key.strip()] = value.strip()

            return {
                'prices': prices,
                'specs': specs,
                'source': 'zigwheels',
                'url': url
            }

    except Exception as e:
        logger.error(f"Error scraping ZigWheels: {e}")

    return None

def get_gemini_insights(make, model, year, vehicle_type, specs=None):
    """Get additional insights from Gemini AI"""
    logger.info(f"Getting Gemini insights for {make} {model} {year}")

    try:
        # Create a prompt for Gemini
        prompt = f"""
        Provide detailed information about the {year} {make} {model} {vehicle_type} in the Indian market.

        Include the following information:
        1. A brief overview of the vehicle
        2. Key features and specifications
        3. Pros and cons
        4. Market position in India
        5. Resale value insights
        6. Maintenance costs
        7. Fuel efficiency
        8. Competitors in the same segment

        Format the response in a concise, structured way that would be helpful for someone considering purchasing this vehicle.
        """

        if specs:
            prompt += f"\n\nHere are some known specifications: {json.dumps(specs)}"

        # Generate content with Gemini
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        # Process and return the response
        if response and hasattr(response, 'text'):
            return response.text
        else:
            return "No additional information available from Gemini AI."

    except Exception as e:
        logger.error(f"Error getting Gemini insights: {e}")
        return "Unable to retrieve additional information at this time."

def get_vehicle_price_data(make, model, year=None, condition='good', vehicle_type='car'):
    """
    Get vehicle price data from multiple Indian sources
    """
    # Create a cache key
    cache_key = f"{vehicle_type}_{make}_{model}_{year}_{condition}"

    # Check if data is in cache and not expired
    if cache_key in price_cache:
        cache_time, data = price_cache[cache_key]
        if time.time() - cache_time < cache_expiry:
            logger.info(f"Using cached data for {cache_key}")
            return data

    # Initialize results
    all_prices = []
    all_specs = {}
    sources = []
    urls = []

    # Scrape from multiple sources
    cardekho_data = scrape_cardekho(make, model, year, vehicle_type)
    if cardekho_data and cardekho_data['prices']:
        all_prices.extend(cardekho_data['prices'])
        all_specs.update(cardekho_data['specs'])
        sources.append(cardekho_data['source'])
        urls.append(cardekho_data['url'])

    carwale_data = scrape_carwale(make, model, year, vehicle_type)
    if carwale_data and carwale_data['prices']:
        all_prices.extend(carwale_data['prices'])
        all_specs.update(carwale_data['specs'])
        sources.append(carwale_data['source'])
        urls.append(carwale_data['url'])

    zigwheels_data = scrape_zigwheels(make, model, year, vehicle_type)
    if zigwheels_data and zigwheels_data['prices']:
        all_prices.extend(zigwheels_data['prices'])
        all_specs.update(zigwheels_data['specs'])
        sources.append(zigwheels_data['source'])
        urls.append(zigwheels_data['url'])

    # Process the prices if we have any
    if all_prices:
        # Calculate statistics
        avg_price = sum(all_prices) / len(all_prices)
        min_price = min(all_prices)
        max_price = max(all_prices)

        # Get additional insights from Gemini
        gemini_insights = get_gemini_insights(make, model, year, vehicle_type, all_specs)

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
            'formatted_avg_price': format_price_usd(avg_price),
            'formatted_min_price': format_price_usd(min_price),
            'formatted_max_price': format_price_usd(max_price),
            'sample_size': len(all_prices),
            'confidence': min(0.95, 0.6 + (len(all_prices) / 10)),  # Higher confidence with more samples
            'currency': 'USD',
            'source': ', '.join(sources),
            'source_urls': urls,
            'specifications': all_specs,
            'gemini_insights': gemini_insights
        }

        # Cache the result
        price_cache[cache_key] = (time.time(), result)
        return result

    # If we couldn't find price data, use a fallback method
    return generate_fallback_price(make, model, year, condition, vehicle_type)

def generate_fallback_price(make, model, year, condition, vehicle_type='car'):
    """
    Generate a fallback price when scraping fails - using Indian market prices
    """
    logger.info(f"Generating fallback price for {make} {model} {year}")

    # Base prices for common makes in USD
    car_base_prices = {
        # Popular car brands
        'maruti': 8000,       # Basic Maruti
        'hyundai': 10000,     # Basic Hyundai
        'tata': 9000,         # Basic Tata
        'mahindra': 12000,    # Basic Mahindra
        'toyota': 15000,      # Basic Toyota
        'honda': 13000,       # Basic Honda
        'kia': 11000,         # Basic Kia
        'mg': 18000,          # Basic MG
        'ford': 14000,        # Basic Ford
        'volkswagen': 16000,  # Basic Volkswagen
        'skoda': 17000,       # Basic Skoda
        'renault': 9000,      # Basic Renault
        'nissan': 10000,      # Basic Nissan
        'jeep': 22000,        # Basic Jeep
        # Luxury brands
        'mercedes': 60000,    # Basic Mercedes
        'bmw': 55000,         # Basic BMW
        'audi': 50000,        # Basic Audi
        'lexus': 65000,       # Basic Lexus
        'jaguar': 60000,      # Basic Jaguar
        'land rover': 80000,  # Basic Land Rover
        'volvo': 50000,       # Basic Volvo
    }

    # Base prices for common bike makes in USD
    bike_base_prices = {
        # Popular bike brands
        'hero': 1000,           # Basic Hero
        'bajaj': 1200,          # Basic Bajaj
        'tvs': 1100,            # Basic TVS
        'honda': 1500,          # Basic Honda
        'yamaha': 1600,         # Basic Yamaha
        'suzuki': 1700,         # Basic Suzuki
        'royal enfield': 2200,  # Basic Royal Enfield
        'ktm': 2500,            # Basic KTM
        'kawasaki': 3500,       # Basic Kawasaki
        'harley davidson': 12000, # Basic Harley Davidson
        'triumph': 9500,        # Basic Triumph
        'ducati': 18000,        # Basic Ducati
        'bmw': 22000,           # Basic BMW
        'jawa': 2000,           # Basic Jawa
        'husqvarna': 2700,      # Basic Husqvarna
        'benelli': 3000,        # Basic Benelli
    }

    # Select the appropriate price dictionary based on vehicle type
    base_prices = bike_base_prices if vehicle_type == 'bike' else car_base_prices

    # Get base price or use average if make not found
    make_lower = make.lower()
    default_price = 1200 if vehicle_type == 'bike' else 10000  # Default: $1,200 for bikes, $10,000 for cars
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

    # Get additional insights from Gemini
    gemini_insights = get_gemini_insights(make, model, year, vehicle_type)

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
        'formatted_avg_price': format_price_usd(price),
        'formatted_min_price': format_price_usd(price * 0.9),
        'formatted_max_price': format_price_usd(price * 1.1),
        'sample_size': 1,
        'confidence': 0.7,
        'currency': 'USD',
        'source': 'fallback_algorithm',
        'source_urls': [],
        'specifications': {},
        'gemini_insights': gemini_insights
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

    result = get_vehicle_price_data(make, model, year, condition, vehicle_type)
    return jsonify(result)

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

    result = get_vehicle_price_data(make, model, year, condition, 'car')
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

    result = get_vehicle_price_data(make, model, year, condition, 'bike')
    return jsonify(result)

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'ok',
        'message': 'VelaValue Vehicle Price API is running',
        'version': '2.0.0',
        'supported_vehicles': ['car', 'bike'],
        'supported_sources': ['cardekho', 'carwale', 'zigwheels', 'gemini'],
        'currency': 'USD',
        'cache_size': len(price_cache),
        'developer': 'Varun Anish',
        'contact': 'anishvarun17@gmail.com',
        'institution': 'IFHE',
        'project': 'VelaValue - Special Project'
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
