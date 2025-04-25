import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchBar.css";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import UserCards from "./cardDetails";
import ProfileDetails from "./profileDetails";
import { useDispatch, useSelector } from 'react-redux';
import { searchFailure, searchRequest, searchSuccess } from "../../../Redux/Action/piiAction";

const ShowDetails = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
 
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState('');
  const dispatch = useDispatch();
  
  const handleSearch = async () => {
    if (!query.trim()) return;
  
    let url = "";
    console.log("searchTyep",searchType)
   console.log("searchQuery",query)
    if (searchType === "email") {
      url = `http://5.180.148.40:9002/api/osint-man/v1/email/${query}`;
    } else {
      url = `http://5.180.148.40:9002/api/osint-man/v1/phone-no/${query}`;
    }
  
    url = encodeURI(url); // in case of special chars like @
  
    try {
      console.log("Final URL:", url);
      const response = await axios.get(url);
      console.log("data--------",response);
      setData(response.data); // important fix
      dispatch(searchSuccess(response.data))
      console.log("data", response.data);
    } catch (err) {
      console.log("error", err.message);
      console.log("full error", err);
    }
  };
  
  const handleCreateCase = () => {
    navigate(
      "/cases"
      //, { state: { showPopup: true } }
    );
  };

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
        <select className="search-dropdown" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="" disabled selected>Select</option>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>
          
          
          
           <input
            className="search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch(); // Calls the search function when Enter is pressed
          }
        }}
      
        placeholder={`Enter ${searchType} to search`}
      />
          <Search onClick={handleSearch} color="gray" size="15" style={{marginRight:'5px'}} />
        </div>
        <div className="search-results-container">
          <div className="searchresult"  >
           
           <div className="wrapper">
           <ProfileDetails/>
           <UserCards/>
           </div>

          </div>
        </div>
        <div className="button-container">
          <button className="create-case-button" onClick={handleCreateCase}>
            Create Case
          </button>
        </div>
      </div>
      {/* <div className="search-bar">
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
      </select>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`Enter ${searchType}`}
      />

      <button onClick={handleSearch}>Search</button>

      Optional: Show response
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div> */}
    </>
  );
};

export default ShowDetails;
