import React, { useState } from 'react';
import './savedCriteria.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import  TuneIcon  from '@mui/icons-material/Tune';
import CreateCriteria, { sharedSxStyles } from "./createCriteria";
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import RecentCriteria from './recentCriteria';
import { useSelector, useDispatch } from "react-redux";
import { closePopup, openPopup, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import axios from 'axios'; // Import axios
import Cookies from 'js-cookie'; // Import js-cookie


const SavedCriteria = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activePopup = useSelector((state) => state.popup.activePopup);

  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searResult",searchResults, totalPages,currentPage, totalResults)
  // const savedResults = JSON.parse(localStorage.getItem('searchResults'));
  const savedResults = JSON.parse(localStorage.getItem('searchResults'))?.expiry > new Date().getTime() ? JSON.parse(localStorage.getItem('searchResults')).results : null;

console.log(savedResults);
  
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  const [activeTab, setActiveTab] = useState('Cases');
  const [filteredResults, setFilteredResults] = useState(savedResults || []);
const [savedCriteria, setSavedCriteria] = useState([]);
const [formData, setFormData] = useState({
  searchQuery: '',
  // Add other form fields as needed
});
  console.log("searchChips", searchChips);
  if (activePopup !== "saved") return null;
  

  // const handleKeyPress = (e) => {
  //   if (e.key === 'Enter' && inputValue.trim() !== '') {
  //     // Add chip and clear input
  //     if (!searchChips.includes(inputValue.trim())) {
  //       setSearchChips([...searchChips, inputValue.trim()]);
  //     }
  //     setInputValue('');
  //   }
  // };
  
  // const removeChip = (chip) => {
  //   setSearchChips(searchChips.filter(item => item !== chip));
  // };
  
  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
  };

  const Token = Cookies.get('accessToken');
  // const handleSaveCriteria = async () => {
  //   try {
  //     // Use the first chip as the keyword if available, otherwise use searchQuery
  //     const keyword = searchChips.length > 0 ? searchChips[0] : formData.searchQuery;
  
  //     const criteriaPaylod = {
  //       keyword: keyword,
  //     };
  
  //     console.log("Criteria Payload", criteriaPaylod);
  
  //     const Token = Cookies.get('accessToken'); // Ensure token is available
  
  //     const response = await axios.post('http://5.180.148.40:9006/api/das/criteria', criteriaPaylod, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${Token}`
  //       },
  //     });
  
  //     // Update local state with the new saved criteria
  //     setSavedCriteria(prevCriteria => [...prevCriteria, response.data]);
  
  //     // Clear search chips after saving
  //     setSearchChips([]);
  
  //     // Show success toast
  //     toast.success("Criteria saved successfully");
      
  //     console.log('Criteria saved successfully:', response.data);
  
  //     // Optional: Close the create popup or perform any additional actions
  //     dispatch(closePopup());
  //     dispatch(openPopup("recent"))
  
  //   } catch (error) {
  //     console.error('Error saving criteria:', error);
      
  //     // Show error toast
  //     toast.error("Failed to save criteria");
  //   }
  // };
  // Handle Enter key press (convert input to chip)
  const filterResults = (chips, query) => {
    if (!chips.length && !query) {
      setFilteredResults(savedResults); // Show full list if no filters
      return;
    }

    const lowerQuery = query.toLowerCase();

    const filtered = savedResults.filter((item) =>
      chips.some((chip) => matchesSearch(item, chip)) || matchesSearch(item, lowerQuery)
    );

    setFilteredResults(filtered.length > 0 ? filtered : []); // No match condition
  };

  // ✅ Checks if ANY field matches the search query
  const matchesSearch = (item, query) => {
    return (
      item?.unified_case_id?.join(", ").toLowerCase().includes(query) ||  // Match ID
      item?.status?.toLowerCase().includes(query) ||  // Match Status
      item?.site_keywordsmatched?.toLowerCase().includes(query) ||  // Match Keywords
      item?.unified_activity_title?.toLowerCase().includes(query) ||  // Match Title
      item?.unified_type?.toLowerCase().includes(query)  // Match Type
    );
  };

  // ✅ Handle Enter key press (convert input to chip)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!searchChips.includes(inputValue.trim())) {
        const updatedChips = [...searchChips, inputValue.trim()];
        setSearchChips(updatedChips);
        filterResults(updatedChips, inputValue);
      }
      setInputValue("");
    }
  };

  // ✅ Handle input change & filter results
  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    filterResults(searchChips, query);
  };

  // ✅ Remove a chip and update filtering
  const removeChip = (chip) => {
    const updatedChips = searchChips.filter((item) => item !== chip);
    setSearchChips(updatedChips);
    filterResults(updatedChips, inputValue);
  };
  const handleSearch = async () => {
    // if (keywords || keywords.length === 0) {
    //   console.error("No keywords selected!", searchQuery);
    //   return;
    // }
  
    try {
      const queryObj = {
        keyword:searchChips, // Pass the array of keywords directly
      };
  
      console.log("Sending search query:", searchChips);
 
      const response = await axios.post('http://5.180.148.40:9006/api/das/search', {
        queryObj
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        }
      });
  
      console.log("Search results:", response.data);
  
      // Dispatch the search results to the store
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results:response.data.total_results || 0,
      }));
   dispatch(setPage(1));
      // Store the results locally
      localStorage.setItem('searchResults', JSON.stringify({
        results: response.data.results,
        expiry: new Date().getTime() + 24 * 60 * 60 * 1000 // Store for 24 hours
      }));
  
      // Clear selected chips
      setFormData(prev => ({
        ...prev,
        searchQuery: [] // Clear the chips array after successful search
      })
    
    );
