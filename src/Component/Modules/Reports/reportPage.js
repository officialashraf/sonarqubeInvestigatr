import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { setPage } from '../../../Redux/Action/criteriaAction';
import { saveReportilterPayload, setReportResults,clearReportilterPayload } from '../../../Redux/Action/reportAction';
import { clearCaseFilterPayload, saveCaseFilterPayload } from "../../../Redux/Action/caseAction";
import axios from 'axios';
import GridView from './gridView';
import SearchUIContainer from "../../Common/SearchBarCriteria/SearchUIContainer";
import AddFilter from './reportFilter'; // You'll need to create this component
import { toast } from 'react-toastify';

const ReportPage = () => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const reportFilter = useSelector((state) => state.reportFilter?.reportFilters);
  const { file_type, keyword, start_time, end_time, target, sentiment,case_id } = reportFilter || {}

  const [inputValue, setInputValue] = useState("");
  
  // Local state for managing chips before sending
  const [localKeywordChips, setLocalKeywordChips] = useState([]);
  const [localFileTypeChips, setLocalFileTypeChips] = useState([]);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [localEndTime, setLocalEndTime] = useState(null);
  const [localTargets, setlocalTargets] = useState([]);
  const [localSentiments, setLocalSentiments] = useState([]);
  const [localCaseIds, setLocalCaseIds] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  // Case options state
  const [caseOptions, setCaseOptions] = useState([]);

  // Initialize with empty payload on mount
  useEffect(() => {
    const savePayload = {
      file_type: [],
      keyword: [],
      start_time: null,
      end_time: null,
      target: [],
      sentiment: [],
      case_id: []
    };
    dispatch(saveReportilterPayload(savePayload));
  }, []);

  // Sync local state with Redux state
  useEffect(() => {
    setLocalKeywordChips(Array.isArray(keyword) ? [...keyword] : []);
     setLocalCaseIds(Array.isArray(case_id) ? [...case_id] : []);
    setLocalFileTypeChips(Array.isArray(file_type) ? [...file_type] : []);
    setlocalTargets(
      Array.isArray(target) && target.length > 0
        ? target.map(t => ({ id: t.id, name: t.name, value: t.value ?? t.id }))
        : []
    );
    setLocalSentiments(Array.isArray(sentiment) ? [...sentiment] : []);
    setLocalStartTime(start_time);
    setLocalEndTime(end_time);
  }, [keyword, file_type, start_time, end_time, sentiment, target,case_id]);

  // Fetch case options on mount
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });

        const caseOptionsFormatted = response.data.data.map(caseItem => ({
          value: caseItem.id,
          label: `${`CASE${String(caseItem.id).padStart(4, "0")}`} - ${caseItem.title || 'Untitled'}`
        }));

        setCaseOptions(caseOptionsFormatted);
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };
    fetchCaseData();
  }, [Token]);

  // Generate display chips from local state
  const getDisplayChips = () => {
    const chips = [];

    chips.push(...localKeywordChips);
    chips.push(...localFileTypeChips);
    chips.push(...localSentiments);
    chips.push(...localTargets.map(t => t.name));
    chips.push(...localCaseIds);

    if (localStartTime && localEndTime) {
      chips.push(`${localStartTime} to ${localEndTime}`);
    }

    return [...new Set(chips)];
  };

  // Handle search submit
  const handleSearchSubmit = async () => {
    const isSearchEmpty = (
      (!localKeywordChips || localKeywordChips.length === 0) &&
      (!localCaseIds || localCaseIds.length === 0) &&
      (!localStartTime && !localEndTime) &&
      (!localFileTypeChips || localFileTypeChips.length === 0) &&
      (!localTargets || localTargets.length === 0) &&
      (!localSentiments || localSentiments.length === 0)
    );

    if (isSearchEmpty) {
      toast("Enter a keyword, or choose a case or date to proceed.");
      return;
    }

    try {
      // Build query object
      const queryObject = {
        report_generation: true,
        ...(localKeywordChips.length > 0 && { keyword: localKeywordChips }),
        ...(localCaseIds.length > 0 && { case_id: localCaseIds }),
        ...(localFileTypeChips.length > 0 && { file_type: localFileTypeChips }),
        ...(localSentiments.length > 0 && { sentiments: localSentiments }),
        ...(localTargets.length > 0 && { targets: localTargets.map(t => String(t.value)) })
      };

      if (localStartTime && localEndTime) {
        queryObject.start_time = localStartTime;
        queryObject.end_time = localEndTime;
      }

      // Build final payload
      const payload = {
        file_extension: "pdf", // Default extension
        query: queryObject,
        page: 1
      };

      console.log("Report search payload", payload);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        payload.query, // Send only the query part for now
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      await dispatch(setReportResults({
        results: response.data.results,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      }));

      // Update Redux state
      const savePayload = {
        keyword: localKeywordChips,
        file_type: localFileTypeChips,
        target: localTargets,
        sentiment: localSentiments,
        case_id: localCaseIds.map(c => String(c.value)) || [],
        ...(localStartTime && { start_time: localStartTime }),
        ...(localEndTime && { end_time: localEndTime })
      };

      dispatch(saveReportilterPayload(savePayload));
      dispatch(setPage(1));

    } catch (error) {
      console.error('Error performing search:', error);
      toast.error('Error performing search');
    }
  };

  // Handle adding new chips to local state
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChip = inputValue.trim();

      if (localKeywordChips.includes(newChip)) {
        setInputValue("");
        return;
      }

      setLocalKeywordChips(prev => [...prev, newChip]);
      setInputValue("");
    }
  };

  const resetSearch = () => {
    setLocalKeywordChips([]);
    setLocalFileTypeChips([]);
    setLocalStartTime(null);
    setLocalEndTime(null);
    setInputValue("");
    setlocalTargets([]);
    setLocalSentiments([]);
    setLocalCaseIds([]);

    dispatch(clearReportilterPayload());
  };

  const removeChip = (chipToRemove) => {
    if (typeof chipToRemove === 'string' && chipToRemove.includes(' to ')) {
      setLocalStartTime(null);
      setLocalEndTime(null);
      return;
    }

    // Remove from respective arrays
    setLocalKeywordChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalFileTypeChips(prev => prev.filter(chip => chip !== chipToRemove));
    setLocalSentiments(prev => prev.filter(chip => chip !== chipToRemove));
    
    // For targets - chipToRemove will be string name
    setlocalTargets(prev => prev.filter(chip => chip.name !== chipToRemove));
    
    // For case IDs - chipToRemove will be the label
    setLocalCaseIds(prev => prev.filter(chip => chip !== chipToRemove));
  };

  const displayChips = getDisplayChips();

  return (
    <div style={{ backgroundColor: "#080E17", height: "100%", zIndex: "1050", overflowY: "hidden" }}>
      <SearchUIContainer
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSearch={handleSearchSubmit}
        handleKeyPress={handleKeyPress}
        resetSearch={resetSearch}
        activeComponent="gridView" // Fixed component
        setActiveComponent={() => {}} // No component switching
        displayChips={displayChips}
        chipCheckFunctions={[
          (chip) => localFileTypeChips.includes(chip),
          (chip) => localSentiments.includes(chip),
          (chip) => localTargets.some(t => t.name === chip),
          (chip) => localCaseIds.includes(chip),
          (chip) => chip.includes(' to ')
        ]}
        removeChip={removeChip}
        PopupComponent={AddFilter}
        isPopupVisible={isPopupVisible}
        setIsPopupVisible={setIsPopupVisible}
        showCaseHeader={false}
        CaseHeaderComponent={null}
        componentsMap={{
          gridView: { icon: null, component: <GridView /> }
        }}
        popupSearchChips={localKeywordChips}
      />
    </div>
  );
};

