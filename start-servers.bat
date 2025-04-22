@echo off
echo Starting VelaValue servers...

echo Starting Python backend server...
start cmd /k "cd server && python indian_vehicle_scraper.py"

echo Starting React frontend...
start cmd /k "npm run dev"

echo Servers started! Access the application at http://localhost:3000
