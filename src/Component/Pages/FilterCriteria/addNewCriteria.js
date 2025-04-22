

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePickera from './datepicker';
import '../FilterCriteria/createCriteria.css';
import { customStyles } from '../Case/createCase';
import { openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import { toast } from 'react-toastify';
import Confirm from './confirmCriteria';

const AddNewCriteria = ({ 
    togglePopup, 
    handleCreateCase, 
    searchChips, 
    isPopupVisible, 
    setIsPopupVisible,
}) => {
    const dispatch = useDispatch();
    console.log("searaddnew", searchChips)
    // State for dynamic options

     const [showSavePopup, setShowSavePopup] = useState(false);
    const [caseOptions, setCaseOptions] = useState([]);
    const [fileTypeOptions, setFileTypeOptions] = useState([]);
    // const [searchResults, setSearchResults] = useState();
 const Token = Cookies.get('accessToken');
  
    // State for form data
    const [formData, setFormData] = useState({
        searchQuery: '',
        dataType: [],
        fileType: [],
        platform: [],
        caseIds: [],
        startDate: null,
        endDate: null,
        includeArchived: false,
        latitude: '',
        longitude: '',
    });
console.log(
    "formdatgertt...", formData
)
    // Fetch case data from API
    const fetchCaseData = async () => {
        try {
            const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
            });

            const caseOptionsFormatted = response.data.data.map(caseItem => ({
                value: caseItem.id,
                label: `${caseItem.id} - ${caseItem.title || 'Untitled'}`
            }));

            setCaseOptions(caseOptionsFormatted);
        } catch (error) {
            console.error('Error fetching case data:', error);
        }
    };

    // Fetch file types from API
    const fetchFileTypes = async () => {
        try {
            const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
            });
console.log("platforms", response.data)
            const fileTypeOptionsFormatted = response.data.data.map(platform => ({
                value: platform,
                label: platform
            }));

            setFileTypeOptions(fileTypeOptionsFormatted);
        } catch (error) {
            console.error('Error fetching file types:', error);
        }
    };

    useEffect(() => {
        fetchCaseData();
        fetchFileTypes();
    }, []);

    // Date picker state and handlers
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
        startTime: { hours: 16, minutes: 30 },
        endTime: { hours: 16, minutes: 30 }
    });
