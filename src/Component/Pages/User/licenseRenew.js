import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./login.css";

const LicenseRenew = ({ togglePopup }) => {

  const [error, setError] = useState({});
  const [licenseKey, setLicenseKey] = useState("");

  const validateForm = () => {
    const errors = {};
    if (!licenseKey.trim()) {
      errors.licenseKey = "License key is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      await axios.post(
        `${window.runtimeConfig.REACT_APP_API_LICENSE}/api/license/register`,
        { key: licenseKey },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("License renewed successfully");
      togglePopup();
      // navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.detail || "License registration failed");
      setError({ submit: err.response?.data?.detail || "Registration error" });
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>License Renewal</h5>
          <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
            <label>
              License Key *
            </label>
            <textarea
              placeholder="Paste your license key here"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setError((prev) => ({ ...prev, licenseKey: "", submit: "" }));
              }}
              rows={3}
              className="customfiled"
              style={{ backgroundColor: "white", color: "black" }}
            />
            {error.licenseKey && (
              <p style={{ color: "red", margin: "0px" }}>{error.licenseKey}</p>
            )}
            {error.submit && (
              <p style={{ color: "red" }}>{error.submit}</p>
            )}
            <div className="d-flex justify-content-end mt-3">
              <button type="submit" className="create-btn">
                Apply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LicenseRenew;