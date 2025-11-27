const admin = require("firebase-admin");
const express = require("express");
const creds = require("./cred.json"); // Path to your service account JSON
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(creds),
});
const db = admin.firestore();
module.exports = db;
