import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import Header from "./Header";
//import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

export default function HomePage() {

  // State to hold the list of tasks.
  const [taskList, setTaskList] = useState([]);

  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  function handleAddTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (!newTaskName || !newTaskName.trim()) return;
    if (taskList.some((task) => task.name === newTaskName)) {
      alert("Task already exists!");
      return;
    }

    const newTask = {
      id: `${Date.now()}-${Math.round(Math.random()*10000)}`,
      name: newTaskName,
      finished: false,
    };

    // add new task
    setTaskList((prev) => [...prev, newTask]);
    setNewTaskName("");
  }

  // Function to toggle the 'finished' status of a task.
  function toggleTaskCompletion(task) {
    console.log("Toggling task:", task);
    setTaskList((prev) => prev.map((t) => (t.id === task.id ? { ...t, finished: !t.finished } : t)));

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.
  }

  function deleteTask(id) {
    setTaskList((prev) => prev.filter((t) => t.id !== id));
  }

   // Function to compute a message indicating how many tasks are unfinished.
  function getUnfinishedTaskMessage() {
    const unfinishedTasks = taskList.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  // Persist tasks to localStorage
  useEffect(() => {
    // Load on mount
    const saved = localStorage.getItem("todo_tasks_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setTaskList(parsed);
      } catch (e) {
        console.warn("Failed to parse saved tasks", e);
      }
    } else {
      // initialize with some sample tasks if none saved
      const samples = [
        { id: `s-1`, name: "create a todo app", finished: false },
        { id: `s-2`, name: "wear a mask", finished: false },
        { id: `s-3`, name: "play roblox", finished: false },
        { id: `s-4`, name: "be a winner", finished: true },
        { id: `s-5`, name: "become a tech bro", finished: true },
      ];
      setTaskList(samples);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("todo_tasks_v1", JSON.stringify(taskList));
    } catch (e) {
      console.warn("Failed to save tasks", e);
    }
  }, [taskList]);

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getUnfinishedTaskMessage()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={newTaskName}
                  placeholder="Type your task here"
                  onChange={(event) => setNewTaskName(event.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddTask(); }}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {taskList.map((task) => (
                <ListItem
                  key={task.id}
                  dense
                  onClick={() => toggleTaskCompletion(task)}
                >
                  <Checkbox
                    checked={task.finished}
                    onChange={(e) => { e.stopPropagation(); toggleTaskCompletion(task); }}
                    onClick={(e) => e.stopPropagation()} /* prevent ListItem click from also firing */
                  />
                  <ListItemText
                    primary={
                      <span
                        style={{
                          textDecoration: task.finished ? "line-through" : "none",
                          color: task.finished ? "rgba(0,0,0,0.5)" : "inherit",
                        }}
                      >
                        {task.name}
                      </span>
                    }
                  />
                  <IconButton edge="end" aria-label="delete" onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}