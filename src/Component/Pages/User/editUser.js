import React, { useState } from "react";
import "./createUser.css"; // You can rename if you want

const EditUser = ({ onClose, userData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    username: userData.username || "",
    email: userData.email || "",
    contactNumber: userData.contactNumber || "",
    role: userData.role || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData); // Call parent handler if passed
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Edit User</h5>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name:</label>
            <input
              className="com"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <label htmlFor="lastName">Last Name:</label>
            <input
              className="com"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <label htmlFor="username">Username:</label>
            <input
              className="com"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />

            <label htmlFor="email">Email ID:</label>
            <input
              className="com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <label htmlFor="contactNumber">Contact Number:</label>
            <input
              className="com"
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />

            <label htmlFor="role">Role:</label>
            <input
              className="com"
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            />

            <div className="button-container">
              <button type="submit" className="create-btn">Update</button>
              <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
