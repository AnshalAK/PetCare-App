import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddPet from "./AddPet";
import Petlist from "./Petlist";
import SetReminder from "./SetReminder"; // Import SetReminder component
import { firestore } from "./Firebase";
import { collection, getDocs } from "firebase/firestore";

import "./MainApp.css";
import ProfilePage from "./ProfilePage"; 

const MainApp = ({ user }) => {
  const [pets, setPets] = useState([]);

  // Fetch pets from Firestore
  const fetchPets = async () => {
    try {
      const petCollection = collection(firestore, "pets");
      const petSnapshot = await getDocs(petCollection);
      const petList = petSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPets(petList);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  // Fetch pets on initial load
  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <Router>
      <div className="main-app">
        {/* Navbar */}
        <nav className="navbar">
          <h1 className="navbar-logo">PetCare</h1>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/set-reminder">Set Reminder</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
          </ul>
        </nav>

        {/* Routing */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="dashboard">
                <div className="add-pet-section">
                  <h2>Add a New Pet</h2>
                  <AddPet refreshPets={fetchPets} />

                </div>
                <div className="pet-list-section">
                 
                  <Petlist pets={pets} />
                </div>
              </div>
            }
          />
          <Route path="/set-reminder" element={<SetReminder />} />
<Route path="/profile" element={<ProfilePage />} />
          <Route path="/about-us" element={<div>About Us Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default MainApp;
