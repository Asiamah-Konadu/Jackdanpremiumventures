import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB3jdBT7ZCRfZi9ZIEx7K12GXPzcKtWxaM",
  authDomain: "jackdan-premium-ventures.firebaseapp.com",
  projectId: "jackdan-premium-ventures",
  storageBucket: "jackdan-premium-ventures.firebasestorage.app",
  messagingSenderId: "415101432138",
  appId: "1:415101432138:web:af2fbc12116b9ffb2ad1b3",
  measurementId: "G-8LTKKZ1SZ3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
