import { useState, useEffect } from 'react';
import DatePickera from './datepicker';
import { Search, Send, Tune } from '@mui/icons-material';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import style from './createCriteria.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from "react-redux";
import { closePopup, openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import Confirm from './confirmCriteria';
import { toast } from 'react-toastify';
import { useAutoFocusWithManualAutofill } from '../../../utils/autoFocus';
import styles from '../../Common/Table/table.module.css';
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import CommonMultiSelect from '../../Common/MultiSelect/CommonMultiSelect';
import CommonDateInput from '../../Common/DateField/DateField';
import CommonTextInput from '../../Common/MultiSelect/CommonTextInput';

export const sharedSxStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-root': {
    boxShadow: 'none',
  },
};

const CreateCriteria = ({ handleCreateCase }) => {
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    searchQuery: '',
    datatype: [],
    filetype: [],
    caseIds: [],
    targets: [],
    sentiment: [],
    includeArchived: false,
    latitude: '',
    longitude: ''
  });
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showPopupD, setShowPopupD] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });
  const [caseOptions, setCaseOptions] = useState([]);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [error, setError] = useState({});
  const [targetOptions, setTargetOptions] = useState([]);
  const [sentimentOptions, setSentimentOptions] = useState([]);


  // const validateForm = () => {
  //   const errors = {};

  //   if (!formData.searchQuery) {
  //     errors.searchQuery = "At least one keyword is required";
  //   }
  //   return errors;
  // };


  const activePopup = useSelector((state) => state.popup?.activePopup || null);
  console.log("create popup", activePopup)

  // Fetch case IDs on component mount
  // if (activePopup !== "create") return null;
  // Fetch case data from API

  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });

        // Format the response data for react-select
        const caseOptionsFormatted = response.data.data.map(caseItem => ({
          value: caseItem.id,
          label: `${`CASE${String(caseItem.id).padStart(4, "0")}`} - ${caseItem.title || 'Untitled'}`
          // {`CASE${String(caseItem.id).padStart(4, "0")}`}
        }));

        setCaseOptions(caseOptionsFormatted);
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };

    // Fetch file types from API
    const fetchFileTypes = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
          headers: {
            'Authorization': `Bearer ${Token}`
          },
        });
        console.log("response", response.data.data)
        // Format the response data for react-select
        const fileTypeOptionsFormatted = response.data.data.map(platform => ({
          value: platform,  // Use the platform value directly if it's a string
          label: platform   // Use the platform value directly if it's a string
        }));

        setFileTypeOptions(fileTypeOptionsFormatted);
      } catch (error) {
        console.error('Error fetching file types:', error);

      }
    };
    
    const fetchTargetOptions = async () => {
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

        const buckets = response.data?.targets?.buckets || [];
        const sentimentBuckets = response.data?.sentiment?.buckets || [];


        const formatted = buckets.map(bucket => ({
          value: bucket.key,
          label: bucket.key
        }));

        const formattedSentiments = sentimentBuckets.map(bucket => ({
          value: bucket.key,
          label: bucket.key
        }));

        setTargetOptions(formatted);
        setSentimentOptions(formattedSentiments);

      } catch (error) {
        console.error("Failed to fetch target options:", error);
      }
    };

    fetchCaseData();
    fetchFileTypes();
    fetchTargetOptions();
  }, [Token]);
  useEffect(() => {
    const isSearchQueryEmpty = !formData.searchQuery || formData.searchQuery.length === 0;
    const isCaseIdsEmpty = !formData.caseIds || formData.caseIds.length === 0;
    const isFileTypeEmpty = !formData.filetype || formData.filetype.length === 0;
    const isLatitudeEmpty = !formData.latitude;
    const isLongitudeEmpty = !formData.longitude;

    const nothingFilled = isSearchQueryEmpty && isCaseIdsEmpty && isFileTypeEmpty && isLatitudeEmpty && isLongitudeEmpty;

    if (nothingFilled && formData.includeArchived) {
      setFormData(prev => ({ ...prev, includeArchived: false }));
      setShowSavePopup(false); // Close the save popup as well
    }
  }, [formData]);
  // Handle checkbox change for saving criteria
  const handleSaveCriteriaChange = (e) => {
    e.preventDefault();

    const isSearchQueryEmpty = !formData.searchQuery || (Array.isArray(formData.searchQuery) && formData.searchQuery.length === 0) || (typeof formData.searchQuery === 'string' && formData.searchQuery.trim() === '');
    const isCaseIdsEmpty = !formData.caseIds || formData.caseIds.length === 0;
    const isFileTypeEmpty = !formData.filetype || formData.filetype.length === 0;
    const isLatitudeEmpty = !formData.latitude || formData.latitude.trim() === '';
    const isLongitudeEmpty = !formData.longitude || formData.longitude.trim() === '';
    const isDateEmpty = !selectedDates.startDate && !selectedDates.endDate;

    const isAnyFieldFilled = !(isSearchQueryEmpty && isCaseIdsEmpty && isFileTypeEmpty && isLatitudeEmpty && isLongitudeEmpty && isDateEmpty);

    const isChecked = e.target.checked;

    if (isChecked) {
      if (!isAnyFieldFilled) {
        toast.error("Please select at least one search criteria before saving.");
        // Do not check the checkbox or open popup if validation fails
        return;
      }
      setFormData((prev) => ({ ...prev, includeArchived: true }));
      setShowSavePopup(true); // Open the popup
    } else {
      // Close the popup and reset form state when unchecked
      setFormData((prev) => ({ ...prev, includeArchived: false }));
      setShowSavePopup(false);
    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "searchQuery") {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(",").map(keyword => keyword) // Split by commas and trim extra spaces
      }));
    } else {
      // For other inputs, handle normally
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

  };

  const handleSearch = async (e) => {
    e.preventDefault();

    // Validation: check if all relevant fields are empty
    const isSearchQueryEmpty = !formData.searchQuery || (Array.isArray(formData.searchQuery) && formData.searchQuery.length === 0) || (typeof formData.searchQuery === 'string' && formData.searchQuery.trim() === '');
    const isCaseIdsEmpty = !formData.caseIds || formData.caseIds.length === 0;
    const isFileTypeEmpty = !formData.filetype || formData.filetype.length === 0;
    const isLatitudeEmpty = !formData.latitude || formData.latitude.trim() === '';
    const isLongitudeEmpty = !formData.longitude || formData.longitude.trim() === '';
    const isDateEmpty = !selectedDates.startDate && !selectedDates.endDate;

    if (isSearchQueryEmpty && isCaseIdsEmpty && isFileTypeEmpty && isLatitudeEmpty && isLongitudeEmpty && isDateEmpty) {
      toast.error("Please enter at least one search criteria before searching.");
      return;
    }
    try {

      const payload = {
        keyword: formData.searchQuery?.length > 0 ? formData.searchQuery : [],
        case_id: formData.caseIds?.length > 0
          ? (formData.caseIds.map(caseId => caseId.value.toString()))
          : [],

        file_type: formData.filetype?.length > 0 ? formData.filetype.map(type => type.value) : [],
        targets: formData.targets?.length > 0 ? formData.targets.map(target => target.value) : [],
        sentiment: formData.sentiment?.length > 0
          ? formData.sentiment.map(s => s.value)
          : [],
        page: 1, // Start at page 1
        ...(formData.latitude && { latitude: formData.latitude }),
        ...(formData.longitude && { longitude: formData.longitude }),
      };

      if (selectedDates.startDate && selectedDates.startTime) {
        payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
      }

      if (selectedDates.endDate && selectedDates.endTime) {
        payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
      }

      console.log("search payload", payload);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      console.log("dispatchresponse", response);

      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      dispatch(setKeywords({
        keyword: response.data.input.keyword,
        queryPayload: response.data.input  // or other fields if needed
      }));
      console.log("setkeywordDispacth", response.data.input.keyword)
      // Dispatch initial page number
      dispatch(setPage(1));

      setFormData({
        searchQuery: [],
        datatype: [],
        filetype: [],
        caseIds: [],
        targets: [],
        includeArchived: false,
        latitude: '',
        longitude: ''
      });

      // Handle the search results (e.g., pass them to a parent component)
      if (handleCreateCase) {
        handleCreateCase(response.data);
      }

      dispatch(openPopup("saved"));
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to search")
      console.error('Error performing search:', error);
    }
  };

  // Toggle popup visibility
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

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Create Criteria</h5>
          <form onSubmit={handleSearch} >
            {/* Search Bar with Icons */}
            <label style={{ fontSize: '14px' }}>Search Keywords</label>
            <TextField
              fullWidth
              className={styles.searchBar}
              name="searchQuery"
              InputProps={{
                readOnly: isReadOnly,
                onFocus: handleFocus,
                inputRef: inputRef,
                startAdornment: (
                  <InputAdornment position="start" >
                    <Search style={{ color: "#0073CF" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" >
                    <Send onClick={() => dispatch(openPopup("recent"))} style={{ cursor: 'pointer', color: "#0073cf", marginRight: '5px' }} />
                    <Tune onClick={() => dispatch(openPopup("saved"))} style={{ cursor: 'pointer', color: "#0073cf" }} />
                  </InputAdornment>
                ),
                style: {
                  height: '38px',
                  padding: '0 8px',
                  color: 'white',
                  borderRadius: '15px',
                  border: '1px solid #0073CF',

                },
                autoComplete: 'off',
              }}
              placeholder="Search..."
              value={formData.searchQuery}
              onChange={handleInputChange}
              sx={sharedSxStyles}
            />
            {/* <SearchBar
              inputValue={formData.searchQuery}
              onChange={handleInputChange}
              onFocus={handleFocus}
              inputRef={inputRef}
              isReadOnly={isReadOnly}
              sharedSxStyles={sharedSxStyles}
              onSearchClick={() => dispatch(openPopup("recent"))}
              onTuneClick={() => dispatch(openPopup("saved"))}
            /> */}


            {/* Filetype Dropdown (Multi Select) */}
            <CommonMultiSelect
              label="Source Type"
              value={formData.filetype}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, filetype: selected }))
              }
              options={fileTypeOptions}
              customStyles={customSelectStyles}

            />


            <CommonMultiSelect
              label="Case"
              isMulti
              customStyles={customSelectStyles}
              options={caseOptions}
              styles={customSelectStyles}
              // className="com"
              value={formData.caseIds}
              onChange={(selected) => { setFormData(prev => ({ ...prev, caseIds: selected })); }}
              placeholder="Select cases"
            />

            <CommonMultiSelect
              label="Target"
              value={formData.targets}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, targets: selected }))
              }
              options={targetOptions}
              customStyles={customSelectStyles}
            />
            <CommonMultiSelect
              label="Sentiment"
              value={formData.sentiment}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, sentiment: selected }))
              }
              options={sentimentOptions}
              customStyles={customSelectStyles}
            />
            {/* </div> */}

            {/* DatePicker */}
            {/* <div >

              <label>Date</label>
              <TextField 
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CalendarToday style={{ cursor: 'pointer' , color: '#0073CF' }} onClick={togglePopupA} />
                    </InputAdornment>
                  ),
                  // style: {
                  //   height: '38px',
                  //   padding: '0 8px',
                  //   fontSize: '12px',
                  // },
                  style: { height: '38px', color: 'white', borderRadius: '15px' }
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
            </div> */}
            <CommonDateInput
              label="Date"
              value={
                selectedDates.startDate && selectedDates.endDate
                  ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                  : formatDate(selectedDates.startDate || selectedDates.endDate)
              }
              onClickIcon={togglePopupA}
              sx={sharedSxStyles}
            />

            {/* Location Fields */}
            <label style={{ fontSize: '14px' }}>Focus your search on a particular location or area</label>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', color: 'white' }}>
              <CommonTextInput
                name="latitude"
                placeholder="Latitude"
                // className="com me-2"
                value={formData.latitude}
                onChange={handleInputChange}
                showIcon={false}
                autoComplete='off'
              />
              <CommonTextInput
                name="longitude"
                placeholder="Longitude"
                showIcon={false}
                value={formData.longitude}
                onChange={handleInputChange}


                autoComplete='off'
              />
            </div>

            {/* Save Criteria Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.includeArchived}
                  onChange={handleSaveCriteriaChange}
                  style={{ color: '#0073CF' }} // Custom color for checkbox


                />
              }
              label="Save this search"

            />

            {/* Submit Button */}
            <div className="button-container" style={{ textAlign: 'center' }}>
              <button
                type="submit"
                style={{ width: '100%', height: '30px' }}
                className="add-btn"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup components */}
      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={togglePopupA}
        />
      )}
      {
        showSavePopup && (
          <Confirm formData={formData} selectedDates={selectedDates} />
        )
      }
    </div>
  );
};

export default CreateCriteria;