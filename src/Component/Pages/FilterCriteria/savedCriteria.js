import { useEffect, useState } from 'react';
import './savedCriteria.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { sharedSxStyles } from "./createCriteria";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { closePopup, openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../Layout/loader';
import { toast } from 'react-toastify';
import { useAutoFocusWithManualAutofill } from '../../../utils/autoFocus';


const SavedCriteria = () => {
  const Token = Cookies.get('accessToken');
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Redux Payload:", reduxPayload);

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

  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
  };

  // Main search function to call API
  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    setIsLoading(true);
    try {
      // console.log("gsdhgfshgdf", searchChips, keyword)
      // if (searchChips.length === 0 && keyword.length === 0 && enterInput.length===0) {
      //   console.log("Both searchChips and keyword are empty");
      //   toast.error("Please enter at least one keyword to search");
      //   return;
      // }
      setIsLoading(true);
      // 1. Redux ke sirf keyword le rahe hain
      const reduxKeywords = Array.isArray(reduxPayload.keyword)
        ? reduxPayload.keyword
        : JSON.parse(reduxPayload.keyword || "[]");
      console.log("reduxKeyword", reduxKeywords)

      const userKeywords = Array.isArray(enterInput)
        ? enterInput
        : JSON.parse(enterInput || "[]");

      console.log("userKeyword", userKeywords)
      // 🔥 Keywords only: searchChips se wo elements jo redux keywords ya user keywords me hain
      const allPossibleKeywords = [...reduxKeywords, ...userKeywords];
      console.log("alllProgresskeyword", allPossibleKeywords)
      const finalKeywords = searchChips.filter((chip) => allPossibleKeywords.includes(chip));
      console.log("finalkeywords", finalKeywords)
      // 2. case_id aur file_type separately treat honge
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");
      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)
      const finalCaseIds = searchChips.filter((chip) => reduxCaseIds.includes(chip));
      const finalFileTypes = searchChips.filter((chip) => reduxFileTypes.includes(chip));
      console.log("finalcaseid or finalfiletype", finalCaseIds, finalFileTypes)

      const payload = {
        keyword: finalKeywords,   // Only keywords
        case_id: finalCaseIds,    // Only case_ids
        file_type: finalFileTypes,// Only file_types
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
        <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Search Result</h5>
          <div className="search-container">
            <div className="search-header">
              <TextField
                fullWidth
                className="com mb-3"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon
                        style={{ cursor: isLoading ? 'default' : 'pointer' }}
                        onClick={isLoading ? null : handleSearch}
                      />
                      <TuneIcon
                        style={{ cursor: 'pointer' }}
                        onClick={() => dispatch(openPopup("create"))}
                      />
                    </InputAdornment>
                  ),
                  style: {
                    height: '38px',
                    padding: '0 8px',
                  },
                }}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Search..."
                sx={sharedSxStyles}
                disabled={isLoading}
                readOnly={isReadOnly}
                onFocus={handleFocus}
                ref={inputRef}
              />
            </div>
            <div>
              <div className="search-term-indicator">
                <div className="chips-container">
                  {searchChips && searchChips.map((chip, index) => (
                    <div key={index} className="search-chip">
                      <span>{chip}</span>
                      <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                        <CloseIcon fontSize='15px' />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="action-buttons">
                  <button className="action-button" onClick={resetSearch}>RESET</button>
                </div>
              </div>

              <div className="tabs">
                <div
                  className={`tab active`}
                // onClick={() => setActiveTab('Cases')}
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
                      <div className="card-header">
                        <div className="card-id">{item.unified_case_id?.join(", ") || "N/A"}</div>
                        <div className="status-badge">{item.status || 'NEW'}</div>
                      </div>
                      <div className="card-text">{item.site_keywordsmatched || "N/A"}</div>
                      <div className="card-subtext">{item.unified_type || "N/A"}</div>
                      {/* <div className="card-subtext">{item.unified_type || "N/A"}</div> */}
                    </div>
                  ))
                ) : (
                  <div className="card-subtext">❌ No Matched Data</div>
                )}
                <button className="add-btn" style={{ marginLeft: '0px' }} onClick={ViewScreen}>
                  View All Results In Full Screen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedCriteria;