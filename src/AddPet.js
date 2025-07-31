import React, { useState } from "react";
import { firestore } from "./Firebase";
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./AddPet.css";

const AddPet = ({ refreshPets }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = "https://via.placeholder.com/150"; // Default profile pic

      if (image) {
        const storage = getStorage();
        const imageRef = ref(storage, `pets/${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(firestore, "pets"), {
        name,
        type,
        age,
        imageUrl,
      });

      setName("");
      setType("");
      setAge("");
      setImage(null);
      setImagePreview(null);
      alert("Pet added successfully!");
      refreshPets();
    } catch (err) {
      console.error("Error adding pet:", err);
      alert("Error adding pet.");
    }
  };

  return (
    <div className="add-pet-container">
      <h2>Add a New Pet</h2>
      <form onSubmit={handleSubmit} className="add-pet-form">
        <div className="image-upload">
          <label htmlFor="upload-button" className="circle-upload">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Pet Preview"
                className="uploaded-image"
              />
            ) : (
              <span className="plus-icon">+</span>
            )}
          </label>
          <input
            id="upload-button"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </div>
        <input
          type="text"
          placeholder="Pet Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Pet Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Pet Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default AddPet;
