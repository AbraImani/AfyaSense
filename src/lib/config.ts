import { GoogleGenAI } from "@google/genai";
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Configuration AI
export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// Configuration Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
