import React, { useState } from "react";
import { auth } from "./Firebase"; // Import Firebase Auth instance
import { updateProfile } from "firebase/auth";
import "./ProfilePage.css"; // ProfilePage CSS

const ProfilePage = () => {
  const [name, setName] = useState(auth.currentUser?.displayName || "");
  const [email] = useState(auth.currentUser?.email || "");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleEditName = async () => {
    if (name.trim() === "") {
      setMessage("Name cannot be empty.");
      return;
    }

    try {
      await updateProfile(auth.currentUser, { displayName: name });
      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-details">
        <div className="profile-item">
          <label>Email:</label>
          <span>{email}</span>
        </div>
        <div className="profile-item">
          <label>Name:</label>
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="profile-input"
              />
              <button onClick={handleEditName} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </>
          ) : (
            <>
              <span>{name}</span>
              <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            </>
          )}
        </div>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