export default ReportPage;

// import { useState, useEffect } from 'react';
// import Select from 'react-select';
// import DatePickera from '../FilterCriteria/datepicker';
// import { Search, CalendarToday } from '@mui/icons-material';
// import { InputAdornment, TextField } from '@mui/material';
// import { Search as SearchIcon, Close as CloseIcon, Send as SendIcon, Tune as TuneIcon } from "@mui/icons-material";
// import { useDispatch } from 'react-redux';
// import Cookies from 'js-cookie';
// import { setPage } from '../../../Redux/Action/criteriaAction';
// import { setReportResults } from '../../../Redux/Action/reportAction';
// import '../FilterCriteria/createCriteria.module.css';
// import styles from '../../Common/Table/table.module.css';
// import AddButton from '../../Common/Buttton/button';
// import axios from 'axios';
// import GridView from './gridView';
// import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";
// import { toast } from 'react-toastify';
// import AppButton from '../../Common/Buttton/button';

// const ReportPage = () => {
//   const Token = Cookies.get('accessToken');
//   const dispatch = useDispatch();
//   // Search form state
//   const [formData, setFormData] = useState({
//     searchQuery: [],
//     caseIds: [],
//   });

//   const [showPopupD, setShowPopupD] = useState(false);
//   const [selectedDates, setSelectedDates] = useState({
//     startDate: null,
//     endDate: null,
//     startTime: { hours: 16, minutes: 30 },
//     endTime: { hours: 16, minutes: 30 }
//   });

