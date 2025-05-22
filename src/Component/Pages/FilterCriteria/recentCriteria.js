import { useState, useEffect, useCallback } from "react";
import "./recentCriteria.css"
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
import { closePopup, openPopup, setPage, setSearchResults, setKeywords } from "../../../Redux/Action/criteriaAction";
import axios from "axios";

const RecentCriteria = () => {

  const [savedSearch, setSavedSearch] = useState([]);
  const [criteriaId, setCriteriaId] = useState()
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [enterInput, setEnterInput] = useState([]);

  const [keywords, setKeyword] = useState([]);
  const recentKeyword = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.keyword
  );

  const caseId = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.case_id || ''
  );
  console.log("caseId", caseId);

  const fileType = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.file_type || ''
  );
  console.log("fileType", fileType);

  const keyword = useSelector(
    (state) => state.criteriaKeywords?.queryPayload?.keyword || ''
  );
  console.log("keyword", keyword);
  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Redux Payload:", reduxPayload);

  useEffect(() => {
    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    let updatedKeywords = [];

    // Handle recentKeyword
    if (Array.isArray(recentKeyword) && recentKeyword.length > 0) {
      updatedKeywords = [...updatedKeywords, ...recentKeyword];
    } else if (isValid(recentKeyword)) {
      updatedKeywords.push(recentKeyword);
    }
    if (Array.isArray(caseId) && caseId.length > 0) {
      updatedKeywords = [...updatedKeywords, ...caseId.map(id => `${id}`)];
    } else if (isValid(caseId)) {
      updatedKeywords.push(`${caseId}`);
    }

    // Handle fileType — always as array of strings
    if (Array.isArray(fileType) && fileType.length > 0) {
      updatedKeywords = [...updatedKeywords, ...fileType.map(ft => `${ft}`)];
    } else if (isValid(fileType)) {
      updatedKeywords.push(`${fileType}`);
    }

    console.log("Updated keyword state (processed):", updatedKeywords);
    setKeyword(updatedKeywords);
  }, [recentKeyword, caseId, fileType]);


  const dispatch = useDispatch();
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

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      e.preventDefault(); // Prevent form submission
      setKeyword([...keywords, searchQuery.trim()]); // Add new keyword to the list
      setEnterInput(prev => [...prev, searchQuery.trim()]);
      setSearchQuery(""); // Clear input field
    }
  };

  // Remove chip when clicked
  const handleRemoveItem = (chipToDelete) => {
    setKeyword(keywords.filter((chip) => chip !== chipToDelete));
    setEnterInput((prev) => prev.filter((chip) => chip !== chipToDelete));
  };

  const handleReset = () => {
    setKeyword([]);
    setEnterInput([]);
  };

  const Token = Cookies.get('accessToken');
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://5.180.148.40:9007/api/das/criteria", {
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
      const response = await fetch(`http://5.180.148.40:9007/api/das/criteria/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });

      if (response.ok) {
        // Filter the list to remove the item locally
        fetchData()
        toast("Criteria successfully deleted")
        console.log("Criteria successfully deleted!");
      } else {
        console.error("Failed to delete item:", response.status);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  console.log("keyword", keywords, searchQuery)




  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    console.log("enterInput:", enterInput);
    console.log("searchChips:", keywords);

    try {
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
      const finalKeywords = keywords.filter((chip) => allPossibleKeywords.includes(chip));
      console.log("finalkeywords", finalKeywords)
      // 2. case_id aur file_type separately treat honge
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");
      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)
      const finalCaseIds = keywords.filter((chip) => reduxCaseIds.includes(chip));
      const finalFileTypes = keywords.filter((chip) => reduxFileTypes.includes(chip));
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
        'http://5.180.148.40:9007/api/das/search',
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

      if (isValid(item.start_date)) {
        queryPayload.start_date = item.start_date;
      }


      if (isValid(item.end_date)) {
        queryPayload.end_date = item.end_date;
      }

      if (isValid(item.lat)) {
        queryPayload.lat = item.lat;
      }

      if (isValid(item.long)) {
        queryPayload.long = item.long;
      }
      setKeyword(updatedKeywords)
    }

    try {
      const response = await axios.post(
        'http://5.180.148.40:9007/api/das/search',
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
      // ✅ Dispatch updated keywords
      dispatch(setKeywords({
        keyword: updatedKeywords,
        queryPayload: response.data.input // or other fields if needed
      }));

      // ✅ Update local state if needed
      setKeyword(updatedKeywords);

      // ✅ Store API result in Redux
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

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={() => dispatch(closePopup())}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Saved Criteria</h5>
          <div className="container p-4  text-white  shadow-lg" style={{ background: 'grey' }}>
            <div className="d-flex align-items-center mb-3">
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

                      <Send style={{ cursor: 'pointer' }} onClick={handleSearch} />
                      <TuneIcon style={{ cursor: 'pointer' }} onClick={handelCreate} /> {/* New Card List Filter Icon */}
                    </InputAdornment>
                  ), style: {
                    height: '38px', // Use consistent height
                    padding: '0 8px', // Ensure uniform padding

                  },
                }}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  console.log("Typed: ", e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                sx={sharedSxStyles}
              />

            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <AccessTimeIcon color="action" />
                  <label style={{ marginLeft: '5px' }}>Recent</label>
                </div>
                <label style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={handleReset}>Clear Recent</label>
              </div>

              <div className="chips-container">
                {keywords && keywords.map((chip, index) => (
                  <div key={index} className="search-chip">
                    <span>{chip}</span>
                    <button className="chip-delete-btn" onClick={() => handleRemoveItem(chip)}>
                      <CloseIcon fontSize='15px' />
                    </button>
                  </div>
                ))}
              </div>


            </div>
            <hr />
            <div style={{ height: '300px', overflow: 'auto' }}>

              <div style={{ display: "flex", alignItems: "center" }}>
                <SaveIcon color="action" />
                <label style={{ marginLeft: '5px' }}>Saved Search</label>
              </div>
              <List className="bg-gray">
                {filteredList.length > 0 ? (
                  filteredList.map((item, index) => (
                    <ListItem key={index} className="text-white">
                      <ListItemText style={{ cursor: 'pointer' }} primary={item.title} onClick={() => ReuseCriteria(item)} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="dark">
                          <Edit
                            onClick={() => {
                              toggleEditPopup();
                              setCriteriaId(item.id); // Set the selected item's ID
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                        </IconButton>
                        <IconButton edge="end" color="dark" onClick={() => handleDelete(index, item.id)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))) : (
                  <p className="text-gray-400">No matched keyword</p>
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