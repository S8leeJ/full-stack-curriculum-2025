const express = require("express");
const cors = require("cors");
const db = require("./firebase"); // Import Firestore instance
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON body

// 1. Get all todos for a user
app.get("/todos/:user", async (req, res) => {
  const { user } = req.params;
  const snapshot = await db.collection("tasks").where("user", "==", user).get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(todos);
});

// compatibility routes for frontend expecting `/tasks` paths
app.get("/tasks/:user", async (req, res) => {
  const { user } = req.params;
  const snapshot = await db.collection("tasks").where("user", "==", user).get();
  const todos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(todos);
});

// 2. Create a todo object
app.post("/todos", async (req, res) => {
  const data = req.body; // { user: "Jenna", task: "Clean room", finished: false }
  const addedTask = await db.collection("tasks").add(data);
  res.status(201).json({ id: addedTask.id, ...data });
});

// compatibility POST /tasks
app.post("/tasks", async (req, res) => {
  const data = req.body;
  const addedTask = await db.collection("tasks").add(data);
  res.status(201).json({ id: addedTask.id, ...data });
});

// 3. Delete a todo object
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.json({ message: "Deleted successfully" });
});

// compatibility DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.json({ message: "Deleted successfully" });
});

// 4. Optional: Update/Check off a todo
app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { finished } = req.body;
  await db.collection("tasks").doc(id).update({ finished });
  res.json({ message: "Updated successfully" });
});

// compatibility PATCH /tasks/:id
app.patch("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { finished } = req.body;
  await db.collection("tasks").doc(id).update({ finished });
  res.json({ message: "Updated successfully" });
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
