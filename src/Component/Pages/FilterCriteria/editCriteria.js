// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import DatePickera from './datepicker';
// import { CalendarToday } from '@mui/icons-material';
// import { InputAdornment, TextField } from '@mui/material';
// import '../FilterCriteria/createCriteria.css';
// import { customStyles } from '../Case/createCase';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { sharedSxStyles } from './createCriteria';
// import { toast } from 'react-toastify';

// const EditCriteria = ({ togglePopup, criteriaId }) => {
//   const [formData, setFormData] = useState({
//     searchQuery: '',
//     filetype: [],
//     caseIds: [],
//     latitude: '',
//     longitude: ''
//   });
//   const [showPopupD, setShowPopupD] = useState(false);
//   const [selectedDates, setSelectedDates] = useState({
//     startDate: null,
//     endDate: null,
//     startTime: { hours: 16, minutes: 30 },
//     endTime: { hours: 16, minutes: 30 }
//   });
//   const [caseOptions, setCaseOptions] = useState([]);
//   const [fileTypeOptions, setFileTypeOptions] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
// console.log("criteriaId", criteriaId)
//   // Fetch necessary data when component mounts
//   useEffect(() => {
//     fetchCaseData();
//     fetchFileTypes();
//     fetchCriteriaDetails();
//   }, [criteriaId]);

//   // Fetch criteria details by ID
//   const fetchCriteriaDetails = async () => {
//     try {
//       setIsLoading(true);
//       const Token = Cookies.get('accessToken');
//       const response = await axios.get(`http://5.180.148.40:9006/api/das/criteria/${criteriaId}`, {
//         headers: {
//           'Authorization': `Bearer ${Token}`
//         },
//       });
//       console.log("criteriaDetails", response)
//       const criteriaData = response.data.data;
      
//       // Parse dates from the API response
//       let startDate = null;
//       let endDate = null;
//       let startTime = { hours: 16, minutes: 30 };
//       let endTime = { hours: 16, minutes: 30 };
      
//       if (criteriaData.start_time) {
//         const startDateTime = new Date(criteriaData.start_time);
//         startDate = startDateTime;
//         startTime = {
//           hours: startDateTime.getHours(),
//           minutes: startDateTime.getMinutes()
//         };
//       }
      
//       if (criteriaData.end_time) {
//         const endDateTime = new Date(criteriaData.end_time);
//         endDate = endDateTime;
//         endTime = {
//           hours: endDateTime.getHours(),
//           minutes: endDateTime.getMinutes()
//         };
//       }
      
//       setSelectedDates({
//         startDate,
//         endDate,
//         startTime,
//         endTime
//       });
      
//       // Find the matching case option
//       const caseOption = criteriaData.case_id ? 
//         { value: criteriaData.case_id, label: `${criteriaData.case_id}` } : null;
//       console.log("caseOption", caseOption)
      
//       // Find the matching filetype option
//       const fileTypeOption = criteriaData.file_type ? 
//       { value: criteriaData.file_type, label: criteriaData.file_type } : null;
//       console.log("caseOption", caseOption)
//       // Update form data
//       setFormData(prev => ({
//         ...prev,
//         searchQuery: criteriaData.keyword || [],
//         // caseIds: caseOption ? [caseOption] : [],
//         caseIds:criteriaData.case_id || [],
//         filetype: fileTypeOption ? [fileTypeOption] : [],
//         latitude: criteriaData.latitude || '',
//         longitude: criteriaData.longitude || ''
//       }));
//       console.log("setFormData", formData)
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching criteria details:', error);
//       setError('Failed to load criteria details.');
//       setIsLoading(false);
//     }
//   };
// console.log("formdata", formData.caseIds)
//   // Fetch case data from API
//   const fetchCaseData = async () => {
//     try {
//       const Token = Cookies.get('accessToken');
//       const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Token}`
//         },
//       });
      
//       // Format the response data for react-select
//       const caseOptionsFormatted = response.data.data.map(caseItem => ({
//         value: caseItem.id,
//         label: `${caseItem.id} - ${caseItem.name || 'Untitled'}`
//       }));
      
//       setCaseOptions(caseOptionsFormatted);
//     } catch (error) {
//       console.error('Error fetching case data:', error);
//     }
//   };

//   // Fetch file types from API
//   const fetchFileTypes = async () => {
//     try {
//       const Token = Cookies.get('accessToken');
//       const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${Token}`
//           },
//       });
    
//       // Format the response data for react-select
//       const fileTypeOptionsFormatted = response.data.data.map(platform => ({
//         value: platform,
//         label: platform
//       }));
      
