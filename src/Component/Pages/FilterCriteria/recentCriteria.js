import React, { useState , useEffect} from "react";
import "./recentCriteria.css"
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import { Edit, Delete, Send } from "@mui/icons-material";
import InputAdornment from '@mui/material/InputAdornment';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SaveIcon from "@mui/icons-material/Save";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CloseIcon from "@mui/icons-material/Close";
// import "bootstrap/dist/css/bootstrap.min.css";
import CreateCriteria, { sharedSxStyles } from "./createCriteria";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";
import EditCriteria from './editCriteria';
import { useDispatch, useSelector } from "react-redux";
import { closePopup, openPopup, setPage, setSearchResults,setKeywords } from "../../../Redux/Action/criteriaAction";
import axios from "axios";

const RecentCriteria = () => {
  
  const [recentSearch, setRecentSearch] = useState(["person", "every"]);
  const [savedSearch, setSavedSearch] = useState([]);
 const [criteriaId, setCriteriaId] = useState()
 const [showEditPopup, setShowEditPopup] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [keywords, setKeyword] = useState([]);
 const recentKeyword = useSelector((state) => state.criteriaKeywords.keywords);
 console.log("recnetkeyword", recentKeyword.keywords)
//  setKeyword(recentKeyword)
const [formData, setFormData] = useState({
    searchQuery: '',
    datatype: [],
    filetype: [],
    caseIds: [],
    includeArchived: false,
    latitude: '',
    longitude: ''
  });


  useEffect(() => {
    if (recentKeyword) {
      setKeyword(recentKeyword); // Update the state with recentKeyword
      console.log("Updated keywords:", recentKeyword);
    }
  }, [recentKeyword]);

  useEffect(() => {
      fetchData();
    }, []);
  const dispatch = useDispatch();
  const activePopup = useSelector((state) =>state.popup?.activePopup || null);
  console.log("Current Active Popup:", activePopup);

const handelCreate = ()=>{
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
      setSearchQuery(""); // Clear input field
    }
  };

  // Remove chip when clicked
  const handleRemoveItem = (chipToDelete) => {
    setKeyword(keywords.filter((chip) => chip !== chipToDelete));
  };
   

  const Token = Cookies.get('accessToken');
  const fetchData = async () => {
    try {
      const response = await fetch("http://5.180.148.40:9006/api/das/criteria", {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
      const data = await response.json();
      console.log("resposegetCriteria",data.data)
      if (data && data.data) {
        setSavedSearch(data.data.map(item => ({ keyword: item.keyword.slice(0, 3).join(", "), id: item.id }))); // Extract keywords
       console.log("setSavedSearch", setSavedSearch)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log("setkewords",savedSearch,setSavedSearch)
  };

  const handleDelete = async (index, id) => {
    try {
      // Making the DELETE API call
      const response = await fetch(`http://5.180.148.40:9006/api/das/criteria/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
      });
  
      if (response.ok) {
        // Filter the list to remove the item locally
        fetchData()
        toast("Criteria successfully deleted!")
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
    try {
      const payload = {
        keyword: keywords,
        case_id: [],
        file_type: [],
        page: 1,
      };
  
      console.log("Sending search query:", payload);
  
      const response = await axios.post(
        'http://5.180.148.40:9006/api/das/search',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`,
          },
        }
      );
  
      console.log("Search results:", response.data);
  
      dispatch(setSearchResults({
        results: response.data.results,
        total_pages: response.data.total_pages || 1,
        total_results: response.data.total_results || 0,
      }));
  
      dispatch(setKeywords(response.data.input.keyword));
      //  dispatch(setPage(1));
  
        dispatch(openPopup("saved")); // Remove closePopup call
  
    } catch (error) {
      console.error("Error performing search:", error);
    }
  };
  
  
  // const filteredList = savedSearch.filter((item) =>
  //   item.keyword?.toLowerCase().includes(searchQuery.toLowerCase())
  // );
  const filteredList = savedSearch.filter((item) =>
    typeof item.keyword === "string" &&
    item.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="popup-overlay">
    <div className="popup-container">
    <button className="close-icon" onClick={() => dispatch(closePopup())}>
        &times;
      </button>
      <div className="popup-content">
        <h5>Saved Criteria</h5>
    <div className="container p-4  text-white  shadow-lg" style={{  background:'grey' }}>
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
       
       <Send style={{cursor:'pointer'}} onClick={handleSearch}/>
          <TuneIcon  style={{cursor:'pointer'}} onClick={handelCreate}/> {/* New Card List Filter Icon */}
                                    </InputAdornment>
                                ), style: {
                                    height: '38px', // Use consistent height
                                    padding: '0 8px', // Ensure uniform padding
    
                                  },
                            }}
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
  <label style={{ marginLeft: 'auto' }}>Clear Recent</label>
</div>

                <div className="chips-container">
                  {keywords.map((chip, index) => (
                    <div key={index} className="search-chip">
                      <span>{chip}</span>
                      <button className="chip-delete-btn" onClick={() => handleRemoveItem(chip)}>
                        <CloseIcon fontSize='15px' />
                      </button>
                    </div>
                  ))}
                </div>
                
        {/* <List className="bg-gray rounded border-1">
          {keywords.map((item, index) => (
            <ListItem key={index} className="text-white">
              <ListItemText primary={item} />
              <IconButton  onClick={() => handleRemoveItem(item)} style={{
                padding: "0",
                margin: "0",
              }} >
              <CloseIcon style={{fontSize:'15px'}} />
            </IconButton>
            </ListItem>
          ))}
        </List> */}
      </div>
      <hr  />
      <div style={{height:'300px', overflow:'auto'}}>
        
      <div style={{ display: "flex", alignItems: "center" }}>
      <SaveIcon color="action"/>
      <label style={{marginLeft:'5px'}}>Saved Search</label>
    </div>
        <List className="bg-gray">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <ListItem key={index} className="text-white">
              <ListItemText primary={item.keyword} />
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
                <IconButton edge="end" color="dark"   onClick={() => handleDelete(index, item.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))): (
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
        />
      )}
    </div>
  );
};

export default RecentCriteria;
