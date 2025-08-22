import React, { useState } from "react";
import axios from "axios";
import styles from "./searchBar.module.css";
import { Search } from "react-bootstrap-icons";
import UserCards from "./cardDetails";
import { useDispatch } from 'react-redux';
import { searchSuccess } from "../../../Redux/Action/piiAction";
import { toast } from 'react-toastify';
import validator from "validator";
import Cookies from 'js-cookie';
import Loader from "../Layout/loader";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Select from 'react-select';

const ShowDetails = () => {
  const dispatch = useDispatch();
  const token = Cookies.get('accessToken');
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("phone number");
  const [platform, setPlatform] = useState(""); // New state for social media platform

  const handleSearch = async () => {

    if (!query.trim()) return;
    // if (searchType === "social" && !platform.trim()) {
    //   toast.info("Please select a social media platform");
    //   return;
    // }
    // console.log("Seartype", searchType)

    if (searchType === "email") {
      if (!validator.isEmail(query)) {
        toast.info("Please enter a valid email address");
        return;
      }
    } else if (searchType === "phone number") {

      // Check if the query contains any alphabet character
      const hasAlphabets = /[a-zA-Z]/.test(query);
      const hasInvalidSpecialChars = /[^0-9/\-+.]/.test(query);
      if (hasAlphabets || hasInvalidSpecialChars) {
        toast.info("Phone number must contain only digits");
        return;
      }
    }
    setLoading(true);
    let url = "";
    if (searchType === "email") {
      url = `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/pii/getEmailInfo/${query}`;
    } else if (searchType === "phone number") {
      url = `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/pii/getPhoneNumberInfo/${query.startsWith('+') ? query : '+' + query}`;
    } else if (searchType === "social media id") {
      url = `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/alias/${query}`;
    }

    url = encodeURI(url); // Encode URL to handle special characters

    try {
      console.log("Final URL:", url);
      const response = await axios.get(url, { // Pass headers inside request
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      // setData(response.data);
      dispatch(searchSuccess(response.data));
      console.log("data", response.data);
    } catch (err) {
      console.log("error", err.message);
      toast.error(err.response?.data?.detail || 'Failed to search');
      console.log("full error", err);
    } finally {
      setLoading(false);
    }
  };
  const options = [
    { value: 'phone number', label: <span style={{ color: '#d2d2d2' }}>Phone</span> },
    { value: 'email', label: <span style={{ color: '#d2d2d2' }}>Email</span> },
    {
      value: 'social media id', label: <span style={{ color: '#d2d2d2' }}>Social Media ID</span>
    }
  ];

  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'X', label: 'X' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'vk', label: 'VK' },
    { value: 'skype', label: 'Skype' },
    { value: 'google', label: 'Google' },
    { value: 'gpay', label: 'Google Pay' },
    { value: 'phonepay', label: 'PhonePe' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'gmail', label: 'Gmail' },
    { value: 'telegram', label: 'Telegram' },
    { value: 'discord', label: 'Discord' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'pinterest', label: 'Pinterest' },
    { value: 'axisbank', label: 'Axis Bank' }
  ];

  return (
    <>
      <div className={styles.searchBarContainer}>
        <div className={styles.searchBar}>
          <Select
            className={styles.searchDropdown}
            options={options}
            value={options.find(o => o.value === searchType)}
            onChange={(selected) => {
              setSearchType(selected.value);
              setQuery('');
              setPlatform(''); // Reset platform when search type changes
            }}
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: '#080E17',
                color: '#D9D9D9',
                borderRadius: '15px',
                border: 'none'
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: '#080E17',
                borderRadius: '15px',
                overflow: 'hidden',
                border: "1px solid #0073CF"
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#101D2B' : '#080E17',
                color: '#D9D9D9',
                cursor: 'pointer'
              })
            }}
          />
          {/* {searchType === "social" && (
            <Select
              className={styles.searchDropdown}
              options={socialPlatforms}
              value={socialPlatforms.find(p => p.value === platform)}
              onChange={(selected) => setPlatform(selected.value)}
              placeholder="Select Platform"
              styles={{
                singleValue: (provided) => ({
                  ...provided,
                  color: '#FFFFFF'  // 👈 White color for selected text
                }),
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#080E17',
                  color: '#D9D9D9',
                  borderRadius: '15px',
                  border: 'none'
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: '#080E17',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  border: "1px solid #0073CF",
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused ? '#101D2B' : '#080E17',
                  color: '#D9D9D9',
                  cursor: 'pointer'
                })
              }}
            />
          )} */}
          {searchType === "phone number" ? (
            <PhoneInput
              country={"ng"}
              value={query}
              onChange={(value) => setQuery(value)}
              enableSearch={true}
              inputClass="search-input"
              dropdownStyle={{
                maxHeight: "160px",
                overflowY: "scroll",
                backgroundColor: "#080E17",
                borderRadius: "15px",
                color: "#D9D9D9",
                border: "1px solid #0073CF !important"
              }}
              inputStyle={{
                marginLeft: "50px", //  fix for visibility
              }}
              inputProps={{
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(); //  Triggers on Enter
                  }
                }
              }}
            />
          ) : (
            <input
              className={styles.searchInput}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(); // Validate and execute search only when Enter is pressed
                }
              }}
              // placeholder={searchType === "social" ? "Enter keyword to search" : `Enter ${searchType} to search`}
              placeholder={`Enter ${searchType} to search`}
              disabled={!searchType}
            />
          )}
          <Search
            style={{ color: '#0073CF', cursor: 'pointer', width: '25px', height: '25px' }}
            onClick={handleSearch} // Triggers validation & search only when clicked
          />
        </div>
        <div className={styles.searchResultsContainer}>
          <div className={styles.searchresult}>
            <div className={styles.wrapper}>
              {loading ? (
                <Loader />
              ) : (
                <>
                  <UserCards />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowDetails;
