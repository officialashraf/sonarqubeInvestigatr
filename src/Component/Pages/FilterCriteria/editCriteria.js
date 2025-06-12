import { useState, useEffect, useCallback } from 'react';
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
import Loader from '../Layout/loader'

// const API_BASE_URL = 'http://5.180.148.40';

const EditCriteria = ({ togglePopup, criteriaId, onUpdate }) => {
  const Token = Cookies.get('accessToken');

  const [showPopupD, setShowPopupD] = useState(false);
  const [caseOptions, setCaseOptions] = useState([]);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  const [formData, setFormData] = useState({
    searchQuery: '',
    filetype: [],
    caseIds: [],
    latitude: '',
    longitude: ''
  });

  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });

  // Fetch case data from API
  const fetchCaseData = useCallback(async () => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      const caseOptionsFormatted = response.data.data.map(caseItem => ({
        value: caseItem.id,
        label: `${caseItem.id}`
      }));

      setCaseOptions(caseOptionsFormatted);
      return caseOptionsFormatted;
    } catch (error) {
      console.error('Error fetching case data:', error);
      toast.error('Failed to fetch case data');
      return [];
    }
  }, [Token]);

  // Fetch file types from API
  const fetchFileTypes = useCallback(async () => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      const fileTypeOptionsFormatted = response.data.data.map(platform => ({
        value: platform,
        label: platform
      }));

      setFileTypeOptions(fileTypeOptionsFormatted);
      return fileTypeOptionsFormatted;
    } catch (error) {
      console.error('Error fetching file types:', error);
      toast.error('Failed to fetch file types');
      return [];
    }
  }, [Token]);

  // Process keywords - handle both string and array formats
  const processKeywords = (keywords) => {
    if (!keywords) return '';

    if (Array.isArray(keywords)) {
      // If it's already an array, join them with commas
      return keywords.join(', ');
    } else if (typeof keywords === 'string') {
      // If it's a string, return as is
      return keywords;
    }

    return '';
  };

  // Convert keywords string to array format for API
  const formatKeywordsForAPI = (keywordString) => {
    if (!keywordString || typeof keywordString !== 'string') return [];

    // Split by comma and clean up each keyword
    return keywordString
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
  };

  // Fetch criteria details by ID
  const fetchCriteriaDetails = useCallback(async (caseOpts, fileTypeOpts) => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/criteria/${criteriaId}`, {
        headers: {
          'Authorization': `Bearer ${Token}`
        },
      });

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

      // Format case IDs as an array of objects for React-Select
      const selectedCaseIds = [];
      if (criteriaData.case_id) {
        const caseIdsArray = Array.isArray(criteriaData.case_id) ? criteriaData.case_id : [criteriaData.case_id];

        caseIdsArray.forEach(caseId => {
          const matchingOption = caseOpts.find(option => option.value.toString() === caseId.toString());
          if (matchingOption) {
            selectedCaseIds.push(matchingOption);
          } else {
            selectedCaseIds.push({ value: caseId, label: `${caseId}` });
          }
        });
      }

      // Format file types as an array of objects for React-Select
      const selectedFileTypes = [];
      if (criteriaData.file_type) {
        const fileTypesArray = Array.isArray(criteriaData.file_type) ? criteriaData.file_type : [criteriaData.file_type];

        fileTypesArray.forEach(fileType => {
          const matchingOption = fileTypeOpts.find(option => option.value === fileType);
          if (matchingOption) {
            selectedFileTypes.push(matchingOption);
          } else {
            selectedFileTypes.push({ value: fileType, label: fileType });
          }
        });
      }

      // Process keywords properly
      const processedKeywords = processKeywords(criteriaData.keyword);

      // Update form data
      setFormData({
        searchQuery: processedKeywords,
        caseIds: selectedCaseIds,
        filetype: selectedFileTypes,
        latitude: criteriaData.latitude || '',
        longitude: criteriaData.longitude || ''
      });

      setInitialFormData({
        searchQuery: processedKeywords,
        caseIds: selectedCaseIds,
        filetype: selectedFileTypes,
        latitude: criteriaData.latitude || '',
        longitude: criteriaData.longitude || ''
      });

      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching criteria details:', error);
      setError('Failed to load criteria details.');
      setIsLoading(false);
      toast.error('Failed to load criteria details');
    }
  }, [Token, criteriaId]);

  // Initial data fetch - Fixed dependency issue
  useEffect(() => {
    if (!dataFetched && Token && criteriaId) {
      const fetchAllData = async () => {
        setIsLoading(true);
        try {
          const [caseOpts, fileTypeOpts] = await Promise.all([
            fetchCaseData(),
            fetchFileTypes()
          ]);
          await fetchCriteriaDetails(caseOpts, fileTypeOpts);
          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load necessary data");
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [dataFetched, Token, criteriaId, fetchCaseData, fetchFileTypes, fetchCriteriaDetails]);

  // Handle form update submission
  const handleUpdate = async (e) => {
    e.preventDefault();

 //   Validation
    if (!formData.searchQuery.trim()) {
      toast.error('Search query is required');
      return;
    }
    // const validationErrors = validateForm();
    // if (Object.keys(validationErrors).length > 0) {
    //   setError(validationErrors);
    //   return;
    // }

    try {
      const keywordsArray = formatKeywordsForAPI(formData.searchQuery);

      const updatePayload = {
        keyword: keywordsArray, // Now properly formatted as array
        case_id: formData.caseIds.map(caseId => caseId.value.toString()),
        file_type: formData.filetype.map(file => file.value.toString()),
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        start_time: selectedDates.startDate ?
          `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`
          : null,
        end_time: selectedDates.endDate ?
          `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
          : null
      };

      console.log("updatePayload", updatePayload);
      console.log("Keywords formatted as:", keywordsArray);

      const updateResponse = await axios.put(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/criteria/${criteriaId}`, updatePayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      console.log("updateResponse", updateResponse);
      toast.success('Criteria updated successfully');
      togglePopup();
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating criteria:', error);
      toast.error( (error.response?.data?.detail || error.message) || 'Failed to update criteria' );
    }
  };

  useEffect(() => {

    const isSame =
      formData.searchQuery.trim() === initialFormData.searchQuery &&
      JSON.stringify(formData.caseIds.map(caseId => caseId.value.toString())) ===
      JSON.stringify(initialFormData.caseIds.map(caseId => caseId.value.toString())) &&
      JSON.stringify(formData.filetype.map(file => file.value.toString())) ===
      JSON.stringify(initialFormData.filetype.map(file => file.value.toString()));

    setIsBtnDisabled(isSame);
  }, [formData, initialFormData]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // setError((prevErrors) => ({
    //   ...prevErrors,
    //   [name]: ""  // Remove the specific error message
    // }));
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
          <Loader />
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
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
            <button className="btn btn-secondary" onClick={togglePopup}>
              Close
            </button>
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
            <div >
              <label>Search Keywords </label>
              <TextField
                fullWidth
                className="com"
                name="searchQuery"
                InputProps={{
                  style: {
                    height: '38px',
                    padding: '0 8px',
                  },
                }}
                placeholder="Enter keywords separated by commas (e.g., keyword1, keyword2, keyword3)"
                value={formData.searchQuery}
                onChange={handleInputChange}
                sx={sharedSxStyles}
                multiline={false}
              />
              {/* {error.searchQuery && <p style={{ color: "red", margin: '0px' }} >{error.searchQuery}</p>} */}
                          </div>

            {/* Filetype Dropdown (Multi Select) */}
            <div >
              <label>Filetype</label>
              <Select
                isMulti
                options={fileTypeOptions}
                styles={customStyles}
                className="com"
                value={formData.filetype}
                onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected || [] }))}
                placeholder="Select file types"
                isLoading={fileTypeOptions.length === 0}
              />
            </div>

            {/* Case Selection Field */}
            <div >
              <label>Case</label>
              <Select
                isMulti
                options={caseOptions}
                styles={customStyles}
                className="com"
                value={formData.caseIds}
                onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected || [] }))}
                placeholder="Select cases"
                isLoading={caseOptions.length === 0}
              />
            </div>

            {/* DatePicker */}
            <div >
              <label>DatePicker</label>
              <TextField
                fullWidth
                className="com"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday style={{ cursor: 'pointer' }} onClick={togglePopupA} />
                    </InputAdornment>
                  ),
                  style: {
                    height: '38px',
                    padding: '0 8px',
                    fontSize: '12px',
                  },
                }}
                placeholder="Select date..."
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
            <div >
              <label>Focus your search to a particular location or area</label>
              <div className="d-flex gap-2">
                <TextField
                  name="latitude"
                  placeholder="Latitude"
                  className="com"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  InputProps={{
                    style: {
                      height: '38px',
                      padding: '0 8px',
                    },
                  }}
                  sx={sharedSxStyles}
                  type="number"
                  step="any"
                />
                <TextField
                  name="longitude"
                  placeholder="Longitude"
                  className="com"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  InputProps={{
                    style: {
                      height: '38px',
                      padding: '0 8px',
                    },
                  }}
                  sx={sharedSxStyles}
                  type="number"
                  step="any"
                />
              </div>
            </div>

            {/* <h5 >SELECT ON MAP</h5> */}

            {/* Update Button */}
            <div className="button-container d-flex gap-2" style={{ textAlign: 'center' }}>
              <button
                type="submit"
                className="create-btn"
                disabled={isBtnDisabled}
              >
                Update
              </button>
              <button
                type="button"
                className="create-btn"
                onClick={togglePopup}
              >
                Cancel
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

