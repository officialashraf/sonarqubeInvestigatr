import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePickera from '../FilterCriteria/datepicker';
import { Search, Send, Tune, CalendarToday } from '@mui/icons-material';
import { Checkbox, FormControlLabel, InputAdornment, TextField } from '@mui/material';
import '../FilterCriteria/createCriteria.css';
import { customStyles } from '../Case/createCase';
import RecentCriteria from '../FilterCriteria/recentCriteria';
import SavedCriteria from '../FilterCriteria/savedCriteria';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useDispatch, useSelector} from "react-redux";
import { closePopup, openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import Confirm from '../FilterCriteria/confirmCriteria';
import { setReportResults } from '../../../Redux/Action/reportAction';


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
  }
};

const SearchView = ({ togglePopup, setShowPopup, handleCreateCase }) => {
  const dispatch = useDispatch();
  const Token = Cookies.get('accessToken');
  
  const [formData, setFormData] = useState({
    searchQuery: '',
    datatype: [],
      caseIds: [],
  
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
  const [template, setTemplate] = useState()
  

  const activePopup = useSelector((state) => state.popup?.activePopup || null);
console.log("create popup", activePopup)
   const results = useSelector((state) => state.report?.results || null);
console.log("result",results)
  // Fetch case IDs on component mount
  useEffect(() => {
    fetchCaseData();

  }, []);
  // if (activePopup !== "create") return null;
  // Fetch case data from API

 

  const fetchCaseData = async () => {
    try {
      const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      // Format the response data for react-select
      const caseOptionsFormatted = response.data.data.map(caseItem => ({
        value: caseItem.id,
        label: `${caseItem.id} - ${caseItem.title || 'Untitled'}`
      }));

      setCaseOptions(caseOptionsFormatted);
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };

 

 
 

 
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If updating `searchQuery`, split input into an array of keywords
    if (name === "searchQuery") {
        setFormData(prev => ({
            ...prev,
            [name]: value.split(",").map(keyword => keyword.trim()) // Split by commas and trim extra spaces
        }));
    } else {
        // For other inputs, handle normally
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }
};


// const handleSearch = async (e) => {
//   e.preventDefault();
//   try {
//    let raw = formData.searchQuery;

//     const payload = {
//      query :  { 
//         search_query:  Array.isArray(raw) ? raw[0] : raw // Ensure proper formatting for search_query

// },
//       // case_id: formData.caseIds?.length > 0 
//       // ? formData.caseIds.map(caseId => caseId.value).join(",") 
//       // : "",
//       case_id: formData.caseIds?.length > 0 
//       ? (formData.caseIds.map(caseId => caseId.value.toString()))
//       : "[]",
    
    
//     };
    
//     if (selectedDates.startDate && selectedDates.startTime) {
//       payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
//     }
    
//     if (selectedDates.endDate && selectedDates.endTime) {
//       payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
//     }
    
//     console.log("search payload", payload);
    
//     const response = await axios.post(
//       'http://5.180.148.40:9007/api/das/search', 
//       payload, 
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Token}`
//         }
//       }
//     );
    
//     console.log("dispatchresponse", response);




//   const fetchReportData = async () => {
//     try {
//       const response2 = await axios.post('http://5.180.148.40:9002/api/osint-man/v1/report', response, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${Token}`,
//         },
//       });

//       dispatch(setReportResults({
//         results: response2.data.results,
//         total_pages: response2.data.total_pages,
//         total_results: response2.data.total_results,
//       }));
//     } catch (error) {
//       console.error('Error fetching report data:', error);
//     }

//   }

//     // dispatch(setSearchResults({
//     //   results: response.data.results,
//     //   total_pages: response.data.total_pages || 1,
//     //   total_results: response.data.total_results || 0,
//     // }));

//     // dispatch(setKeywords({
//     //    keyword: response.data.input.keyword,
//     //   queryPayload: response.data.input  // or other fields if needed
//     // }));
//     console.log("setkeywordDispacth",response.data.input.keyword)
//     // Dispatch initial page number
//     dispatch(setPage(1));
    
//     setFormData({
//       searchQuery: '',
//       datatype: [],
//            caseIds: [],
//     });
    
//     // Handle the search results (e.g., pass them to a parent component)
   

//   } catch (error) {
//     console.error('Error performing search:', error);
//   }
// };

const handleSearch = async (e) => {
  e.preventDefault();
  try {
    let raw = formData.searchQuery;

    const payload = {
      // query: { 
      //   search_query: Array.isArray(raw) ? raw[0] : raw // Ensure search query is a string
      // },
       keyword: Array.isArray(formData.searchQuery) ? formData.searchQuery : [formData.searchQuery],
       report_generation: true,

      case_id: formData.caseIds?.length > 0 
        ? formData.caseIds.map(caseId => caseId.value.toString()) 
        : [], // Ensuring it's an empty array, not "[]"
      page: 1 // Start at page 1
    };
    
    if (selectedDates.startDate && selectedDates.startTime) {
      payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
    }
    
    if (selectedDates.endDate && selectedDates.endTime) {
      payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
    }
    
    console.log("search payload", payload);

    const response = await axios.post(
      'http://5.180.148.40:9007/api/das/search', 
      payload, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        }
      }
    );
    await dispatch(setReportResults({
          results: response.data.results,
          total_pages: response.data.total_pages,
          total_results: response.data.total_results,
        }));
    
    console.log("dispatchresponse", response.data.results);


    // Dispatch search results


    
    // Dispatch initial page number
    dispatch(setPage(1));
    
    // Reset form data
    setFormData({
      searchQuery: '',
      datatype: [],
      caseIds: [],
    });

  } catch (error) {
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
//  const fetchReportData = async () => {
//   try {
//     const response2 = await axios.post(
//       'http://5.180.148.40:9002/api/osint-man/v1/report',
//       { rows: results },
//       {
//         responseType: 'blob', // ✅ tell axios to expect binary Word file
//         headers: {
//           Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           Authorization: `Bearer ${Token}`,
//         },
//       }
//     );

//     // ✅ Save the file using file picker
//     const fileHandle = await window.showSaveFilePicker({
//       suggestedName: "social_media_report.docx",
//       types: [
//         {
//           description: "Word Document",
//           accept: {
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//           },
//         },
//       ],
//     });

//     const writable = await fileHandle.createWritable();
//     await writable.write(response2.data); // use the blob directly
//     await writable.close();

//     console.log("Report saved successfully!");
//   } catch (error) {
//     console.error("Error downloading or saving .docx file:", error);
//   }
// };
 
const handleDownload  = async () => {
  try {
    console.log("Template:", template.data);
    const docContent = await template.data;
     const blob = docContent.blob();
     const fileHandle =await window.showSaveFilePicker({
            suggestedName: "social_media_report.docx",
            types: [{ description: "Word Document", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] } }]
        });

        const writable =await fileHandle.createWritable();
       await writable.write(blob);
       await writable.close(); 
  } catch (error) {
    console.error("Error downloading .docx file:", error);
  }
};


  return (
    <div>
       
        {/* <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button> */}
        <div className="popup-content"style={{height:'100vh'}}>
          <h5>Search Report</h5>
          <form onSubmit={handleSearch}>
            {/* Search Bar with Icons */}
            <label>Search</label>
            <TextField
              fullWidth
              className="com mb-3"
              name="searchQuery"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Send onClick={() => dispatch(openPopup("recent"))} style={{ cursor: 'pointer' }} />
                  
                  </InputAdornment>
                ),
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

          
           

            {/* Submit Button */}
            <div className="button-container" style={{ textAlign: 'center' }}>
              <button
                type="submit"
                style={{ width: '100%', height: '30px', marginTop:'10px' }}
                className="add-btn"

              >
                Search
              </button>
            </div>
            
          </form>
           {/* <button onClick={fetchReportData}>Download Word File</button> */}
        </div>
     

      {/* Popup components */}
      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={togglePopupA}
        />
      )}
{/* {
 showSavePopup && (
  <Confirm  formData={formData} selectedDates={selectedDates}/>
 )
} */}
      {/* {showPopupR && (
        <RecentCriteria
          togglePopup={togglePopupR}
          setShowPopup={setShowPopup}
        />
      )}

      {showPopupS && (
        <SavedCriteria
          togglePopup={togglePopupS}
          setShowPopup={setShowPopup}
        />
      )} */}
    


    </div>
  );
};

export default SearchView;