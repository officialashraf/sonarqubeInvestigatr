// import React, { useState } from 'react';
// import Select from 'react-select';
// import DatePickera from './datepicker'
// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Button from '@mui/material/Button';
// import enLocale from 'date-fns/locale/en-US';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import '../FilterCriteria/createCriteria.css'
// import { customStyles } from '../Case/createCase'
// import RecentCriteria from './recentCriteria';
// import SavedCriteria from './savedCriteria';


// export const sharedSxStyles = {
//     '& .MuiOutlinedInput-root': {
//         '& fieldset': {
//             border: 'none', // Removes the border
//         },
//         '&:hover fieldset': {
//             border: 'none', // Ensures no border on hover
//         },
//         '&.Mui-focused fieldset': {
//             border: 'none', // Removes the border when focused
//         },
//     },
//     '& .MuiInputBase-root': {
//         boxShadow: 'none', // Removes blue focus shadow
//     }
// }

// const AddNewCriteria = ({ togglePopup, handleCreateCase, searchChips, isPopupVisible, setIsPopupVisible }) => {
//     const [formData, setFormData] = useState({
//         // New fields
//         searchQuery: '',
//         datatype: null,
//         filetype: [],
//         caseNumber: '',
//         // selectedDates: '',
//         includeArchived: false
//     });
//     const [showPopupR, setShowPopupR] = useState(false);
//     const [showPopupS, setShowPopupS] = useState(false);
//     const [showPopupD, setShowPopupD] = useState(false);
//     const [selectedDates, setSelectedDates] = useState({
//         startDate: null,
//         endDate: null,
//         startTime: { hours: 16, minutes: 30 },
//         endTime: { hours: 16, minutes: 30 }
//     });
//     console.log("setfggfd", selectedDates)


//     const options = [
//         { value: 'type1', label: 'Type 1' },
//         { value: 'type2', label: 'Type 2' },
//     ];


//     const togglePopupN = () => {
//         setIsPopupVisible(false); // Pop-up ko close kar deta hai
//     };
//     const handleInputChange = (e) => {
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     // Toggle popup visibility
//     const togglePopupA = () => {
//         setShowPopupD(!showPopupD);
//     };
//     const togglePopupR = () => {
//         setShowPopupR(!showPopupR);
//     };
//     const togglePopupS = () => {
//         setShowPopupS(!showPopupS);
//     };
//     // Handle data from DatePicker
//     const handleDateSelection = (dateData) => {
//         setSelectedDates(dateData);
//         togglePopupA(); // Close popup after selection
//     };
//     console.log("handledatw", handleDateSelection)
//     // Format date for display
//     const formatDate = (date) => {
//         if (!date) return 'No date selected';
//         return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//     };
//     // console.log("formatdate", formatDate(selectedDates))
//     console.log("seerhcporops", searchChips)
//     return (
//         <>
//             {isPopupVisible && (
//                 <div className="popup-overlay" style={{ justifyContent: 'center' }}>
//                     <div className="popup-container" style={{ width: '20%' }}>

//                         <div className="popup-content" style={{ marginTop: '4rem' }}>
//                             <h5> Filter Criteria </h5>
//                             <span style={{ cursor: "pointer", marginLeft: '14rem' }} onClick={togglePopupN}>
//                                 &times;
//                             </span>
//                             <form
//                             // onSubmit={(e) => {
//                             //     e.preventDefault();
//                             //     handleCreateCase(formData);
//                             // }}
//                             >
//                                 {/* Search Bar with Icons */}
//                                 <h5>Filter</h5>
//                        <p>{searchChips|| null}</p>

//                                 {/* Datatype Dropdown (Single Select) */}
//                                 <div className="mb-3">
//                                     <label>Datatype</label>
//                                     <Select
//                                         isMulti
//                                         options={options}
//                                         styles={customStyles}
//                                         className="com"
//                                         value={formData.datatype}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, datatype: selected }))}
//                                         placeholder="Select Datatype"
//                                     />
//                                 </div>

//                                 {/* Filetype Dropdown (Multi Select) */}
//                                 <div className="mb-3">
//                                     <label>Filetype</label>
//                                     <Select
//                                         isMulti
//                                         options={options}
//                                         styles={customStyles}
//                                         className="com"
//                                         value={formData.filetype}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
//                                         placeholder="Select Filetypes"
//                                     />
//                                 </div>

