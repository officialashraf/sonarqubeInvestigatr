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
import { setPage } from '../../../Redux/Action/criteriaAction';
 

const SavedCriteria = ({togglePopup, setShowPopup}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { searchResults, totalPages, currentPage } = useSelector((state) => state.search);
  console.log("searResult",searchResults, totalPages,currentPage)
  const [showCreate, setshowCreate] = useState(false);
  const [showRecent, setshowRecent] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState(['bomb']);
  const [activeTab, setActiveTab] = useState('Cases');
  
  // Sample data
  const cases = [
    { id: 'C28301', status: 'New', text: 'pcjpmrnplgku', subtext: 'aslshh.rsg' },
    { id: 'C76064', status: 'New', text: 'connectionpcjncn12434', subtext: 'aslshh.rsg' }
  ];
  
  const transactions = [
    { id: 'T12345', status: 'Pending', text: 'transfer38292', subtext: 'cxnpay.io' },
    { id: 'T67890', status: 'Complete', text: 'exchngbtc212', subtext: 'btcwall.net' }
  ];
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      // Add chip and clear input
      if (!searchChips.includes(inputValue.trim())) {
        setSearchChips([...searchChips, inputValue.trim()]);
      }
      setInputValue('');
    }
  };
  
  const removeChip = (chip) => {
    setSearchChips(searchChips.filter(item => item !== chip));
  };
  
  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
  };

  const handleShow= () =>{
    setshowCreate(true)
  }
  const handleShowRecent= () =>{
    setshowRecent(true)
  }
  const ViewScreen = () => {
    navigate('/search' );
     togglePopup();
     setShowPopup()
    }

  return (
    <div className="popup-overlay">
    <div className="popup-container">
        <button className="close-icon"  onClick={() => {
          // Directly set showPopup to false in parent component
          setShowPopup();
          // Also close this component's popup if needed
          if (typeof togglePopup === 'function') {
            togglePopup();
          }
        }} >
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
               
                     <SendIcon style={{cursor:'pointer'}} onClick={handleShowRecent} />
                  <TuneIcon  style={{cursor:'pointer'}} onClick={handleShow}/> {/* New Card List Filter Icon */}
               
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
       {/* </div> */}
      </div>
      
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
          <button className="action-button">SAVE SEARCH</button>
        </div>
      </div>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'Cases' ? 'active' : ''}`}
          onClick={() => setActiveTab('Cases')}
        >
          Cases (87)
        </div>
        <div 
          className={`tab ${activeTab === 'Transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('Transactions')}
        >
          Transactions (4127)
        </div>
      </div>
      
      <div className="search-results">
        {activeTab === 'Cases' ? (
          searchResults && searchResults.map((item) => (
            <div key={item.id} className="result-card">
              <div className="card-header">
                <div className="card-id">{item.unified_case_id}</div>
                <div className="status-badge">{item.status || 'NEW'}</div>
              </div>
              <div className="card-text">{item.site_keywordsmatched}</div>
              <div className="card-subtext">{item.unified_type}</div>
            </div>
          ))
        ) : (
          transactions.map(item => (
            <div key={item.id} className="result-card">
              <div className="card-header">
                <div className="card-id">{item.id}</div>
                <div className={`status-badge ${item.status === 'Complete' ? 'complete' : 'pending'}`}>
                  {item.status}
                </div>
              </div>
              <div className="card-text">{item.text}</div>
              <div className="card-subtext">{item.subtext}</div>
            </div>
          ))
        )}
        <button className="add-btn" style={{marginLeft:'0px'}} onClick={ViewScreen}>
          VIEW ALL RESULTS IN FULL SCREEN
        </button>
      </div>
      
     {/* Pagination */}
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
      </div>
    </div>
    </div>
    </div>
    {showCreate && <CreateCriteria setShowPopup={setShowPopup} togglePopup={togglePopup}/>}
    {showRecent && <RecentCriteria togglePopup={togglePopup} togglePopupa={setShowPopup} />}
    </div>
  );
};

export default SavedCriteria;