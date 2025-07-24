// import { useSelector } from "react-redux";
// import { ListAltOutlined, PieChart } from "@mui/icons-material";
// import { FaPhotoVideo } from "react-icons/fa";
// // import { FaArrowLeft } from 'react-icons/fa';
// import "./tabulerHeader.module.css";
// import { useNavigate } from "react-router-dom";
// import styles from "./caseHeader.module.css";

// const CaseHeader = ({ onIconClick, activeView }) => {

//   const caseData = useSelector((state) => state.caseData.caseData);
//   const navigate = useNavigate();

//   // const backToSnap = () => {
//   //   navigate(`/cases/${caseData.id}`);
//   // };

//   return (
//     <>
//       <div className={styles.caseHeader}>
//         <div
//           className={styles.headerRow}
//           // style={{ background: "lightgray" }}
//         >

//            {/* <div className={styles.backIcon} onClick={backToSnap}>
//           <FaArrowLeft />
//         </div> */}
//           <div className={styles.headerTitle}>
//             <h5 >
//               Case ID: {`CASE${String(caseData.id).padStart(4, "0")}`}
//             </h5>
//             <p >{caseData.title}</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CaseHeader;
import { useSelector } from "react-redux";
import { ListAltOutlined, PieChart } from "@mui/icons-material";
import { FaPhotoVideo } from "react-icons/fa";
// import { FaArrowLeft } from 'react-icons/fa';
import "./tabulerHeader.module.css";
import { useNavigate } from "react-router-dom";
import styles from "./caseHeader.module.css";

const CaseHeader = ({ onIconClick, activeView }) => {

  const caseData = useSelector((state) => state.caseData.caseData);
  const navigate = useNavigate();

  // const backToSnap = () => {
  //   navigate(/cases/${caseData.id});
  // };

  return (
    <>
      <div className={styles.caseHeader}>
        <div
          className={styles.headerRow}
          // style={{ background: "lightgray" }}
        >

           {/* <div className={styles.backIcon} onClick={backToSnap}>
          <FaArrowLeft />
        </div> */}
          <div className={styles.headerTitle}>
            <h5 >
              Case ID: {`CASE${String(caseData.id).padStart(4, "0")}`}
            </h5>
            <p >{caseData.title}</p>
          </div>
        </div>

        {/* <div
          className="row py-0 px-2  align-items-start"

        >
          <div className="col-auto ms-auto d-flex align-items-center gap-3" style={{ margin: "5px", marginBottom: "15px" }}>
            <PieChart
              className={icon-style ${activeView === 'graphicalData' ? 'active-icon' : ''}}
              onClick={() => onIconClick("graphicalData")}
            />
            <FaPhotoVideo
              className={icon-style ${activeView === 'resources' ? 'active-icon' : ''}}
              onClick={() => onIconClick("resources")}
            />
            <ListAltOutlined
              className={icon-style ${activeView === 'caseData' ? 'active-icon' : ''}}
              onClick={() => onIconClick("caseData")}
            />
          </div>
        </div> */}
         <div className={styles.actionIconsContainer}>
          <PieChart sx={{ fontSize: 40 }}
          className={`${styles.icon} ${
            activeView === "graphicalData" ? styles.activeIcon : ""
          }`}
          onClick={() => onIconClick("graphicalData")}
        />
        <FaPhotoVideo
          className={`${styles.icon} ${
            activeView === "resources" ? styles.activeIcon : ""
          }`}
          onClick={() => onIconClick("resources")}
        />
          <ListAltOutlined sx={{
            fontSize: 40
}}
          className={`${styles.icon} ${
            activeView === "caseData" ? styles.activeIcon : ""
          }`}
          onClick={() => onIconClick("caseData")}
        />
      </div>

      </div>
    </>
  );
};

export default CaseHeader;