// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBk__Ro5vpDcpoKYymDUAD2p2i5kkYLFTA",
  authDomain: "velavalue-1bae0.firebaseapp.com",
  projectId: "velavalue-1bae0",
  storageBucket: "velavalue-1bae0.firebasestorage.app",
  messagingSenderId: "440722097198",
  appId: "1:440722097198:web:2a5d518a140493acaa4bbf",
  measurementId: "G-F2SHGVLL99"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set persistence to LOCAL (session will persist even after browser restart)
try {
  setPersistence(auth, browserLocalPersistence);
} catch (error) {
  console.error('Error setting persistence:', error);
}

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Only initialize analytics in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
}

// Export authentication functions
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    const result = await firebaseSignIn(auth, email, password);
    return result;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const createUserWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const result = await firebaseSignUp(auth, email, password);

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(result.user, { displayName });
    } else {
      // Use email as display name if not provided
      await updateProfile(result.user, { displayName: email.split('@')[0] });
    }

    return result;
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error('Google login error:', error.message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error('Signout error:', error.message);
    throw error;
  }
};

// Function to get the current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Function to listen for auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

export const getCarData = async () => {
  try {
    // For now, just return sample data without trying to access Firestore
    // This avoids potential 400 errors during development
    const sampleCars = [
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

    // Return sample data directly
    return sampleCars;
  } catch (error) {
    console.error('Error fetching car data:', error);
    // Fallback to sample data if there's an error
    return [
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
    ];
  }
};

// Function to predict car price
export const predictCarPrice = async (carData) => {
  try {

    // If no similar predictions, use algorithm
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

    const make = carData.make?.toLowerCase() || '';
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

    // No need to save to Firestore for now

    return {
      estimatedPrice: Math.round(predictedPrice),
      confidence: 0.85,
      marketComparison: 'Average',
      priceRange: {
        low: Math.round(predictedPrice * 0.9),
        high: Math.round(predictedPrice * 1.1),
      },
    };
  } catch (error) {
    console.error('Error predicting car price:', error);

    // Fallback to simple calculation if there's an error
    const basePrice = 25000;
    return {
      estimatedPrice: basePrice,
      confidence: 0.7,
      marketComparison: 'Estimated (fallback)',
      priceRange: {
        low: Math.round(basePrice * 0.85),
        high: Math.round(basePrice * 1.15),
      },
    };
  }
};

export { auth, db, storage, analytics };