console.log("selectedDates", selectedDates)
    const [showPopupD, setShowPopupD] = useState(false);

    const toggleDatePickerPopup = () => {
        setShowPopupD(!showPopupD);
    };

    const handleDateSelection = (dateData) => {
        setSelectedDates(dateData);
        setFormData(prev => ({
            ...prev,
            startDate: dateData.startDate,
            endDate: dateData.endDate
        }));
        toggleDatePickerPopup();
    };

    const formatDateRange = () => {
        if (selectedDates.startDate && selectedDates.endDate) {
            return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
        }
        return 'Select Date Range';
    };

    // Perform search API call
    
    const performSearch = async (e) => {
        e.preventDefault();
        
        console.log(e);
        try {
          // Build the query payload with the correct structure
          const payload = {
            keyword: searchChips?.length > 0
              ? searchChips.map(chip => chip || "")
              : [],
            case_id: formData.caseIds?.length > 0
              ? formData.caseIds.map(caseId => caseId.value)
              : [],
            file_type: formData.platform?.length > 0
              ? formData.platform.map(type => type.value)
              : [],
            page: 1
          };
          
          // Add start time to the query if available
          if (selectedDates.startDate && selectedDates.startTime) {
            payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
          }
          
          // Add end time to the query if available
          if (selectedDates.endDate && selectedDates.endTime) {
            payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
          }
          
          console.log("Query Payload:", payload);
          
          // Make the API request with the correct payload structure
          const response = await axios.post(
            'http://5.180.148.40:9006/api/das/search',
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Token}`,
              }
            }
          );
          
          // Dispatch search results
          dispatch(setSearchResults({
            results: response.data.results,
            total_pages: response.data.total_pages || 1,
            total_results: response.data.total_results || 0,
          }));
          
          dispatch(setKeywords({
                 keyword:searchChips,
                queryPayload: response.data.input  // or other fields if needed
              }));
          // Dispatch the initial page number
          dispatch(setPage(1));
          console.log("Dispatched setSearchResults with:", response.data.results);
          
          // Persist results in local storage with an expiry timestamp
        //   localStorage.setItem('searchResults', JSON.stringify({
        //     results: response.data.results,
        //     expiry: new Date().getTime() + 24 * 60 * 60 * 1000, // 24-hour expiry
        //   }));
          
          console.log('Search results:', response.data);
          setIsPopupVisible(false);
          // Reset form data to initial values
          setFormData({
            searchQuery: '',
            datatype: [],
            filetype: [],
            caseIds: [],
            includeArchived: false,
            latitude: '',
            longitude: '',
          });
          
          // Handle the search results, if applicable
          if (handleCreateCase) {
            handleCreateCase(response.data);
          }
          
          // Show the "saved" popup
          // dispatch(openPopup("saved"));
        } catch (error) {
          console.error('Error performing search:', error);
        }
      };
    
    // Handle Apply button click (Create Criteria)
    const handleCreateCriteria = async (e) => {
        e.preventDefault(); // Prevent default form submission
    
        try {
            // Build the criteria payload
            const criteriaPayload = {
                keyword: searchChips?.length > 0
                ? searchChips.map(chip => chip || "")
                : [],  // Wrap `keywordsString` in an array if it's a single value
                case_id: formData.caseIds?.length > 0
                    ? formData.caseIds.map(caseId => caseId.value.toString())
                    : [], // Handle multiple `caseIds` as an array
                file_type: formData.platform?.length > 0
                    ? formData.platform.map(file => file.value)
                    : [], // Handle multiple `file_type` values as an array
                latitude: formData.latitude || "",
                longitude: formData.longitude || "",
                start_time: selectedDates.startDate && selectedDates.startTime
                    ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`
                    : null, // Include start_time if both date and time are provided
                end_time: selectedDates.endDate && selectedDates.endTime
                    ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
                    : null, // Include end_time if both date and time are provided
            };
    
            console.log("Criteria Payload:", criteriaPayload);
    
            // Make the API request
            const response = await axios.post(
                'http://5.180.148.40:9006/api/das/criteria',
                criteriaPayload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    }
                }
            );
    
            console.log("Response:", response);
    
            // Dispatch popup to indicate criteria creation success
            //dispatch(openPopup("created"));
            dispatch(openPopup("recent"));
            setIsPopupVisible(false);
        } catch (error) {
            console.error('Error creating criteria:', error);
    
            // Optionally handle error further (e.g., show an error popup or toast)
        }
    };
    const handleSaveCriteriaChange = () => {
            setShowSavePopup(true); // Open the popup  
      };

    return (
        <>
            {isPopupVisible && (
                <div className="popup-overlay" style={{ justifyContent: 'center' }}>
                    <div className="popup-container" style={{ width: '40%' }}>
                        <div className="popup-content" style={{ marginTop: '4rem' }}>
                            <h5>Filter Criteria</h5>
                            <span style={{ cursor: "pointer", marginLeft: '14rem' }} onClick={() => setIsPopupVisible(false)}>
                                &times;
                            </span>
                            <form>
                                <h5>Filter</h5>
                             {/* <div style={{height:'150px', overflowX:'auto'}}>
                             <p>
                                    {searchChips?.map((chip, index) => (
                                        <span key={index} style={{marginRight: '5px'}}>
                                            {chip.keyword}
                                            {index < searchChips.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                             </div> */}

                                {/* Case Selection */}
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

                                {/* Platform Selection */}
                                <div className="mb-3">
                                    <label>Platform</label>
                                    <Select
                                        isMulti
                                        options={fileTypeOptions}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.platform}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
                                        placeholder="Select Platforms"
                                    />
                                </div>

                                {/* Date Range */}
                                <div className="mb-3">
                                    <label>Date Range</label>
                                    <TextField
                                        fullWidth
                                        className="com mb-3"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon 
                                                        style={{ cursor: 'pointer' }} 
                                                        onClick={toggleDatePickerPopup} 
                                                    />
                                                </InputAdornment>
                                            ),
                                            style: { height: '38px', padding: '0 8px' },
                                        }}
                                        placeholder="Select Date Range"
                                        value={formatDateRange()}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { border: 'none' },
                                                '&:hover fieldset': { border: 'none' },
                                                '&.Mui-focused fieldset': { border: 'none' },
                                            }
                                        }}
                                    />
                                </div>

                               
                                {/* Buttons */}
                                <div className="button-container">
                                    <button type="button"  onClick={performSearch}className="add-btn">Search</button>
                                    <button 
                                        type="button" 
                                        className="add-btn" 
                                        onClick={handleSaveCriteriaChange}
                                    >
                                      Create
                                    </button>
                                    <button 
                                        type="button" 
                                        className="add-btn" 
                                        onClick={() => setIsPopupVisible(false)}
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
                            onClose={toggleDatePickerPopup}
                        />
                    )}
                    {
 showSavePopup && (
  <Confirm  formData={formData} selectedDates={selectedDates}  searchChips={searchChips} />
 )
}
                </div>
            )}
        </>
    );
};

export default AddNewCriteria;                        