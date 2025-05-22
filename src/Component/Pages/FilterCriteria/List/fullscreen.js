
import { useState, useEffect } from 'react';
import '../savedCriteria.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputAdornment from '@mui/material/InputAdornment';
import { TextField } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { sharedSxStyles } from "../createCriteria";
import SendIcon from '@mui/icons-material/Send';
import CriteriaCaseTable from './criteriaCaseList';
import AddNewCriteria from '../addNewCriteria';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import { setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ListAltOutlined, PieChart } from "@mui/icons-material";
import GrapghicalCriteria from './CriteriaGraphicaView/grapghicalCriteria';
import Loader from '../../Layout/loader';


const SearchResults = ({ onClose }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState('');
  const [searchChips, setSearchChips] = useState([]);
  const [enterInput, setEnterInput] = useState([])
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState('list');


  const { searchResults, totalPages, currentPage, totalResults } = useSelector((state) => state.search);
  console.log("searchResult", searchResults, totalPages, currentPage, totalResults);

  const keywords = useSelector((state) => state.criteriaKeywords?.queryPayload?.keyword || '');
  console.log("Keywords from Redux:", keywords);

  const caseId = useSelector((state) => state.criteriaKeywords?.queryPayload?.case_id || '');
  console.log("casId", caseId)

  const fileType = useSelector((state) => state.criteriaKeywords?.queryPayload?.file_type || '');
  console.log("filetype", fileType)
  const reduxPayload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  console.log("Full Redux Payload:", reduxPayload);



  const handleComponentToggle = (componentName) => {
    setActiveComponent(componentName);
  };

  useEffect(() => {
    console.log("Keywords object:", keywords);
    console.log("Case ID:", caseId);
    console.log("File Type:", fileType);

    const isValid = (val) =>
      val !== null && val !== undefined && val.toString().trim() !== "";

    if (keywords && Array.isArray(keywords)) {
      let combinedChips = [...keywords];

      if (Array.isArray(caseId) && caseId.length > 0) {
        combinedChips = [...combinedChips, ...caseId.map((id) => `${id}`)]; // Ensure each caseId value remains a string
      }


      // Check if fileType is an array and merge its values
      if (Array.isArray(fileType) && fileType.length > 0) {
        combinedChips = [...combinedChips, ...fileType];
      } else if (isValid(fileType)) {
        combinedChips.push(fileType); // Add fileType if it's a valid single value
      }

      console.log("Combined Chips:", combinedChips);
      setSearchChips(combinedChips);
    } else {
      console.log("Keywords is not an array or doesn't exist.");
      setSearchChips([]); // Fallback for empty or invalid data
      // setActiveTab([]);
    }
  }, [keywords, caseId, fileType]);
  const openPopup = () => {
    setIsPopupVisible(true); // Pop-up ko open karne ke liye state ko true kare
  };
  const exitClick = () => {
    navigate('/cases')
  }

  const Token = Cookies.get('accessToken');

  console.log("Keywords saerch:", searchChips);
  const filteredChips = searchChips.filter((chip) =>
    (typeof chip === "string" && chip.toLowerCase().includes(inputValue.toLowerCase())) ||
    (typeof chip === "number" && chip.toString().includes(inputValue)) // Search for numbers
  );

  console.log("filterdeChpis", filteredChips)
  // Add new chip when "Enter" is pressed
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChip = inputValue.trim();
      if (!searchChips.find((chip) => chip === newChip)) {
        setSearchChips((prev) => [...prev, newChip]);
        setEnterInput((prev) => [...prev, newChip]); // user input me add karna hai
      }
      setInputValue("");
    }
  };

  const removeChip = (chipToRemove) => {
    const updatedChips = searchChips.filter((chip) => chip !== chipToRemove);
    setSearchChips(updatedChips);

    // ❗ Only remove from enterInput if it was user's entered chip
    setEnterInput((prev) => prev.filter((chip) => chip !== chipToRemove));
  };

  const resetSearch = () => {
    setSearchChips([]);
    setInputValue('');
    setEnterInput([])
  };

  const handleSearch = async () => {
    console.log("reduxPayload:", reduxPayload);
    console.log("enterInput:", enterInput);
    console.log("searchChips:", searchChips);

    try {
      // setLoading(true);
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
      const finalKeywords = searchChips.filter((chip) => allPossibleKeywords.includes(chip));
      console.log("finalkeywords", finalKeywords)
      // 2. case_id aur file_type separately treat honge
      const reduxCaseIds = Array.isArray(reduxPayload.case_id)
        ? reduxPayload.case_id
        : JSON.parse(reduxPayload.case_id || "[]");

      const reduxFileTypes = Array.isArray(reduxPayload.file_type)
        ? reduxPayload.file_type
        : JSON.parse(reduxPayload.file_type || "[]");
      console.log("fileType or Caseids", reduxCaseIds, reduxFileTypes)
      const finalCaseIds = searchChips.filter((chip) => reduxCaseIds.includes(chip));
      const finalFileTypes = searchChips.filter((chip) => reduxFileTypes.includes(chip));
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
handleComponentToggle("list")
      dispatch(setPage(1));

    } catch (error) {
      console.error("Error performing search:", error);
    } 
     };


  return (

    <div className="search-container" style={{ backgroundColor: 'darkgray', height: '100%', zIndex: '1050' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', aligntems: 'center', marginTop: '5px' }}>
        {/* 
  <h6 >Search Results</h6 > */}

        <div className="search-header" style={{ width: '50%' }}>

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

                  <SendIcon style={{ cursor: 'pointer' }} onClick={handleSearch} />
                  <TuneIcon onClick={openPopup} style={{ cursor: 'pointer' }} /> {/* New Card List Filter Icon */}

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


        </div>
        <button className="action-button" style={{ padding: '0px 5px', height: '30px', marginTop: "5px" }} onClick={resetSearch}>RESET</button>

        <button className="action-button" style={{ padding: '0px 5px', height: '30px', marginTop: "5px" }} onClick={exitClick}>Exit FullScreen</button>
      </div>

      <div className="search-term-indicator">
        <div className="chips-container">
          {filteredChips && filteredChips.map((chip, index) => (
            <div key={index} className="search-chip">
              <span>{chip}</span>
              <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                <CloseIcon fontSize='15px' />
              </button>
            </div>
          ))}
        </div>

      </div>
      <div className="col-auto  d-flex align-items-center gap-1 justify-content-end  me-2">
        <PieChart
          className="icon-style"
          onClick={() => handleComponentToggle("graph")}
        />
        <ListAltOutlined
          className="icon-style"
          onClick={() => handleComponentToggle("list")}
        />
      </div>
      <div className="search-results" style={{ height: 'auto' }}>

        {activeComponent === "graph" && (
          <GrapghicalCriteria searchChips={searchChips} />
        )}
        {activeComponent === "list" && (
          <CriteriaCaseTable searchChips={searchChips} />
        )}

      </div>

      {isPopupVisible && <AddNewCriteria searchChips={searchChips} isPopupVisible={isPopupVisible} setIsPopupVisible={setIsPopupVisible} />}

    </div>



  );
};

export default SearchResults; 