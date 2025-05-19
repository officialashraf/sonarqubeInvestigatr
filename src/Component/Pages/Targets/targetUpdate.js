
import React, { useState, useEffect } from "react";
import "../Case/createCase.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from 'react-select';
import "./target.css";

export const customStyles = {
  control: (base, state) => ({
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

const TargetUpdate = ({ togglePopup, details }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    synonyms: [],
    type: "",
    threat_weightage: 0
  });

  const [synonymInput, setSynonymInput] = useState("");

  // Threat score options from 0 to 10
  const threatScoreOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i.toString()
  }));

  // Pre-fill the form with existing details when component mounts or details change
  useEffect(() => {
    if (details) {
      setFormData({
        name: details.name || "",
        description: details.description || "",
        synonyms: details.synonyms || [],
        type: details.type || "",
        threat_weightage: details.threat_weightage || 0,
        id: details.id // Make sure to capture the ID for the update API call
      });
    }
  }, [details]);

  const handleUpdateKeyword = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }
    try {
      const response = await axios.put(`http://5.180.148.40:9001/api/case-man/v1/target/${formData.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      window.dispatchEvent(new Event("databaseUpdated"));


      if (response.status === 200) {
        toast.success("Keyword updated successfully");
        togglePopup();
      } else {
        toast.error("Unexpected response received from the server");
      }
    } catch (err) {
      console.error("Error during keyword update:", err.response || err);
      toast.error((err.response?.data?.detail || err.message || "Error encountered during keyword update"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleThreatScoreChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      threat_weightage: selectedOption ? selectedOption.value : 0
    }));
  };

  const handleSynonymInputChange = (e) => {
    setSynonymInput(e.target.value);
  };

  const handleSynonymKeyDown = (e) => {
    if (e.key === 'Enter' && synonymInput.trim() !== '') {
      e.preventDefault();
      if (formData.synonyms.length < 5) {
        setFormData((prevData) => ({
          ...prevData,
          synonyms: [...prevData.synonyms, synonymInput.trim()]
        }));
        setSynonymInput('');
      } else {
        toast.warning("Maximum 5 synonyms allowed");
      }
    }
  };

  const removeSynonym = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      synonyms: prevData.synonyms.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Edit Keyword</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateKeyword();
            }}
          >
            <label htmlFor="name">Keyword:</label>
            <input
              className="com"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter keyword"
              required
            />

            <div>
              <label htmlFor="type">Type:</label>
              <input
                className="com"
                type="text"
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                placeholder="Enter type"
                required
              />
            </div>

            <label htmlFor="description">Description:</label>
            <textarea
              className="com"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            ></textarea>

            <label htmlFor="synonyms">Alternative Keywords/Synonym (up to 5 keywords):</label>
            <div className="synonym-input-container">
              <input
                className="com"
                type="text"
                id="synonyms"
                value={synonymInput}
                onChange={handleSynonymInputChange}
                onKeyDown={handleSynonymKeyDown}
                placeholder="Type in Keywords/Synonym and press Enter to add..."
                disabled={formData.synonyms.length >= 5}
              />
              <div className="synonym-chips">
                {formData.synonyms.map((synonym, index) => (
                  <div key={index} className="synonym-chip">
                    {synonym}
                    <button
                      type="button"
                      className="synonym-remove"
                      onClick={() => removeSynonym(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="threat_weightage">Threat Score:</label>
              <Select
                options={threatScoreOptions}
                styles={customStyles}
                className="com"
                placeholder="Select Threat Score"
                value={threatScoreOptions.find((option) => option.value === formData.threat_weightage) || null}
                onChange={handleThreatScoreChange}
              />
            </div>

            <div className="button-container">
              <button type="submit" className="create-btn">
                Update
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

export default TargetUpdate;