//   // Case options state
//   const [caseOptions, setCaseOptions] = useState([]);

//   // Fetch case options on mount
//   useEffect(() => {
//     const fetchCaseData = async () => {
//       try {
//         const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${Token}`
//           },
//         });

//         // Format the response data for react-select
//         const caseOptionsFormatted = response.data.data.map(caseItem => ({
//           value: caseItem.id,
//           label: `${`CASE${String(caseItem.id).padStart(4, "0")}`} - ${caseItem.title || 'Untitled'}`
//         }));

//         setCaseOptions(caseOptionsFormatted);
//       } catch (error) {
//         console.error('Error fetching case data:', error);
//       }
//     };
//     fetchCaseData();
//   }, [Token]);

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     // If updating `searchQuery`, split input into an array of keywords
//     if (name === "searchQuery") {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value.split(",").map(keyword => keyword) // Split by commas and trim extra spaces
//       }));
//     } else {
//       // For other inputs, handle normally
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }
//   };

//   // Handle case select change
//   const handleCaseChange = (selected) => {
//     setFormData(prev => ({ ...prev, caseIds: selected }));
//   };

//   // Toggle date picker popup
//   const togglePopupD = () => {
//     setShowPopupD(!showPopupD);
//   };

//   // Handle date selection from DatePickera
//   const handleDateSelection = (dateData) => {
//     setSelectedDates(dateData);
//     togglePopupD();
//   };

//   // Format date for display
//   const formatDate = (date) => {
//     if (!date) return 'No date selected';
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   // Handle search submit
//   const handleSearch = async (e) => {
//     e.preventDefault();
//     const isSearchEmpty = (
//       (!formData.searchQuery || formData.searchQuery.length === 0) &&
//       (!formData.caseIds || formData.caseIds.length === 0) &&
//       (!selectedDates.startDate && !selectedDates.endDate)
//     );

//     if (isSearchEmpty) {
//       // ✅ Replace this with toast or snackbar if needed
//       toast("Enter a keyword, or choose a case or date to proceed.");
//       return;
//     }
//     try {
//       const payload = {
//         keyword: Array.isArray(formData.searchQuery) ? formData.searchQuery : [],
//         report_generation: true,

//         case_id: formData.caseIds?.length > 0
//           ? formData.caseIds.map(caseId => caseId.value.toString())
//           : [], // Ensuring it's an empty array, not "[]"
//         page: 1 // Start at page 1
//       };

//       if (selectedDates.startDate && selectedDates.startTime) {
//         payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
//       }

//       if (selectedDates.endDate && selectedDates.endTime) {
//         payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
//       }

//       console.log("search payload", payload);

//       const response = await axios.post(
//         `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
//         payload,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${Token}`
//           }
//         }
//       );
//       await dispatch(setReportResults({
//         results: response.data.results,
//         total_pages: response.data.total_pages,
//         total_results: response.data.total_results,
//       }));

//       console.log("dispatchresponse", response.data.results);
//       // Dispatch initial page number
//       dispatch(setPage(1));

//       // Reset form data
//       setFormData({
//         searchQuery: '',
//         datatype: [],
//         caseIds: [],
//       });

//     } catch (error) {
//       console.error('Error performing search:', error);
//     }
//   };



