import { useEffect, useState } from 'react';
import './savedCriteriaGlobal.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { sharedSxStyles } from "./createCriteria";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { clearCriteria, closePopup, openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../Layout/loader';
import { toast } from 'react-toastify';
import { useAutoFocusWithManualAutofill } from '../../../utils/autoFocus';
import AddButton from '../../Common/Buttton/button';
import SearchBar from '../../Common/SearchBarCriteria/Searchbar';
import styles from '../../Common/Table/table.module.css'


const SavedCriteria = () => {
 const navigate = useNavigate();
  const dispatch = useDispatch();
  const Token = Cookies.get('accessToken');
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const activePopup = useSelector((state) => state.popup.activePopup);

  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searchResult", searchResults, totalPages, currentPage, totalResults);

  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  // const [activeTab, setActiveTab] = useState('Cases');
  const [isLoading, setIsLoading] = useState(false);
  const [enterInput, setEnterInput] = useState([]);


  const caseId = useSelector((state) => state.criteriaKeywords?.queryPayload?.case_id || '');
  console.log("casId", caseId)
  const fileType = useSelector((state) => state.criteriaKeywords?.queryPayload?.file_type || '');
  console.log("filetype", fileType)
  const keyword = useSelector((state) => state.criteriaKeywords?.queryPayload?.keyword || '');
  console.log("keyword", keyword)
   const sentiments = useSelector((state) => state.criteriaKeywords?.queryPayload?.sentiments || '');
  console.log("keyword", sentiments)
   const targets = useSelector((state) => state.criteriaKeywords?.queryPayload?.targets || '');
  console.log("keyword", targets)
  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Redux Payload:", reduxPayload);

  // Function to check if chip is from Redux data
  const isReduxChip = (chip) => {
    const reduxKeywords = Array.isArray(keyword) ? keyword : [];
    const reduxCaseIds = Array.isArray(caseId) ? caseId.map(id => String(id)) : [];
    const reduxFileTypes = Array.isArray(fileType) ? fileType : [];
    const reduxSentiments = Array.isArray(sentiments) ? sentiments : [];
    const reduxTargets = Array.isArray(targets) ? targets : [];
    
    return [...reduxKeywords, ...reduxCaseIds, ...reduxFileTypes, ...reduxSentiments, ...reduxTargets].includes(chip);
  };

  useEffect(() => {
    console.log("Case ID:", caseId);
    console.log("File Type:", fileType);

    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    if (keyword && Array.isArray(keyword)) {
      let combinedChips = [...keyword];

      if (Array.isArray(caseId) && caseId.every(id => (typeof id === "number" || typeof id === "string"))) {
        combinedChips = [...combinedChips, ...caseId.map((id) => `${id}`)];
      }
 if (Array.isArray(targets) && targets.length > 0) {
        combinedChips = [...combinedChips, ...targets];
      }
       if (Array.isArray(sentiments) && sentiments.length > 0) {
        combinedChips = [...combinedChips, ...sentiments];
      }
      // Check if fileType is an array and merge its values
      if (Array.isArray(fileType) && fileType.length > 0) {
        combinedChips = [...combinedChips, ...fileType];
      } else if (isValid(fileType)) {
        combinedChips.push(fileType); // Add fileType if it's a valid single value
      }
      console.log("Combined Chips:", combinedChips);
      setSearchChips(combinedChips);
    } else {
      console.log("Keywords is not an array or doesn't exist.");
      setSearchChips([]); // Fallback for empty or invalid data
    }
  }, [keyword, caseId, fileType]);

  const displayResults = searchResults
  console.log("searchChips", searchChips);

  // Filter results based on user input
  const filterResults = (chips, query) => {
    if (!chips.length && !query) {
      return displayResults; // Show full list if no filters
    }

    const lowerQuery = query.toLowerCase();
    return displayResults.filter((item) =>
      chips.some((chip) => matchesSearch(item, chip)) || matchesSearch(item, lowerQuery)
    );
  };

  // Get filtered results based on current search chips and input
  const getFilteredResults = () => {
    if (!displayResults || displayResults.length === 0) {
      return [];
    }
    return filterResults(searchChips, inputValue);
  };

  // Checks if ANY field matches the search query
  const matchesSearch = (item, query) => {
    if (!item) return false;
    const lowerQuery = String(query).toLowerCase();
    return (
      (item.unified_case_id && item.unified_case_id.join(", ").toLowerCase().includes(lowerQuery)) ||
      (item.status && item.status.toLowerCase().includes(lowerQuery)) ||
      (item.site_keywordsmatched && item.site_keywordsmatched.toLowerCase().includes(lowerQuery)) ||
      (item.unified_activity_title && item.unified_activity_title.toLowerCase().includes(lowerQuery)) ||
      (item.unified_type && item.unified_type.toLowerCase().includes(lowerQuery))
    );
  };

  if (activePopup !== "saved") return null;

  // Handle Enter key press (convert input to chip)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!searchChips.includes(inputValue.trim())) {
        const updatedChips = [...searchChips, inputValue.trim()];
        setSearchChips(updatedChips);
        setEnterInput(prev => [...prev, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
  };

  // Remove a chip
  const removeChip = (chip) => {
    const updatedChips = searchChips.filter((item) => item !== chip);
    setSearchChips(updatedChips);
    setEnterInput((prev) => prev.filter((exchip) => exchip !== chip));
  };

  // Updated reset function without API call
  const resetSearch = () => {
    // Check if there's any data to reset
    const hasData = searchChips.length > 0 || Object.keys(reduxPayload).length > 0;
    
    if (!hasData) {
      toast.info("Data not available");
      return;
    }

    // Clear local state only
    dispatch(clearCriteria());
    setSearchChips([]);
    setInputValue('');
    setEnterInput([]);
    
    toast.success("Search reset successfully");
  };

  // Main search function to call API
  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    setIsLoading(true);
    const hasKeywords = keyword.length > 0;
const hasReduxData = Object.keys(reduxPayload).length > 0;

if (!hasKeywords && !hasReduxData) {
  toast.info("Please enter keywords or select criteria to search");
  return;
}
    try {
      setIsLoading(true);
      
      // 1. Redux ke keywords
      const reduxKeywords = Array.isArray(reduxPayload.keyword)
        ? reduxPayload.keyword
        : JSON.parse(reduxPayload.keyword || "[]");
      console.log("reduxKeyword", reduxKeywords)

      // 2. User ke enter kiye gaye keywords (search bar se)
      const userKeywords = Array.isArray(enterInput)
        ? enterInput
        : JSON.parse(enterInput || "[]");
      console.log("userKeyword", userKeywords)

      // 🔥 All keywords (Redux + User entered) will be passed as keywords to API
      const allKeywords = [...reduxKeywords, ...userKeywords];
      console.log("allKeywords to be sent:", allKeywords)

      // 3. case_id aur file_type separately treat honge (sirf Redux se)
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");
        
      const reduxSentiments = Array.isArray(reduxPayload.sentiments)
        ? reduxPayload.sentiments
        : JSON.parse(reduxPayload.sentiments || "[]");
        
      const reduxTargets = Array.isArray(reduxPayload.targets)
        ? reduxPayload.targets
        : JSON.parse(reduxPayload.targets || "[]");

      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)

      const payload = {
        keyword: allKeywords,        // All keywords (Redux + User entered)
        case_id: reduxCaseIds,       // Only Redux case_ids
        file_type: reduxFileTypes,   // Only Redux file_types
        page: reduxPayload.page || 1,
        sentiments: reduxPayload.sentiments || null,
        targets: reduxPayload.targets || null,
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
            'Authorization': `Bearer ${Token}`
          }
        }
      );
      console.log("Search results------:", response);

      setIsLoading(false);
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

      dispatch(setPage(1));
      // dispatch(openPopup("saved"));
    } catch (error) {
      console.error("Error performing search:", error.message);
    }
  };

  const ViewScreen = () => {
    navigate('/search');
    dispatch(closePopup());
  };

  // Get the filtered results to display
  const resultsToDisplay = getFilteredResults();

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button> */}
        <div className="popup-content">
          <h5>Search Result <span> <button className="close-icon" onClick={() => dispatch(closePopup())}>
            &times;
          </button></span></h5>
          <div>
            <div style={{marginBottom: '10px'}}>
              <TextField
                fullWidth
                InputProps={{

                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: '#0073cf'}}/>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon
                        style={{ cursor: isLoading ? 'default' : 'pointer', color: '#0073cf',marginRight:'5px' }}
                        onClick={isLoading ? null : handleSearch}
                      />
                      <TuneIcon
                        style={{ cursor: 'pointer', color: '#0073cf' }}
                        onClick={() => dispatch(openPopup("create"))}
                      />
                    </InputAdornment>
                  ),
                  style: {
                    height: '38px',
                    padding: '10px',
                    color: 'white',
                    border: '1px solid #0073CF',
                    borderRadius: '15px',
                  },
                }}
                inputProps={{
                  style: {
                    padding: '0px',            
                  },
                }}
                className={styles.searchBar}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                autoComplete="off"
                sx={sharedSxStyles}
                // disabled={isLoading}
              />
            </div>

            {/* <SearchBar
              inputValue={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onSearchClick={handleSearch}
              onTuneClick={() => dispatch(openPopup('create'))}
              isLoading={isLoading}
              isReadOnly={false}
              inputRef={inputRef}
              onFocus={handleFocus}
              autoComplete="off"
            /> */}
            <div>
              <div className="search-term-indicator">
                <div className="chips-container">
                  {searchChips && searchChips.map((chip, index) => (
                    <div 
                      key={index} 
                      className={`search-chip ${isReduxChip(chip) ? 'redux-chip' : ''}`}
                      style={{
                        backgroundColor: isReduxChip(chip) ? '#ffd700' : '', // Yellow color for Redux chips
                        color: isReduxChip(chip) ? '#000' : '', // Black text for better contrast on yellow
                      }}
                    >
                      <span>{chip}</span>
                      <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                        <CloseIcon fontSize='15px' />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="action-buttons">
                  <button 
                    className="action-button" 
                    onClick={resetSearch}
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="tabs">
                <div
                  className={`tab active`}
                // onClick={() => setActiveTab('Cases')}
                      style={{backgroundColor:"#101D2B"}}
                >
                  Cases ({totalResults || 0})
            
                </div>
              </div>

              <div className="search-results">
                {isLoading ? (
                  <Loader />
                ) : resultsToDisplay.length > 0 ? (
                  resultsToDisplay.slice(-5).map((item, index) => (
                    <div key={index} className="result-card">
                     
                        <div className="card-id">{item.unified_case_id?.join(", ") || "N/A"}</div>
                      <div className="card-header">
                        <div className="card-text">{item.site_keywordsmatched || "N/A"}</div>
                        <div className="status-badge">{item.status || 'NEW'}</div>
                      </div>
                      <div className="card-subtext">{item.unified_type || "N/A"}</div>
                      {/* <div className="card-subtext">{item.unified_type || "N/A"}</div> */}
                    </div>
                  ))
                ) : (
                  <div className="card-subtext">❌ No Matched Data</div>
                )}
                <AddButton style={{ marginLeft: '0px' }} onClick={ViewScreen}>
                  View All Results In Full Screen
                </AddButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCriteria;