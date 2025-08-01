import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import DatePickera from './datepicker';
import { CalendarToday } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import './createCriteria.module.css';
import { customStyles } from '../Case/createCase';
import axios from 'axios';
import Cookies from 'js-cookie';
import { sharedSxStyles } from './createCriteria';
import { toast } from 'react-toastify';
import Loader from '../Layout/loader'
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import styles from '../../Common/Table/table.module.css';
import CommonMultiSelect from '../../Common/MultiSelect/CommonMultiSelect';
import CommonDateInput from '../../Common/DateField/DateField';
import AppButton from '../../Common/Buttton/button';
import CommonTextInput from '../../Common/MultiSelect/CommonTextInput';


// const API_BASE_URL = 'http://5.180.148.40';

const EditCriteria = ({ togglePopup, criteriaId, onUpdate }) => {
  const Token = Cookies.get('accessToken');

  const [showPopupD, setShowPopupD] = useState(false);
  const [caseOptions, setCaseOptions] = useState([]);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [targetOptions, setTargetOptions] = useState([]);
  const [sentimentOptions, setSentimentOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataFetched, setDataFetched] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    searchQuery: '',
    filetype: [],
    caseIds: [],
    targets: [],
    sentiment: [],
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
        label: `${`CASE${String(caseItem.id).padStart(4, "0")}`}`
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

  // Fetch target and sentiment options from API
  const fetchTargetAndSentimentOptions = useCallback(async () => {
    try {
      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
        { fields: ["targets", "sentiment"] },
        {
          headers: {
            'Authorization': `Bearer ${Token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("criteriaData.targets:", response.targets);
      console.log("criteriaData.sentiment:", response.sentiment);


      const buckets = response.data?.targets?.buckets || [];
      const sentimentBuckets = response.data?.sentiment?.buckets || [];

      const formattedTargets = buckets.map(bucket => ({
        value: bucket.key,
        label: bucket.key
      }));

      const formattedSentiments = sentimentBuckets.map(bucket => ({
        value: bucket.key,
        label: bucket.key
      }));

      setTargetOptions(formattedTargets);
      setSentimentOptions(formattedSentiments);
      return { targets: formattedTargets, sentiments: formattedSentiments };
    } catch (error) {
      console.error("Failed to fetch target and sentiment options:", error);
      toast.error('Failed to fetch target and sentiment options');
      return { targets: [], sentiments: [] };
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
  const fetchCriteriaDetails = useCallback(async (caseOpts, fileTypeOpts, targetOpts, sentimentOpts) => {
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

      // Format targets as an array of objects for React-Select
      const selectedTargets = [];
      if (criteriaData.targets) {
        const targetsArray = Array.isArray(criteriaData.targets) ? criteriaData.targets : [criteriaData.targets];

        targetsArray.forEach(target => {
          const matchingOption = targetOpts.find(option => option.value.toString().toLowerCase() === target.toString().toLowerCase());
          if (matchingOption) {
            selectedTargets.push(matchingOption);
          } else {
            selectedTargets.push({ value: target, label: target });
          }
        });
      }

      // Format sentiment as an array of objects for React-Select
      const selectedSentiments = [];
      if (criteriaData.sentiments) {
        const sentimentArray = Array.isArray(criteriaData.sentiments) ? criteriaData.sentiments : [criteriaData.sentiments];

        sentimentArray.forEach(sentiment => {
          const matchingOption = sentimentOpts.find(option => option.value.toString().toLowerCase() === sentiment.toString().toLowerCase());
          if (matchingOption) {
            selectedSentiments.push(matchingOption);
          } else {
            selectedSentiments.push({ value: sentiment, label: sentiment });
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
        targets: selectedTargets,
        sentiment: selectedSentiments,
        latitude: criteriaData.latitude || '',
        longitude: criteriaData.longitude || ''
      });

      setInitialFormData({
        searchQuery: processedKeywords,
        caseIds: selectedCaseIds,
        filetype: selectedFileTypes,
        targets: selectedTargets,
        sentiment: selectedSentiments,
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
          const [caseOpts, fileTypeOpts, targetSentimentOpts] = await Promise.all([
            fetchCaseData(),
            fetchFileTypes(),
            fetchTargetAndSentimentOptions()
          ]);
          const targetOpts = targetSentimentOpts.targets || [];
          const sentimentOpts = targetSentimentOpts.sentiments || [];
          await fetchCriteriaDetails(caseOpts, fileTypeOpts, targetOpts, sentimentOpts);
          setDataFetched(true);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to load necessary data");
          setIsLoading(false);
        }
      };

      fetchAllData();
    }
  }, [dataFetched, Token, criteriaId, fetchCaseData, fetchFileTypes, fetchCriteriaDetails, fetchTargetAndSentimentOptions]);

  // Handle form update submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    //   Validation
    if (!formData.searchQuery.trim()) {
      toast.info('Search query is required');
      return;
    }
    // const validationErrors = validateForm();
    // if (Object.keys(validationErrors).length > 0) {
    //   setError(validationErrors);
    //   return;
    // }
    setIsSubmitting(true);
    try {
      const keywordsArray = formatKeywordsForAPI(formData.searchQuery);

      const updatePayload = {
        keyword: keywordsArray, // Now properly formatted as array
        case_id: formData.caseIds.map(caseId => caseId.value.toString()),
        file_type: formData.filetype.map(file => file.value.toString()),
        targets: formData.targets.map(target => target.value.toString()),
        sentiments: formData.sentiment.map(s => s.value.toString()),
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
      toast.error((error.response?.data?.detail || error.message) || 'Failed to update criteria');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {

    const isSame =
      formData.searchQuery.trim() === initialFormData.searchQuery &&
      JSON.stringify(formData.caseIds.map(caseId => caseId.value.toString())) ===
      JSON.stringify(initialFormData.caseIds.map(caseId => caseId.value.toString())) &&
      JSON.stringify(formData.filetype.map(file => file.value.toString())) ===
      JSON.stringify(initialFormData.filetype.map(file => file.value.toString())) &&
      JSON.stringify(formData.targets.map(target => target.value.toString())) ===
      JSON.stringify(initialFormData.targets.map(target => target.value.toString())) &&
      JSON.stringify(formData.sentiment.map(s => s.value.toString())) ===
      JSON.stringify(initialFormData.sentiment.map(s => s.value.toString()));

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
                className={styles.searchBar}
                name="searchQuery"
                InputProps={{
                  style: {
                    height: '38px',
                    padding: '0 8px',
                    color: 'white',
                    border: '1px solid #0073CF',
                    borderRadius: '15px',
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

            {/* <label>Filetype</label> */}
            <CommonMultiSelect
              label="Source Type"
              isMulti
              options={fileTypeOptions}
              customStyles={customSelectStyles}
              value={formData.filetype}
              onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected || [] }))}
              placeholder="Select file types"
              isLoading={fileTypeOptions.length === 0}
            />

            <CommonMultiSelect
              label="Case"
              isMulti
              options={caseOptions}
              customStyles={customSelectStyles}
              value={formData.caseIds}
              onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected || [] }))}
              placeholder="Select cases"
              isLoading={caseOptions.length === 0}
            />

            <CommonMultiSelect
              label="Target"
              isMulti
              options={targetOptions}
              customStyles={customSelectStyles}
              value={formData.targets}
              onChange={(selected) => setFormData(prev => ({ ...prev, targets: selected || [] }))}
              placeholder="Select targets"
              isLoading={targetOptions.length === 0}
            />

            <CommonMultiSelect
              label="Sentiment"
              isMulti
              options={sentimentOptions}
              customStyles={customSelectStyles}
              value={formData.sentiment}
              onChange={(selected) => setFormData(prev => ({ ...prev, sentiment: selected || [] }))}
              placeholder="Select sentiment"
              isLoading={sentimentOptions.length === 0}
            />


            {/* DatePicker */}

            <CommonDateInput
              fullWidth
              placeholder="Select date..."
              value={
                selectedDates.startDate && selectedDates.endDate
                  ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                  : formatDate(selectedDates.startDate || selectedDates.endDate)
              }
              readOnly
              sx={sharedSxStyles}
            />


         
            {/* Update Button */}
            <div className="button-container d-flex gap-2" style={{ textAlign: 'center' }}>
              <AppButton
                type="submit"

                disabled={isBtnDisabled || isSubmitting}
              >
                {isSubmitting ? 'Editing...' : 'Edit'}
              </AppButton>
              <AppButton
                type="button"

                onClick={togglePopup}
              >
                Cancel
              </AppButton>
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