//       setFileTypeOptions(fileTypeOptionsFormatted);
//     } catch (error) {
//       console.error('Error fetching file types:', error);
//     }
//   };

//   // Handle form update submission
//   const handleUpdate = async (e) => {
//     e.preventDefault();
    
//     try {
//       const Token = Cookies.get('accessToken');
//       const updatePayload = {
//         keyword: Array.isArray(formData.searchQuery) 
//         ? formData.searchQuery 
//         : [formData.searchQuery], // Ensure `searchQuery` is always an array
//       case_id: formData.caseIds?.length > 0 
//         ? formData.caseIds.map(caseId => caseId.value.toString()) 
//         : [], // Handle multiple case IDs as an array of strings
//       file_type: formData.filetype?.length > 0 
//         ? formData.filetype.map(file => file.value.toString()) 
//         : [],
//         latitude: formData.latitude || "",
//         longitude: formData.longitude || "",
//         start_time: selectedDates.startDate ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00` : null,
//         end_time: selectedDates.endDate ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00` : null
//       };
//       console.log("updated payload", updatePayload)
//       const response = await axios.put(`http://5.180.148.40:9006/api/das/criteria/${criteriaId}`, updatePayload, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Token}`
//         },
//       });
//       toast('Criteria updated successfully')
//       console.log('Criteria updated successfully:', response.data);
      
//       // Close the popup after successful update
//       togglePopup();
//     } catch (error) {
//       console.error('Error updating criteria:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   // Toggle date picker popup visibility
//   const togglePopupA = () => {
//     setShowPopupD(!showPopupD);
//   };

//   // Handle data from DatePicker
//   const handleDateSelection = (dateData) => {
//     setSelectedDates(dateData);
//     togglePopupA(); // Close popup after selection
//   };

