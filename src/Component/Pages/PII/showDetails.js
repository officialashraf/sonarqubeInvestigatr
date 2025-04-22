import React, { useState, useEffect } from "react";
import axios from "axios";
import "./searchBar.css";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import UserCards from "./cardDetails";
import ProfileDetails from "./profileDetails";

const ShowDetails = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchType, setSearchType] = useState("name");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/users`
        );
        setData(response.data);
        setFilteredResults(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchTypeChange = (e) => setSearchType(e.target.value);
  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearch = () => {
    if (query.trim() === "") {
      setFilteredResults(data);
    } else {
      const filteredData = data.filter((user) =>
        user[searchType]?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filteredData);
    }
  };
  const handleCreateCase = () => {
    navigate(
      "/home"
      //, { state: { showPopup: true } }
    );
  };

  return (
    <>
      <div className="search-bar-container">
        <div className="search-bar">
          <select
            value={searchType}
            onChange={handleSearchTypeChange}
            className="search-dropdown"
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            </select>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            //  onChange={handleSearch}
            placeholder={`Enter ${searchType} to search`}
            className="search-input"
          />
          <Search onClick={handleSearch} color="gray" size="24" />
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
    </>
  );
};

export default ShowDetails;
