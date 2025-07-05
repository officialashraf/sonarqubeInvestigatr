import { useEffect, useState } from "react";
import "./addUser.css";
// import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from "react-select";
import { customStyles } from "../Case/createCase";
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";




const AddUser = ({ onClose }) => {
  const token = Cookies.get("accessToken");
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    contact_no: "",
    password: ""
  });

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

     if (!formData.first_name.trim()) {
      errors.first_name = "Firstname is required";
    }
      if (!formData.role.trim()) {
      errors.role = "Role is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      errors.password = "Password must be at least 6 characters, include 1 capital letter and 1 special character.";
    }

    return errors;
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/roles`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        console.log("response_Data", response.data)
        // Map roles into dropdown format
        const formattedRoles = response.data.map(role => ({
          value: role,
          label: role
        }));
        console.log("response_Dropdown", formattedRoles)
        setRoles(formattedRoles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setLoading(false);
      }
    };

    fetchRoles();
  }, [token]);


  const handleChange = (e) => {
    let { name, value } = e.target;

    // Fields to apply capitalization
    const capitalizeFields = ['first_name', 'last_name', 'role'];

    if (name === 'username') {
      // Prevent capital letters and spaces in username
      value = value.toLowerCase().replace(/\s/g, '');
    } else if (capitalizeFields.includes(name)) {
      // Capitalize first letter of each word if the field is in the list
      value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""  // Remove the specific error message
    }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Authentication token missing.");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    const payloadData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );

    setIsSubmitting(true);
    console.log("queryPyload", formData)
    try {
      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`,
        payloadData,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>&times;</button>
        <div className="popup-content">
          <h5>Add User</h5>
          <form onSubmit={handleCreateUser}>

            <label>Username *</label>
            <input className="com" ref={inputRef} name="username" autoComplete="username" value={formData.username} onChange={handleChange} placeholder="Enter username" readOnly={isReadOnly}
              onFocus={handleFocus} requiblack />
            {error.username && <p style={{ color: "red", margin: '0px' }} >{error.username}</p>}
            <label>First Name *</label>
            <input className="com" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter first name" />
             {error.first_name && <p style={{ color: "red", margin: '0px' }} >{error.first_name}</p>}
            <label>Last Name</label>
            <input className="com" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter last name" />
            <div>
              <label>Role *</label>
              <Select
                options={roles}
                placeholder="Select a role"
                isLoading={loading}
                value={roles.find(role => role.value === formData.role)}
                onChange={(selectedOption) => setFormData({ ...formData, role: selectedOption.value })}
                styles={customStyles}
                // classNamePrefix="select"
                className="com"
              />
              {error.role && <p style={{ color: "red", margin: '0px' }} >{error.role}</p>}
            </div>
            <label>Email ID *</label>
            <input className="com" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email id" requiblack />
            {error.email && <p style={{ color: "red", margin: '0px' }}>{error.email}</p>}
            <label>Contact Number</label>
            <input className="com" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Enter contact number" />
            <label>Password *</label>
            <input className="com" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" requiblack />
            {error.password && <p style={{ color: "red", margin: '0px' }}>{error.password}</p>}
            <div className="button-container">
              <button type="submit" className="create-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
