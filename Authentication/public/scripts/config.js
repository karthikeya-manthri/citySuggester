var firebaseConfig = {
  apiKey: "AIzaSyBS99Hu5LjulLZXv5ktX_ngKukWenAn1AQ",
  authDomain: "task1-authentication.firebaseapp.com",
  databaseURL: "https://task1-authentication.firebaseio.com",
  projectId: "task1-authentication",
  storageBucket: "task1-authentication.appspot.com",
  appId: "1:1084391945616:web:b7b70218aa5bbb81972f15",
  measurementId: "G-BLGDRRXSJL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// auth,firestore reference
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();
const storage = firebase.storage();