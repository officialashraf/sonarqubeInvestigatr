// import React, { useEffect, useState } from "react";
// import { TextField, InputAdornment } from "@mui/material";
// import { PieChart } from "@mui/icons-material";
// import { ListAltOutlined } from "@mui/icons-material";
// import { FaPhotoVideo } from "react-icons/fa";
// import SearchIcon from "@mui/icons-material/Search";
// import SendIcon from "@mui/icons-material/Send";
// import TuneIcon from "@mui/icons-material/Tune";
// import CloseIcon from "@mui/icons-material/Close";
// import AppButton from "../../Common/Buttton/button"; // Assuming you have this
// import GraphicalData from "./GraphicalData/graphicalData";
// import Resources from "./Resources";
// import TabulerData from "./TabularData/tabulerData";
// import styles from "./caseHeader.module.css";
// import CaseHeader from "./caseHeader";
// import AddFilter from "./TabularData/filter";
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSummaryData } from "../../../Redux/Action/filterAction";
// import { clearCaseFilterPayload, saveCaseFilterPayload } from "../../../Redux/Action/caseAction";
// // import styles from "./SearchResults.module.css"; // Adjust your stylesheet import

// const CaseTableDataFilter = () => {
//     const dispatch = useDispatch();
// const caseData = useSelector((state) => state.caseData.caseData);
// const caseFilter = useSelector((state) => state.caseFilter?.caseFilters );
// console.warn("caseflter", caseFilter)
// const { file_type,aggs_fields,keyword,start_time,end_time } = caseFilter || {}

// //  console.log("caseFilterChips",file_type,aggs_fields,keyword);
//   const [inputValue, setInputValue] = useState("");
//   const [searchChips, setSearchChips] = useState([]);
//   console.log("searchChips", searchChips)
//   const [filteredChips, setFilteredChips] = useState([]);
//     console.log("filterChips", filteredChips)
//   const [activeComponent, setActiveComponent] = useState("graphicalData");
//   const [isPopupVisible, setIsPopupVisible] = useState(false);

//   const openPopup = () => {
//     console.log("TuneIcon clicked, opening popup");
//     setIsPopupVisible(true);
//   };
//  // redux se caseData lo
//  useEffect(() => {
//     if (caseData?.id) {
//       const savePayload = {
//         caseId: caseData.id,
//         file_type: [],
//         keyword: [],
//         aggs_fields: [],
//       };
//       dispatch(saveCaseFilterPayload(savePayload));
//       console.log("saveredux", savePayload);
//     }
//   }, [caseData?.id]); 
// useEffect(() => {
//   const chips = [];

//   if (Array.isArray(file_type)) chips.push(...file_type);
//   else if (file_type) chips.push(file_type);

//   if (Array.isArray(aggs_fields)) chips.push(...aggs_fields);
//   else if (aggs_fields) chips.push(aggs_fields);

//   if (Array.isArray(keyword)) chips.push(...keyword);
//   else if (keyword) chips.push(keyword);

//   setFilteredChips(chips);
//   setSearchChips(chips);
// }, [file_type, aggs_fields, keyword]);



// const handleSearchSubmit = () => {
//   if (!caseData?.id) return;
// // const platformList = ["facebook", "instagram", "vk", "x", "tiktok", "linkedin", "youtube"];
// // const aggragtionFields = [
// //   "person", "org", "gpe", "loc", "product", "event", "work_of_art",
// //   "law", "language", "percent", "money", "date", "time", "quantity"
// // ];

// // const file_type = [];
// // const aggsFields = [];
// // const keyword = [];
// // console.log("aggsfileds",aggsFields)
// // filteredChips.forEach((chip) => {
// //   const normalizedChip = chip.toLowerCase().trim();

// //   if (platformList.includes(normalizedChip)) {
// //     file_type.push(chip); // send original chip
// //   } else if (aggragtionFields.includes(normalizedChip)) {
// //     aggsFields.push(chip); // send original chip
// //   } else {
// //     keyword.push(chip); // send original chip
// //   }
// // });

// const keyword = [...filteredChips]
//   const queryPayload = {
//     unified_case_id: caseData.id,
//   };

