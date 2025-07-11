 
import React, { useState, useEffect } from "react";
import "./createCaseGlobal.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";
import CommonTextInput from "../../Common/MultiSelect/CommonTextInput";
import CommonTextArea from "../../Common/MultiSelect/CommonText";
import CommonMultiSelect from "../../Common/MultiSelect/CommonMultiSelect";
import CommonSingleSelect from "../../Common/MultiSelect/CommonSingleSelect";
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import AppButton from "../../Common/Buttton/button";

export const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: '38px',
    maxHeight: '38px',
    overflowY: 'auto',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'none',
    outline: 'none',
  }),
  valueContainer: (provided) => ({
    ...provided,
    maxHeight: '500px',
    flexWrap: 'wrap',
    backgroundColor: 'white',
    color: 'black',
  }),
};

const CreateCase = ({ togglePopup }) => {
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: '',
    watchers: [],
    assignee: '',
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getUserData = async () => {
    const token = Cookies.get("accessToken");
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const options = users.data && users.data.map(user => ({
    value: user.id,
    label: user.username
  }));

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    return errors;
  };

  const handleCreateCase = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication error: No token found");
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
    try {
      const caseQuery = {
        title: payloadData.title,
        description: payloadData.description,
        assignee: payloadData.assignee,
      };

      if (Array.isArray(payloadData.watchers) && payloadData.watchers.length > 0) {
        caseQuery.watchers = payloadData.watchers;
      }

      const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`,
        caseQuery, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      window.dispatchEvent(new Event("databaseUpdated"));

      if (response.status === 200) {
        toast.success("Case created successfully");
        togglePopup();
      } else {
        toast.error("Unexpected response from server");
      }

    } catch (err) {
      console.error("Error during case creation:", err.response || err);
      toast.error((err.response?.data?.detail || err.message || "Error encountered during case creation."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value || "";

    if (name === 'title') {
      formattedValue = formattedValue.replace(/\b\w/g, (char) => char.toUpperCase());
    } else if (name === 'description') {
      formattedValue = formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));
  };

  const handleWatchersChange = (selectedOptions) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      watchers: selectedIds,
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
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateCase();
          }}>
            {/* <label htmlFor="title">Title *</label> */}
            <CommonTextInput
              label="Title *"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter title"
              readOnly={isReadOnly}
              onFocus={handleFocus}
              ref={inputRef}
            />
            {error.title && <p style={{ color: "red", margin: '0px' }}>{error.title}</p>}

            {/* <label htmlFor="description">Description *</label> */}
            <CommonTextArea
              // className="com"
              label="Description *"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
            {error.description && <p style={{ color: "red", margin: '0px' }}>{error.description}</p>}

            <div>
              {/* <label htmlFor="assignee">Assignee</label> */}
              <CommonSingleSelect
              label='Assignee'
                options={options}
                customStyles={customSelectStyles}
                className="com"
                placeholder="Select assignee"
                value={options && options.find(option => option.value === formData.assignee) || null}
                onChange={handleAssigneeChange}
              />
            </div>

            <div className="watcher-container">
              {/* <label htmlFor="watchers">Watchers</label> */}
              <CommonMultiSelect
              label='Watchers'
                options={options}
                isMulti
                
                customStyles={customSelectStyles}
                name="watchers"
                placeholder="Select watchers"
                value={options && options.filter(option => formData.watchers.includes(option.value))}
                onChange={handleWatchersChange}
              />
            </div>

            <div className="button-container">
              <AppButton type="submit" className="create-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </AppButton>
              <AppButton type="button" className="cancel-btn" onClick={togglePopup}>
                Cancel
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCase;
