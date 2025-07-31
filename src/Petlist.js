import React, { useEffect, useState } from "react";
import { firestore } from "./Firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import "./Petlist.css"; // optional styling

const PetList = () => {
  const [pets, setPets] = useState([]);

  const fetchPets = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "pets"));
      const petsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPets(petsData);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this pet?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(firestore, "pets", id));
      fetchPets(); // refresh the list
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

 return (
  <div className="pet-list">
    <h2>Your Pets</h2>
    <div className="grid-container">
      {pets.map((pet) => (
        <div key={pet.id} className="pet-card">
          <img
            src={pet.imageUrl || "https://via.placeholder.com/100"}
            alt={pet.name}
            className="pet-image"
          />
          <div className="pet-details">
            <p><strong>Name:</strong> {pet.name}</p>
            <p><strong>Type:</strong> {pet.type}</p>
            <p><strong>Age:</strong> {pet.age}</p>
            <button onClick={() => handleDelete(pet.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default PetList;
