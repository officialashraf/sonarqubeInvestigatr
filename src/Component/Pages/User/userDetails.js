

import React from "react";
import { Table, CloseButton } from "react-bootstrap";
import "../../../Assets/Stlyes/caseDetails.css";

const UserDetails = ({ onClose }) => {
  return (

    <>
    <div className="popup-overlay">
      <div className="popup-containera">
        <div className="popup-content">
          <div className="header">
            <h5>Suresh Kumar</h5>
            <CloseButton onClick={onClose} />
          </div>
          <div className="case-details-container">
            <Table bordered hover className="custom-table custom-table-th">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>surash_K</td>
                </tr>
                <tr>
                  <th>User ID</th>
                  <td>SK123</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>rh@nia.gov.in</td>
                </tr>
                <tr>
                  <th>Last Active</th>
                  <td>Apr 12, 2024 12:34 PM</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>
                    <span className="status-active-1">● Active</span>
                  </td>
                </tr>
                <tr>
                  <th>Password</th>
                  <td>Qwert@12345</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="button-container">
            <button type="button" className="cancel-btn" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
 </> );
};

export default UserDetails;