//   // Format date for display
//   const formatDate = (date) => {
//     if (!date) return 'No date selected';
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   if (isLoading) {
//     return (
//       <div className="popup-overlay">
//         <div className="popup-container">
//           <div className="popup-content text-center">
//             <p>Loading Criteria Details...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="popup-overlay">
//         <div className="popup-container">
//           <button className="close-icon" onClick={togglePopup}>
//             &times;
//           </button>
//           <div className="popup-content text-center">
//             <p>{error}</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <button className="close-icon" onClick={togglePopup}>
//           &times;
//         </button>
//         <div className="popup-content">
//           <h5>Edit Criteria</h5>
//           <form onSubmit={handleUpdate}>
//             {/* Search Bar */}
//             <label>Search</label>
//             <TextField
//               fullWidth
//               className="com mb-3"
//               name="searchQuery"
//               InputProps={{
//                 style: {
//                   height: '38px',
//                   padding: '0 8px',
//                 },
//               }}
//               placeholder="Search..."
//               value={formData.searchQuery}
//               onChange={handleInputChange}
//               sx={sharedSxStyles}
//             />

            
          
//             {/* Filetype Dropdown (Multi Select) */}
//             <div className="mb-3">
//               <label>Filetype</label>
//               <Select
//                 isMulti
//                 options={fileTypeOptions}
//                 styles={customStyles}
//                 className="com"
//                 value={formData.filetype}
//                 onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
//                 placeholder="Select Filetypes"
//               />
//             </div>

//             {/* Case Selection Field */}
//             <div className="mb-3">
//               <label>Case</label>
//               <Select
//                 isMulti
//                 options={caseOptions}
//                 styles={customStyles}
//                 className="com"
//                 value={formData.caseIds}
//                 onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
//                 placeholder="Select Cases"
//               />
//             </div>

//             {/* DatePicker */}
//             <div className="mb-3">
//               <label>DatePicker</label>
//               <TextField
//                 fullWidth
//                 className="com mb-3"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <CalendarToday style={{ cursor: 'pointer' }} onClick={togglePopupA} />
//                     </InputAdornment>
//                   ),
//                   style: {
//                     height: '38px',
//                     padding: '0 8px',
//                   },
//                 }}
//                 placeholder="Select Date..."
//                 value={
//                   selectedDates.startDate && selectedDates.endDate
//                     ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
//                     : formatDate(selectedDates.startDate || selectedDates.endDate)
//                 }
//                 readOnly
//                 sx={sharedSxStyles}
//               />
//             </div>

//             {/* Location Fields */}
//             <label>Focus your search to a particular location or area</label>
//             <div className="mb-3 d-flex">
//               <TextField
//                 name="latitude"
//                 placeholder="Latitude"
//                 className="com mb-3 me-2"
//                 value={formData.latitude}
//                 onChange={handleInputChange}
//                 InputProps={{
//                   style: {
//                     height: '38px',
//                     padding: '0 8px',
//                   },
//                 }}
//                 sx={sharedSxStyles}
//               />
//               <TextField
//                 name="longitude"
//                 placeholder="Longitude"
//                 className="com mb-3"
//                 value={formData.longitude}
//                 onChange={handleInputChange}
//                 InputProps={{
//                   style: {
//                     height: '38px',
//                     padding: '0 8px',
//                   },
//                 }}
//                 sx={sharedSxStyles}
//               />
//             </div>
//             <h5 className="mb-3">SELECT ON MAP</h5>

//             {/* Update Button */}
//             <div className="button-container" style={{ textAlign: 'center' }}>
//               <button
//                 type="submit"
//                 style={{ width: '100%', height: '30px' }}
//                 className="add-btn"
//               >
//                 Update
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
      
//       {/* Date Picker Popup */}
//       {showPopupD && (
//         <DatePickera
//           onSubmit={handleDateSelection}
//           initialDates={selectedDates}
//           onClose={togglePopupA}
//         />
//       )}
//     </div>
//   );
// };

// export default EditCriteria;

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
        // Check if case_id is an array or a single value
        const caseIdsArray = Array.isArray(criteriaData.case_id) ? criteriaData.case_id : [criteriaData.case_id];
        
        // Wait for case options to be loaded
        if (caseOptions.length > 0) {
          caseIdsArray.forEach(caseId => {
            const matchingOption = caseOptions.find(option => option.value.toString() === caseId.toString());
            if (matchingOption) {
              selectedCaseIds.push(matchingOption);
            }
          });
        } else {
          // If case options are not yet loaded, create temporary options
          caseIdsArray.forEach(caseId => {
            selectedCaseIds.push({ value: caseId, label: `${caseId}` });
          });
        }
      }
      
      // Format file types as an array of objects for React-Select
      const selectedFileTypes = [];
      if (criteriaData.file_type) {
        // Check if file_type is an array or a single value
        const fileTypesArray = Array.isArray(criteriaData.file_type) ? criteriaData.file_type : [criteriaData.file_type];
        
        fileTypesArray.forEach(fileType => {
          selectedFileTypes.push({ value: fileType, label: fileType });
        });
      }
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        searchQuery: criteriaData.keyword || '',
        caseIds: selectedCaseIds,
        filetype: selectedFileTypes,
        latitude: criteriaData.latitude || '',
        longitude: criteriaData.longitude || ''
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching criteria details:', error);
      setError('Failed to load criteria details.');
      setIsLoading(false);
    }
  };

  // Update case IDs when case options are loaded
  useEffect(() => {
    if (caseOptions.length > 0 && formData.caseIds.length > 0) {
      // Try to match temporary options with actual options
      const updatedCaseIds = formData.caseIds.map(caseId => {
        const matchingOption = caseOptions.find(option => option.value.toString() === caseId.value.toString());
        return matchingOption || caseId;
      });
      
      setFormData(prev => ({
        ...prev,
        caseIds: updatedCaseIds
      }));
    }
  }, [caseOptions]);

  // Update file types when file type options are loaded
  useEffect(() => {
    if (fileTypeOptions.length > 0 && formData.filetype.length > 0) {
      // Try to match temporary options with actual options
      const updatedFileTypes = formData.filetype.map(fileType => {
        const matchingOption = fileTypeOptions.find(option => option.value === fileType.value);
        return matchingOption || fileType;
      });
      
      setFormData(prev => ({
        ...prev,
        filetype: updatedFileTypes
      }));
    }
  }, [fileTypeOptions]);

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
        label: `${caseItem.id}`
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
        case_id: formData.caseIds.map(caseId => caseId.value.toString()),
        file_type: formData.filetype.map(file => file.value.toString()),
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        start_time: selectedDates.startDate ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00` : null,
        end_time: selectedDates.endDate ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00` : null
      };
      
      const response = await axios.put(`http://5.180.148.40:9006/api/das/criteria/${criteriaId}`, updatePayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      
      toast('Criteria updated successfully');
      console.log('Criteria updated successfully:', response.data);
      
      // Close the popup after successful update
      togglePopup();
    } catch (error) {
      console.error('Error updating criteria:', error);
      toast.error('Failed to update criteria');
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

            {/* Filetype Dropdown (Multi Select) */}
            <div className="mb-3">
              <label>Filetype</label>
              <Select
                isMulti
                options={fileTypeOptions}
                styles={customStyles}
                className="com"
                value={formData.filetype}
                onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected || [] }))}
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
                onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected || [] }))}
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