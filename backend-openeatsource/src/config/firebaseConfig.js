import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, child, query, orderByChild, equalTo, push } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "ubereatsplagiat.firebaseapp.com",
  databaseURL: "https://ubereatsplagiat-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "ubereatsplagiat",
  storageBucket: "ubereatsplagiat.firebasestorage.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, get, set, child, query, orderByChild, equalTo, push };
