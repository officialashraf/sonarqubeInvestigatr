// import React from "react";
// import { TextField, InputAdornment } from "@mui/material";
// import { Search as SearchIcon, Close as CloseIcon, Send as SendIcon, Tune as TuneIcon } from "@mui/icons-material";
// import styles from '../../Modules/Analyze/caseHeader.module.css';
// import AppButton from "../Buttton/button";
// import CaseHeader from "../../Modules/Analyze/caseHeader";

// const SearchUIContainer = ({
//   inputValue,
//   setInputValue,
//   handleSearch,
//   handleKeyPress,
//   resetSearch,
//   activeComponent,
//   setActiveComponent,
//   componentsMap,
//   displayChips,
//   chipCheckFunctions,
//   removeChip,
//   PopupComponent,
//   isPopupVisible,
//   setIsPopupVisible,
//   showCaseHeader = false,
//   CaseHeaderComponent = null,
//   popupSearchChips = [],
// }) => {
//   return (
//     <div
//       className="search-container"
//       style={{ backgroundColor: "#080E17", height: "100%", zIndex: "1050", overflowY: "hidden" }}
//     >
//       {showCaseHeader && CaseHeaderComponent}

//       {/* Search Header */}
//       <div
//         className={styles.actionIconsContainer}
//         style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}
//       >
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
//                     onClick={handleSearch}
//                   />
//                   <TuneIcon
//                     style={{ cursor: "pointer", backgroundColor: "#0073CF", color: "#0A192F" }}
//                     onClick={() => setIsPopupVisible(true)}
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
//           {Object.entries(componentsMap).map(([key, { icon: Icon }]) => (
//             <Icon
//               key={key}
//               sx={{ fontSize: 40 }}
//               className={`${styles.icon} ${activeComponent === key ? styles.activeIcon : ""}`}
//               onClick={() => setActiveComponent(key)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Chips Section */}
//       <div className="search-term-indicator" style={{ backgroundColor: "#080E17" }}>
//      <div
//   className={`chips-container ${!showCaseHeader ? 'overrideHeight' : ''}`}
// >

//           {displayChips.map((chip, index) => {
//             let chipStyle = { backgroundColor: "#0073CF", color: "white" };
//             for (let check of chipCheckFunctions) {
//               if (check(chip)) {
//                 chipStyle = { backgroundColor: "#FFD700", color: "#000" };
//                 break;
//               }
//             }

//             return (
//               <div
//                 key={index}
//                 className="search-chip"
//                 style={{
//                   ...chipStyle,
//                   padding: "4px 8px",
//                   borderRadius: "12px",
//                   margin: "2px",
//                   display: "inline-flex",
//                   alignItems: "center",
//                   fontSize: "12px",
//                 }}
//               >
//                 <span>{chip}</span>
//                 <button
//                   className="chip-delete-btn"
//                   onClick={() => removeChip(chip)}
//                   style={{
//                     background: "none",
//                     border: "none",
//                     marginLeft: "4px",
//                     cursor: "pointer",
//                     color: chipStyle.color,
//                     display: "flex",
//                     alignItems: "center",
//                   }}
//                 >
//                   <CloseIcon style={{ fontSize: "15px" }} />
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Active Component Renderer */}
//       <div style={{ borderRadius: "15px", overflowY: "auto" }}>
//         {componentsMap[activeComponent]?.component || null}
//       </div>

//       {/* Popup */}
//       {isPopupVisible && (
//         <PopupComponent
//           searchChips={popupSearchChips}
//           isPopupVisible={isPopupVisible}
//           setIsPopupVisible={setIsPopupVisible}
//         />
//       )}
//     </div>
//   );
// };

// export default SearchUIContainer;
import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon, Send as SendIcon, Tune as TuneIcon } from "@mui/icons-material";
import styles from '../../Modules/Analyze/caseHeader.module.css';
import AppButton from "../Buttton/button";

const SearchUIContainer = ({
  inputValue,
  setInputValue,
  handleSearch,
  handleKeyPress,
  resetSearch,
  activeComponent,
  setActiveComponent,
  componentsMap,
  displayChips,
  chipCheckFunctions,
  removeChip,
  PopupComponent,
  isPopupVisible,
  setIsPopupVisible,
  showCaseHeader = false,
  CaseHeaderComponent = null,
  popupSearchChips = [],
}) => {
  // Check if we have any components to render icons for
  const hasComponentSwitching = componentsMap && Object.keys(componentsMap).length > 1;

  return (
    <div
      className="search-container"
      style={{ backgroundColor: "#080E17", height: "100%", zIndex: "1050", overflowY: "hidden" }}
    >
      {showCaseHeader && CaseHeaderComponent}

      {/* Search Header */}
      <div
        className={styles.actionIconsContainer}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}
      >
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
                    onClick={handleSearch}
                  />
                  <TuneIcon
                    style={{ cursor: "pointer", backgroundColor: "#0073CF", color: "#0A192F" }}
                    onClick={() => setIsPopupVisible(true)}
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

        {/* Component switching icons - only show if there are multiple components */}
        {hasComponentSwitching && (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {Object.entries(componentsMap).map(([key, { icon: Icon }]) => (
              Icon && (
                <Icon
                  key={key}
                  sx={{ fontSize: 40 }}
                  className={`${styles.icon} ${activeComponent === key ? styles.activeIcon : ""}`}
                  onClick={() => setActiveComponent(key)}
                />
              )
            ))}
          </div>
        )}
      </div>

      {/* Chips Section */}
      <div className="search-term-indicator" style={{ backgroundColor: "#080E17" }}>
        <div
          className={`chips-container ${!showCaseHeader ? 'overrideHeight' : ''}`}
        >
          {displayChips.map((chip, index) => {
            let chipStyle = { backgroundColor: "#0073CF", color: "white" };
            for (let check of chipCheckFunctions) {
              if (check(chip)) {
                chipStyle = { backgroundColor: "#FFD700", color: "#000" };
                break;
              }
            }

            return (
              <div
                key={index}
                className="search-chip"
                style={{
                  ...chipStyle,
                  padding: "4px 8px",
                  borderRadius: "12px",
                  margin: "2px",
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
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
                    alignItems: "center",
                  }}
                >
                  <CloseIcon style={{ fontSize: "15px" }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Component Renderer */}
      <div style={{ borderRadius: "15px", overflowY: "auto" }}>
        {componentsMap[activeComponent]?.component || null}
      </div>

      {/* Popup */}
      {isPopupVisible && (
        <PopupComponent
          searchChips={popupSearchChips}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
        />
      )}
    </div>
  );
};

export default SearchUIContainer;