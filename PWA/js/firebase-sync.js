import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBQG6GHxApLRSgBnQvXWrfdgrIf9sEacRA",
  authDomain: "qa-lead-dashboard.firebaseapp.com",
  projectId: "qa-lead-dashboard",
  storageBucket: "qa-lead-dashboard.firebasestorage.app",
  messagingSenderId: "946430881036",
  appId: "1:946430881036:web:1c0281b84acc89fd19ed29",
  measurementId: "G-7Y3YPX7XNS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Expose sync function to the global window so app.js can call it easily
window.syncStateToCloud = async function(userStoryKey, moduleId, stateObject, overallProgress) {
  if (!userStoryKey || userStoryKey === "default") return; // Don't sync generic/non-SOP module progress
  
  try {
    const docRef = doc(db, "user_stories", userStoryKey);
    // Push the state for this specific module
    await setDoc(docRef, { 
      [moduleId]: stateObject,
      overallProgress: overallProgress,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log(`Successfully synced ${moduleId} for ${userStoryKey} to Firebase.`);
  } catch (e) {
    console.error("Error syncing to Firebase:", e);
  }
};
