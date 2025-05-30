import { useEffect, useState } from "react";
import "./addUser.css"; // You can rename if you want
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import Select from "react-select";
import { customStyles } from "./addUser";

const EditUser = ({ togglePopup, item }) => {
  const token = Cookies.get("accessToken");

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: item.first_name || "",
    lastName: item.last_name || "",
    username: item.username || "",
    email: item.email || "",
    contactNumber: item.contact_no || "",
    role: item.role || "",
  });
  console.log("formDate", formData)

  const getUserData = async () => {
    try {
      const response = await axios.get('http://5.180.148.40:9000/api/user-man/v1/user', {
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
  const handleEditUser = async (formData) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Token not found. Please log in again");
      return;
    }

    try {
      const hasChanged = {};
      // Only include fields that have actually changed
      if (formData.firstName !== item.first_name || formData.firstName === "") { hasChanged.first_name = formData.firstName; }
      if (formData.lastName !== item.last_name || formData.lastName === "") { hasChanged.last_name = formData.lastName; }
      if (formData.username !== item.username || formData.username === "") { hasChanged.username = formData.username; }
      if (formData.email !== item.email) { hasChanged.email = formData.email; }
      if (formData.contactNumber !== item.contact_no) { hasChanged.contact_no = formData.contactNumber; }
      if (formData.role !== item.role) { hasChanged.role = formData.role; }


      // If nothing has changed 
      if (Object.keys(hasChanged).length === 0) {
        toast.info("No changes detected.");
        return;
      }

      console.log("Data to be sent:", hasChanged); // Debugging line
      const response = await axios.put(
        `http://5.180.148.40:9000/api/user-man/v1/user/${item.id}`,
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
  };


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
              required
            />
            <label htmlFor="firstName">First Name <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
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
              <label>Role *</label>
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


            <label htmlFor="email">Email ID <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="contactNumber">Contact Number <span style={{ color: 'black' }}>*</span></label>
            <input
              className="com"
              type="text"
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <div className="button-container">
              <button type="submit" className="create-btn" disabled={loading}>
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
