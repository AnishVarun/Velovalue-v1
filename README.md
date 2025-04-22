# VelaValue - Indian Vehicle Price Calculator

VelaValue is a modern web application that helps Indian users get accurate price estimates for cars and bikes. It features a user-friendly interface, authentication with Firebase, and a powerful price prediction algorithm enhanced with web scraping from popular Indian automotive websites and Gemini AI insights.

## Features

- **Car & Bike Price Calculator**: Get accurate price estimates for any vehicle in Indian Rupees
- **Indian Market Focus**: Specifically designed for the Indian automotive market
- **Web Scraping**: Fetches real-time data from popular Indian websites like CarDekho, CarWale, and ZigWheels
- **Gemini AI Integration**: Provides detailed insights and analysis about vehicles
- **Authentication**: Login and signup with email or Google
- **Community Forum**: Discuss with other vehicle enthusiasts
- **Responsive Design**: Works on desktop and mobile devices
- **Detailed Specifications**: View comprehensive vehicle specifications and features

## Tech Stack

### Frontend
- React
- Vite
- TailwindCSS
- Lucide React (for icons)

### Backend
- Firebase (Authentication, Firestore)
- Python Flask API (for web scraping)
- BeautifulSoup (for web scraping)
- Google Generative AI (Gemini API for vehicle insights)
- Indian automotive websites (CarDekho, CarWale, ZigWheels)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.8 or higher (for the scraping API)
- Firebase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/velavalue.git
   cd velavalue
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd server
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

### Running the Application

#### Option 1: Using the start script

1. Run the start script to launch both servers:
   ```
   start-servers.bat
   ```

2. Open your browser and navigate to `http://localhost:3000`

#### Option 2: Manual startup

1. Start the frontend development server:
   ```
   npm run dev
   ```

2. Start the backend API server:
   ```
   cd server
   python indian_vehicle_scraper.py
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
velavalue/
├── public/              # Static assets
├── server/              # Python backend for web scraping
│   ├── indian_vehicle_scraper.py  # Flask API for vehicle price scraping
│   └── requirements.txt      # Python dependencies
├── src/
│   ├── components/      # React components
│   │   ├── auth/        # Authentication components
│   │   ├── community/   # Community forum components
│   │   ├── layout/      # Layout components
│   │   ├── ui/          # UI components
│   │   ├── PriceCalculator.jsx  # Car price calculator
│   │   ├── BikeCalculator.jsx   # Bike price calculator
│   │   ├── ContactForm.jsx      # Contact form
│   │   └── DisclaimerPopup.jsx  # Disclaimer popup
│   ├── config/          # Configuration files
│   │   └── firebase.js  # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Entry point
├── package.json         # Project dependencies
└── start-servers.bat    # Script to start both servers
```

## Authentication

The application supports two authentication methods:

1. **Email/Password**: Users can sign up and log in using their email and password
2. **Google Authentication**: Users can sign in with their Google account

Authentication state is persisted using Firebase's local persistence, so users remain logged in even after closing the browser.

## Vehicle Price Calculator

The vehicle price calculator uses multiple data sources:

1. **Indian Web Scraping API**: When online, the application uses a Python Flask API that scrapes vehicle price data from popular Indian websites:
   - CarDekho.com
   - CarWale.com
   - ZigWheels.com
   - BikeWale.com
   - BikeDekho.com

2. **Gemini AI Integration**: The application uses Google's Gemini AI to provide detailed insights about vehicles, including:
   - Vehicle overview
   - Key features and specifications
   - Pros and cons
   - Market position in India
   - Resale value insights
   - Maintenance costs
   - Fuel efficiency
   - Competitors in the same segment

3. **Fallback Algorithm**: As a fallback, the application uses a prediction algorithm based on various factors like make, model, year, mileage, and condition, specifically calibrated for the Indian market

## Deployment

### Frontend

The frontend can be deployed to Firebase Hosting:

```
npm run build
firebase deploy --only hosting
```

### Backend

The backend can be deployed to a service like Heroku, Google Cloud Run, or AWS:

```
# Example for Heroku
cd server
heroku create
git push heroku main
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [Flask](https://flask.palletsprojects.com/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)
- [Google Generative AI (Gemini)](https://ai.google.dev/)
- [CarDekho](https://www.cardekho.com/)
- [CarWale](https://www.carwale.com/)
- [ZigWheels](https://www.zigwheels.com/)

## Special Thanks

This project was created by Varun Anish as a special project for IFHE. For inquiries, please contact:
- Email: anishvarun17@gmail.com
- Phone: +91 7396947531
