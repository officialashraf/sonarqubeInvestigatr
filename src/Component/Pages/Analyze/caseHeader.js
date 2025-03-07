import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ListAltOutlined, PieChart, MoreVert } from "@mui/icons-material";
import "../../../Assets/Stlyes/tabulerHeader.css";
import { useNavigate } from "react-router-dom";

const CaseHeader = ({ onIconClick }) => {
  const caseData1 = useSelector((state) => state.caseData.caseData);
  const navigate = useNavigate();
  const backToSnap = () => {
    navigate(`/cases/${caseData1.id}`);
  };
  const backToCase = () => {
    navigate(`/cases`);
  };
  const backToResource = () => {
    navigate(`/esource`);
  };
  // const togglePopup = () => {
  //   setShowPopup((prev) => !prev);
  // };
  return (
    <>
    <div className="container-fluid">

      <div
        className="row header-row p-2 text-dark align-items-center"
        style={{ background: "lightgray" }}
      >
        {/* <div className='row header-row p-2' style={{background: 'lightgray', color:'black',display: 'flex', marginLeft: '0rem', marginRight: '0rem', height:"40px"}} > */}
        <div className="col">
          <h5 className="mb-1">
            Case ID: {`CASE${String(caseData1.id).padStart(4, "0")}`}
          </h5>
          <p className="mb-0">{caseData1.title}</p>

          {/* <h5 className="header-caseid-h7" >Case id: {`CASE${String(caseData1.id).padStart(4, '0')}`}</h5> */}
          {/* <p className='header-casename-h5' >{caseData1.title}</p> */}
        </div>
        <div className="col d-flex flex-wrap justify-content-center align-items-center">
          <button className="add-new-filter-button" onClick={backToResource}>
            Resources
          </button>
          <button
            className="add-new-filter-button"
            style={{ marginLeft: "12px" }}
            onClick={backToCase}
          >
            Case board
          </button>
          <button
            className="add-new-filter-button"
            style={{ marginLeft: "12px" }}
            onClick={backToSnap}
          >
            {" "}
            Back to Case Snapshot
          </button>
        </div>
        {/* <div className='col d-flex justify-content-end align-items-center' >
            <button className="add-new-filter-button ">  Back to Case Snapshot</button>
        </div> */}
      </div>
      {/*end header*/}
      <div
        className="row py-0 px-2  align-items-start"
        style={{ backgroundColor: "lightgrey" }}
        >
        <div className="col-md-2 col-sm-4 mb-2">
          <input
            type="text"
            className="form-control form-control-sm search-bar-f-option"
            placeholder="Search..."
            />
        </div>
        {/* <div className="col-md-auto">
  <ListAltOutlined/>
  </div> */}

        <div className="col-md-auto col-sm-12 mb-1 ">
          <select
            className="form-select form-select-sm"
            style={{ fontSize: "12px" }}
            >
            {/* <select className="form-select header-dropdown1" style={{fontSize:"12px" }} > */}
            <option value="source1">Smart Insights</option>
            <option value="source2">Options</option>
          </select>
        </div>
        {/* <div className="col-auto ms-auto ml-3 d-flex justify-content-center align-items-center"  style={{ marginRight:"5px", height:"28px"}}> */}
        <div className="col-auto ms-auto d-flex align-items-center">
          <PieChart
            className="icon-style"
            onClick={() => onIconClick("graphicalData")}
          />
          <ListAltOutlined
            className="icon-style"
            onClick={() => onIconClick("caseData")}
          />
          {/* <MoreVert className="icon-style" /> */}
        </div>
      </div>
      {/* {showPopup && <AddFilter2 togglePopup={togglePopup} />} */}
            </div>
    </>
  );
};

export default CaseHeader;
