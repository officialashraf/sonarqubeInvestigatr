import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import  style from  "./login.module.css";
import TextareaField from "../../Common/TextField/textField";
import AppButton from "../../Common/Buttton/button";
import { Form } from "react-bootstrap";
import PopupModal from "../../Common/Popup/popup";

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
    <PopupModal title="License Renewal" onClose={togglePopup}>
      <div>
      <Form onSubmit={handleSubmit}>
        <TextareaField
          label="License Key *"
          placeholder="Paste your license key here"
          value={licenseKey}
          onChange={(e) => {
            setLicenseKey(e.target.value);
            setError((prev) => ({ ...prev, licenseKey: "", submit: "" }));
          }}
          rows={3}
          className="customfiled"
          error={!!error.licenseKey}
          style={{ backgroundColor: "white", color: "black" }}
        />
        {error.licenseKey && (
          <p style={{ color: "red", margin: "0px" }}>{error.licenseKey}</p>
        )}
        <div className="d-flex justify-content-end mt-3">
          <AppButton children="Apply" />
        </div>
      </Form>
      </div>
    </PopupModal>
  );
}

export default LicenseRenew;