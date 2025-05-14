import React, { useState, useEffect } from 'react';
import './one.css'; // You'll need to merge the CSS files
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Select from 'react-select';
import {
  Search, Send, Tune, CalendarToday, LocationOn, AccessTime, Save,
  Edit, Delete, Close as CloseIcon
} from '@mui/icons-material';
import {
  TextField, InputAdornment, Checkbox, FormControlLabel,
  List, ListItem, ListItemText, ListItemSecondaryAction, IconButton
} from '@mui/material';
import DatePickera from './datepicker';
import { customStyles } from '../Case/createCase'; // Ensure this import is correct
import EditCriteria from './editCriteria';

// Shared styles for text fields
export const sharedSxStyles = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-root': {
    boxShadow: 'none',
  }
};

const UnifiedSearchCriteria = ({ onClose, setShowPopup, handleCreateCase }) => {
  const navigate = useNavigate();
  const Token = Cookies.get('accessToken');
  
  // State management
  const [activeView, setActiveView] = useState('saved'); // 'saved', 'recent', 'create'
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState(['bomb']);
  const [activeTab, setActiveTab] = useState('Cases');
  const [showPopupD, setShowPopupD] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [criteriaId, setCriteriaId] = useState(null);
  
  // Form data for create criteria
  const [formData, setFormData] = useState({
    searchQuery: '',
    datatype: [],
    filetype: [],
    caseIds: [],
    includeArchived: false,
    latitude: '',
    longitude: ''
  });
  
  // Sample data for saved criteria
  const cases = [
    { id: 'C28301', status: 'New', text: 'pcjpmrnplgku', subtext: 'aslshh.rsg' },
    { id: 'C76064', status: 'New', text: 'connectionpcjncn12434', subtext: 'aslshh.rsg' }
  ];
  
  const transactions = [
    { id: 'T12345', status: 'Pending', text: 'transfer38292', subtext: 'cxnpay.io' },
    { id: 'T67890', status: 'Complete', text: 'exchngbtc212', subtext: 'btcwall.net' }
  ];
  
  // Data for recent criteria
  const [recentSearch, setRecentSearch] = useState(['person', 'every']);
  const [savedSearch, setSavedSearch] = useState([]);
  const [recommendations, setRecommendations] = useState(["Currently there are no recommendations for you"]);
  
  // Data for create criteria
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });
  const [caseOptions, setCaseOptions] = useState([]);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchCaseData();
    fetchFileTypes();
    fetchSavedCriteria();
  }, []);
  
  // API Calls
  const fetchCaseData = async () => {
    try {
      const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      
      const caseOptionsFormatted = response.data.data.map(caseItem => ({
        value: caseItem.id,
        label: `${caseItem.id} - ${caseItem.title || 'Untitled'}`
      }));
      
      setCaseOptions(caseOptionsFormatted);
    } catch (error) {
      console.error('Error fetching case data:', error);
    }
  };
  
  const fetchFileTypes = async () => {
    try {
      const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
        headers: {
          'Authorization': `Bearer ${Token}`
        },
      });
      
      const fileTypeOptionsFormatted = response.data.data.map(platform => ({
        value: platform,
        label: platform
      }));
      
      setFileTypeOptions(fileTypeOptionsFormatted);
    } catch (error) {
      console.error('Error fetching file types:', error);
    }
  };
  
  const fetchSavedCriteria = async () => {
    try {
      const response = await fetch("http://5.180.148.40:9006/api/das/criteria", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      const data = await response.json();
      if (data && data.data) {
        setSavedSearch(data.data.map(item => ({ keyword: item.keyword, id: item.id })));
      }
    } catch (error) {
      console.error("Error fetching saved criteria:", error);
    }
  };
  
  const saveCriteria = async () => {
    try {
      const criteriaPayload = {
        keyword: formData.searchQuery,
        case_id: formData.caseIds && formData.caseIds.length > 0 ? formData.caseIds[0].value.toString() : "",
        file_type: formData.filetype && formData.filetype.length > 0 ? formData.filetype[0].value : "",
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        start_time: selectedDates.startDate ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00` : "",
        end_time: selectedDates.endDate ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00` : ""
      };
      
      const response = await axios.post('http://5.180.148.40:9006/api/das/criteria', criteriaPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      
      toast.success("Criteria saved successfully");
      fetchSavedCriteria(); // Refresh saved criteria list
      return response.data;
    } catch (error) {
      console.error('Error saving criteria:', error);
      toast.error("Failed to save criteria");
      return null;
    }
  };
  
  const handleDeleteCriteria = async (id) => {
    try {
      const response = await fetch(`http://5.180.148.40:9006/api/das/criteria/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
  
      if (response.ok) {
        fetchSavedCriteria();
        toast.success("Criteria successfully deleted!");
      } else {
        toast.error("Failed to delete criteria");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Error while deleting criteria");
    }
  };
  
  // Event Handlers
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    try {
      // Save criteria if checkbox is checked
      if (formData.includeArchived) {
        await saveCriteria();
      }
      
      // Prepare search payload
      const queryArray = formData.filetype.map(type => ({
        unified_case_id: formData.caseIds && formData.caseIds.length > 0 ? formData.caseIds[0].value : "",
        unified_type: type.value,
        site_keywordsmatched: formData.searchQuery,
        start_time: selectedDates.startDate ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00` : "",
        end_time: selectedDates.endDate ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00` : ""
      }));
      
      const response = await axios.post('http://5.180.148.40:9007/api/das/search', {
        query: queryArray
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      
      // Add to recent searches
      if (formData.searchQuery && !recentSearch.includes(formData.searchQuery)) {
        setRecentSearch([formData.searchQuery, ...recentSearch]);
      }
      
      // Reset form
      setFormData({
        searchQuery: '',
        datatype: [],
        filetype: [],
        caseIds: [],
        includeArchived: false,
        latitude: '',
        longitude: ''
      });
      
      // Handle search results
      if (handleCreateCase) {
        handleCreateCase(response.data);
      }
      
      // Switch back to saved view - MODIFIED
      setActiveView('saved');
      
    } catch (error) {
      console.error('Error performing search:', error);
      toast.error("Search failed. Please try again");
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
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
  
  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSaveCriteriaChange = (e) => {
    setFormData(prev => ({ ...prev, includeArchived: e.target.checked }));
  };
  
  const handleDateSelection = (dateData) => {
    setSelectedDates(dateData);
    setShowPopupD(false);
  };
  
  const removeRecentItem = (index) => {
    const updatedSearch = recentSearch.filter((_, i) => i !== index);
    setRecentSearch(updatedSearch);
  };
  
  const handleViewAll = () => {
    navigate('/cases/save');
    onClose();
    setShowPopup(false);
  };
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Toggle Edit Popup
  const toggleEditPopup = (id = null) => {
    if (id) setCriteriaId(id);
    setShowEditPopup(!showEditPopup);
  };
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    setRecentSearch([]);
    toast.info("Recent searches cleared");
  };

  // Render functions for different views
  const renderSavedView = () => (
    <>
      <div className="search-container">
        <div className="search-header">
          <TextField
            fullWidth
            className="com mb-3"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Send onClick={() => setActiveView('recent')} style={{cursor:'pointer'}} />
                  <Tune onClick={() => setActiveView('create')} style={{cursor:'pointer'}} />
                </InputAdornment>
              ),
              style: {
                height: '38px',
                padding: '0 8px',
              },
            }}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search..."
            sx={sharedSxStyles}
          />
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
            cases.map(item => (
              <div key={item.id} className="result-card">
                <div className="card-header">
                  <div className="card-id">{item.id}</div>
                  <div className="status-badge">{item.status}</div>
                </div>
                <div className="card-text">{item.text}</div>
                <div className="card-subtext">{item.subtext}</div>
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
          <button className="add-btn" style={{marginLeft:'0px'}} onClick={handleViewAll}>
            VIEW ALL RESULTS IN FULL SCREEN
          </button>
        </div>
      </div>
    </>
  );
  
  const renderRecentView = () => (
    <>
      <div className="container p-4 text-white shadow-lg" style={{ background:'grey' }}>
        <div className="d-flex align-items-center mb-3">
          <TextField
            fullWidth
            className="com mb-3"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {/* MODIFIED: Changed Tune icon click handler to go back to saved view */}
                  <Tune style={{cursor:'pointer'}} onClick={() => setActiveView('saved')} />
                </InputAdornment>
              ),
              style: {
                height: '38px',
                padding: '0 8px',
              },
            }}
            placeholder="Search..."
            sx={sharedSxStyles}
          />
        </div>
        
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <AccessTime color="action" />
              <label style={{ marginLeft: '5px' }}>Recent</label>
            </div>
            <label style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={clearRecentSearches}>Clear Recent</label>
          </div>
          <List className="bg-gray rounded border-1">
            {recentSearch.map((item, index) => (
              <ListItem key={index} className="text-white">
                <ListItemText primary={item} />
                <IconButton 
                  onClick={() => removeRecentItem(index)} 
                  style={{ padding: "0", margin: "0" }}
                >
                  <CloseIcon style={{fontSize:'15px'}} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
        
        <hr />
        
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <LocationOn color="action"/> 
            <label style={{marginLeft:'5px'}}>Recommendation</label>
          </div>
          <List className="bg-gray rounded border-1">
            {recommendations.map((item, index) => (
              <ListItem key={index} className="text-white">
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </div>
        
        <hr />
        
        <div style={{height:'300px', overflow:'auto'}}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Save color="action"/>
            <label style={{marginLeft:'5px'}}>Saved Search</label>
          </div>
          <List className="bg-gray">
            {savedSearch.map((item, index) => (
              <ListItem key={index} className="text-white">
                <ListItemText primary={item.keyword} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" color="dark">
                    <Edit 
                      onClick={() => toggleEditPopup(item.id)}
                      style={{ cursor: 'pointer' }} 
                    />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    color="dark" 
                    onClick={() => handleDeleteCriteria(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </>
  );
  
  const renderCreateView = () => (
    <>
      <div className="popup-content">
        <h5>Create Criteria</h5>
        <form onSubmit={handleSearch}>
          {/* Search Bar with Icons */}
          <label>Search</label>
          <TextField
            fullWidth
            className="com mb-3"
            name="searchQuery"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {/* MODIFIED: Send icon now goes to recent view */}
                  <Send onClick={() => setActiveView('recent')} style={{ cursor: 'pointer' }} />
                  {/* MODIFIED: Tune icon now goes to saved view */}
                  <Tune onClick={() => setActiveView('saved')} style={{ cursor: 'pointer' }} />
                </InputAdornment>
              ),
              style: {
                height: '38px',
                padding: '0 8px',
              },
            }}
            placeholder="Search..."
            value={formData.searchQuery}
            onChange={handleInputChange}
            sx={sharedSxStyles}
          />

          {/* Datatype Dropdown (Multi Select) */}
          <div className="mb-3">
            <label>Datatype</label>
            <Select
              isMulti
              options={fileTypeOptions}
              styles={customStyles}
              className="com"
              value={formData.datatype}
              onChange={(selected) => setFormData(prev => ({ ...prev, datatype: selected }))}
              placeholder="Select Datatype"
            />
          </div>

          {/* Filetype Dropdown (Multi Select) */}
          <div className="mb-3">
            <label>Filetype</label>
            <Select
              isMulti
              options={fileTypeOptions}
              styles={customStyles}
              className="com"
              value={formData.filetype}
              onChange={(selected) => setFormData(prev => ({ ...prev, filetype: selected }))}
              placeholder="Select Filetypes"
            />
          </div>

          {/* Case Selection Field */}
          <div className="mb-3">
            <label>Case</label>
            <Select
              isMulti
              options={caseOptions}
              styles={customStyles}
              className="com"
              value={formData.caseIds}
              onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
              placeholder="Select Cases"
            />
          </div>

          {/* DatePicker */}
          <div className="mb-3">
            <label>DatePicker</label>
            <TextField
              fullWidth
              className="com mb-3"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CalendarToday style={{ cursor: 'pointer' }} onClick={() => setShowPopupD(true)} />
                  </InputAdornment>
                ),
                style: {
                  height: '38px',
                  padding: '0 8px',
                },
              }}
              placeholder="Select Date..."
              value={
                selectedDates.startDate && selectedDates.endDate
                  ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                  : formatDate(selectedDates.startDate || selectedDates.endDate)
              }
              readOnly
              sx={sharedSxStyles}
            />
          </div>

          {/* Location Fields */}
          <label>Focus your search to a particular location or area</label>
          <div className="mb-3 d-flex">
            <TextField
              name="latitude"
              placeholder="Latitude"
              className="com mb-3 me-2"
              value={formData.latitude}
              onChange={handleInputChange}
              InputProps={{
                style: {
                  height: '38px',
                  padding: '0 8px',
                },
              }}
              sx={sharedSxStyles}
            />
            <TextField
              name="longitude"
              placeholder="Longitude"
              className="com mb-3"
              value={formData.longitude}
              onChange={handleInputChange}
              InputProps={{
                style: {
                  height: '38px',
                  padding: '0 8px',
                },
              }}
              sx={sharedSxStyles}
            />
          </div>
          <h5 className="mb-3">SELECT ON MAP</h5>

          {/* Save Criteria Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.includeArchived}
                onChange={handleSaveCriteriaChange}
              />
            }
            label="Save this search"
            className="mb-3"
          />

          {/* Submit Button - onClick modified to directly set view to saved */}
          <div className="button-container" style={{ textAlign: 'center' }}>
            <button
              type="button" // Changed from submit to button to handle custom logic
              style={{ width: '100%', height: '30px' }}
              className="add-btn"
              onClick={(e) => {
                e.preventDefault();
                handleSearch(e);
                setActiveView('saved'); // MODIFIED: Ensure view changes to saved
              }}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </>
  );
  
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={onClose}>
          &times;
        </button>
        <div className="popup-content">
          {activeView === 'saved' && renderSavedView()}
          {activeView === 'recent' && renderRecentView()}
          {activeView === 'create' && renderCreateView()}
        </div>
      </div>
      
      {/* Popup components */}
      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={() => setShowPopupD(false)}
        />
      )}
      
      {showEditPopup && (
        <EditCriteria 
          togglePopup={toggleEditPopup} 
          criteriaId={criteriaId}
          onSaved={() => {
            fetchSavedCriteria();
            toggleEditPopup();
          }}
        />
      )}
    </div>
  );
};

export default UnifiedSearchCriteria;