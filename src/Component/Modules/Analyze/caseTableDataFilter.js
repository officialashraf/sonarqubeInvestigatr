import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "../../Common/Buttton/button"; // Assuming you have this
import GraphicalData from "./GraphicalData/graphicalData";
import Resources from "./Resources";
import TabulerData from "./TabularData/tabulerData";
import styles from "./caseHeader.module.css";
import CaseHeader from "./caseHeader";
import AddFilter from "./TabularData/filter";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
import { saveCaseFilterPayload } from "../../../Redux/Action/caseAction";
// import styles from "./SearchResults.module.css"; // Adjust your stylesheet import

const CaseTableDataFilter = () => {
    const dispatch = useDispatch();
const caseData = useSelector((state) => state.caseData.caseData);
const { file_type,aggs_fields,keyword } = useSelector((state) => state.caseFilter?.caseFilters || {});
 console.log("caseFilterChips",file_type,aggs_fields,keyword);
  const [inputValue, setInputValue] = useState("");
  const [searchChips, setSearchChips] = useState([]);
  console.log("searchChips", searchChips)
  const [filteredChips, setFilteredChips] = useState([]);
    console.log("filterChips", filteredChips)
  const [activeComponent, setActiveComponent] = useState("graphicalData");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

 // redux se caseData lo

useEffect(() => {
  const chips = [];

  if (Array.isArray(file_type)) chips.push(...file_type);
  else if (file_type) chips.push(file_type);

  if (Array.isArray(aggs_fields)) chips.push(...aggs_fields);
  else if (aggs_fields) chips.push(aggs_fields);

  if (Array.isArray(keyword)) chips.push(...keyword);
  else if (keyword) chips.push(keyword);

  setFilteredChips(chips);
  setSearchChips(chips);
}, [file_type, aggs_fields, keyword]);



const handleSearchSubmit = () => {
  if (!caseData?.id) return;
const platformList = ["facebook", "instagram", "vk", "x", "tiktok", "linkedin", "youtube"];
const aggragtionFields = [
  "person", "org", "gpe", "loc", "product", "event", "work_of_art",
  "law", "language", "percent", "money", "date", "time", "quantity"
];

const file_type = [];
const aggsFields = [];
const keyword = [];
console.log("aggsfileds",aggsFields)
filteredChips.forEach((chip) => {
  const normalizedChip = chip.toLowerCase().trim();

  if (platformList.includes(normalizedChip)) {
    file_type.push(chip); // send original chip
  } else if (aggragtionFields.includes(normalizedChip)) {
    aggsFields.push(chip); // send original chip
  } else {
    keyword.push(chip); // send original chip
  }
});


  const queryPayload = {
    unified_case_id: caseData.id,
  };

  const summaryPayload ={
    queryPayload,
    ...(keyword.length > 0 && { keyword }),
    ...(aggsFields.length > 0 && { aggsFields }),
    ...(file_type.length > 0 && { file_type }),
    page: 1,
    itemsPerPage: 50
  }
  dispatch(fetchSummaryData(summaryPayload));
  console.log("summaryadte",summaryPayload)
  const savePayload ={
        caseId: caseData.id,
        file_type:file_type,
        keyword:keyword,
        aggs_fields:aggsFields,
      }
     dispatch(saveCaseFilterPayload(savePayload));
      console.log("saveredux", savePayload)
};

 const handleKeyPress = (e) => {
  if (e.key === "Enter" && inputValue.trim() !== "") {
    const newChip = inputValue.trim();
    const newChips = [...searchChips, newChip];
    setSearchChips(newChips);
    setFilteredChips(newChips);
    setInputValue("");
  }
};

  const resetSearch = () => {
    setInputValue("");
    setSearchChips([]);
    setFilteredChips([]);
  };

  const openPopup = () => {
    setIsPopupVisible(true);
  };

const removeChip = (chipToRemoveIndex) => {
  const newChips = [...searchChips];
  newChips.splice(chipToRemoveIndex, 1);
  setSearchChips(newChips);
  setFilteredChips(newChips);
};


  return (
    <div className="search-container" style={{ backgroundColor: "#080E17", height: "100%", zIndex: "1050" }}>
      <CaseHeader/>
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
      <div className="search-term-indicator" style={{ backgroundColor: "#080E17", marginBottom: "10px" }}>
        <div className="chips-container">
          {filteredChips.map((chip, index) => (
            <div key={index} className="search-chip">
              <span>{chip}</span>
              <button className="chip-delete-btn" onClick={() => removeChip(chip)}>
                <CloseIcon fontSize="15px" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{height:"380px",backgroundColor: "#101D2B", borderRadius: "15px", overflow: "auto" }}>
        {activeComponent === "graphicalData" && <GraphicalData  />}
        {activeComponent === "resources" && <Resources  />}
        {activeComponent === "caseData" && <TabulerData  />}
      </div>

      {isPopupVisible && (
        <AddFilter
        searchChips={keyword}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
        />
      )}
    </div>
    </div>
  );
};


export default CaseTableDataFilter;
