import React, { useState } from "react";
import './App.css';

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";


function App() {
  // This will hold the user information
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");




  // This will hold the uploaded image URL
  const uploadedImageURL = null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log(userCredential.user);

    } catch (error) {
      console.error("error logging in");
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      setUser(userCredential.user);
      console.log(userCredential.user);
    } catch (error) {
      console.error("error signing up");
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("error logging out");

    }
  }

  const handleGoogleSignup = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user);
      console.log(userCredential.user);
    } catch (error) {
      console.error("error signing up with Google");
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Authentication & File Upload Demo</h1>
        {/* Check if the user exists (is logged in) to show the login or welcome screen */}
        {!user ? (
          <>
            <form onSubmit={handleLogin}>
              <h3>Login</h3>
              <input
                type="email"
                placeholder="Email"
                required value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required value={password} onChange={(e) => setPassword(e.target.value)}
              />
              <button onClick={handleLogin} type="submit">Login</button>
            </form>

            <form onSubmit={handleSignup}>
              <h3>Sign Up</h3>
              <input
                type="email"
                placeholder="Email"
                required value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                required value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
              />
              <button type="submit">Sign Up</button>
            </form>

            <button onClick={handleGoogleSignup}>Sign Up with Google</button>
          </>
        ) : (
          <div>
            <p>Welcome, {user?.displayName || user?.email}</p>
            <button onClick={handleLogout}>Sign Out</button>

            {/* Image upload section */}
            <h3>Upload an Image</h3>
            <input type="file" />
            <button>Upload</button>

            {/* Display uploaded image if there is one*/}
            {uploadedImageURL && (
              <div>
                <h4>Uploaded Image:</h4>
                <img
                  alt="Uploaded"
                  style={{ width: "300px", height: "auto" }}
                />
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
