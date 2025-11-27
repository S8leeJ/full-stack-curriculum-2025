// Importing necessary hooks and functionalities
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";

// Creating a context for authentication. Contexts provide a way to pass data through 
// the component tree without having to pass props down manually at every level.
const AuthContext = createContext();
const firebaseConfig = {
    apiKey: "AIzaSyB3KFsNObVAeyOr1peCJxiJp8plqdq91WY",
    authDomain: "todo-backend-a1d36.firebaseapp.com",
    projectId: "todo-backend-a1d36",
    storageBucket: "todo-backend-a1d36.firebasestorage.app",
    messagingSenderId: "528054678224",
    appId: "1:528054678224:web:b9978414a14ac53518a4d5",
    measurementId: "G-PY9VD0JGCQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// This is a custom hook that we'll use to easily access our authentication context from other components.
export const useAuth = () => {
    return useContext(AuthContext);
};

// This is our authentication provider component.
// It uses the context to provide authentication-related data and functions to its children components.
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null); // State to hold the current user's information.
    const [loginError, setLoginError] = useState(null); // State to hold any login error messages.

    const register = (email, password) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setCurrentUser(userCredential.user);
                // Get access token (we'll need this for backend auth later)
                userCredential.user.getIdToken().then((accessToken) => {
                    console.log("Access Token:", accessToken);
                });
                navigate("/");
            })
            .catch((error) => {
                setLoginError(error.message);
            });
    };

    // Login function that validates the provided username and password.
    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                setCurrentUser(userCredential.user);
                // this method of retrieving access token also works
                console.log(userCredential.user.accessToken)
                navigate("/");
            })
            .catch((error) => {
                setLoginError(error.message);
            });
    };

    // Logout function to clear user data and redirect to the login page.
    const logout = () => {
        auth.signOut().then(() => {
            setCurrentUser(null);
            navigate("/login");
        });
    };

    // An object containing our state and functions related to authentication.
    // By using this context, child components can easily access and use these without prop drilling.
    const contextValue = {
        currentUser,
        login,
        logout,
        register,
        loginError
    };

    // The AuthProvider component uses the AuthContext.Provider to wrap its children.
    // This makes the contextValue available to all children and grandchildren.
    // Instead of manually passing down data and functions, components inside this provider can
    // simply use the useAuth() hook to access anything they need.
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}