//                                 {/* Case Search Field */}
//                                 {/* <label>Case</label> */}
//                                 <div className="mb-3">
//                                     <label>Case</label>
//                                     <Select
//                                         isMulti
//                                         options={options}
//                                         styles={customStyles}
//                                         className="com"
//                                         value={formData.filetype}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
//                                         placeholder="Select Filetypes"
//                                     />
//                                 </div>
//                                 {/* <TextField
//                             fullWidth
//                             className="com mb-3"
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <SearchIcon />
//                                     </InputAdornment>
//                                 ), style: {
//                                     height: '38px', // Use consistent height
//                                     padding: '0 8px', // Ensure uniform padding
//                                   },
//                             }}
//                             placeholder="Search Case..."
//                             value={formData.caseNumber}
//                             onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
//                             sx={sharedSxStyles}
//                         /> */}


//                                 {/* Datatype Dropdown (Single Select) */}

//                                 <div className=" mb-3">
//                                     <label>DatePicker</label>
//                                     <TextField
//                                         fullWidth
//                                         className="com mb-3"
//                                         InputProps={{
//                                             endAdornment: (
//                                                 <InputAdornment position="end">
//                                                     <CalendarTodayIcon style={{ cursor: 'pointer' }} onClick={togglePopupA} />
//                                                 </InputAdornment>
//                                             ), style: {
//                                                 height: '38px', // Use consistent height
//                                                 padding: '0 8px', // Ensure uniform padding
//                                             },
//                                         }}
//                                         placeholder="Select Date..."
//                                         value={
//                                             selectedDates.startDate && selectedDates.endDate
//                                                 ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
//                                                 : formatDate(selectedDates.startDate || selectedDates.endDate)
//                                         }
//                                         onChange={(e) => setFormData(prev => ({ ...prev, caseNumber: e.target.value }))}
//                                         sx={sharedSxStyles}
//                                     />

//                                 </div>


//                                 <label>Focus your search to a particular location or area</label>
//                                 <h5 className="mb-3">SELECT ON MAP</h5>
//                                 {/* <TextField placeholder='SELECT ON MAP'
//                         className="com mb-3"
//                         InputProps={{
//                            style: {
//                                height: '38px', // Use consistent height
//                                padding: '0 8px', // Ensure uniform padding
//                              },
//                        }}sx={sharedSxStyles}
//                         ></TextField> */}
//                                 {/* Checkbox */}
//                                 {/* <FormControlLabel
//                                     control={
//                                         <Checkbox
//                                             checked={formData.includeArchived}
//                                             onChange={(e) => setFormData(prev => ({ ...prev, includeArchived: e.target.checked }))}
//                                             color="primary"
//                                         />
//                                     }
//                                     label="Save this search"
//                                     className="mb-3"
//                                 /> */}


//                                 {/* <span>{selectedDates}</span> */}
//                                 {/* Submit Button */}
//                                 <div className="button-container" >
//                                     <button
//                                         type="submit"
//                                         style={{ height: '30px' }}
//                                         className="add-btn">Search</button>
//                                         <button
//                                         type="submit"
//                                         style={{ height: '30px' }}
//                                         className="add-btn">Cancel</button>
//                                         <button
//                                         type="submit"
//                                         style={{ height: '30px' }}
//                                         className="add-btn">Apply</button>
//                                     {/* <Button
//                 variant="outlined"
//                 color="secondary"
//                 onClick={togglePopup}
//               >
//                 Cancel
//               </Button> */}
//                                 </div>
//                             </form>
//                         </div>
//                     </div>
//                     {showPopupD && (

//                         <DatePickera
//                             onSubmit={handleDateSelection}
//                             initialDates={selectedDates}
//                             onClose={togglePopupA}
//                         />

//                     )}
//                     {showPopupR && (

//                         <RecentCriteria

//                             onClose={togglePopupR}
//                         />


//                     )}
//                     {showPopupS && (
//                         < SavedCriteria
//                             onClose={togglePopupS}
//                         />
//                     )}
//                 </div>)}
//         </>);
// };

// export default AddNewCriteria;


// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';

// import TextField from '@mui/material/TextField';
// import InputAdornment from '@mui/material/InputAdornment';
// import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
// import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import DatePickera from './datepicker';
// import '../FilterCriteria/createCriteria.css';
// import { customStyles } from '../Case/createCase';
// import { openPopup } from '../../../Redux/Action/criteriaAction';
// import { searchReducer } from '../../../Redux/Reducers/criteriaReducer';

