import { useEffect, useState } from "react";
import "./addUser.css";
import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from "react-select";



export const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'none',
    outline: 'none'
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? 'black' : 'white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: 'black',
      color: 'white'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
  }),
  multiValueLabel: (base) => ({
    ...base,
    backgroundColor: 'black',
    color: 'white',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'black',
    '&:hover': {
      backgroundColor: 'black',
      color: 'white'
    }
  })
};

const AddUser = ({ onClose }) => {
  const token = Cookies.get("accessToken");
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    role: "",
    email: "",
    contact_no: "",
    password: ""
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required";
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
        const response = await axios.get("http://5.180.148.40:9000/api/user-man/v1/roles", {
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
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""  // Remove the specific error message
    }));
  };

  const handleSubmit = async (e) => {
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

    console.log("queryPyload", formData)
    try {
      const response = await axios.post(
        "http://5.180.148.40:9000/api/user-man/v1/user",
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
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>&times;</button>
        <div className="popup-content">
          <h5>Add User</h5>
          <form onSubmit={handleSubmit}>
            <label>User Name *</label>
            <input className="com" name="username" value={formData.username} onChange={handleChange} placeholder="Enter User Name" requiblack />
            {error.username && <p style={{ color: "red" , margin: '0px' }} >{error.username}</p>}


            <label>First Name</label>
            <input className="com" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="Enter First Name" />

            <label>Last Name</label>
            <input className="com" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Enter Last Name" />

            <div>
              <label>Role</label>
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
            </div>
            <label>Email ID *</label>
            <input className="com" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email ID" requiblack />
            {error.email && <p style={{ color: "red",  margin: '0px' }}>{error.email}</p>}

            <label>Contact Number</label>
            <input className="com" name="contact_no" value={formData.contact_no} onChange={handleChange} placeholder="Enter Contact Number" />

            <label>Password *</label>
            <input className="com" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" requiblack />
            {error.password && <p style={{ color: "red", margin: '0px' }}>{error.password}</p>}

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
