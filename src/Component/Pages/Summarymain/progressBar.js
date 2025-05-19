import React from "react";
import './progressBar.css'
import { ProgressBar } from "react-bootstrap";

const ProgressRow = ({ now, label }) => {
  return (
    <div className="mb-3" style={{ width: '100%', background: "lightgray" }}>
      <ProgressBar
      />
    </div>
  );
};

export default ProgressRow;
