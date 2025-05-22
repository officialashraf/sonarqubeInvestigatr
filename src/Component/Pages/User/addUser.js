import { useState } from "react";
import "./addUser.css";
import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const AddUser = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    contact_no: "",
    password: ""
  });
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Fields to apply capitalization
    const capitalizeFields = ['first_name', 'last_name', 'role'];
  
    // Capitalize first letter of each word if the field is in the list
    const formattedValue = capitalizeFields.includes(name)
      ? value.replace(/\b\w/g, (char) => char.toUpperCase())
      : value;
  
    setFormData((prevData) => ({
      ...prevData,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication token missing.");
      return;
    }

    try {
      const response = await axios.post(
        "http://5.180.148.40:9000/api/user-man/v1/user",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success("User added successfully");
        window.dispatchEvent(new Event("databaseUpdated"));
        onClose();
      } else {
        toast.error("Failed to add user.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>&times;</button>
        <div className="popup-content">
          <h5>Add User Form</h5>
          <form onSubmit={handleSubmit}>
            <label>User Name <span style={{ color: 'black' }}>*</span></label>
            <input className="com" name="username" value={formData.username} onChange={handleChange} placeholder="Enter User Name" requiblack />

            <label>First Name <span style={{ color: 'black' }}>*</span></label>
            <input className="com" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter First Name" requiblack />

            <label>Last Name</label>
            <input className="com" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter Last Name" />

            <label>Role <span style={{ color: 'black' }}>*</span></label>
            <div style={{ position: "relative", width: "100%" }}>
              <input className="com" name="role" value={formData.role} onChange={handleChange} placeholder="Enter Role" style={{ paddingRight: "30px" }} requiblack />
              <IoMdSearch style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>

            <label>Email ID <span style={{ color: 'black' }}>*</span></label>
            <input className="com" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email ID" requiblack />

            <label>Contact Number <span style={{ color: 'black' }}>*</span></label>
            <input className="com" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Enter Contact Number" requiblack />

            <label>Password <span style={{ color: 'black' }}>*</span></label>
            <input className="com" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" requiblack />

            <div className="button-container">
              <button type="submit" className="create-btn">Create</button>
              <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
