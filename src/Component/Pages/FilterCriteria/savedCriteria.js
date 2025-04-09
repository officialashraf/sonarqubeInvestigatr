
import React, { useEffect, useState } from 'react';
import './savedCriteria.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CreateCriteria, { sharedSxStyles } from "./createCriteria";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import RecentCriteria from './recentCriteria';
import { useSelector, useDispatch } from "react-redux";
import { closePopup, openPopup, setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const SavedCriteria = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activePopup = useSelector((state) => state.popup.activePopup);

  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searchResult", searchResults, totalPages, currentPage, totalResults);
  
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  const [activeTab, setActiveTab] = useState('Cases');
  const [isLoading, setIsLoading] = useState(false);
  
  const keywords = useSelector((state) => state.criteriaKeywords);
  const [formData, setFormData] = useState({
    searchQuery: '',
  });

  const displayResults = searchResults 
  

  console.log("searchChips", searchChips);
  
  useEffect(() => {
    let combinedChips = '';
    if (keywords?.keywords && Array.isArray(keywords.keywords)) {
      combinedChips = keywords.keywords;
      console.log("combinedChips", combinedChips);
    }
    setSearchChips(combinedChips);
  }, [keywords]);

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
  };

  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
  };

  const Token = Cookies.get('accessToken');
  
  // Main search function to call API
  const handleSearch = async () => {
    if (searchChips.length === 0 && !inputValue.trim()) {
      toast.warning("Please enter a search term");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // If there's input in the search field that hasn't been added as a chip yet,
      // include it in the search query
      const searchTerms = [...searchChips];
      if (inputValue.trim()) {
        searchTerms.push(inputValue.trim());
      }
      
      const payload = {
        keyword: searchTerms,
        case_id: [],
        file_type: [],
        page: 1
      };
      
      console.log("Sending search query:", payload);
      
      const response = await axios.post(
        'http://5.180.148.40:9006/api/das/search', 
        payload, // Send the payload directly, not wrapped in an object
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );
      
      console.log("Search results:", response.data);
      
      // Dispatch the search results to the Redux store
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));
      dispatch(setKeywords(response.data.input.keyword));
      dispatch(setPage(1));
      
      // Clear input field after search
      setInputValue('');
      
      // Show success toast
      toast.success("Search completed successfully");
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error("Search failed. Please try again.");
    } finally {
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
                        style={{cursor: isLoading ? 'default' : 'pointer'}} 
                        onClick={isLoading ? null : handleSearch}
                      />
                      <TuneIcon 
                        style={{cursor:'pointer'}} 
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
              />
            </div>
            <div>
              <div className="search-term-indicator">
                <div className="chips-container">
                  {searchChips.map((chip, index) => (
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
                  onClick={() => setActiveTab('Cases')}
                >
                  Cases ({totalResults || 0})
                </div>
              </div>

              <div className="search-results">
                {isLoading ? (
                  <div className="card-subtext">Loading results...</div>
                ) : resultsToDisplay.length > 0 ? (
                  resultsToDisplay.slice(-5).map((item, index) => (
                    <div key={index} className="result-card">
                      <div className="card-header">
                        <div className="card-id">{item.unified_case_id?.join(", ") || "N/A"}</div>
                        <div className="status-badge">{item.status || 'NEW'}</div>
                      </div>
                      <div className="card-text">{item.site_keywordsmatched  || "N/A"}</div>
                      <div className="card-subtext">{item.unified_type || "N/A"}</div>
                      {/* <div className="card-subtext">{item.unified_type || "N/A"}</div> */}
                    </div>
                  ))
                ) : (
                  <div className="card-subtext">❌ No Matched Data</div>
                )}
                <button className="add-btn" style={{marginLeft:'0px'}} onClick={ViewScreen}>
                  VIEW ALL RESULTS IN FULL SCREEN
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