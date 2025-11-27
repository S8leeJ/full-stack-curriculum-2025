const admin = require("firebase-admin");
const express = require("express");
// const creds = require("./cred.json"); // Path to your service account JSON
// Initialize Firebase Admin SDK

const creds = JSON.parse(
  Buffer.from(process.env.FIREBASE_CREDS_BASE64, 'base64').toString()
);


admin.initializeApp({
  credential: admin.credential.cert(creds),
});
const db = admin.firestore();
module.exports = db;
