import { useState, useEffect, useCallback } from "react";
import "./recentCriteria.module.css"
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import { Edit, Delete, Send } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
import { sharedSxStyles } from "./createCriteria";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
import EditCriteria from './editCriteria';
import { useDispatch, useSelector } from "react-redux";
import { closePopup, openPopup, setPage, setSearchResults, setKeywords, clearCriteria } from "../../../Redux/Action/criteriaAction";
import axios from "axios";
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";
import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";
import styles from '../../Common/Table/table.module.css';

const RecentCriteria = () => {
    const dispatch = useDispatch();
  const Token = Cookies.get('accessToken');
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();
  const [savedSearch, setSavedSearch] = useState([]);
  const [criteriaId, setCriteriaId] = useState()
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEnteredKeywords, setUserEnteredKeywords] = useState([]); // Only user-entered keywords
  const [reduxKeywords, setReduxKeywords] = useState([]); // Only Redux keywords

  // Redux selectors
  const recentKeyword = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.keyword);

  const caseId = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.case_id || '');

  const fileType = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.file_type || '');

  const keyword = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.keyword || '');

  const sentiments = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.sentiments || '');

  const targets = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.targets || '');
    
  const start_time = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.start_time || '');
  
  const end_time = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.end_time || '');

  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Redux Payload:", reduxPayload);

  // Initialize Redux keywords from Redux data
  useEffect(() => {
    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    let updatedReduxKeywords = [];

    // Handle recentKeyword
    if (Array.isArray(recentKeyword) && recentKeyword.length > 0) {
      updatedReduxKeywords = [...updatedReduxKeywords, ...recentKeyword];
    } else if (isValid(recentKeyword)) {
      updatedReduxKeywords.push(recentKeyword);
    }
    
    if (Array.isArray(caseId) && caseId.length > 0) {
      updatedReduxKeywords = [...updatedReduxKeywords, ...caseId.map(id => `${id}`)];
    } else if (isValid(caseId)) {
      updatedReduxKeywords.push(`${caseId}`);
    }

    // Handle fileType — always as array of strings
    if (Array.isArray(fileType) && fileType.length > 0) {
      updatedReduxKeywords = [...updatedReduxKeywords, ...fileType.map(ft => `${ft}`)];
    } else if (isValid(fileType)) {
      updatedReduxKeywords.push(`${fileType}`);
    }

    // Handle sentiments
    if (Array.isArray(sentiments) && sentiments.length > 0) {
      updatedReduxKeywords = [...updatedReduxKeywords, ...sentiments];
    }

    // Handle targets
    if (Array.isArray(targets) && targets.length > 0) {
      updatedReduxKeywords = [...updatedReduxKeywords, ...targets];
    }

    // Handle time range - create a single chip for date range if both exist
    if (isValid(start_time) && isValid(end_time)) {
      updatedReduxKeywords.push(`${start_time} to ${end_time}`);
    }

    console.log("Updated Redux keywords:", updatedReduxKeywords);
    setReduxKeywords(updatedReduxKeywords);
  }, [recentKeyword, caseId, fileType, sentiments, targets, start_time, end_time]);

  const activePopup = useSelector((state) => state.popup?.activePopup || null);
  console.log("Current Active Popup:", activePopup);

  const handelCreate = () => {
    console.log("🚀 Create button clicked! Dispatching openPopup('create')");
    dispatch(openPopup("create"))
  }

  // Debugging
  const toggleEditPopup = () => {
    setShowEditPopup(!showEditPopup);
  };

  // Handle Enter key press - Add to user-entered keywords only
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      e.preventDefault(); // Prevent form submission
      const newKeyword = searchQuery.trim();
      setUserEnteredKeywords(prev => [...prev, newKeyword]); // Add to user-entered keywords only
      setSearchQuery(""); // Clear input field
    }
  };

  // Check if chip is from Redux or user-entered
  const isReduxChip = (chip) => {
    return reduxKeywords.includes(chip);
  };

  // Check if chip is a time range chip
  const isTimeRangeChip = (chip) => {
    return chip.includes(' to ');
  };

  // Remove chip - handle both Redux and user-entered
  const handleRemoveItem = (chipToRemove) => {
    if (isReduxChip(chipToRemove)) {
      // Remove from Redux keywords and update Redux store
      const updatedReduxKeywords = reduxKeywords.filter(chip => chip !== chipToRemove);
      setReduxKeywords(updatedReduxKeywords);
      
      // Update Redux store - need to determine which field this chip belongs to
      const updatedPayload = { ...reduxPayload };
      
      // Handle time range chip removal
      if (isTimeRangeChip(chipToRemove)) {
        // Remove start_time and end_time from Redux payload
        delete updatedPayload.start_time;
        delete updatedPayload.end_time;
      } else {
        // Check and update keyword field
        if (Array.isArray(keyword) && keyword.includes(chipToRemove)) {
          updatedPayload.keyword = keyword.filter(k => k !== chipToRemove);
        }
        
        // Check and update case_id field
        if (Array.isArray(caseId) && caseId.map(id => String(id)).includes(chipToRemove)) {
          updatedPayload.case_id = caseId.filter(id => String(id) !== chipToRemove);
        }
        
        // Check and update file_type field
        if (Array.isArray(fileType) && fileType.includes(chipToRemove)) {
          updatedPayload.file_type = fileType.filter(ft => ft !== chipToRemove);
        }
        
        // Check and update sentiments field
        if (Array.isArray(sentiments) && sentiments.includes(chipToRemove)) {
          updatedPayload.sentiments = sentiments.filter(s => s !== chipToRemove);
        }
        
        // Check and update targets field
        if (Array.isArray(targets) && targets.includes(chipToRemove)) {
          updatedPayload.targets = targets.filter(t => t !== chipToRemove);
        }
      }
      
      // Dispatch updated payload to Redux
      dispatch(setKeywords({
        keyword: updatedReduxKeywords,
        queryPayload: updatedPayload
      }));
      
    } else {
      // Remove from user-entered keywords
      setUserEnteredKeywords(prev => prev.filter(chip => chip !== chipToRemove));
    }
  };

  const handleReset = () => {
    dispatch(clearCriteria());
    setReduxKeywords([]);
    setUserEnteredKeywords([]);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/criteria`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      const data = response
      console.log("resposegetCriteria", data.data)
      if (data && data.data) {
        setSavedSearch(data.data.data); // Extract keywords
        console.log("setSavedSearch", savedSearch)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [Token])
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (index, id) => {
    try {
      // Making the DELETE API call
      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/criteria/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      console.log("responseDelete", response)
      if (response.status === 200) {
        toast.success("Criteria successfully deleted")
        // Filter the list to remove the item locally
        fetchData()
        console.log("Criteria successfully deleted!");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed deleting criteria")
      console.error("Error deleting item:", error);
    }
  };

  const handleSearch = async () => {
    // Check if there's any data to search
    const hasUserKeywords = userEnteredKeywords.length > 0;
    const hasReduxKeywords = reduxKeywords.length > 0;
    const hasReduxData = Object.keys(reduxPayload).length > 0;
    
    if (!hasUserKeywords && !hasReduxKeywords && !hasReduxData) {
      toast.info("Please enter keywords or select criteria to search");
      return;
    }

    console.log("reduxPayload:", reduxPayload);
    console.log("reduxKeywords:", reduxKeywords);
    console.log("userEnteredKeywords:", userEnteredKeywords);

    try {
      // Get Redux keywords from current payload
      const currentReduxKeywords = Array.isArray(reduxPayload.keyword)
        ? reduxPayload.keyword
        : JSON.parse(reduxPayload.keyword || "[]");
      
      // All keywords (Redux + User entered) will be passed as keywords to API
      const allKeywords = [...currentReduxKeywords, ...userEnteredKeywords];
      console.log("allKeywords to be sent:", allKeywords)

      // Get other Redux data
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");

      const reduxTargets = Array.isArray(reduxPayload.targets)
        ? reduxPayload.targets
        : JSON.parse(reduxPayload.targets || "[]");

      const reduxSentiments = Array.isArray(reduxPayload.sentiments)
        ? reduxPayload.sentiments
        : JSON.parse(reduxPayload.sentiments || "[]");

      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)

      const rawPayload = {
        keyword: allKeywords,        // All keywords (Redux + User entered)
        case_id: reduxCaseIds,       // Only Redux case_ids
        file_type: reduxFileTypes,   // Only Redux file_types
        targets: reduxTargets,       // Only Redux targets
        sentiments: reduxSentiments, // Only Redux sentiments
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
      dispatch(openPopup("saved"));
    } catch (error) {
      console.error("Error performing search:", error);
      toast.error("Search failed. Please try again.");
    }
  };

  const ReuseCriteria = async (item) => {
    console.log("detailscriterai", item);

    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    let updatedKeywords = [];
    const queryPayload = {};

    if (item) {
      if (Array.isArray(item.keyword) && item.keyword.length > 0) {
        updatedKeywords.push(...item.keyword.map((kw) => `${kw}`));
        queryPayload.keyword = item.keyword;
      }

      if (Array.isArray(item.case_id) && item.case_id.length > 0) {
        updatedKeywords.push(...item.case_id.map((id) => `${id}`));
        queryPayload.case_id = item.case_id;
      }

      if (Array.isArray(item.file_type) && item.file_type.length > 0) {
        updatedKeywords.push(...item.file_type.map((ft) => `${ft}`));
        queryPayload.file_type = item.file_type;
      }

      if (Array.isArray(item.targets) && item.targets.length > 0) {
        updatedKeywords.push(...item.targets.map((t) => `${t}`));
        queryPayload.targets = item.targets;
      }

      if (Array.isArray(item.sentiments) && item.sentiments.length > 0) {
        updatedKeywords.push(...item.sentiments.map((s) => `${s}`));
        queryPayload.sentiments = item.sentiments;
      }

      if (isValid(item.start_date)) {
        queryPayload.start_time = item.start_time;
      }

      if (isValid(item.end_date)) {
        queryPayload.end_time = item.end_time;
      }

      // Add time range chip if both dates exist
      if (isValid(item.start_time) && isValid(item.end_time)) {
        updatedKeywords.push(`${item.start_time} to ${item.end_time}`);
      }

      if (isValid(item.lat)) {
        queryPayload.lat = item.lat;
      }

      if (isValid(item.long)) {
        queryPayload.long = item.long;
      }
      
      // Set as Redux keywords since these come from saved criteria
      setReduxKeywords(updatedKeywords);
      // Clear user-entered keywords when reusing criteria
      setUserEnteredKeywords([]);
    }

    try {
      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        queryPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
          },
        }
      );
      
      console.log("Reusee Qeury Payload", queryPayload)
      console.log("QueryResponse", response)
      console.log("updatedetRecent", updatedKeywords)
      
      // Dispatch updated keywords
      dispatch(setKeywords({
        keyword: updatedKeywords,
        queryPayload: response.data.input // or other fields if needed
      }));

      // Store API result in Redux
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      console.log("Updated keyword state after reuse:", updatedKeywords);
      console.log("Query Payload dispatched:", queryPayload);
      dispatch(openPopup("saved"));
    } catch (error) {
      console.error("API call failed in ReuseCriteria:", error);
    }
  };

  const filteredList = Array.isArray(savedSearch) ? savedSearch.filter((item) =>
    (typeof item.keyword === "string" && item.keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (typeof item.title === "string" && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  // Combine all keywords for display
  const allDisplayKeywords = [...reduxKeywords, ...userEnteredKeywords];

  // Function to determine chip style based on type
  const getChipStyle = (chip) => {
    if (isTimeRangeChip(chip)) {
      return { backgroundColor: '#FFD700', color: '#000' }; // Yellow for time range
    }
    return isReduxChip(chip) 
      ? { backgroundColor: '#ffd700', color: '#000' } // Yellow for Redux chips
      : { backgroundColor: '#0073cf', color: 'white' }; // Blue for user-entered chips
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Saved Criteria</h5>
          <div className="container p-4 text-white">
            <div className="d-flex align-items-center mb-3">
              <TextField
                fullWidth
                className={styles.searchBar}
                InputProps={{
                  readOnly: isReadOnly,
                  onFocus: handleFocus,
                  inputRef: inputRef,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon style={{color: "#0073cf" }}/>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Send style={{ cursor: 'pointer', color: "#0073cf", marginRight:'5px' }} onClick={handleSearch} />
                      <TuneIcon style={{ cursor: 'pointer', backgroundColor: "#0073CF", color: '#0A192F' }} onClick={handelCreate} />
                    </InputAdornment>
                  ), 
                  style: {
                    height: '38px',
                    padding: '10px',
                    backgroundColor: '#080E17',
                    borderRadius: '15px',
                    color: 'white',
                    border: '1px solid #0073CF',
                  },
                  autoComplete: 'off',
                }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("Typed: ", e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                sx={sharedSxStyles}
                style={customSelectStyles}
              />
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon style={{ color: 'var(--color-colors-primaryAccent)' }} />
                  <label style={{ marginLeft: '5px', fontSize: "18px" }}>Recent</label>
                </div>
                <label style={{ marginLeft: 'auto', cursor: 'pointer', fontSize: "18px" }} onClick={handleReset}>Clear Recent</label>
              </div>

              <div className="chips-container">
                {allDisplayKeywords && allDisplayKeywords.map((chip, index) => {
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
                        onClick={() => handleRemoveItem(chip)}
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
            </div>
            
            <hr />
            
            <div style={{ height: '300px', overflow: 'auto' }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <SaveIcon style={{ color: 'var(--color-colors-primaryAccent)' }} />
                <label style={{ marginLeft: '5px', fontSize: "16px" }}>Saved Search</label>
              </div>

              <List className="bg-gray">
                {filteredList.length > 0 ? (
                  filteredList.map((item, index) => (
                    <ListItem key={index} className="text-white">
                      <ListItemText style={{ cursor: 'pointer' }} primary={item.title} onClick={() => ReuseCriteria(item)} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="#0073cf">
                          <Edit style={{ cursor: 'pointer', color: '#0073cf' }}
                            onClick={() => {
                              toggleEditPopup();
                              setCriteriaId(item.id);
                            }}
                          />
                        </IconButton>
                        <IconButton edge="end" color="dark" onClick={() => handleDelete(index, item.id)}>
                          <Delete style={{ color: '#0073cf'}} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))) : (
                  <p className="text-gray-400" style={{ display: 'flex', justifyContent: 'center', fontSize: '18px'}}>No matched keyword</p>
                )}
              </List>
            </div>
          </div>
        </div>
      </div>
      
      {showEditPopup && (
        <EditCriteria
          togglePopup={toggleEditPopup}
          criteriaId={criteriaId}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

export default RecentCriteria;