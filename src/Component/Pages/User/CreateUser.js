import React from "react";
import "./createUser.css";
import { IoMdSearch } from "react-icons/io";

const CreateUser = ({ onClose }) => {

return (
<>
  <div className="popup-overlay">
    <div className="popup-container">
      <button className="close-icon" onClick={onClose}>
        &times;
      </button>
      <div className="popup-content">
        <h5>Add User Form</h5>
        <form>
          <label>First Name:</label>
          <input
            className="com"
            type="text"
            id="title"
            name="title"
            placeholder="Enter"
            required
          />
          <label>Last Name:</label>
          <input
            className="com"
            id="description"
            name="description"
            placeholder="Enter"
          />
          <label>User Name:</label>
          <input
            className="com"
            id="description"
            name="description"
            placeholder="Enter"
          />
          <label>Email ID:</label>
          <input
            className="com"
            type="email"
            id="description"
            name="description"
            placeholder="Enter"
          />
          <label>Contact Number:</label>
          <input
            className="com"
            type="text"
            id="description"
            name="description"
            placeholder="Enter"
          />
          <label>Role:</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              className="com"
              type="text"
              id="description"
              name="description"
              placeholder="Enter"
              style={{ paddingRight: "30px" }}
            />
            <IoMdSearch
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#00000"
              }}
            />
          </div>
          <h7>Password: The system will generate the secure password, which can be viewed on user profile.</h7>

          <div className="button-container">
            <button type="submit" onClick={onClose} className="create-btn">
              Cancel
            </button>
            <button type="button" className="cancel-btn">
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</>);
};

export default CreateUser;
