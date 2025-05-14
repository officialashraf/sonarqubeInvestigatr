import React, {  useState,useEffect } from "react";
import "./createCase.css";
import axios from "axios";
import Cookies from "js-cookie"; // Make sure you're using this for cookies
import {  toast } from 'react-toastify';
import Select from 'react-select';

export   const customStyles = {
  control: (base,state) => ({
    ...base,
    backgroundColor: 'white', // Black background
    color: 'black', // White text
    // border: '1px solid #fff',
    boxShadow: 'none',
    outline: 'none'
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white', // Black background
    color: 'black', // White text
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? 'black' : 'white', // Darker black for selected option
    color: 'black', // White text
    '&:hover': {
      backgroundColor: 'black', // Lighter black on hover
      color:'white'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'white', // Dark background for selected values
    color: 'black', // White text
  }),
  multiValueLabel: (base) => ({
    ...base,
    backgroundColor:'black',
    color: 'white', // White text
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'black', // White text
    '&:hover': {
      backgroundColor: 'black', // Lighter black on hover
      color: 'white' // White text
    }
  })
};
  const CreateCase = ({ togglePopup }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
     status: '',
     watchers: '',
     assignee: '',
  });

  const [users, setUsers] = useState([]);
  const options = users.data && users.data.map(user => ({
    value: user.id,
    label: user.username
  }));


const userData = async () => {
  const token = Cookies.get("accessToken");
   try { 
    const response = await axios.get('http://5.180.148.40:9000/api/user-man/v1/user'
      , {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
     const user = response.data;
      setUsers(user); // Update the state with usered data
       } catch (error) { 
        console.error('There was an error usering the data!', error); 
      } };
    useEffect(() => {
    userData(); // Call the userData function
    }, []);


const handleCreateCase = async (formData) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }
    try {
      const response = await axios.post('http://5.180.148.40:9001/api/case-man/v1/case', {
        title: formData.title,
        description: formData.description,
        assignee: formData.assignee,
        watchers:formData.watchers,  
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );    window.dispatchEvent(new Event("databaseUpdated"));
      if (response.status === 200) {
        toast.success("Case created successfully");
        togglePopup(); // पॉपअप बंद करें
      } else {
        toast.error("Unexpected response received from the server");
      }
  
    } catch (err) {
      console.error("Error during case creation:", err.response || err);
      toast.error( (err.response?.data?.detail || err.message || "Error encountered during case creation: " ));
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleWatchersChange = (selectedOptions) => {
    const selectedLabels = selectedOptions.map((option) => option.label).join(", ");
    setFormData((formData) => ({
      ...formData,
      watchers: selectedLabels , // Ensure it's an array
    }));
  };
  
  const handleAssigneeChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      assignee: selectedOption ? parseInt(selectedOption.value, 10) : ''
    }));
  };


   
    return (
        <div className="popup-overlay">
      <div className="popup-container">
      <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Create Case</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateCase(formData);
            }}
          >
            <label htmlFor="title">Title:</label>
            <input
             className="com"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter title"
              required
            />
            <label htmlFor="description">Description:</label>
            <textarea
             className="com"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            ></textarea>
           
    <div>
      <label htmlFor="assignee">Assignee:</label>
     
        
      <Select
            options={options}
            styles={customStyles}
            className="com"
            placeholder="Select Assignee"
            value={options && options.find((option) => option.value === formData.assignee) || null}
            onChange={handleAssigneeChange}
          />
    </div>
        <label htmlFor="watcher">Watcher:</label>
        <Select
        options={options}
        isMulti
        styles={customStyles}
        className="com"
        name="watchers"
        placeholder="Select Watchers"
        value={options && options.filter((option) => formData.watchers.split(", ").includes(option.label)
           )}
        onChange={handleWatchersChange}
        />
            <div className="button-container">
              <button type="submit" className="create-btn">
               Create
              </button>
              <button type="button" className="cancel-btn" onClick={togglePopup}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    );
  };
 export default CreateCase;  