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

  // Updated removeChip function - only update local state, not Redux
  const removeChip = (chipToDelete) => {
    // Update only local state - Redux will be updated when user clicks Send
    const updatedChips = searchChips.filter((item) => item !== chipToDelete);
    setSearchChips(updatedChips);
    setEnterInput((prev) => prev.filter((exchip) => exchip !== chipToDelete));

    console.log("Chip removed from UI:", chipToDelete);
    console.log("Updated local chips:", updatedChips);
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

  // Main search function to call API - Now handles removed chips
  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    setIsLoading(true);

    try {
      setIsLoading(true);

      // Get current Redux data
      const reduxKeywords = Array.isArray(reduxPayload.keyword)
        ? reduxPayload.keyword
        : JSON.parse(reduxPayload.keyword || "[]");

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

      // Filter Redux data based on current searchChips (removed chips won't be included)
      const filteredKeywords = reduxKeywords.filter(kw => searchChips.includes(kw));
      const filteredCaseIds = reduxCaseIds.filter(id => searchChips.includes(String(id)));
      const filteredFileTypes = reduxFileTypes.filter(ft => searchChips.includes(ft));
      const filteredSentiments = reduxSentiments.filter(s => searchChips.includes(s));
      const filteredTargets = reduxTargets.filter(t => searchChips.includes(t));

      // Add user entered keywords
      const allKeywords = [...filteredKeywords, ...enterInput];

      // Check if there's any data to search
      const hasData = allKeywords.length > 0 || filteredCaseIds.length > 0 ||
        filteredFileTypes.length > 0 || filteredSentiments.length > 0 ||
        filteredTargets.length > 0;

      if (!hasData) {
        toast.info("Please enter keywords or select criteria to search");
        setIsLoading(false);
        return;
      }

      console.log("Filtered data for API:");
      console.log("Keywords:", allKeywords);
      console.log("Case IDs:", filteredCaseIds);
      console.log("File Types:", filteredFileTypes);
      console.log("Sentiments:", filteredSentiments);
      console.log("Targets:", filteredTargets);

      const rawPayload = {
        keyword: allKeywords,
        case_id: filteredCaseIds,
        file_type: filteredFileTypes,
        sentiments: filteredSentiments,
        targets: filteredTargets,
        page: reduxPayload.page || 1,
        start_time: reduxPayload.start_time || null,
        end_time: reduxPayload.end_time || null,
        latitude: reduxPayload.latitude || null,
        longitude: reduxPayload.longitude || null
      };

      const isValid = (v) =>
        Array.isArray(v) ? v.length > 0 :
          typeof v === 'string' ? v.trim() !== '' :
            v !== null && v !== undefined;

      const payload = Object.fromEntries(
        Object.entries(rawPayload).filter(([_, value]) => isValid(value))
      );

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

      // Update Redux with the filtered/updated data
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      // Update Redux with the actual data sent to API
      dispatch(setKeywords({
        keyword: allKeywords,
        queryPayload: response.data.input
      }));

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
                  {searchChips && searchChips.map((chip, index) => (
                    <div
                      key={index}
                      className={`search-chip ${isReduxChip(chip) ? 'redux-chip' : ''}`}
                      style={{
                        backgroundColor: isReduxChip(chip) ? '#ffd700' : '#0073CF', // Yellow for Redux, Blue for user-entered
                        color: isReduxChip(chip) ? '#000' : '#fff', // Black text for yellow, white for blue
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
                          color: isReduxChip(chip) ? '#000' : '#fff',
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <CloseIcon style={{ fontSize: "15px" }} />
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