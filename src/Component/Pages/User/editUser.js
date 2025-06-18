import { useEffect, useState } from "react";
import "./addUser.css"; // You can rename if you want
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Select from "react-select";
import { customStyles } from "../Case/createCase"; // Adjust the import path as needed

const EditUser = ({ togglePopup, item }) => {
  const token = Cookies.get("accessToken");

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [error, setError] = useState({});

  const [formData, setFormData] = useState({
    firstName: item.first_name || "",
    lastName: item.last_name || "",
    username: item.username || "",
    email: item.email || "",
    contactNumber: item.contact_no || "",
    role: item.role || "",
  });
  console.log("formDate", formData)

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    return errors;
  };


  const getUserData = async () => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again later');
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

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
  const handleEditUser = async (formData) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Token not found. Please log in again");
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
    try {
      const hasChanged = {};
      if (payloadData.firstName && payloadData.firstName !== item.first_name) {
        hasChanged.first_name = payloadData.firstName;
      }
      if (payloadData.lastName && payloadData.lastName !== item.last_name) {
        hasChanged.last_name = payloadData.lastName;
      }
      if (payloadData.username && payloadData.username !== item.username) {
        hasChanged.username = payloadData.username;
      }
      if (payloadData.email && payloadData.email !== item.email) {
        hasChanged.email = payloadData.email;
      }
      if (payloadData.contactNumber && payloadData.contactNumber !== item.contact_no) {
        hasChanged.contact_no = payloadData.contactNumber;
      }

      if (payloadData.role && payloadData.role !== item.role) { hasChanged.role = payloadData.role; }

      // If nothing has changed 
      if (Object.keys(hasChanged).length === 0) {
        toast.info("No changes detected.");
        return;
      }

      console.log("Data to be sent:", hasChanged); // Debugging line
      const response = await axios.put(
        `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user/${item.id}`,
        hasChanged,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        },
      ); console.log("respose", response.data)
      if (response.status === 200) {
        toast.success("User updated successfully.");
        // onUserUpdated?.(response.data); // Notify parent to refresh data
        window.dispatchEvent(new Event("databaseUpdated"));
        togglePopup();// onClose(); // Close modal
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.detail || "Something went wrong while updating. Please try again");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Fields to apply capitalization
    const capitalizeFields = ['firstName', 'lastName', 'role'];

    // Capitalize first letter of each word if the field is in the list
    const formattedValue = capitalizeFields.includes(name)
      ? value.replace(/\b\w/g, (char) => char.toUpperCase())
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""  // Remove the specific error message
    }));
  };

  useEffect(() => {
    setInitialFormData({
      firstName: item.first_name || "",
      lastName: item.last_name || "",
      username: item.username || "",
      email: item.email || "",
      contactNumber: item.contact_no || "",
      role: item.role || "",
    });
  }, [item]);

  useEffect(() => {
    const isSame =
      formData.firstName === initialFormData.firstName &&
      formData.lastName === initialFormData.lastName &&
      formData.username === initialFormData.username &&
      formData.email === initialFormData.email &&
      formData.contactNumber === initialFormData.contactNumber &&
      formData.role === initialFormData.role;

    setIsBtnDisabled(isSame);
  }, [formData, initialFormData]);



  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Edit User</h5>
          <form onSubmit={(e) => { e.preventDefault(); handleEditUser(formData); }}>
            <label htmlFor="username">Username <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {error.username && <p style={{ color: "red", margin: '0px' }} >{error.username}</p>}
            <label htmlFor="firstName">First Name </label>
            <input
              className="com"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <label htmlFor="lastName">Last Name</label>
            <input
              className="com"
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <div>
              <label>Role </label>
              <Select
                options={roles}
                placeholder="Select a role"
                isLoading={loading}
                value={roles.find(role => role.value === formData.role)}
                onChange={(selectedOption) => setFormData({ ...formData, role: selectedOption.value })}
                styles={customStyles}
                classNamePrefix="select"
              />
            </div>
            <label htmlFor="email">Email ID *</label>
            <input
              className="com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {error.email && <p style={{ color: "red", margin: '0px' }}>{error.email}</p>}


            <label htmlFor="contactNumber">Contact Number</label>
            <input
              className="com"
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />

            <div className="button-container">
              <button type="submit" className="create-btn" disabled={isBtnDisabled || loading}>
                {loading ? "Updating..." : "Update"}
              </button>
              <button type="button" onClick={togglePopup} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
