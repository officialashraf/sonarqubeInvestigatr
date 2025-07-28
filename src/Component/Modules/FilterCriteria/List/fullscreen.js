// import { useState, useEffect } from 'react';
// import '../savedCriteriaGlobal.css';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import InputAdornment from '@mui/material/InputAdornment';
// import { TextField } from '@mui/material';
// import TuneIcon from '@mui/icons-material/Tune';
// import { sharedSxStyles } from "../createCriteria";
// import SendIcon from '@mui/icons-material/Send';
// import CriteriaCaseTable from './criteriaCaseList';
// import AddNewCriteria from '../addNewCriteria';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie'
// import { clearCriteria, setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { ListAltOutlined, PieChart } from "@mui/icons-material";
// import { FaPhotoVideo } from "react-icons/fa";
// import ScrollCriteriaViewer from './ResourceView';
// import GrapghicalCriteria from './CriteriaGraphicaView/Grapghs/grapghicalCriteria';
// import AppButton from '../../../Common/Buttton/button';
// import styles from "../../Analyze/caseHeader.module.css";
// // import Loader from '../../Layout/loader';

// const SearchResults = () => {
//   const token = Cookies.get('accessToken');
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
//   console.log("searchResult", searchResults, totalPages, currentPage, totalResults);

//   const keywords = useSelector((state) => state.criteriaKeywords?.queryPayload?.keyword || '');
//   console.log("Keywords from Redux:", keywords);

//   const caseId = useSelector((state) => state.criteriaKeywords?.queryPayload?.case_id || '');
//   console.log("casId", caseId)

//   const fileType = useSelector((state) => state.criteriaKeywords?.queryPayload?.file_type || '');
//   console.log("filetype", fileType)

//   const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
//   console.log("Full Redux Payload:", reduxPayload);

//   const [inputValue, setInputValue] = useState('');
//   const [searchChips, setSearchChips] = useState([]);
//   const [enterInput, setEnterInput] = useState([])
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [activeComponent, setActiveComponent] = useState('graph');

//   const handleComponentToggle = (componentName) => {
//     setActiveComponent(componentName);
//   };

//   useEffect(() => {
//     console.log("Keywords object:", keywords);
//     console.log("Case ID:", caseId);
//     console.log("File Type:", fileType);

//     const isValid = (val) =>
//       val !== null && val !== undefined && val.toString().trim() !== "";

//     if (keywords && Array.isArray(keywords)) {
//       let combinedChips = [...keywords];

//       if (Array.isArray(caseId) && caseId.length > 0) {
//         combinedChips = [...combinedChips, ...caseId.map((id) => `${id}`)]; // Ensure each caseId value remains a string
//       }


//       // Check if fileType is an array and merge its values
//       if (Array.isArray(fileType) && fileType.length > 0) {
//         combinedChips = [...combinedChips, ...fileType];
//       } else if (isValid(fileType)) {
//         combinedChips.push(fileType); // Add fileType if it's a valid single value
//       }

//       console.log("Combined Chips:", combinedChips);
//       setSearchChips(combinedChips);
//     } else {
//       console.log("Keywords is not an array or doesn't exist.");
//       setSearchChips([]); // Fallback for empty or invalid data
//       // setActiveTab([]);
//     }
//   }, [keywords, caseId, fileType]);
//   const openPopup = () => {
//     setIsPopupVisible(true); // Pop-up ko open karne ke liye state ko true kare
//   };
//   const exitClick = () => {
//     navigate('/cases')
//   }

//   console.log("Keywords saerch:", searchChips);
//   const filteredChips = searchChips.filter((chip) =>
//     (typeof chip === "string" && chip.toLowerCase().includes(inputValue.toLowerCase())) ||
//     (typeof chip === "number" && chip.toString().includes(inputValue)) // Search for numbers
//   );
//   console.log("filterdeChpis", filteredChips)