//   const summaryPayload ={
//     queryPayload,
//     ...(keyword.length > 0 && { keyword }),
//     // ...(aggsFields.length > 0 && { aggsFields }),
//     // ...(file_type.length > 0 && { file_type }),
//     // file_type: [],       // empty
//     // aggs_fields: [],
//     page: 1,
//     itemsPerPage: 50
//   }
//   dispatch(fetchSummaryData(summaryPayload));
//   console.log("summaryadte",summaryPayload)
//   const savePayload ={
//         caseId: caseData.id,
//         keyword:keyword,
//         //  file_type:file_type,
//         // aggs_fields:aggsFields,
//     //     file_type: [],       // empty
//     // aggs_fields: [],
//       }
//      dispatch(saveCaseFilterPayload(savePayload));
//       console.log("saveredux", savePayload)
// };

//  const handleKeyPress = (e) => {
//   if (e.key === "Enter" && inputValue.trim() !== "") {
//     const newChip = inputValue.trim();
//     const newChips = [...searchChips, newChip];
//     setSearchChips(newChips);
//     setFilteredChips(newChips);
//     setInputValue("");
//   }
// };

//   const resetSearch = () => {
//     dispatch(clearCaseFilterPayload());
//     setInputValue("");
//     setSearchChips([]);
//     setFilteredChips([]);
//   };


// const removeChip = (chipToRemove) => {
//   const newChips = searchChips.filter(chip => chip !== chipToRemove);
//   setSearchChips(newChips);
//   setFilteredChips(newChips);
// };



//   return (
//     <div className="search-container" style={{ backgroundColor: "#080E17", height: "100%", zIndex: "1050" }}>
//       <CaseHeader/>
//       <div className={styles.actionIconsContainer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
//         <div className={styles.searchHeader} style={{ width: "60%", backgroundColor: "#080E17" }}>

//           <TextField
//             fullWidth
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon style={{ color: "#0073CF" }} />
//                 </InputAdornment>
//               ),
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <SendIcon
//                     style={{ cursor: "pointer", color: "#0073CF", marginRight: "5px" }}
//                      onClick={handleSearchSubmit}
//                   />
//                   <TuneIcon
//                     style={{ cursor: "pointer", backgroundColor: "#0073CF", color: "#0A192F" }}
//                     onClick={openPopup}
//                   />
//                 </InputAdornment>
//               ),
//               style: {
//                 height: "38px",
//                 padding: "0 8px",
//                 backgroundColor: "#101D2B",
//                 borderRadius: "15px",
//                 color: "white",
//                 fontSize: "12px",
//                 marginBottom: "5px",
//               },
//             }}
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Search..."
//           />
//           <div style={{ padding: "0px 0px", height: "20px", marginLeft: "5px" }}>
//             <AppButton children={"Reset"} onClick={resetSearch} />
//           </div>
//         </div>

//         <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
//           <PieChart
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "graphicalData" ? styles.activeIcon : ""}`}
//             onClick={() => setActiveComponent("graphicalData")}
//           />
//           <FaPhotoVideo
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "resources" ? styles.activeIcon : ""}`}
//             onClick={() => setActiveComponent("resources")}
//           />
//           <ListAltOutlined
//             sx={{ fontSize: 40 }}
//             className={`${styles.icon} ${activeComponent === "caseData" ? styles.activeIcon : ""}`}
//             onClick={() => setActiveComponent("caseData")}
//           />
//         </div>
//       </div>

//       <div className="search-term-indicator" style={{ backgroundColor: "#080E17", marginBottom: "10px" }}>
//         <div className="chips-container">
//           {filteredChips.map((chip, index) => (
//             <div key={index} className="search-chip">
//               <span>{chip}</span>
//               <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
//                 <CloseIcon fontSize="15px" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div style={{height:"380px", borderRadius: "15px", overflow: "auto" }}>
//         {activeComponent === "graphicalData" && <GraphicalData  />}
//         {activeComponent === "resources" && <Resources  />}
//         {activeComponent === "caseData" && <TabulerData  />}
//       </div>

//       {isPopupVisible && (
//         <AddFilter
//         searchChips={keyword}
//           isPopupVisible={isPopupVisible}
//           setIsPopupVisible={setIsPopupVisible}
//         />
//       )}
//     </div>
//   );
// };

// export default CaseTableDataFilter;
import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { PieChart } from "@mui/icons-material";
import { ListAltOutlined } from "@mui/icons-material";
import { FaPhotoVideo } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "../../Common/Buttton/button";
import GraphicalData from "./GraphicalData/graphicalData";
import Resources from "./Resources";
import TabulerData from "./TabularData/tabulerData";
import styles from "./caseHeader.module.css";
import CaseHeader from "./caseHeader";
import AddFilter from "./TabularData/filter";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
import { clearCaseFilterPayload, saveCaseFilterPayload } from "../../../Redux/Action/caseAction";

