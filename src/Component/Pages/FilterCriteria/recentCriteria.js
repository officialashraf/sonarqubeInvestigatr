import React, { useState , useEffect} from "react";
import "./recentCriteria.css"
import TuneIcon from '@mui/icons-material/Tune';
import SearchIcon from '@mui/icons-material/Search';
import { TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
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

const RecentCriteria = ({togglePopup, setShowPopup}) => {
  const [search, setSearch] = useState("");
  const [recentSearch, setRecentSearch] = useState(["person", "every"]);
  const [savedSearch, setSavedSearch] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showPopup, setshowPopup] = useState(false)
 const [criteriaId, setCriteriaId] = useState()
//  console.log("criteriaIdmain", criteriaId)
  const toggleEditPopup = () => {
    setShowEditPopup(!showEditPopup);
  };
  const toggle = () => {
  setshowPopup(true);
  };
  const handleRemoveItem = (index) => {
    const updatedSearch = recentSearch.filter((_, i) => i !== index);
    setRecentSearch(updatedSearch);
  };
    useEffect(() => {
      fetchData();
    }, []);

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
      console.log("resposegetCriteria",data)
      if (data && data.data) {
        setSavedSearch(data.data.map(item => ({ keyword: item.keyword, id: item.id }))); // Extract keywords
       
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

  return (
    <div className="popup-overlay">
    <div className="popup-container">
    {/* <button className="close-icon" onClick={onClose}>
        &times;
      </button> */}
      <div className="popup-content">
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
       
       
          <TuneIcon  style={{cursor:'pointer'}} onClick={toggle}/> {/* New Card List Filter Icon */}
       
                                    </InputAdornment>
                                ), style: {
                                    height: '38px', // Use consistent height
                                    padding: '0 8px', // Ensure uniform padding
    
                                  },
                            }}
                            placeholder="Search..."
                            // value={formData.searchQuery}
                            // onChange={(e) => setFormData(prev => ({ ...prev, searchQuery: e.target.value }))}
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
        <List className="bg-gray rounded border-1">
          {recentSearch.map((item, index) => (
            <ListItem key={index} className="text-white">
              <ListItemText primary={item} />
              <IconButton onClick={() => handleRemoveItem(index)} style={{
                padding: "0",
                margin: "0",
              }} >
              <CloseIcon style={{fontSize:'15px'}} />
            </IconButton>
            </ListItem>
          ))}
        </List>
      </div>
      <hr  />
      <div style={{height:'300px', overflow:'auto'}}>
        
      <div style={{ display: "flex", alignItems: "center" }}>
      <SaveIcon color="action"/>
      <label style={{marginLeft:'5px'}}>Saved Search</label>
    </div>
        <List className="bg-gray">
          {savedSearch.map((item, index) => (
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
          ))}
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
      {showPopup && (
        <CreateCriteria setShowPopup={setShowPopup} togglePopup={togglePopup}/>
      )}
    
    </div>
  );
};

export default RecentCriteria;