// const AddNewCriteria = ({ 
//     togglePopup, 
//     handleCreateCase, 
//     searchChips, 
//     isPopupVisible, 
//     setIsPopupVisible,
//     Token 
// }) => {
//     const dispatch = useDispatch();
    
//     // State for dynamic options
//     const [caseOptions, setCaseOptions] = useState([]);
//     const [fileTypeOptions, setFileTypeOptions] = useState([]);
// const [searchResults, setSearchResults] = useState()
//     // State for form data
//     const [formData, setFormData] = useState({
//         searchQuery: '',
//         dataType: [],
//         fileType: [],
//         platform: [],
//         caseIds: [],
//         startDate: null,
//         endDate: null,
//         includeArchived: false,
//         latitude: '',
//         longitude: '',
//         radius: ''
//     });

//     // Fetch case data from API
//     const fetchCaseData = async () => {
//         try {
//             const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${Token}`
//                 },
//             });

//             // Format the response data for react-select
//             const caseOptionsFormatted = response.data.data.map(caseItem => ({
//                 value: caseItem.id,
//                 label: `${caseItem.id} - ${caseItem.title || 'Untitled'}`
//             }));

//             setCaseOptions(caseOptionsFormatted);
//         } catch (error) {
//             console.error('Error fetching case data:', error);
//         }
//     };

//     // Fetch file types from API
//     const fetchFileTypes = async () => {
//         try {
//             const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
//                 headers: {
//                     'Authorization': `Bearer ${Token}`
//                 },
//             });
// console.log("filtetyep", response)
//             // Format the response data for react-select
//             const fileTypeOptionsFormatted = response.data.data.map(platform => ({
//                 value: platform,  // Use the platform value directly
//                 label: platform   // Use the platform value directly
//             }));

//             setFileTypeOptions(fileTypeOptionsFormatted);
//             console.log("fileTypeOptions", fileTypeOptions)
//         } catch (error) {
//             console.error('Error fetching file types:', error);
//         }
//     };

//     // Fetch data on component mount
//     useEffect(() => {
//         fetchCaseData();
//         fetchFileTypes();
//     }, [Token]);

//     // State for date picker
//     const [selectedDates, setSelectedDates] = useState({
//         startDate: null,
//         endDate: null,
//         startTime: { hours: 16, minutes: 30 },
//         endTime: { hours: 16, minutes: 30 }
//     });

//     // Popup state
//     const [showPopupD, setShowPopupD] = useState(false);

//     // Toggle date picker popup
//     const toggleDatePickerPopup = () => {
//         setShowPopupD(!showPopupD);
//     };

//     // Handle date selection
//     const handleDateSelection = (dateData) => {
//         setSelectedDates(dateData);
//         setFormData(prev => ({
//             ...prev,
//             startDate: dateData.startDate,
//             endDate: dateData.endDate
//         }));
//         toggleDatePickerPopup();
//     };

//     // Format date for display
//     const formatDateRange = () => {
//         if (selectedDates.startDate && selectedDates.endDate) {
//             return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
//         }
//         return 'Select Date Range';
//     };

//     // Perform search
//     const performSearch = async () => {
//         try {
//             // Create query array based on search chips
//             const queryArray = searchChips.map(keyword => {
//                 let queryObj = [{
//                     unified_case_id: formData.caseIds.length > 0 
//                         ? formData.caseIds[0].value 
//                         : "",
//                     unified_type: formData.platform.length > 0
//                         ? formData.platform[0].value
//                         : "",
//                     site_keywordsmatched: keyword
//                 }];

//                 // Add date range if selected
//                 if (selectedDates.startDate && selectedDates.startTime) {
//                     queryObj.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
//                 }

//                 if (selectedDates.endDate && selectedDates.endTime) {
//                     queryObj.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
//                 }

//                 return queryObj;
//             });

//             // Perform search API call
//             const response = await axios.post('http://5.180.148.40:9006/api/das/search', {
//                 query: queryArray, 
//                 page: 1, 
//                 per_page: 50
//             }, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${Token}`
//                 }
//             });

//             // Dispatch search results
//             dispatch(setSearchResults(response.data.results));
//             localStorage.setItem('searchResults', JSON.stringify(response.data.results));

//             // Optional: callback to parent component
//             if (handleCreateCase) {
//                 handleCreateCase(response.data);
//             }

