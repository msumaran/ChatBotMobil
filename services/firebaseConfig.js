import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: 'AIzaSyDCyZTjP6Pl5_KfvsacMl4QyG0b8laeHlE',
  authDomain: 'nativosdev.firebaseapp.com',
  projectId: 'nativosdev',
  storageBucket: 'nativosdev.appspot.com',
  messagingSenderId: '481876600822',
  appId: '1:481876600822:web:1fc3d0a46e1cab9f1ec9d7',
  measurementId: 'G-JG57GJ8947',
  // apiKey: "AIzaSyDPEtYPRul7fCWNnrnamSfzUjRTlihHnSM",
  // authDomain: "netjoven-f2aed.firebaseapp.com",
  // projectId: "netjoven-f2aed",
  // storageBucket: "netjoven-f2aed.appspot.com",
  // messagingSenderId: "127407554357",
  // appId: "1:127407554357:web:bf78220812b4779561d67c",
  // measurementId: "G-K23G0JG84R",
};

  const app = initializeApp(firebaseConfig);

  // Obtiene una instancia de la base de datos
  const database = getDatabase(app);
  
  const auth = getAuth(app);

  export { database, auth };