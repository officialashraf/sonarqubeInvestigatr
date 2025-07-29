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
    const { file_type, aggs_fields, keyword, start_time, end_time } = caseFilter || {}

    const [inputValue, setInputValue] = useState("");
    const [searchChips, setSearchChips] = useState([]);
    console.log("searchChips", searchChips)
    const [filteredChips, setFilteredChips] = useState([]);
    console.log("filterChips", filteredChips)
    const [activeComponent, setActiveComponent] = useState("graphicalData");
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const openPopup = () => {
        console.log("TuneIcon clicked, opening popup");
        setIsPopupVisible(true);
    };

    // redux se caseData lo
    useEffect(() => {
        if (caseData?.id) {
            const savePayload = {
                caseId: caseData.id,
                file_type: [],
                keyword: [],
                aggs_fields: [],
                start_time: null,
                end_time: null,
            };
            dispatch(saveCaseFilterPayload(savePayload));
            console.log("saveredux", savePayload);
        }
    }, [caseData?.id]);

    // Fixed useEffect - only sync from Redux, don't mix with local state
    useEffect(() => {
        const chips = [];

        // Add file_type chips
        if (Array.isArray(file_type)) {
            chips.push(...file_type);
        } else if (file_type) {
            chips.push(file_type);
        }

        // Add aggs_fields chips
        if (Array.isArray(aggs_fields)) {
            chips.push(...aggs_fields);
        } else if (aggs_fields) {
            chips.push(aggs_fields);
        }

        // Add keyword chips
        if (Array.isArray(keyword)) {
            chips.push(...keyword);
        } else if (keyword) {
            chips.push(keyword);
        }

        // Add time range chip if both start_time and end_time exist
        if (start_time && end_time) {
            const timeRangeChip = `${start_time} to ${end_time}`;
            chips.push(timeRangeChip);
        }

        // Remove duplicates using Set
        const uniqueChips = [...new Set(chips)];
        
        setFilteredChips(uniqueChips);
        setSearchChips(uniqueChips);
    }, [file_type, aggs_fields, keyword, start_time, end_time]);

    const handleSearchSubmit = () => {
        if (!caseData?.id) return;

        // Separate chips by type
        const platformList = ["facebook", "instagram", "vk", "x", "tiktok", "linkedin", "youtube"];
        const aggregationFields = [
            "person", "org", "gpe", "loc", "product", "event", "work_of_art",
            "law", "language", "percent", "money", "date", "time", "quantity"
        ];

        const fileTypeChips = [];
        const aggsFieldsChips = [];
        const keywordChips = [];

        // Filter out time range chips and categorize others
        const nonTimeChips = filteredChips.filter(chip => !chip.includes(' to '));
        
        nonTimeChips.forEach((chip) => {
            const normalizedChip = chip.toLowerCase().trim();

            if (platformList.includes(normalizedChip)) {
                fileTypeChips.push(chip);
            } else if (aggregationFields.includes(normalizedChip)) {
                aggsFieldsChips.push(chip);
            } else {
                keywordChips.push(chip);
            }
        });

        const queryPayload = {
            unified_case_id: caseData.id,
        };

        const summaryPayload = {
            queryPayload,
            ...(keywordChips.length > 0 && { keyword: keywordChips }),
            ...(fileTypeChips.length > 0 && { file_type: fileTypeChips }),
            ...(aggsFieldsChips.length > 0 && { aggs_fields: aggsFieldsChips }),
            ...(start_time && { start_time }),
            ...(end_time && { end_time }),
            page: 1,
            itemsPerPage: 50
        }

        dispatch(fetchSummaryData(summaryPayload));
        console.log("summaryPayload", summaryPayload);

        const savePayload = {
            caseId: caseData.id,
            keyword: keywordChips,
            file_type: fileTypeChips,
            aggs_fields: aggsFieldsChips,
            ...(start_time && { start_time }),
            ...(end_time && { end_time }),
        }

        dispatch(saveCaseFilterPayload(savePayload));
        console.log("saveredux", savePayload);
    };

    // Fixed handleKeyPress - update Redux immediately
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newChip = inputValue.trim();
            
            // Don't add if already exists
            if (filteredChips.includes(newChip)) {
                setInputValue("");
                return;
            }

            // Categorize the new chip
            const platformList = ["facebook", "instagram", "vk", "x", "tiktok", "linkedin", "youtube"];
            const aggregationFields = [
                "person", "org", "gpe", "loc", "product", "event", "work_of_art",
                "law", "language", "percent", "money", "date", "time", "quantity"
            ];

            const normalizedChip = newChip.toLowerCase().trim();
            let updatedKeywords = Array.isArray(keyword) ? [...keyword] : [];
            let updatedFileTypes = Array.isArray(file_type) ? [...file_type] : [];
            let updatedAggsFields = Array.isArray(aggs_fields) ? [...aggs_fields] : [];

            if (platformList.includes(normalizedChip)) {
                updatedFileTypes.push(newChip);
            } else if (aggregationFields.includes(normalizedChip)) {
                updatedAggsFields.push(newChip);
            } else {
                updatedKeywords.push(newChip);
            }

            // Update Redux immediately
            const savePayload = {
                caseId: caseData.id,
                keyword: updatedKeywords,
                file_type: updatedFileTypes,
                aggs_fields: updatedAggsFields,
                ...(start_time && { start_time }),
                ...(end_time && { end_time }),
            };

            dispatch(saveCaseFilterPayload(savePayload));
            setInputValue("");
        }
    };

    const resetSearch = () => {
        dispatch(clearCaseFilterPayload());
        setInputValue("");
        setSearchChips([]);
        setFilteredChips([]);
    };

    const removeChip = (chipToRemove) => {
        // If removing time range chip, clear start_time and end_time from redux
        if (chipToRemove.includes(' to ')) {
            const currentPayload = {
                caseId: caseData.id,
                keyword: keyword || [],
                file_type: file_type || [],
                aggs_fields: aggs_fields || [],
                start_time: null,
                end_time: null,
            };
            dispatch(saveCaseFilterPayload(currentPayload));
            return;
        }

        // Remove from appropriate Redux array
        const updatedKeywords = Array.isArray(keyword) ? keyword.filter(chip => chip !== chipToRemove) : [];
        const updatedFileTypes = Array.isArray(file_type) ? file_type.filter(chip => chip !== chipToRemove) : [];
        const updatedAggsFields = Array.isArray(aggs_fields) ? aggs_fields.filter(chip => chip !== chipToRemove) : [];

        const savePayload = {
            caseId: caseData.id,
            keyword: updatedKeywords,
            file_type: updatedFileTypes,
            aggs_fields: updatedAggsFields,
            ...(start_time && { start_time }),
            ...(end_time && { end_time }),
        };

        dispatch(saveCaseFilterPayload(savePayload));
    };

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
                    {filteredChips.map((chip, index) => {
                        // Determine chip type for styling
                        let chipStyle = { backgroundColor: "#0073CF", color: "white" }; // Default for keywords
                        
                        // Check if chip is from file_type (yellow)
                        if (file_type && (Array.isArray(file_type) ? file_type.includes(chip) : file_type === chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        // Check if chip is from aggs_fields (yellow)
                        else if (aggs_fields && (Array.isArray(aggs_fields) ? aggs_fields.includes(chip) : aggs_fields === chip)) {
                            chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                        }
                        // Check if chip is time range (yellow)
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
                    searchChips={keyword}
                    isPopupVisible={isPopupVisible}
                    setIsPopupVisible={setIsPopupVisible}
                />
            )}
        </div>
    );
};

export default CaseTableDataFilter;
