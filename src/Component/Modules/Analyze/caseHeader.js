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
  //   navigate(`/cases/${caseData.id}`);
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
      </div>
    </>
  );
};

export default CaseHeader;