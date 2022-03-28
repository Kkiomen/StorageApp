// Import the functions you need from the SDKs you need
import * as firebase from "firebase/compat";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'
import firestore from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1-8q1Co4ipti6rd7MPNwj9BbR7r00gDE",
    authDomain: "storageapp-6d6a9.firebaseapp.com",
    projectId: "storageapp-6d6a9",
    storageBucket: "storageapp-6d6a9.appspot.com",
    messagingSenderId: "107994642843",
    appId: "1:107994642843:web:44d02ec7166f7ae1b1493e",
    token: "A189513D-617D-455A-99A6-46A803E32250",
};

// Initialize Firebase
let app;
if(firebase.apps.length === 0){
    app = firebase.initializeApp(firebaseConfig);
}else{
    app = firebase.app();
}

firebase.firestore();
const auth = firebase.auth();
const db = app.firestore();
const storage = app.storage();

export { auth,db,storage };
export default firebase;
