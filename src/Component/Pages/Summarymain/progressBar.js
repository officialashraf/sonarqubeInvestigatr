import React from "react";
import './progressBar.css'
import { ProgressBar } from "react-bootstrap";

const ProgressRow = ({ now, label }) => {
  return (
    <div className="mb-3" style={{ width:'100%',background:"lightgray"}}>
      {/* <strong>{label}</strong> */}
      <ProgressBar 
      // now={now} 
      // label={`${now}%`}  
      />
    </div>
  );
};

export default ProgressRow;
