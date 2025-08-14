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
  const [isLoading, setIsLoading] = useState(false);

  // Local state for managing chips (same as RecentCriteria and SearchResults)
  const [localKeywordChips, setLocalKeywordChips] = useState([]);
  const [localCaseIdChips, setLocalCaseIdChips] = useState([]);
  const [localFileTypeChips, setLocalFileTypeChips] = useState([]);
  const [localSentimentChips, setLocalSentimentChips] = useState([]);
  const [localTargetChips, setLocalTargetChips] = useState([]);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [localEndTime, setLocalEndTime] = useState(null);

  // Track which chips came from Redux vs user input
  const [reduxOriginatedChips, setReduxOriginatedChips] = useState(new Set());
  const [userInputChips, setUserInputChips] = useState(new Set());

  // Redux selectors
  const caseId = useSelector((state) => state.criteriaKeywords?.queryPayload?.case_id || '');
  console.log("casId", caseId)
  const fileType = useSelector((state) => state.criteriaKeywords?.queryPayload?.file_type || '');
  console.log("filetype", fileType)
  const keyword = useSelector((state) => state.criteriaKeywords?.queryPayload?.keyword || '');
  console.log("keyword", keyword)
  const sentiments = useSelector((state) => state.criteriaKeywords?.queryPayload?.sentiments || '');
  console.log("sentiments", sentiments)
  const targets = useSelector((state) => state.criteriaKeywords?.queryPayload?.targets || '');
  console.log("targets", targets)
  const start_time = useSelector((state) => state.criteriaKeywords?.queryPayload?.start_time || '');
  const end_time = useSelector((state) => state.criteriaKeywords?.queryPayload?.end_time || '');
  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Redux Payload:", reduxPayload);

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

  // Sync local state with Redux state and track Redux originated chips
  useEffect(() => {
    console.log("Syncing Redux to local state");
    console.log("Keywords:", keyword);
    console.log("Case ID:", caseId);
    console.log("File Type:", fileType);
    console.log("Sentiments:", sentiments);
    console.log("Targets:", targets);
    console.log("Start Time:", start_time);
    console.log("End Time:", end_time);

    const newReduxChips = new Set();

    // Update local state from Redux and track Redux originated chips
    const keywordChips = Array.isArray(keyword) ? [...keyword] : [];
    const caseIdChips = Array.isArray(caseId) ? [...caseId.map(id => String(id))] : [];
    const fileTypeChips = Array.isArray(fileType) ? [...fileType] : [];
    const sentimentChips = Array.isArray(sentiments) ? [...sentiments] : [];
    const targetChips = Array.isArray(targets) && targets.length > 0
      ? targets.map(t => ({ 
          id: t.id, 
          name: t.name, 
          value: t.value ?? t.id,
          label: t.label ?? t.name 
        }))
      : [];

    setLocalKeywordChips(keywordChips);
    setLocalCaseIdChips(caseIdChips);
    setLocalFileTypeChips(fileTypeChips);
    setLocalSentimentChips(sentimentChips);
    setLocalTargetChips(targetChips);
    setLocalStartTime(start_time);
    setLocalEndTime(end_time);

    // Track all Redux originated chips
    keywordChips.forEach(chip => newReduxChips.add(chip));
    caseIdChips.forEach(chip => newReduxChips.add(chip));
    fileTypeChips.forEach(chip => newReduxChips.add(chip));
    sentimentChips.forEach(chip => newReduxChips.add(chip));
    targetChips.forEach(t => newReduxChips.add(t.name));

    // Add date range chip if exists
    const dateRangeChip = createDateRangeChip(start_time, end_time);
    if (dateRangeChip) {
      newReduxChips.add(dateRangeChip);
    }

    setReduxOriginatedChips(newReduxChips);

  }, [keyword, caseId, fileType, sentiments, targets, start_time, end_time]);

  // Generate display chips from local state
  const getDisplayChips = () => {
    const chips = [];

    // Add all local chips
    chips.push(...localKeywordChips);
    chips.push(...localCaseIdChips);
    chips.push(...localFileTypeChips);
    chips.push(...localSentimentChips);
    chips.push(...localTargetChips.map(t => t.name)); // Show target name in chips

    // Add time range chip if both exist
    const dateRangeChip = createDateRangeChip(localStartTime, localEndTime);
    if (dateRangeChip) {
      chips.push(dateRangeChip);
    }

    return [...new Set(chips)]; // Remove duplicates
  };

  // Function to determine chip style based on origin
  const getChipStyle = (chip) => {
    // User entered chips are always blue
    if (userInputChips.has(chip)) {
      return { backgroundColor: '#0073cf', color: 'white' }; // Blue for user entered
    }
    
    // Redux originated chips are yellow
    if (reduxOriginatedChips.has(chip)) {
      return { backgroundColor: '#ffd700', color: '#000' }; // Yellow for Redux originated
    }
    
    // Default (fallback)
    return { backgroundColor: '#0073cf', color: 'white' };
  };

  const displayResults = searchResults;
  const searchChips = getDisplayChips();
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

  // Handle Enter key press - Add to local keyword chips and track as user input
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newKeyword = inputValue.trim();
      
      // Check if already exists
      if (localKeywordChips.includes(newKeyword)) {
        setInputValue("");
        return;
      }
      
      setLocalKeywordChips(prev => [...prev, newKeyword]);
      
      // Track as user input chip
      setUserInputChips(prev => new Set([...prev, newKeyword]));
      
      setInputValue("");
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
  };

  // Remove chip from local state and update tracking sets
  const removeChip = (chipToRemove) => {
    console.log("Removing chip:", chipToRemove);
    
    // Handle date range chips
    if (chipToRemove.includes(' to ')) {
      setLocalStartTime(null);
      setLocalEndTime(null);
      // Remove from tracking sets
      setReduxOriginatedChips(prev => {
        const newSet = new Set(prev);
        newSet.delete(chipToRemove);
        return newSet;
      });
      return;
    }

    // Remove from appropriate local array
    setLocalKeywordChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalCaseIdChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalFileTypeChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalSentimentChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalTargetChips(prev => prev.filter(chip => chip.name !== chipToRemove));

    // Remove from tracking sets
    setReduxOriginatedChips(prev => {
      const newSet = new Set(prev);
      newSet.delete(chipToRemove);
      return newSet;
    });
    setUserInputChips(prev => {
      const newSet = new Set(prev);
      newSet.delete(chipToRemove);
      return newSet;
    });
  };

  // Reset function - clear both local state and Redux
  const resetSearch = () => {
    // Check if there's any data to reset
    const hasLocalData = localKeywordChips.length > 0 || localCaseIdChips.length > 0 || 
                         localFileTypeChips.length > 0 || localSentimentChips.length > 0 ||
                         localTargetChips.length > 0 || localStartTime || localEndTime;
    
    const hasReduxData = Object.keys(reduxPayload).length > 0;

    if (!hasLocalData && !hasReduxData) {
      toast.info("Data not available");
      return;
    }

    // Clear both local state and Redux
    setLocalKeywordChips([]);
    setLocalCaseIdChips([]);
    setLocalFileTypeChips([]);
    setLocalSentimentChips([]);
    setLocalTargetChips([]);
    setLocalStartTime(null);
    setLocalEndTime(null);
    setInputValue('');
    
    // Clear tracking sets
    setReduxOriginatedChips(new Set());
    setUserInputChips(new Set());

    dispatch(clearCriteria());
    toast.success("Search reset successfully");
  };

  // Main search function using local state
  const handleSearch = async () => {
    console.log("Local state for search:");
    console.log("localKeywordChips:", localKeywordChips);
    console.log("localCaseIdChips:", localCaseIdChips);
    console.log("localFileTypeChips:", localFileTypeChips);
    console.log("localSentimentChips:", localSentimentChips);
    console.log("localTargetChips:", localTargetChips);

    // Check if there's any data to search using local state
    const hasLocalKeywords = localKeywordChips.length > 0;
    const hasLocalCaseIds = localCaseIdChips.length > 0;
    const hasLocalFileTypes = localFileTypeChips.length > 0;
    const hasLocalSentiments = localSentimentChips.length > 0;
    const hasLocalTargets = localTargetChips.length > 0;
    const hasLocalDates = localStartTime || localEndTime;
    
    if (!hasLocalKeywords && !hasLocalCaseIds && !hasLocalFileTypes && 
        !hasLocalSentiments && !hasLocalTargets && !hasLocalDates) {
      toast.info("Please enter keywords or select criteria to search");
      return;
    }

    setIsLoading(true);

    try {
      // Use local state for search payload
      const payload = {
        keyword: localKeywordChips,
        case_id: localCaseIdChips,
        file_type: localFileTypeChips,
        sentiments: localSentimentChips,
        targets: localTargetChips.map(t => String(t.value)), // Send value to API
        page: reduxPayload.page || 1,
        start_time: localStartTime || null,
        end_time: localEndTime || null,
        latitude: reduxPayload.latitude || null,
        longitude: reduxPayload.longitude || null
      };

      const isValid = (v) =>
        Array.isArray(v) ? v.length > 0 :
          typeof v === 'string' ? v.trim() !== '' :
            v !== null && v !== undefined;

      const filteredPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => isValid(value))
      );

      console.log("Sending search query:", filteredPayload);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        filteredPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      console.log("Search results------:", response);
      setIsLoading(false);

      // Update Redux with search results
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      // Update Redux with current local state
      dispatch(setKeywords({
        keyword: localKeywordChips,
        queryPayload: {
          case_id: localCaseIdChips,
          file_type: localFileTypeChips,
          keyword: localKeywordChips,
          targets: localTargetChips,
          sentiment: localSentimentChips,
          start_time: localStartTime,
          end_time: localEndTime,
          latitude: payload.latitude,
          longitude: payload.longitude,
          page: 1
        }
      }));

      // After successful search, mark current user input chips as Redux originated
      const currentDisplayChips = getDisplayChips();
      const newReduxChips = new Set([...reduxOriginatedChips]);
      
      // Add all current chips to Redux originated (since they're now stored in Redux)
      userInputChips.forEach(chip => {
        if (currentDisplayChips.includes(chip)) {
          newReduxChips.add(chip);
        }
      });
      
      setReduxOriginatedChips(newReduxChips);
      setUserInputChips(new Set()); // Clear user input tracking

      dispatch(setPage(1));

    } catch (error) {
      console.error("Error performing search:", error.message);
      setIsLoading(false);
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
            <div style={{ marginBottom: '10px' }}>
              <TextField
                fullWidth
                InputProps={{

                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{ color: '#0073cf' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon
                        style={{ cursor: isLoading ? 'default' : 'pointer', color: '#0073cf', marginRight: '5px' }}
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
        {searchChips && searchChips.map((chip, index) => {
                          const chipStyle = getChipStyle(chip);
                          
                          return (
                            <div 
                              key={index} 
                              className="search-chip"
                              style={{
                                ...chipStyle,
                                padding: "4px 8px",
                                borderRadius: "12px",
                                margin: "2px",
                                display: "inline-flex",
                                alignItems: "center",
                                fontSize: "12px"
                              }}
                            >
                              <span>{chip}</span>
                              <button 
                                className="chip-delete-btn" 
                                onClick={() => removeChip(chip)}
                                style={{
                                  background: "none",
                                  border: "none",
                                  marginLeft: "4px",
                                  cursor: "pointer",
                                  color: chipStyle.color,
                                  display: "flex",
                                  alignItems: "center"
                                }}
                              >
                                <CloseIcon style={{ fontSize: "15px" }} />
                              </button>
                            </div>
                          );
                        })}
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
                  style={{ backgroundColor: "#101D2B" }}
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