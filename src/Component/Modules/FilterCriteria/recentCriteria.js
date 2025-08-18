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
  
  // Local state for managing chips (same as SearchResults)
  const [localKeywordChips, setLocalKeywordChips] = useState([]);
  const [localCaseIdChips, setLocalCaseIdChips] = useState([]);
  const [localFileTypeChips, setLocalFileTypeChips] = useState([]);
  const [localSentimentChips, setLocalSentimentChips] = useState([]);
  const [localTargetChips, setLocalTargetChips] = useState([]);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [localEndTime, setLocalEndTime] = useState(null);

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

  // Generate display chips from local state (same as SearchResults)
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

  // Handle Enter key press - Add to local keyword chips and track as user input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      e.preventDefault(); // Prevent form submission
      const newKeyword = searchQuery.trim();
      
      // Check if already exists
      if (localKeywordChips.includes(newKeyword)) {
        setSearchQuery("");
        return;
      }
      
      setLocalKeywordChips(prev => [...prev, newKeyword]);
      
      // Track as user input chip
      setUserInputChips(prev => new Set([...prev, newKeyword]));
      
      setSearchQuery(""); // Clear input field
    }
  };

  // Remove chip from local state and update tracking sets
  const handleRemoveItem = (chipToRemove) => {
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

  const handleReset = () => {
    // Clear both local state and Redux
    setLocalKeywordChips([]);
    setLocalCaseIdChips([]);
    setLocalFileTypeChips([]);
    setLocalSentimentChips([]);
    setLocalTargetChips([]);
    setLocalStartTime(null);
    setLocalEndTime(null);
    setSearchQuery('');
    
    // Clear tracking sets
    setReduxOriginatedChips(new Set());
    setUserInputChips(new Set());
    
    dispatch(clearCriteria());
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

    console.log("Local state for search:");
    console.log("localKeywordChips:", localKeywordChips);
    console.log("localCaseIdChips:", localCaseIdChips);
    console.log("localFileTypeChips:", localFileTypeChips);
    console.log("localSentimentChips:", localSentimentChips);
    console.log("localTargetChips:", localTargetChips);

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

      // Redux store update
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

    // Reset local state and tracking first
    setLocalKeywordChips([]);
    setLocalCaseIdChips([]);
    setLocalFileTypeChips([]);
    setLocalSentimentChips([]);
    setLocalTargetChips([]);
    setLocalStartTime(null);
    setLocalEndTime(null);
    setUserInputChips(new Set()); // Clear user input tracking
    
    const newReduxChips = new Set();
    const queryPayload = {};

    if (item) {
      if (Array.isArray(item.keyword) && item.keyword.length > 0) {
        setLocalKeywordChips([...item.keyword]);
        queryPayload.keyword = item.keyword;
        item.keyword.forEach(chip => newReduxChips.add(chip));
      }

      if (Array.isArray(item.case_id) && item.case_id.length > 0) {
        const caseIds = item.case_id.map(id => String(id));
        setLocalCaseIdChips(caseIds);
        queryPayload.case_id = item.case_id;
        caseIds.forEach(chip => newReduxChips.add(chip));
      }

      if (Array.isArray(item.file_type) && item.file_type.length > 0) {
        setLocalFileTypeChips([...item.file_type]);
        queryPayload.file_type = item.file_type;
        item.file_type.forEach(chip => newReduxChips.add(chip));
      }

      if (Array.isArray(item.targets) && item.targets.length > 0) {
        // Handle targets properly with name, value, label
        const targetChips = item.targets.map(t => ({
          id: t.id || t.value || t.name,
          name: t.name,
          value: t.value || t.id || t.name,
          label: t.label || t.name
        }));
        setLocalTargetChips(targetChips);
        queryPayload.targets = item.targets.map(t => String(t.value || t.id || t.name));
        targetChips.forEach(t => newReduxChips.add(t.name));
      }

      if (Array.isArray(item.sentiments) && item.sentiments.length > 0) {
        setLocalSentimentChips([...item.sentiments]);
        queryPayload.sentiments = item.sentiments;
        item.sentiments.forEach(chip => newReduxChips.add(chip));
      }

      if (isValid(item.start_time)) {
        setLocalStartTime(item.start_time);
        queryPayload.start_time = item.start_time;
      }

      if (isValid(item.end_time)) {
        setLocalEndTime(item.end_time);
        queryPayload.end_time = item.end_time;
      }

      // Add date range chip to Redux originated set if both dates exist
      if (isValid(item.start_time) && isValid(item.end_time)) {
        const dateRangeChip = createDateRangeChip(item.start_time, item.end_time);
        if (dateRangeChip) {
          newReduxChips.add(dateRangeChip);
        }
      }

      if (isValid(item.lat)) {
        queryPayload.lat = item.lat;
      }

      if (isValid(item.long)) {
        queryPayload.long = item.long;
      }
    }

    // Set all reused chips as Redux originated
    setReduxOriginatedChips(newReduxChips);

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
      
      console.log("Reuse Query Payload", queryPayload)
      console.log("QueryResponse", response)
      
      // Update Redux with the reused criteria
      const allDisplayChips = getDisplayChips();
     const actionPayload = setKeywords({
  keyword: allDisplayChips,
  queryPayload: {
    case_id: queryPayload.case_id,
    file_type: queryPayload.file_type,
    keyword: queryPayload.keyword,
    targets: queryPayload.targets,
    sentiment: queryPayload.sentiments,
    start_time: queryPayload.start_time,
    end_time: queryPayload.end_time,
    latitude: queryPayload.lat || null,
    longitude: queryPayload.long || null,
    page: 1
  }
});

console.log("Action object:", actionPayload); // ye dikhayega type aur payload
dispatch(actionPayload);


      // Store API result in Redux
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));

      console.log("Updated local state after reuse");
      dispatch(openPopup("saved"));
    } catch (error) {
      console.error("API call failed in ReuseCriteria:", error);
    }
  };

  const filteredList = Array.isArray(savedSearch) ? savedSearch.filter((item) =>
    (typeof item.keyword === "string" && item.keyword.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (typeof item.title === "string" && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  // Get display chips from local state
  const allDisplayKeywords = getDisplayChips();

  // Track which chips came from Redux vs user input
  const [reduxOriginatedChips, setReduxOriginatedChips] = useState(new Set());
  const [userInputChips, setUserInputChips] = useState(new Set());

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