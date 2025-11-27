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

const API_BASE = process.env.REACT_APP_BACKEND || 'http://localhost:3001';
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
  const getAuthHeaders = async () => {
    if (!currentUser) return {};
    const token = await currentUser.getIdToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // UPDATED: Add auth header
    const fetchTasks = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${API_BASE}/tasks/${encodeURIComponent(currentUser.email)}`, // Use email instead of currentUser
          { headers }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setTaskList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, [currentUser, navigate]);


  async function handleAddTask() {
    if (newTaskName && !taskList.some((task) => task.name === newTaskName)) {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/tasks`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            user: currentUser.email,  // Use email
            name: newTaskName,
            finished: false
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        setTaskList((prev) => [...prev, created]);
        setNewTaskName("");
      } catch (err) {
        console.error('Error adding task:', err);
      }
    } else if (taskList.some((task) => task.name === newTaskName)) {
      alert("Task already exists!");
    }
  }

  async function toggleTaskCompletion(task) {
    const next = !task.finished;
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/tasks/${task.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ finished: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTaskList((prev) => prev.map((t) => (t.id === task.id ? { ...t, finished: next } : t)));
    } catch (err) {
      console.error('Error updating task:', err);
    }
  }
  async function deleteTask(id) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setTaskList((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
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