const CaseTableDataFilter = () => {
    const dispatch = useDispatch();
    const caseData = useSelector((state) => state.caseData.caseData);
    const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
    console.warn("caseflter", caseFilter)
    const { file_type, aggs_fields, keyword, start_time, end_time, target, sentiment } = caseFilter || {}

    const [inputValue, setInputValue] = useState("");

    // Local state for managing chips before sending
    const [localKeywordChips, setLocalKeywordChips] = useState([]);
    const [localFileTypeChips, setLocalFileTypeChips] = useState([]);
    const [localAggsFieldsChips, setLocalAggsFieldsChips] = useState([]);
    const [localStartTime, setLocalStartTime] = useState(null);
    const [localEndTime, setLocalEndTime] = useState(null);
    const [localTargets, setlocalTargets] = useState([]);
    const [localSetiments, setLocalSetiments] = useState([]);
    const [activeComponent, setActiveComponent] = useState("graphicalData");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const openPopup = () => {
        console.log("TuneIcon clicked, opening popup");
        setIsPopupVisible(true);
    };

    // Initialize with empty payload on case load
    useEffect(() => {
        if (caseData?.id) {
            const savePayload = {
                caseId: caseData.id,
                file_type: [],
                keyword: [],
                aggs_fields: [],
                start_time: null,
                end_time: null,
                target: [],
                sentiment: []
            };
            dispatch(saveCaseFilterPayload(savePayload));
            console.log("Initial redux payload", savePayload);
        }
    }, [caseData?.id]);

    // Sync local state with Redux state (for display purposes only)
    useEffect(() => {
        setLocalKeywordChips(Array.isArray(keyword) ? [...keyword] : []);
        setLocalFileTypeChips(Array.isArray(file_type) ? [...file_type] : []);
        setLocalAggsFieldsChips(Array.isArray(aggs_fields) ? [...aggs_fields] : []);
        setlocalTargets(Array.isArray(target) ? [...target] : []);
        setLocalSetiments(Array.isArray(sentiment) ? [...sentiment] : []);
        setLocalStartTime(start_time);
        setLocalEndTime(end_time);
    }, [keyword, file_type, aggs_fields, start_time, end_time, sentiment, target]);

    // Generate display chips from local state
    const getDisplayChips = () => {
        const chips = [];

        // Add all local chips
        chips.push(...localKeywordChips);
        chips.push(...localFileTypeChips);
        chips.push(...localAggsFieldsChips);
        chips.push(...localSetiments);
        chips.push(...localTargets);

        // Add time range chip if both exist
        if (localStartTime && localEndTime) {
            chips.push(`${localStartTime} to ${localEndTime}`);
        }

        return [...new Set(chips)]; // Remove duplicates
    };

    const handleSearchSubmit = () => {
        if (!caseData?.id) return;

        // Only update Redux and make API call when Send is clicked
        // const queryPayload = {
        //     unified_case_id: caseData.id,
        // };

        const summaryPayload = {
            case_id: String(caseData.id),
            ...(localKeywordChips.length > 0 && { keyword: localKeywordChips }),
            ...(localFileTypeChips.length > 0 && { file_type: localFileTypeChips }),
            ...(localAggsFieldsChips.length > 0 && { aggs_fields: localAggsFieldsChips }),
            ...(localSetiments.length > 0 && { sentiments: localSetiments }),
            ...(localTargets.length > 0 && { target: localTargets }),
            ...(localStartTime && { starttime: localStartTime }),
            ...(localEndTime && { endtime: localEndTime }),
            page: 1,
            itemsPerPage: 50
        }
        // Make API call
        dispatch(fetchSummaryData(summaryPayload));
        console.log("API summaryPayload", summaryPayload);

        // Update Redux state
        const savePayload = {
            caseId: caseData.id,
            keyword: localKeywordChips,
            file_type: localFileTypeChips,
            aggs_fields: localAggsFieldsChips,
            target: localTargets,
            sentiment: localSetiments,
            ...(localStartTime && { start_time: localStartTime }),
            ...(localEndTime && { end_time: localEndTime }),
        }

        dispatch(saveCaseFilterPayload(savePayload));
        console.log("Updated redux payload", savePayload);
    };

    // Handle adding new chips to local state only
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newChip = inputValue.trim();

            // Check if already exists in keyword chips only
            if (localKeywordChips.includes(newChip)) {
                setInputValue("");
                return;
            }

            // Everything from search bar goes to keywords only
            setLocalKeywordChips(prev => [...prev, newChip]);
            setInputValue("");
        }
    };

    const resetSearch = () => {
        // Clear both local state and Redux
        setLocalKeywordChips([]);
        setLocalFileTypeChips([]);
        setLocalAggsFieldsChips([]);
        setLocalStartTime(null);
        setLocalEndTime(null);
        setInputValue("");

        dispatch(clearCaseFilterPayload());
    };

    const removeChip = (chipToRemove) => {
        // Remove from local state only
        if (chipToRemove.includes(' to ')) {
            setLocalStartTime(null);
            setLocalEndTime(null);
            return;
        }

        // Remove from appropriate local array
        setLocalKeywordChips(prev => prev.filter(chip => chip !== chipToRemove));
        setLocalFileTypeChips(prev => prev.filter(chip => chip !== chipToRemove));
        setLocalAggsFieldsChips(prev => prev.filter(chip => chip !== chipToRemove));
        setLocalSetiments(prev => prev.filter(chip => chip !== chipToRemove));
        setlocalTargets(prev => prev.filter(chip => chip !== chipToRemove));
    };

    const displayChips = getDisplayChips();

    return (
        <div className="search-container" style={{ backgroundColor: '#080E17', height: '100%', zIndex: '1050', overflowY: "hidden" }}>
            <CaseHeader />
            <div className={styles.actionIconsContainer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                <div className={styles.searchHeader} style={{ width: "60%", backgroundColor: "#080E17" }}>
                    <TextField
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon style={{ color: "#0073CF" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SendIcon
                                        style={{ cursor: "pointer", color: "#0073CF", marginRight: "5px" }}
                                        onClick={handleSearchSubmit}
                                    />
                                    <TuneIcon
                                        style={{ cursor: "pointer", backgroundColor: "#0073CF", color: "#0A192F" }}
                                        onClick={openPopup}
                                    />
                                </InputAdornment>
                            ),
                            style: {
                                height: "38px",
                                padding: "0 8px",
                                backgroundColor: "#101D2B",
                                borderRadius: "15px",
                                color: "white",
                                fontSize: "12px",
                                marginBottom: "5px",
                            },
                        }}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Search..."
                    />
                    <div style={{ padding: "0px 0px", height: "20px", marginLeft: "5px" }}>
                        <AppButton children={"Reset"} onClick={resetSearch} />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <PieChart
                        sx={{ fontSize: 40 }}
                        className={`${styles.icon} ${activeComponent === "graphicalData" ? styles.activeIcon : ""}`}
                        onClick={() => setActiveComponent("graphicalData")}
                    />
                    <FaPhotoVideo
                        sx={{ fontSize: 40 }}
                        className={`${styles.icon} ${activeComponent === "resources" ? styles.activeIcon : ""}`}
                        onClick={() => setActiveComponent("resources")}
                    />
                    <ListAltOutlined
                        sx={{ fontSize: 40 }}
                        className={`${styles.icon} ${activeComponent === "caseData" ? styles.activeIcon : ""}`}
                        onClick={() => setActiveComponent("caseData")}
                    />
                </div>
            </div>

            <div className="search-term-indicator" style={{ backgroundColor: "#080E17" }}>
                <div className="chips-container">
                    {displayChips.map((chip, index) => {
                        // Determine chip type for styling
                        let chipStyle = { backgroundColor: "#0073CF", color: "white" }; // Default for keywords

                        // Check chip type for styling
                        if (localFileTypeChips.includes(chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        else if (localAggsFieldsChips.includes(chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        else if (localSetiments.includes(chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        else if (localTargets.includes(chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        else if (chip.includes(' to ')) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }

                        return (
                            <div key={index} className="search-chip" style={{
                                ...chipStyle,
                                padding: "4px 8px",
                                borderRadius: "12px",
                                margin: "2px",
                                display: "inline-flex",
                                alignItems: "center",
                                fontSize: "12px"
                            }}>
                                <span>{chip}</span>
                                <button
                                    className="chip-delete-btn"
                                    onClick={() => removeChip(chip)}
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

            <div style={{ borderRadius: "15px", overflowY: "auto" }}>
                {activeComponent === "graphicalData" && <GraphicalData />}
                {activeComponent === "resources" && <Resources />}
                {activeComponent === "caseData" && <TabulerData />}
            </div>

            {isPopupVisible && (
                <AddFilter
                    searchChips={localKeywordChips}
                    isPopupVisible={isPopupVisible}
                    setIsPopupVisible={setIsPopupVisible}
                />
            )}
        </div>
    );
};

export default CaseTableDataFilter;
