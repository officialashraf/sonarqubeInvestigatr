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
import SearchUIContainer from '../../../Common/SearchBarCriteria/SearchUIContainer';

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

  const sentiments = useSelector((state) => state.criteriaKeywords?.queryPayload?.sentiments || '');
  console.log("sentiments", sentiments)
  const targets = useSelector((state) => state.criteriaKeywords?.queryPayload?.targets || '');
  console.log("targets", targets)
  // Get start_time and end_time from Redux
  const startTime = useSelector((state) => state.criteriaKeywords?.queryPayload?.start_time || '');
  const endTime = useSelector((state) => state.criteriaKeywords?.queryPayload?.end_time || '');
  console.log("startTime", startTime, "endTime", endTime);

  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Full Redux Payload:", reduxPayload);

  const [inputValue, setInputValue] = useState('');

  // Local state for managing chips (same pattern as CaseTableDataFilter)
  const [localKeywordChips, setLocalKeywordChips] = useState([]);
  const [localCaseIdChips, setLocalCaseIdChips] = useState([]);
  const [localFileTypeChips, setLocalFileTypeChips] = useState([]);
  const [localSentimentChips, setLocalSentimentChips] = useState([]);
  const [localTargetChips, setLocalTargetChips] = useState([]);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [localEndTime, setLocalEndTime] = useState(null);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState('graph');

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

  // Sync local state with Redux state (for display purposes only)
  useEffect(() => {
    console.log("Keywords object:", keywords);
    console.log("Case ID:", caseId);
    console.log("File Type:", fileType);
    console.log("Start Time:", startTime);
    console.log("End Time:", endTime);

    // Update local state from Redux
    setLocalKeywordChips(Array.isArray(keywords) ? [...keywords] : []);
    setLocalCaseIdChips(Array.isArray(caseId) ? [...caseId] : []);
    setLocalFileTypeChips(Array.isArray(fileType) ? [...fileType] : []);
    setLocalSentimentChips(Array.isArray(sentiments) ? [...sentiments] : []);
    setLocalTargetChips(Array.isArray(targets) ? [...targets] : []);
    setLocalStartTime(startTime);
    setLocalEndTime(endTime);

  }, [keywords, caseId, fileType, startTime, endTime, sentiments, targets]);

  // Generate display chips from local state
  const getDisplayChips = () => {
    const chips = [];

    // Add all local chips
    chips.push(...localKeywordChips);
    chips.push(...localCaseIdChips);
    chips.push(...localFileTypeChips);
    chips.push(...localSentimentChips);
    chips.push(...localTargetChips);

    // Add time range chip if both exist
    const dateRangeChip = createDateRangeChip(localStartTime, localEndTime);
    if (dateRangeChip) {
      chips.push(dateRangeChip);
    }

    return [...new Set(chips)]; // Remove duplicates
  };

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const displayChips = getDisplayChips();
  console.log("Display chips:", displayChips);

  const filteredChips = displayChips.filter((chip) =>
    (typeof chip === "string" && chip.toLowerCase().includes(inputValue.toLowerCase())) ||
    (typeof chip === "number" && chip.toString().includes(inputValue))
  );
  console.log("filteredChips", filteredChips)

  // Add new chip when "Enter" is pressed (only to local keywords)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChip = inputValue.trim();

      // Check if already exists in keyword chips only
      if (localKeywordChips.includes(newChip)) {
        setInputValue("");
        return;
      }

      // Everything from search bar goes to keywords only
      setLocalKeywordChips(prev => [...prev, newChip]);
      setInputValue("");
    }
  };

  // Remove chip from local state only (same as CaseTableDataFilter)
  const removeChip = (chipToRemove) => {
    // Handle date range chips
    if (chipToRemove.includes(' to ')) {
      setLocalStartTime(null);
      setLocalEndTime(null);
      return;
    }

    // Remove from appropriate local array
    setLocalKeywordChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalCaseIdChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalFileTypeChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalSentimentChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalTargetChips(prev => prev.filter(chip => chip !== chipToRemove));
  };

  const resetSearch = () => {
    // Clear both local state and Redux
    setLocalKeywordChips([]);
    setLocalCaseIdChips([]);
    setLocalFileTypeChips([]);
    setLocalSentimentChips([]);
    setLocalTargetChips([]);
    setLocalStartTime(null);
    setLocalEndTime(null);
    setInputValue('');

    dispatch(clearCriteria());
  };

  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    console.log("localKeywordChips:", localKeywordChips);

    try {
      // Use local state for search instead of Redux
      const finalKeywords = localKeywordChips.filter((chip) =>
        !chip.includes(' to ')  // Exclude date range chips
      );
      console.log("finalKeywords", finalKeywords)

      const payload = {
        keyword: finalKeywords,
        case_id: localCaseIdChips,
        file_type: localFileTypeChips,
        sentiments: localSentimentChips,
        targets: localTargetChips,
        page: reduxPayload.page || 1,
        start_time: localStartTime || null,
        end_time: localEndTime || null,
        latitude: reduxPayload.latitude || null,
        longitude: reduxPayload.longitude || null
      };
      console.log("Sending search query:", payload);
      const isValid = (v) =>
        Array.isArray(v) ? v.length > 0 :
          typeof v === 'string' ? v.trim() !== '' :
            v !== null && v !== undefined;

      const filteredPayload = {};
      Object.entries(payload).forEach(([key, value]) => {
        if (isValid(value)) {
          filteredPayload[key] = value;
        }
      });

      const paginatedQuery = {
        ...filteredPayload
      };

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        paginatedQuery,
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

      // handleComponentToggle("list")
      dispatch(setPage(1));

    } catch (error) {
      console.error("Error performing search:", error);
    }
  };

  return (
    <SearchUIContainer
      inputValue={inputValue}
      setInputValue={setInputValue}
      handleSearch={handleSearch}
      handleKeyPress={handleKeyPress}
      resetSearch={resetSearch}
      activeComponent={activeComponent}
      setActiveComponent={handleComponentToggle}
      displayChips={filteredChips}
      chipCheckFunctions={[
        (chip) => localCaseIdChips.includes(chip),
        (chip) => localFileTypeChips.includes(chip),
        (chip) => localSentimentChips.includes(chip),
        (chip) => localTargetChips.includes(chip),
        (chip) => chip.includes(' to ')
      ]}
      removeChip={removeChip}
      PopupComponent={AddNewCriteria}
      isPopupVisible={isPopupVisible}
      setIsPopupVisible={setIsPopupVisible}
      componentsMap={{
        graph: { icon: PieChart, component: <GrapghicalCriteria searchChips={displayChips} /> },
        photoVideo: { icon: FaPhotoVideo, component: <ScrollCriteriaViewer /> },
        list: { icon: ListAltOutlined, component: <CriteriaCaseTable searchChips={displayChips} /> },
      }}
    />

    // <div className="search-container" style={{ backgroundColor: '#080E17', height: '100%', zIndex: '1050', overflowY: "hidden" }}>
    //   <div className={styles.actionIconsContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
    //     <div className={styles.searchHeader} style={{ width: '60%', backgroundColor: '#080E17' }}>
    //       <TextField
    //         fullWidth
    //         InputProps={{
    //           startAdornment: (
    //             <InputAdornment position="start">
    //               <SearchIcon style={{ color: '#0073CF' }} />
    //             </InputAdornment>
    //           ),
    //           endAdornment: (
    //             <InputAdornment position="end">
    //               <SendIcon style={{ cursor: 'pointer', color: '#0073CF', marginRight: '5px' }} onClick={handleSearch} />
    //               <TuneIcon onClick={openPopup} style={{ cursor: 'pointer', backgroundColor: "#0073CF", color: '#0A192F' }} />
    //             </InputAdornment>
    //           ),
    //           style: {
    //             height: '38px',
    //             padding: '0 8px',
    //             backgroundColor: "#101D2B",
    //             borderRadius: "15px",
    //             color: 'white',
    //             fontSize: "12px",
    //             marginBottom: "5px",
    //           },
    //         }}
    //         type="text"
    //         value={inputValue}
    //         onChange={(e) => setInputValue(e.target.value)}
    //         onKeyPress={handleKeyPress}
    //         placeholder="Search..."
    //         sx={sharedSxStyles}
    //       />
    //       <div style={{ padding: '0px 0px', height: '20px', marginLeft: "5px" }}>
    //         <AppButton children={"Reset"} onClick={resetSearch} />
    //       </div>
    //     </div>
    //     <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
    //       <PieChart
    //         sx={{ fontSize: 40 }}
    //         className={`${styles.icon} ${activeComponent === "graph" ? styles.activeIcon : ""}`}
    //         onClick={() => handleComponentToggle("graph")}
    //       />
    //       <FaPhotoVideo
    //         sx={{ fontSize: 40 }}
    //         className={`${styles.icon} ${activeComponent === "photoVideo" ? styles.activeIcon : ""}`}
    //         onClick={() => handleComponentToggle("photoVideo")}
    //       />
    //       <ListAltOutlined
    //         sx={{ fontSize: 40 }}
    //         className={`${styles.icon} ${activeComponent === "list" ? styles.activeIcon : ""}`}
    //         onClick={() => handleComponentToggle("list")}
    //       />
    //     </div>
    //   </div>

    //   <div className="search-term-indicator" style={{ backgroundColor: '#080E17' }}>
    //     <div className="chips-container">
    //       {filteredChips && filteredChips.map((chip, index) => {
    //         // Determine chip type for styling (same logic as CaseTableDataFilter)
    //         let chipStyle = { backgroundColor: "#0073CF", color: "white" }; // Default for keywords

    //         // Check chip type for styling
    //         if (localCaseIdChips.includes(chip) ||
    //           localFileTypeChips.includes(chip) ||
    //           localSentimentChips.includes(chip) ||
    //           localTargetChips.includes(chip) ||
    //           chip.includes(' to ')) {
    //           chipStyle = { backgroundColor: "#FFD700", color: "#000" };
    //         }

    //         return (
    //           <div
    //             key={index}
    //             className="search-chip"
    //             style={{
    //               ...chipStyle,
    //               padding: "4px 8px",
    //               borderRadius: "12px",
    //               margin: "2px",
    //               display: "inline-flex",
    //               alignItems: "center",
    //               fontSize: "12px"
    //             }}
    //           >
    //             <span>{chip}</span>
    //             <button
    //               className="chip-delete-btn"
    //               onClick={() => removeChip(chip)}
    //               style={{
    //                 background: "none",
    //                 border: "none",
    //                 marginLeft: "4px",
    //                 cursor: "pointer",
    //                 color: chipStyle.color,
    //                 display: "flex",
    //                 alignItems: "center"
    //               }}
    //             >
    //               <CloseIcon style={{ fontSize: "15px" }} />
    //             </button>
    //           </div>
    //         );
    //       })}
    //     </div>
    //   </div>

    //   <div className="search-results" style={{ backgroundColor: "#101D2B" }}>
    //     {activeComponent === "graph" && (
    //       <GrapghicalCriteria searchChips={displayChips} />
    //     )}
    //     {activeComponent === "photoVideo" && (
    //       <ScrollCriteriaViewer />
    //     )}
    //     {activeComponent === "list" && (
    //       <CriteriaCaseTable searchChips={displayChips} />
    //     )}
    //   </div>

    //   {isPopupVisible && <AddNewCriteria searchChips={localKeywordChips} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}
    // </div>
  );
};

export default SearchResults;

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