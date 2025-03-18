import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePickera from './datepicker';
import { CalendarToday } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import '../FilterCriteria/createCriteria.css';
import { customStyles } from '../Case/createCase';
import axios from 'axios';
import Cookies from 'js-cookie';
import { sharedSxStyles } from './createCriteria';
import { toast } from 'react-toastify';

const EditCriteria = ({ togglePopup, criteriaId }) => {
  const [formData, setFormData] = useState({
    searchQuery: '',
    datatype: [],
    filetype: [],
    caseIds: [],
    latitude: '',
    longitude: ''
  });
  const [showPopupD, setShowPopupD] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });
  const [caseOptions, setCaseOptions] = useState([]);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("criteriaId", criteriaId)
  // Fetch necessary data when component mounts
  useEffect(() => {
    fetchCaseData();
    fetchFileTypes();
    fetchCriteriaDetails();
  }, [criteriaId]);

  // Fetch criteria details by ID
  const fetchCriteriaDetails = async () => {
    try {
      setIsLoading(true);
      const Token = Cookies.get('accessToken');
      const response = await axios.get(`http://5.180.148.40:9006/api/das/criteria/${criteriaId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`
        },
      });
      console.log("criteriaDetails", response)
      const criteriaData = response.data.data;
      
      // Parse dates from the API response
      let startDate = null;
      let endDate = null;
      let startTime = { hours: 16, minutes: 30 };
      let endTime = { hours: 16, minutes: 30 };
      
      if (criteriaData.start_time) {
        const startDateTime = new Date(criteriaData.start_time);
        startDate = startDateTime;
        startTime = {
          hours: startDateTime.getHours(),
          minutes: startDateTime.getMinutes()
        };
      }
      
      if (criteriaData.end_time) {
        const endDateTime = new Date(criteriaData.end_time);
        endDate = endDateTime;
        endTime = {
          hours: endDateTime.getHours(),
          minutes: endDateTime.getMinutes()
        };
      }
      
      setSelectedDates({
        startDate,
        endDate,
        startTime,
        endTime
      });
      
      // Find the matching case option
      const caseOption = criteriaData.case_id ? 
        { value: criteriaData.case_id, label: `${criteriaData.case_id}` } : null;
      
      // Find the matching filetype option
      const fileTypeOption = criteriaData.file_type ? 
        { value: criteriaData.file_type, label: criteriaData.file_type } : null;
      
      // Update form data
      setFormData({
        searchQuery: criteriaData.keyword || '',
        caseIds: caseOption ? [caseOption] : [],
        filetype: fileTypeOption ? [fileTypeOption] : [],
        datatype: fileTypeOption ? [fileTypeOption] : [], // Assuming datatype is the same as filetype
        latitude: criteriaData.latitude || '',
        longitude: criteriaData.longitude || ''
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching criteria details:', error);
      setError('Failed to load criteria details.');
      setIsLoading(false);
    }
  };

  // Fetch case data from API
  const fetchCaseData = async () => {
    try {
      const Token = Cookies.get('accessToken');
      const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      
      // Format the response data for react-select
      const caseOptionsFormatted = response.data.data.map(caseItem => ({
        value: caseItem.id,
        label: `${caseItem.id} - ${caseItem.name || 'Untitled'}`
      }));
      
      setCaseOptions(caseOptionsFormatted);
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };

  // Fetch file types from API
  const fetchFileTypes = async () => {
    try {
      const Token = Cookies.get('accessToken');
      const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
      });
    
      // Format the response data for react-select
      const fileTypeOptionsFormatted = response.data.data.map(platform => ({
        value: platform,
        label: platform
      }));
      
      setFileTypeOptions(fileTypeOptionsFormatted);
    } catch (error) {
      console.error('Error fetching file types:', error);
    }
  };

  // Handle form update submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const Token = Cookies.get('accessToken');
      const updatePayload = {
        keyword: formData.searchQuery,
        case_id: formData.caseIds && formData.caseIds.length > 0 ? formData.caseIds[0].value.toString() : "",
        file_type: formData.filetype && formData.filetype.length > 0 ? formData.filetype[0].value : "",
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        start_time: selectedDates.startDate ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00` : "",
        end_time: selectedDates.endDate ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00` : ""
      };
      
      const response = await axios.put(`http://5.180.148.40:9006/api/das/criteria/${criteriaId}`, updatePayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      toast('Criteria updated successfully')
      console.log('Criteria updated successfully:', response.data);
      
      // Close the popup after successful update
      togglePopup();
    } catch (error) {
      console.error('Error updating criteria:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Toggle date picker popup visibility
  const togglePopupA = () => {
    setShowPopupD(!showPopupD);
  };

  // Handle data from DatePicker
  const handleDateSelection = (dateData) => {
    setSelectedDates(dateData);
    togglePopupA(); // Close popup after selection
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <div className="popup-content text-center">
            <p>Loading Criteria Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popup-overlay">
        <div className="popup-container">
          <button className="close-icon" onClick={togglePopup}>
            &times;
          </button>
          <div className="popup-content text-center">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Edit Criteria</h5>
          <form onSubmit={handleUpdate}>
            {/* Search Bar */}
            <label>Search</label>
            <TextField
              fullWidth
              className="com mb-3"
              name="searchQuery"
              InputProps={{
                style: {
                  height: '38px',
                  padding: '0 8px',
                },
              }}
              placeholder="Search..."
              value={formData.searchQuery}
              onChange={handleInputChange}
              sx={sharedSxStyles}
            />

            {/* Datatype Dropdown (Multi Select) */}
            <div className="mb-3">
              <label>Datatype</label>
              <Select
                isMulti
                options={fileTypeOptions}
                styles={customStyles}
                className="com"
                value={formData.datatype}
                onChange={(selected) => setFormData(prev => ({ ...prev, datatype: selected }))}
                placeholder="Select Datatype"
              />
            </div>

            {/* Filetype Dropdown (Multi Select) */}
            <div className="mb-3">
              <label>Filetype</label>
              <Select
                isMulti
                options={fileTypeOptions}
                styles={customStyles}
                className="com"
                value={formData.filetype}
                onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
                placeholder="Select Filetypes"
              />
            </div>

            {/* Case Selection Field */}
            <div className="mb-3">
              <label>Case</label>
              <Select
                isMulti
                options={caseOptions}
                styles={customStyles}
                className="com"
                value={formData.caseIds}
                onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
                placeholder="Select Cases"
              />
            </div>

            {/* DatePicker */}
            <div className="mb-3">
              <label>DatePicker</label>
              <TextField
                fullWidth
                className="com mb-3"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday style={{ cursor: 'pointer' }} onClick={togglePopupA} />
                    </InputAdornment>
                  ),
                  style: {
                    height: '38px',
                    padding: '0 8px',
                  },
                }}
                placeholder="Select Date..."
                value={
                  selectedDates.startDate && selectedDates.endDate
                    ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                    : formatDate(selectedDates.startDate || selectedDates.endDate)
                }
                readOnly
                sx={sharedSxStyles}
              />
            </div>

            {/* Location Fields */}
            <label>Focus your search to a particular location or area</label>
            <div className="mb-3 d-flex">
              <TextField
                name="latitude"
                placeholder="Latitude"
                className="com mb-3 me-2"
                value={formData.latitude}
                onChange={handleInputChange}
                InputProps={{
                  style: {
                    height: '38px',
                    padding: '0 8px',
                  },
                }}
                sx={sharedSxStyles}
              />
              <TextField
                name="longitude"
                placeholder="Longitude"
                className="com mb-3"
                value={formData.longitude}
                onChange={handleInputChange}
                InputProps={{
                  style: {
                    height: '38px',
                    padding: '0 8px',
                  },
                }}
                sx={sharedSxStyles}
              />
            </div>
            <h5 className="mb-3">SELECT ON MAP</h5>

            {/* Update Button */}
            <div className="button-container" style={{ textAlign: 'center' }}>
              <button
                type="submit"
                style={{ width: '100%', height: '30px' }}
                className="add-btn"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Date Picker Popup */}
      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={togglePopupA}
        />
      )}
    </div>
  );
};

export default EditCriteria;