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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();


  // State to hold the list of tasks.
  const [taskList, setTaskList] = useState([{ id: 1, name: "Sample Task 1", finished: false },
  { id: 2, name: "Sample Task 2", finished: true }]);

  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    fetch(`${API_BASE}/tasks/${encodeURIComponent(currentUser)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setTaskList(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching tasks:', err));
  }, [currentUser, navigate]);


  function handleAddTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (newTaskName && !taskList.some((task) => task.name === newTaskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.

      fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser, name: newTaskName, finished: false }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((created) => {
          setTaskList((prev) => [...prev, created]);
          setNewTaskName("");
        })
        .catch((err) => console.error('Error adding task:', err));
    } else if (taskList.some((task) => task.name === newTaskName)) {
      alert("Task already exists!");
    }
  }

  // Function to toggle the 'finished' status of a task.
  function toggleTaskCompletion(task) {
    const next = !task.finished;
    fetch(`${API_BASE}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ finished: next }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => {
        setTaskList((prev) => prev.map((t) => (t.id === task.id ? { ...t, finished: next } : t)));
      })
      .catch((err) => console.error('Error updating task:', err));
  }

  function deleteTask(id) {
    fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(() => setTaskList((prev) => prev.filter((t) => t.id !== id)))
      .catch((err) => console.error('Error deleting task:', err));
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getUnfinishedTaskMessage() {
    const unfinishedTasks = taskList.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

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
                <ListItem key={task.id} dense>
                  <Checkbox
                    checked={task.finished}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTaskCompletion(task);
                    }}
                  />
                  <ListItemText
                    primary={task.name}
                    sx={{ textDecoration: task.finished ? 'line-through' : 'none' }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                  >
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