import React, { useEffect, useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import { PieChart } from "@mui/icons-material";
import { ListAltOutlined } from "@mui/icons-material";
import { FaPhotoVideo } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import AppButton from "../../Common/Buttton/button"; // Assuming you have this
import GraphicalData from "./GraphicalData/graphicalData";
import Resources from "./Resources";
import TabulerData from "./TabularData/tabulerData";
import AddNewCriteria from "../FilterCriteria/addNewCriteria";
import styles from "./caseHeader.module.css";
import CaseHeader from "./caseHeader";
import AddFilter from "./TabularData/filter";
import { useSelector } from 'react-redux';
// import styles from "./SearchResults.module.css"; // Adjust your stylesheet import

const CaseTableDataFilter = () => {
const { file_type } = useSelector((state) => state.caseFilter?.caseFilters || {});

       console.log("caseFilter",file_type);
  const [inputValue, setInputValue] = useState("");
  const [searchChips, setSearchChips] = useState([]);
  const [filteredChips, setFilteredChips] = useState([]);
  const [activeComponent, setActiveComponent] = useState("graphicalData");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
useEffect(() => {
  const chips = [];
  if (Array.isArray(file_type)) {
    chips.push(...file_type); // spread karta hai multiple file types
  } else if (file_type) {
    chips.push(file_type); // single string
  }
  setFilteredChips(chips);
}, [file_type]);


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const newChips = [...searchChips, inputValue.trim()];
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

  const removeChip = (chipToRemove) => {
    const newChips = searchChips.filter((chip) => chip !== chipToRemove);
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
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
        />
      )}
    </div>
  );
};

export default CaseTableDataFilter;
