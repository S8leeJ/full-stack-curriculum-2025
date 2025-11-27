const admin = require("firebase-admin");
const express = require("express");
const creds = require("./cred.json"); // Path to your service account JSON

admin.initializeApp({
  credential: admin.credential.cert(creds),
  databaseURL: "https://todo-backend.firebaseio.com"
});

const db = admin.firestore();
module.exports = db;
