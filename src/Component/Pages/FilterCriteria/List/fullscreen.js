import React, { useState } from 'react';
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


const SearchResults = ({onClose}) => {
 
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState(['bomb']);
  const [activeTab, setActiveTab] = useState('Cases');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const openPopup = () => {
    setIsPopupVisible(true); // Pop-up ko open karne ke liye state ko true kare
  };
  const exitClick =()=>{
navigate('/cases')
  }
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

  
  return (

    <div className="search-container" style={{backgroundColor:'darkgray',height:'100%', zIndex:'1050'}}>
   <div style={{display: 'flex', justifyContent: 'space-between', aligntems: 'center'}}>

  <h6 >Search Results</h6 >
  
  
  <button className="action-button" onClick={exitClick}>Exit FullScreen</button>
</div>
      <div className="search-header" style={{width:'50%'}}>
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
               
                     <SendIcon style={{cursor:'pointer'}} onClick={onClose}/>
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
      
      <div className="search-term-indicator">
        <div className="chips-container">
          {searchChips.map((chip, index) => (
            <div key={index} className="search-chip">
              <span>{chip}</span>
              <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                <CloseIcon fontSize='15px'/>
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
      
      <div className="search-results"style={{height:'auto'}}>
        {activeTab === 'Cases' ? (
        //   cases.map(item => (
        //     <div key={item.id} className="result-card">
        //       <div className="card-header">
        //         <div className="card-id">{item.id}</div>
        //         <div className="status-badge">{item.status}</div>
        //       </div>
        //       <div className="card-text">{item.text}</div>
        //       <div className="card-subtext">{item.subtext}</div>
        //     </div>
        //   ))
        <CriteriaCaseTable/>
        ) : (
         <CriteriaTransactionTable/>
        )}
      
      </div>
      
      {/* <div className="view-all">
        
      </div> */}
 {isPopupVisible && <AddNewCriteria isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}

    </div>
   
    
   
  );
};

export default SearchResults; 