//             // Open popup for saved results
//             dispatch(openPopup("saved"));

//             return response.data;

//         } catch (error) {
//             console.error('Error performing search:', error);
//             throw error;
//         }
//     };

//     // Handle form submission
//     const handleSearch = async (e) => {
//         e.preventDefault();

//         try {
//             // Perform search
//             await performSearch();

//             // Reset form data
//             setFormData({
//                 searchQuery: '',
//                 dataType: [],
//                 fileType: [],
//                 platform: [],
//                 caseIds: [],
//                 startDate: null,
//                 endDate: null,
//                 includeArchived: false,
//                 latitude: '',
//                 longitude: '',
//                 radius: ''
//             });

//         } catch (error) {
//             console.error('Error in search process:', error);
//         }
//     };

//     return (
//         <>
//             {isPopupVisible && (
//                 <div className="popup-overlay" style={{ justifyContent: 'center' }}>
//                     <div className="popup-container" style={{ width: '20%' }}>
//                         <div className="popup-content" style={{ marginTop: '4rem' }}>
//                             <h5>Filter Criteria</h5>
//                             <span style={{ cursor: "pointer", marginLeft: '14rem' }} onClick={() => setIsPopupVisible(false)}>
//                                 &times;
//                             </span>
//                             <form onSubmit={handleSearch}>
//                                 <h5>Filter</h5>
//                                 <p>
//                                     {searchChips && searchChips.length > 0 
//                                         ? searchChips.map((chip, index) => (
//                                             <span key={index} style={{marginRight: '5px'}}>
//                                                 {chip}
//                                                 {index < searchChips.length - 1 ? ', ' : ''}
//                                             </span>
//                                         ))
//                                         : null
//                                     }
//                                 </p>

//                                 {/* Case Selection */}
//                                 <div className="mb-3">
//                                     <label>Case</label>
//                                     <Select
//                                         isMulti
//                                         options={caseOptions}
//                                         styles={customStyles}
//                                         className="com"
//                                         value={formData.caseIds}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
//                                         placeholder="Select Cases"
//                                     />
//                                 </div>

//                                 {/* Platform/File Type Selection */}
//                                 <div className="mb-3">
//                                     <label>Platform</label>
//                                     <Select
//                                         isMulti
//                                         options={fileTypeOptions}
//                                         styles={customStyles}
//                                         className="com"
//                                         value={formData.platform}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
//                                         placeholder="Select Platforms"
//                                     />
//                                 </div>

//                                 {/* Date Range Selection */}
//                                 <div className="mb-3">
//                                     <label>Date Range</label>
//                                     <TextField
//                                         fullWidth
//                                         className="com mb-3"
//                                         InputProps={{
//                                             endAdornment: (
//                                                 <InputAdornment position="end">
//                                                     <CalendarTodayIcon 
//                                                         style={{ cursor: 'pointer' }} 
//                                                         onClick={toggleDatePickerPopup} 
//                                                     />
//                                                 </InputAdornment>
//                                             ),
//                                             style: {
//                                                 height: '38px',
//                                                 padding: '0 8px',
//                                             },
//                                         }}
//                                         placeholder="Select Date Range"
//                                         value={formatDateRange()}
//                                         sx={{
//                                             '& .MuiOutlinedInput-root': {
//                                                 '& fieldset': { border: 'none' },
//                                                 '&:hover fieldset': { border: 'none' },
//                                                 '&.Mui-focused fieldset': { border: 'none' },
//                                             }
//                                         }}
//                                     />
//                                 </div>

//                                 {/* Search Buttons */}
//                                 <div className="button-container">
//                                     <button type="submit" className="add-btn">Search</button>
//                                     <button 
//                                         type="button" 
//                                         className="add-btn" 
//                                         onClick={() => setIsPopupVisible(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Date Picker Popup */}
//                     {showPopupD && (
//                         <DatePickera
//                             onSubmit={handleDateSelection}
//                             initialDates={selectedDates}
//                             onClose={toggleDatePickerPopup}
//                         />
//                     )}
//                 </div>
//             )}
//         </>
//     );
// };

// export default AddNewCriteria;

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
console.log("platform", response.data)
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
                // keyword: response.data.input.keyword,
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
                                        onClick={handleCreateCriteria}
                                    >
                                        Apply
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
                </div>
            )}
        </>
    );
};

export default AddNewCriteria;