//   return (
//     <div style={{ backgroundColor: '#080E17', color: 'white' }}>
//       <div
//   className={styles.actionIconsContainer}
//   style={{
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "5px"
//   }}
// >
//   <div
//     className={styles.searchHeader}
//     style={{
//       width: "60%",
//       backgroundColor: "#080E17",
//       display: "flex",
//       alignItems: "center",
//       gap: "10px" // spacing between input and button
//     }}
//   >
//     <TextField
//       fullWidth
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             <SearchIcon style={{ color: "#0073CF" }} />
//           </InputAdornment>
//         ),
//         endAdornment: (
//           <InputAdornment position="end">
//             <SendIcon
//               style={{ cursor: "pointer", color: "#0073CF", marginRight: "5px" }}
//               onClick={handleSearch}
//             />
//             <TuneIcon
//               style={{
//                 cursor: "pointer",
//                 backgroundColor: "#0073CF",
//                 color: "#0A192F"
//               }}
//               // onClick={() => setIsPopupVisible(true)}
//             />
//           </InputAdornment>
//         ),
//         style: {
//           height: "38px",
//           padding: "0 8px",
//           backgroundColor: "#101D2B",
//           borderRadius: "15px",
//           color: "white",
//           fontSize: "12px",
//           marginBottom: "5px"
//         }
//       }}
//       type="text"
//       // value={inputValue}
//       // onChange={(e) => setInputValue(e.target.value)}
//       // onKeyPress={handleKeyPress}
//       placeholder="Search..."
//     />

//     <AppButton
//       children={"Reset"}
//       // onClick={resetSearch}
//       style={{
//         height: "38px",
//         borderRadius: "15px",
//         fontSize: "12px",
//         marginBottom:'5px'
//       }}
//     />
//   </div>

//   {/* If you have other icons or actions, keep them here */}
//   <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
//     {/* Other action buttons or icons */}
//   </div>
// </div>


//       {showPopupD && (
//         <DatePickera
//           onSubmit={handleDateSelection}
//           initialDates={selectedDates}
//           onClose={togglePopupD}
//         />
//       )}

//       <GridView />
//     </div>
//   );
// };

// export default ReportPage;


      {/* <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1, gap: '10px' }}>
          <div className={styles.searchBarContainer}
           style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#101d2b', borderRadius: '15px', paddingLeft: '10px' }}
           >
            <input
              className={styles.searchBar}
              name="searchQuery"
              placeholder="Search..."
              value={formData.searchQuery}
              onChange={handleInputChange}
              style={{ flex: 1, backgroundColor: '#101d2b', border: 'none', color: 'white', height: '38px', borderRadius: '15px' }}
            />
            <Search style={{ color: '#0073CF', cursor: 'pointer' }} onClick= {handleSearch}/>
          </div>
          <div style={{ flex: 1 }}>
            <Select
              className={styles.reactSelectContainer}
              isMulti
              options={caseOptions}
              value={formData.caseIds}
              onChange={handleCaseChange}
              placeholder="Select Cases"
              styles={{
                ...customSelectStyles,
                control: (base) => ({
                  ...base,
                  backgroundColor: '#101d2b',
                  borderRadius: '15px',
                  height: '38px',
                  minHeight: '38px',
                  border: 'none',
                }),
                menuPortal: base => ({ ...base, zIndex: 9999 }),
              }}
              menuPortalTarget={document.body}
              menuShouldBlockScroll={true}
            />
          </div>
          <TextField
            placeholder="Date Select"
            value={
              selectedDates.startDate && selectedDates.endDate
                ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
                : formatDate(selectedDates.startDate || selectedDates.endDate)
            }
            onClick={togglePopupD}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarToday style={{ cursor: 'pointer', color: '#0073CF' }} />
                </InputAdornment>
              ),
              readOnly: true,
              style: { height: '38px', color: 'white', backgroundColor: '#101d2b', borderRadius: '15px', border: 'none' }
            }}
            style={{ flex: 1 }}
          />
        </div>
        <AddButton
          type="submit"
          style={{ flexShrink: 0, backgroundColor: '#0073CF', color: 'white', height: '38px', borderRadius: '15px', padding: '0 20px' }}
        >
          Search
        </AddButton>
      </form> */}
   
