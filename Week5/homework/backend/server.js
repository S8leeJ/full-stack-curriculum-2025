const express = require("express");
const cors = require("cors");
const db = require("./firebase"); // Import Firestore instance
const app = express();
const admin = require("firebase-admin");
//const creds = require("./cred.json"); // Path to your service account JSON

 


//middleware
app.use(cors());
app.use(express.json()); // Parse JSON body
// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// getting user tasks
app.get("/tasks/:user", auth, async (req, res) => {
  const { user } = req.params;
  const snapshot = await db.collection("tasks").where("user", "==", user).get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(todos);
});

// post task
app.post("/tasks", auth, async (req, res) => {
  const data = req.body;
  const addedTask = await db.collection("tasks").add(data);
  res.status(201).json({ id: addedTask.id, ...data });
});

// DELETE /tasks/:id
app.delete("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.json({ message: "Deleted successfully" });
});


// PATCH /tasks/:id
app.patch("/tasks/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { finished } = req.body;
  await db.collection("tasks").doc(id).update({ finished });
  res.json({ message: "Updated successfully" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));