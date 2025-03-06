import React from "react";
//import {  ToggleButton, ButtonGroup } from "react-bootstrap";
//import './preheader.css'

const PreHeader = ({ count, size, totalUploads, totalApproved, onToggle ,totalUnsupported,totalUnderProcessing,totalDiscard}) => {
  return (
    <div className="d-flex justify-content-between align-items-center" style={{background:"lightgray"}}>
      <div className="item vertical-align">
        <strong>Count:</strong> {count}
      </div>
      {/* <ButtonGroup>
        <ToggleButton type="checkbox" variant="outline-primary" onChange={onToggle}>
          Toggle
        </ToggleButton>
      </ButtonGroup> */}
      <div className="item vertical-align">
        <strong>Size:</strong> {size}
      </div>
      <div className="item vertical-align">
        <strong>Total Uploads:</strong> {totalUploads}
      </div>
      <div className="item vertical-align">
        <strong>Total Approved:</strong> {totalApproved}
      </div>
      <div className="item vertical-align">
        <strong> Total UnderProcessing:</strong> {totalUnderProcessing}
      </div>
      <div className="item vertical-align">
        <strong>Total Unsupported:</strong> {totalUnsupported}
      </div>
      <div className="item vertical-align">
        <strong> Total Discard:</strong> {totalDiscard}
      </div>
    </div>
  );
};

export default PreHeader;
