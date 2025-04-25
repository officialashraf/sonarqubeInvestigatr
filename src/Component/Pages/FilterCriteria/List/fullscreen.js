import React, { useState, useEffect } from 'react';
import '../savedCriteria.css';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { sharedSxStyles } from "../createCriteria";
import SendIcon from '@mui/icons-material/Send';
import DataTable from '../../Case/caseList';
import CriteriaCaseTable from './criteriaCaseList';
import CriteriaTransactionTable from './criteriaTransactionlist';
import SavedCriteria from '../savedCriteria';
import AddNewCriteria from '../addNewCriteria';
import {  useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie'
import { toast } from 'react-toastify';
import { closePopup, setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const SearchResults = ({onClose}) => {
 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  const [activeTab, setActiveTab] = useState('Cases');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searchResult", searchResults, totalPages, currentPage, totalResults);
  
  const keywords = useSelector((state) => state.criteriaKeywords.queryPayload.keyword);
  console.log("Keywords from Redux:", keywords);

    const caseId = useSelector((state) => state.criteriaKeywords.queryPayload.case_id);
    console.log("casId", caseId)
   
    const fileType = useSelector((state) => state.criteriaKeywords.queryPayload.file_type);
    console.log("filetype",fileType)
    const payload= useSelector((state) => state.criteriaKeywords.queryPayload);
  

   const [formData, setFormData] = useState({
  searchChips: '',
  // Add other form fields as needed
});
 

useEffect(() => {
  console.log("Keywords object:", keywords);
  console.log("Case ID:", caseId);
  console.log("File Type:", fileType);

  const isValid = (val) =>
    val !== null && val !== undefined && val.toString().trim() !== "";

  if (keywords && Array.isArray(keywords)) {
    let combinedChips = [...keywords];

    if (Array.isArray(caseId) && caseId.length > 0) {
      combinedChips = [...combinedChips, ...caseId.map((id) => `${id}`)]; // Ensure each caseId value remains a string
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
}, [keywords, caseId, fileType]);

// useEffect(() => {
//   console.log("Updated Search Results:", searchResults);
//   console.log("Total Pages:", totalPages);
//   console.log("Current Page:", currentPage);
//   console.log("Total Results:", totalResults);
// }, [searchResults, totalPages, currentPage, totalResults]); 
  

  const openPopup = () => {
    setIsPopupVisible(true); // Pop-up ko open karne ke liye state ko true kare
  };
  const exitClick =()=>{
navigate('/cases')
  }

   const Token = Cookies.get('accessToken');
   
  console.log("Keywords saerch:", searchChips);
  const filteredChips = searchChips.filter((chip) =>
    (typeof chip === "string" && chip.toLowerCase().includes(inputValue.toLowerCase())) ||
    (typeof chip === "number" && chip.toString().includes(inputValue)) // Search for numbers
);

console.log("filterdeChpis", filteredChips)
  // Add new chip when "Enter" is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChip =  inputValue.trim() ; // Add new chip structure

      // Check if chip already exists
      if (!searchChips.find((chip) => chip === newChip)) {
        setSearchChips((prev) => [...prev, newChip]); // Add new chip
      }

      setInputValue(""); // Clear input field
    }
  };
  
  // const removeChip = (chip) => {
  //   setSearchChips(searchChips.filter(item => item !== chip));
  // };
  const removeChip = (chipToRemove) => {
    const updatedChips = searchChips.filter((chip) => chip !== chipToRemove);
    setSearchChips(updatedChips); // Update state
    // onUpdatedChips(updatedChips); // Pass updated chips as props
  };
  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
  };

  const handleSearch = async () => {
    console.log("keyword....",payload)
   console.log("searchzchips1", searchChips)
    try {
      const payload = {
        keyword: [...searchChips],
        case_id: [],
        file_type: [],
        page: 1
      };
      // const fileTypeKeywords = ['instagram', 'twitter', 'facebook', 'vk', 'youtube', 'linkedin', 'tiktok'];
      // // Process searchChips
      // if (searchChips && Array.isArray(searchChips) && searchChips.length > 0) {
      //   searchChips.forEach((chip) => {
      //     const val = chip?.toString().toLowerCase().trim();
    
      //     if (!val) return; // Ignore empty or invalid values
    
      //     if (!isNaN(val)) {
      //       // If it's a number, add it to case_id as a number
      //       payload.case_id.push(Number(val));
      //     } else if (fileTypeKeywords.includes(val)) {
      //       // If it matches a file type keyword, add it to file_type
      //       payload.file_type.push(val);
      //     } else {
      //       // Otherwise, treat it as a keyword
      //       payload.keyword.push(val);
      //     }
        // });
      // }
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
      
      console.log("Search results------:", response);
      
      // Dispatch the search results to the store
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));
      dispatch(setKeywords({
              keyword: response.data.input.keyword,
             queryPayload: response.data.input// or other fields if needed
           }));
      dispatch(setPage(1));
     
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
   
  
  return (

    <div className="search-container" style={{backgroundColor:'darkgray',height:'100%', zIndex:'1050'}}>
   <div style={{display: 'flex', justifyContent: 'space-between', aligntems: 'center', marginTop:'5px'}}>
{/* 
  <h6 >Search Results</h6 > */}
  
  
 

      <div className="search-header" style={{width:'50%'}}>
      
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
                  <TuneIcon onClick={openPopup} style={{cursor:'pointer'}} /> {/* New Card List Filter Icon */}
               
                                            </InputAdornment>
                                        ), style: {
                                            height: '38px', // Use consistent height
                                            padding: '0 8px', // Ensure uniform padding
            
                                          },
                                    }}
                                    type="text" 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search..."
                                    sx={sharedSxStyles}
                                />
                                {/* <button onClick={handleExit}>Exit Full Screen</button> */}
       {/* </div> */}
      
         
      </div>
      <button className="action-button" style={{padding:'0px 5px', height:'30px', marginTop:"5px"}} onClick={resetSearch}>RESET</button>
        
      <button className="action-button" style={{padding:'0px 5px', height:'30px', marginTop:"5px"}} onClick={exitClick}>Exit FullScreen</button>
      </div>
     
      <div className="search-term-indicator">
        <div className="chips-container">
          {filteredChips && filteredChips.map((chip, index) => (
            <div key={index} className="search-chip">
              <span>{chip}</span>
              <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                <CloseIcon fontSize='15px'/>
              </button>
            </div>
          ))}
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
      
      <div className="search-results"style={{height:'auto'}}>
        
      <CriteriaCaseTable searchChips={searchChips} />
       
    
      
      </div>
      
      {/* <div className="view-all">
        
      </div> */}
 {isPopupVisible && <AddNewCriteria searchChips={searchChips} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}

    </div>
   
    
   
  );
};

export default SearchResults; 