//  dispatch(openPopup("saved"));
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
  const ViewScreen = () => {
    navigate('/search' );
    dispatch(closePopup())
    }

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
        {/* <div className="search-input-container"> */}
          {/* <span className="search-icon">
           <SearchIcon/>
          </span>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="search-input"
            placeholder="Search..."
          />
       
        <button className="icon-button">
         <FilterListIcon/>
        </button> */}

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
               
                     <SendIcon style={{cursor:'pointer'}} onClick={handleSearch}/>
                  <TuneIcon  style={{cursor:'pointer'}} onClick={() => dispatch(openPopup("create"))}/> {/* New Card List Filter Icon */}
               
                                            </InputAdornment>
                                        ), style: {
                                            height: '38px', // Use consistent height
                                            padding: '0 8px', // Ensure uniform padding
            
                                          },
                                    }}
                                    type="text" 
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search..."
                                    sx={sharedSxStyles}
                                />
       {/* </div> */}
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
    className={`tab active`} // "Cases" will always be active
    onClick={() => setActiveTab('Cases')}
  >
    Cases ({totalResults || "no results"})
  </div>
</div>

<div className="search-results">
{filteredResults.length > 0 ? (
          filteredResults.slice(-5).map((item) => ( //Only show the latest 5 results
    <div key={item.id} className="result-card">
      <div className="card-header">
        <div className="card-id">{item.unified_case_id.join(", ")}</div>
        <div className="status-badge">{item.status || 'NEW'}</div>
      </div>
      <div className="card-text">{item.site_keywordsmatched}</div>
      <div className="card-subtext">{item.unified_activity_title}</div>
      <div className="card-subtext">{item.unified_type}</div>

    </div>
    
  )) ) : (
    <div className="card-subtext">❌ No Matched Data</div>
  )}
        <button className="add-btn" style={{marginLeft:'0px'}} onClick={ViewScreen}>
          VIEW ALL RESULTS IN FULL SCREEN
        </button>
      </div>
     </div>
{/*       
     Pagination
     <div>
        <button
          onClick={() => dispatch(setPage(currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          onClick={() => dispatch(setPage(currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div> */}
    </div>
    </div>
    </div>
    {/* {showCreate && <CreateCriteria setShowPopup={setShowPopup} togglePopup={togglePopup}/>}
    {showRecent && <RecentCriteria togglePopup={togglePopup} togglePopupa={setShowPopup} />} */}
    </div>
  );
};

export default SavedCriteria;