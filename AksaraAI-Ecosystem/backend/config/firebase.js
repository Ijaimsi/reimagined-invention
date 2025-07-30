// =================================================================
// FILE: config/firebase.js
// DESKRIPSI: Inisialisasi Firebase Admin SDK.
// =================================================================
const admin = require('firebase-admin');

// Ambil service account dari environment variable, parse sebagai JSON
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };