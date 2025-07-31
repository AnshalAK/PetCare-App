import React, { useState, useEffect } from "react";
import { firestore } from "./Firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./SetReminder.css";

const SetReminder = () => {
  const [reminderType, setReminderType] = useState("vaccine");
  const [reminderDate, setReminderDate] = useState("");
  const [petId, setPetId] = useState("");
  const [pets, setPets] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch pets from Firestore
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petCollection = collection(firestore, "pets");
        const petSnapshot = await getDocs(petCollection);
        const petList = petSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPets(petList);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!petId || !reminderDate) {
      setMessage("Please select a pet and set a date.");
      return;
    }
    try {
      await addDoc(collection(firestore, "reminders"), {
        petId,
        reminderType,
        reminderDate,
      });
      setMessage("Reminder set successfully!");
      setReminderType("vaccine");
      setReminderDate("");
      setPetId("");
    } catch (error) {
      console.error("Error setting reminder:", error);
      setMessage("Error setting reminder. Please try again.");
    }
  };

  return (
    <div className="set-reminder">
      <h1>Set a Reminder</h1>
      <form onSubmit={handleSubmit} className="reminder-form">
        <div className="form-group">
          <label htmlFor="reminderType">Reminder Type:</label>
          <select
            id="reminderType"
            value={reminderType}
            onChange={(e) => setReminderType(e.target.value)}
          >
            <option value="vaccine">Vaccine</option>
            <option value="grooming">Grooming</option>
            <option value="food">Food</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reminderDate">Reminder Date:</label>
          <input
            type="date"
            id="reminderDate"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="petId">Select Pet:</label>
          <select
            id="petId"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
          >
            <option value="">-- Select Pet --</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Set Reminder</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SetReminder;
