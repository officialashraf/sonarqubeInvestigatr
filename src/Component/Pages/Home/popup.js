import React from "react";
import "../../../Assets/Stlyes/createCase.css"; // Popup-specific CSS


const Popup = ({ togglePopup }) => {
  const handleCreate = (e) => {
    e.preventDefault(); // Form submission default action रोकता है
    alert("Case created successfully!", Response); // Success message
    togglePopup(); // Popup बंद करता है
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        {/* Close Icon */}
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h2>Create !!!!!Case</h2>
          <form onSubmit={handleCreate}>
            {/* Title Field */}
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter title"
              required
            />

            {/* Description Field */}
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description"
            ></textarea>

            {/* Assignee Dropdown */}
            <label htmlFor="assignee">Assignee:</label>
            <select id="assignee" name="assignee">
              <option value="">Select Assignee</option>
              <option value="user1">User 1</option>
              <option value="user2">User 2</option>
              <option value="user3">User 3</option>
            </select>

            {/* Watcher Field with Search Icon */}
            <label htmlFor="watcher">Watcher:</label>
            <div className="input-with-icon">
              <span className="search-icon">&#128269;</span> {/* Unicode for search icon */}
              <input
                type="text"
                id="watcher"
                name="watcher"
                placeholder="Search watcher"
              />
            </div>

            {/* Buttons */}
            <div className="button-container">
              <button
                type="button"
                className="cancel-btn"
                onClick={togglePopup}
              >
                Cancel
              </button>
              <button type="submit" className="create-btn">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Popup;