//   // Add new chip when "Enter" is pressed
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && inputValue.trim() !== "") {
//       const newChip = inputValue.trim();
//       if (!searchChips.find((chip) => chip === newChip)) {
//         setSearchChips((prev) => [...prev, newChip]);
//         setEnterInput((prev) => [...prev, newChip]); // user input me add karna hai
//       }
//       setInputValue("");
//     }
//   };

//   const removeChip = (chipToRemove) => {
//     const updatedChips = searchChips.filter((chip) => chip !== chipToRemove);
//     setSearchChips(updatedChips);
//     // ❗ Only remove from enterInput if it was user's entered chip
//     setEnterInput((prev) => prev.filter((chip) => chip !== chipToRemove));
//   };

//   const resetSearch = () => {
//      dispatch(clearCriteria());
//     setSearchChips([]);
//     setInputValue('');
//     setEnterInput([])
//   };

//   const handleSearch = async () => {
//     console.log("reduxPayload:", reduxPayload);
//     console.log("enterInput:", enterInput);
//     console.log("searchChips:", searchChips);

//     try {
//       // setLoading(true);
//       // 1. Redux ke sirf keyword le rahe hain
//       const reduxKeywords = Array.isArray(reduxPayload.keyword)
//         ? reduxPayload.keyword
//         : JSON.parse(reduxPayload.keyword || "[]");
//       console.log("reduxKeyword", reduxKeywords)

//       const userKeywords = Array.isArray(enterInput)
//         ? enterInput
//         : JSON.parse(enterInput || "[]");

//       console.log("userKeyword", userKeywords)
//       // 🔥 Keywords only: searchChips se wo elements jo redux keywords ya user keywords me hain
//       const allPossibleKeywords = [...reduxKeywords, ...userKeywords];
//       console.log("alllProgresskeyword", allPossibleKeywords)
//       const finalKeywords = searchChips.filter((chip) => allPossibleKeywords.includes(chip));
//       console.log("finalkeywords", finalKeywords)
//       // 2. case_id aur file_type separately treat honge
//       const reduxCaseIds = Array.isArray(reduxPayload.case_id)
//         ? reduxPayload.case_id
//         : JSON.parse(reduxPayload.case_id || "[]");

//       const reduxFileTypes = Array.isArray(reduxPayload.file_type)
//         ? reduxPayload.file_type
//         : JSON.parse(reduxPayload.file_type || "[]");
//       console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)
//       const finalCaseIds = searchChips.filter((chip) => reduxCaseIds.includes(chip));
//       const finalFileTypes = searchChips.filter((chip) => reduxFileTypes.includes(chip));
//       console.log("finalcaseid or finalfiletype", finalCaseIds, finalFileTypes)

//       const payload = {
//         keyword: finalKeywords,   // Only keywords
//         case_id: finalCaseIds,    // Only case_ids
//         file_type: finalFileTypes,// Only file_types
//         page: reduxPayload.page || 1,
//         start_time: reduxPayload.start_time || null,
//         end_time: reduxPayload.end_time || null,
//         latitude: reduxPayload.latitude || null,
//         longitude: reduxPayload.longitude || null
//       };
//       console.log("Sending search query:", payload);

//       const response = await axios.post(
//         `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       console.log("Search results------:", response);

//       // Redux store update
//       dispatch(setSearchResults({
//         results: response.data.results,
//         total_pages: response.data.total_pages || 1,
//         total_results: response.data.total_results || 0,
//       }));

//       dispatch(setKeywords({
//         keyword: response.data.input.keyword,
//         queryPayload: response.data.input
//       }));
//       handleComponentToggle("list")
//       dispatch(setPage(1));

//     } catch (error) {
//       console.error("Error performing search:", error);
//     }
//   };


//   return (

//     <div className="search-container" style={{ backgroundColor: '#080E17', height: '100%', zIndex: '1050',overflowY:"hidden" }}>
//       {/* <div style={{ display: 'flex', justifyContent: 'space-between', aligntems: 'center', marginTop: '5px' }}> */}
//       <div className={styles.actionIconsContainer} style={{ display: 'flex', justifyContent: 'space-between', aligntems: 'center', marginTop: '5px' }}>
//         {/* 
//   <h6 >Search Results</h6 > */}
//         <div className={styles.searchHeader} style={{ width: '60%', backgroundColor: '#080E17' }}>

//           <TextField
//             fullWidth
//             // className="com mb-3"
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon style={{ color: '#0073CF' }} />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">

//                   <SendIcon style={{ cursor: 'pointer', color: '#0073CF', marginRight: '5px' }} onClick={handleSearch} />
//                   <TuneIcon onClick={openPopup} style={{ cursor: 'pointer', backgroundColor: "#0073CF", color: '#0A192F' }} /> {/* New Card List Filter Icon */}

//                 </InputAdornment>
//               ), style: {
//                 height: '38px', // Use consistent height
//                 padding: '0 8px', // Ensure uniform padding
//                 backgroundColor: "#101D2B",
//                 borderRadius: "15px",
//                 color: 'white',
//                 fontSize: "12px",
//                 marginBottom: "5px",
//               },
//             }}
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Search..."
//             sx={sharedSxStyles}
//           />
//           <div style={{ padding: '0px 0px', height: '20px', marginLeft: "5px" }}>
//             <AppButton children={"Reset"} onClick={resetSearch} />
//           </div>
//         </div>
//         <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
//           <PieChart
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "graph" ? styles.activeIcon : ""}`}
//             onClick={() => handleComponentToggle("graph")}
//           />
//           <FaPhotoVideo
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "photoVideo" ? styles.activeIcon : ""}`}
//             onClick={() => handleComponentToggle("photoVideo")}
//           />
//           <ListAltOutlined
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "list" ? styles.activeIcon : ""}`}
//             onClick={() => handleComponentToggle("list")}
//           />
//         </div>
//       </div>
//       <div className="search-term-indicator" style={{ backgroundColor: '#080E17' }}>
//         <div className="chips-container">
//           {filteredChips && filteredChips.map((chip, index) => (
//             <div key={index} className="search-chip">
//               <span>{chip}</span>
//               <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
//                 <CloseIcon fontSize='15px' />
//               </button>
//             </div>
//           ))}
//         </div>

//       </div>
//       {/* <div className="col-auto  d-flex align-items-center gap-1 justify-content-end  me-2" style={{ margin: "5px", marginBottom: "15px" }}>
//         <PieChart
//           className={`icon-style ${activeComponent === "graph" ? "active-icon" : ""}`}
//           onClick={() => handleComponentToggle("graph")}
//         />
//         <ListAltOutlined
//           className={`icon-style ${activeComponent === "list" ? "active-icon" : ""}`}
//           onClick={() => handleComponentToggle("list")}
//         />

//       </div> */}
//       <div className="search-results" style={{ backgroundColor: "#101D2B" }}>

//         {activeComponent === "graph" && (
//           <GrapghicalCriteria searchChips={searchChips} />
//         )}
//         {activeComponent === "photoVideo" && (
//           <ScrollCriteriaViewer />
//         )}
//         {activeComponent === "list" && (
//           <CriteriaCaseTable searchChips={searchChips} />
//         )}

//       </div>

//       {isPopupVisible && <AddNewCriteria searchChips={searchChips} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}

//     </div>



//   );
// };

// export default SearchResults; 

import { useState, useEffect } from 'react';
import '../savedCriteriaGlobal.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { sharedSxStyles } from "../createCriteria";
import SendIcon from '@mui/icons-material/Send';
import CriteriaCaseTable from './criteriaCaseList';
import AddNewCriteria from '../addNewCriteria';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { clearCriteria, setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ListAltOutlined, PieChart } from "@mui/icons-material";
import { FaPhotoVideo } from "react-icons/fa";
import ScrollCriteriaViewer from './ResourceView';
import GrapghicalCriteria from './CriteriaGraphicaView/Grapghs/grapghicalCriteria';
import AppButton from '../../../Common/Buttton/button';
import styles from "../../Analyze/caseHeader.module.css";

const SearchResults = () => {
  const token = Cookies.get('accessToken');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searchResult", searchResults, totalPages, currentPage, totalResults);

  const keywords = useSelector((state) => state.criteriaKeywords?.queryPayload?.keyword || '');
  console.log("Keywords from Redux:", keywords);

  const caseId = useSelector((state) => state.criteriaKeywords?.queryPayload?.case_id || '');
  console.log("casId", caseId)

  const fileType = useSelector((state) => state.criteriaKeywords?.queryPayload?.file_type || '');
  console.log("filetype", fileType)

  // Get start_time and end_time from Redux
  const startTime = useSelector((state) => state.criteriaKeywords?.queryPayload?.start_time || '');
  const endTime = useSelector((state) => state.criteriaKeywords?.queryPayload?.end_time || '');
  console.log("startTime", startTime, "endTime", endTime);

  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Full Redux Payload:", reduxPayload);

  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  const [enterInput, setEnterInput] = useState([])
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState('graph');
  
  // Track which chips came from Redux (for yellow styling)
  const [reduxChips, setReduxChips] = useState([]);

  const handleComponentToggle = (componentName) => {
    setActiveComponent(componentName);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  // Helper function to create date range chip
  const createDateRangeChip = (start, end) => {
    if (!start && !end) return null;
    
    const formattedStart = formatDate(start);
    const formattedEnd = formatDate(end);
    
    if (formattedStart && formattedEnd) {
      return `${formattedStart} to ${formattedEnd}`;
    } else if (formattedStart) {
      return `From ${formattedStart}`;
    } else if (formattedEnd) {
      return `Until ${formattedEnd}`;
    }
    return null;
  };

  useEffect(() => {
    console.log("Keywords object:", keywords);
    console.log("Case ID:", caseId);
    console.log("File Type:", fileType);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    let combinedChips = [];
    let reduxSourcedChips = [];

    // Add keywords (but don't add to reduxSourcedChips - keep them blue)
    if (keywords && Array.isArray(keywords)) {
      combinedChips = [...keywords];
      // reduxSourcedChips = [...keywords]; // ❌ Removed - keywords stay blue
    }

    // Add case IDs
    if (Array.isArray(caseId) && caseId.length > 0) {
      const caseIdChips = caseId.map((id) => `${id}`);
      combinedChips = [...combinedChips, ...caseIdChips];
      reduxSourcedChips = [...reduxSourcedChips, ...caseIdChips];
    }

    // Add file types
    if (Array.isArray(fileType) && fileType.length > 0) {
      combinedChips = [...combinedChips, ...fileType];
      reduxSourcedChips = [...reduxSourcedChips, ...fileType];
    } else if (isValid(fileType)) {
      combinedChips.push(fileType);
      reduxSourcedChips.push(fileType);
    }

    // Add date range chip
    const dateRangeChip = createDateRangeChip(startTime, endTime);
    if (dateRangeChip) {
      combinedChips.push(dateRangeChip);
      reduxSourcedChips.push(dateRangeChip);
    }

    console.log("Combined Chips:", combinedChips);
    console.log("Redux Sourced Chips (Yellow):", reduxSourcedChips);
    
    setSearchChips(combinedChips);
    setReduxChips(reduxSourcedChips);

  }, [keywords, caseId, fileType, startTime, endTime]);

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const exitClick = () => {
    navigate('/cases')
  }

  console.log("Keywords search:", searchChips);
  const filteredChips = searchChips.filter((chip) =>
    (typeof chip === "string" && chip.toLowerCase().includes(inputValue.toLowerCase())) ||
    (typeof chip === "number" && chip.toString().includes(inputValue))
  );
  console.log("filteredChips", filteredChips)

  // Add new chip when "Enter" is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChip = inputValue.trim();
      if (!searchChips.find((chip) => chip === newChip)) {
        setSearchChips((prev) => [...prev, newChip]);
        setEnterInput((prev) => [...prev, newChip]);
      }
      setInputValue("");
    }
  };

  const removeChip = (chipToRemove) => {
    const updatedChips = searchChips.filter((chip) => chip !== chipToRemove);
    setSearchChips(updatedChips);
    
    // Remove from enterInput if it was user's entered chip
    setEnterInput((prev) => prev.filter((chip) => chip !== chipToRemove));
    
    // Remove from reduxChips if it was a redux chip
    setReduxChips((prev) => prev.filter((chip) => chip !== chipToRemove));
  };

  const resetSearch = () => {
    dispatch(clearCriteria());
    setSearchChips([]);
    setInputValue('');
    setEnterInput([]);
    setReduxChips([]);
  };

  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    console.log("enterInput:", enterInput);
    console.log("searchChips:", searchChips);

    try {
      // Parse Redux data
      const reduxKeywords = Array.isArray(reduxPayload.keyword)
        ? reduxPayload.keyword
        : JSON.parse(reduxPayload.keyword || "[]");
      console.log("reduxKeyword", reduxKeywords)

      const userKeywords = Array.isArray(enterInput)
        ? enterInput
        : JSON.parse(enterInput || "[]");

      console.log("userKeyword", userKeywords)
      
      // Filter keywords from searchChips
      const allPossibleKeywords = [...reduxKeywords, ...userKeywords];
      console.log("allPossibleKeywords", allPossibleKeywords)
      const finalKeywords = searchChips.filter((chip) => 
        allPossibleKeywords.includes(chip) && 
        !chip.includes(' to ') && // Exclude date range chips
        !chip.includes('From ') && 
        !chip.includes('Until ')
      );
      console.log("finalKeywords", finalKeywords)

      // Parse case IDs and file types
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");
      
      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)
      
      const finalCaseIds = searchChips.filter((chip) => reduxCaseIds.includes(chip));
      const finalFileTypes = searchChips.filter((chip) => reduxFileTypes.includes(chip));
      console.log("finalCaseId or finalFileType", finalCaseIds, finalFileTypes)

      const payload = {
        keyword: finalKeywords,
        case_id: finalCaseIds,
        file_type: finalFileTypes,
        page: reduxPayload.page || 1,
        start_time: reduxPayload.start_time || null,
        end_time: reduxPayload.end_time || null,
        latitude: reduxPayload.latitude || null,
        longitude: reduxPayload.longitude || null
      };
      console.log("Sending search query:", payload);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log("Search results------:", response);

      // Redux store update
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      dispatch(setKeywords({
        keyword: response.data.input.keyword,
        queryPayload: response.data.input
      }));
      
      handleComponentToggle("list")
      dispatch(setPage(1));

    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <div className="search-container" style={{ backgroundColor: '#080E17', height: '100%', zIndex: '1050', overflowY: "hidden" }}>
      <div className={styles.actionIconsContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
        <div className={styles.searchHeader} style={{ width: '60%', backgroundColor: '#080E17' }}>
          <TextField
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: '#0073CF' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon style={{ cursor: 'pointer', color: '#0073CF', marginRight: '5px' }} onClick={handleSearch} />
                  <TuneIcon onClick={openPopup} style={{ cursor: 'pointer', backgroundColor: "#0073CF", color: '#0A192F' }} />
                </InputAdornment>
              ), 
              style: {
                height: '38px',
                padding: '0 8px',
                backgroundColor: "#101D2B",
                borderRadius: "15px",
                color: 'white',
                fontSize: "12px",
                marginBottom: "5px",
              },
            }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search..."
            sx={sharedSxStyles}
          />
          <div style={{ padding: '0px 0px', height: '20px', marginLeft: "5px" }}>
            <AppButton children={"Reset"} onClick={resetSearch} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <PieChart
            sx={{ fontSize: 40 }}
            className={`${styles.icon} ${activeComponent === "graph" ? styles.activeIcon : ""}`}
            onClick={() => handleComponentToggle("graph")}
          />
          <FaPhotoVideo
            sx={{ fontSize: 40 }}
            className={`${styles.icon} ${activeComponent === "photoVideo" ? styles.activeIcon : ""}`}
            onClick={() => handleComponentToggle("photoVideo")}
          />
          <ListAltOutlined
            sx={{ fontSize: 40 }}
            className={`${styles.icon} ${activeComponent === "list" ? styles.activeIcon : ""}`}
            onClick={() => handleComponentToggle("list")}
          />
        </div>
      </div>
      
      <div className="search-term-indicator" style={{ backgroundColor: '#080E17' }}>
        <div className="chips-container">
          {filteredChips && filteredChips.map((chip, index) => {
            const isReduxChip = reduxChips.includes(chip);
            return (
              <div 
                key={index} 
                className="search-chip"
                style={{
                  backgroundColor: isReduxChip ? '#FFC107' : '#0073CF', // Yellow for Redux chips, blue for user chips
                  color: isReduxChip ? '#000' : '#fff',
                  border: isReduxChip ? '1px solid #FFA000' : '1px solid #0073CF'
                }}
              >
                <span>{chip}</span>
                <button 
                  className="chip-delete-btn" 
                  onClick={() => removeChip(chip)}
                  style={{
                    color: isReduxChip ? '#000' : '#fff'
                  }}
                >
                  <CloseIcon fontSize='15px' />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="search-results" style={{ backgroundColor: "#101D2B" }}>
        {activeComponent === "graph" && (
          <GrapghicalCriteria searchChips={searchChips} />
        )}
        {activeComponent === "photoVideo" && (
          <ScrollCriteriaViewer />
        )}
        {activeComponent === "list" && (
          <CriteriaCaseTable searchChips={searchChips} />
        )}
      </div>

      {isPopupVisible && <AddNewCriteria searchChips={searchChips} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}
    </div>
  );
};

export default SearchResults;