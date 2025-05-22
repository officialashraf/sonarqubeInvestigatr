import { useSelector } from "react-redux";
import { ListAltOutlined, PieChart } from "@mui/icons-material";
import { FaPhotoVideo } from "react-icons/fa";
import { Col} from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import "./tabulerHeader.css";
import { useNavigate } from "react-router-dom";


const CaseHeader = ({ onIconClick }) => {
  const caseData1 = useSelector((state) => state.caseData.caseData);
  const navigate = useNavigate();
  const backToSnap = () => {
    navigate(`/cases/${caseData1.id}`);
  };
 
  return (
    <>
    <div className="container-fluid">

      <div
        className="row header-row p-2 text-dark align-items-center"
        style={{ background: "lightgray" }}
      >
         <Col xs={1} className="d-flex align-items-center justify-content-center">
                  <FaArrowLeft style={{ cursor: 'pointer',margin:'0px' }}  onClick={backToSnap} />
                </Col>
      <div className="col">
          <h5 className="mb-1">
            Case ID: {`CASE${String(caseData1.id).padStart(4, "0")}`}
          </h5>
          <p className="mb-0">{caseData1.title}</p>

        
        </div>
        <div className="col d-flex flex-wrap justify-content-end align-items-center">
          
          <button
            className="add-new-filter-button"
            style={{ marginLeft: "12px" }}
            onClick={backToSnap}
          >
            {" "}
            Back to Case Snapshot
          </button>
        </div>
    
      </div>
   
      <div
        className="row py-0 px-2  align-items-start"
        style={{ backgroundColor: "lightgrey" }}
        >

        {/* <div className="col-auto ms-auto ml-3 d-flex justify-content-center align-items-center"  style={{ marginRight:"5px", height:"28px"}}> */}
        <div className="col-auto ms-auto d-flex align-items-center gap-3">
           <FaPhotoVideo
            className="icon-styles"
            onClick={() => onIconClick("resources")}
          />
          <PieChart
            className="icon-style"
            onClick={() => onIconClick("graphicalData")}
          />
          <ListAltOutlined
            className="icon-style"
            onClick={() => onIconClick("caseData")}
          />
        
        </div>
      </div>
   
            </div>
    </>
  );
};

export default CaseHeader;