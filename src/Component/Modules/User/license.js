import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import style from  "./login.module.css";
import DAButton from "../../Common/Buttton/button";
import TextareaField from "../../Common/TextField/textField";
import AppButton from "../../Common/Buttton/button";

const LicensePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  console.log("key", licenseKey)

  const validateForm = () => {
    const errors = {};

    if (!licenseKey.trim()) {
      errors.licenseKey = "Please enter the license key before proceeding";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("key", licenseKey)
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      // if(licenseKey.trim()===""){
      //   toast.info("Please enter a license key before processing");
      //   return;
      // }
      console.log("key", typeof licenseKey)
      const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_LICENSE}/api/license/register`,
        { key: licenseKey }, // Ensure key is passed correctly
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("key", licenseKey)
      toast.success("License registered successfully");
      console.log("License Response:", response);

      // Redirect to login page upon success
      //  navigate("/login");

      // Retry GET check up to 3 times
      let attempts = 0;
      let licenseConfirmed = false;

      while (attempts < 3 && !licenseConfirmed) {
        const res = await axios.get(`${window.runtimeConfig.REACT_APP_API_LICENSE}/api/license`);
        if (res.data?.license_registered) {
          licenseConfirmed = true;
          break;
        }

        // Wait 500ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
        attempts++;
      }

      if (licenseConfirmed) {
        localStorage.setItem("licenseKey", "VALID");
        navigate("/login");
      } else {
        toast.error("License registered but verification failed. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "License registration failed");
      console.warn(err.response?.data?.detail || "Registration err");
      console.log("Err:", err);
    }
  };

  return (

    <Container fluid className={style.loginContainer} style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center' }}>
      <Row className={style.loginRow}>
        <Col md={6} className={style.leftColumn}>
          <h1>DataSearch</h1>
        </Col>
        <Col md={6} className={style.rightColumn}>
        <Form className={style.loginForm} onSubmit={handleSubmit}>
  <TextareaField
    label="License Key *"
    value={licenseKey}
    onChange={(e) => {
      setLicenseKey(e.target.value);
      setError((prevErrors) => ({
        ...prevErrors,
        licenseKey: "",
      }));
    }}
    placeholder="Paste your license key here"
    name="licenseKey"
    error={!!error.licenseKey}
    style={{height:'7rem'}}
  />

  {error.licenseKey && <p style={{ color: "red", margin: '0px' }}>{error.licenseKey}</p>}

  <div className="d-flex justify-content-end mt-2">
    <AppButton children={'Apply'} />
  </div>
</Form>
        </Col>
      </Row>
    </Container>

  );
};

export default LicensePage;


