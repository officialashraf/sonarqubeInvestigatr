import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./login.css";

const LicensePage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  console.log("key", licenseKey)

  const validateForm = () => {
    const errors = {};

    if (!licenseKey.trim()) {
      errors.licenseKey = "Username is required";
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
      const response = await axios.post("http://5.180.148.40:9008/api/license/register",
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
      navigate("/login");
    } catch (err) {
      toast.error("License registration failed" || err)
      //   setError(error.response ? error.response.data.message : "Registration error");
      // console.err("Error:", error);
    }
  };

  return (

    <Container fluid className="login-container">
      <Row className="login-row">
        <Col md={6} className="left-column">
          <h1>DataSearch</h1>
        </Col>
        <Col md={6} className="right-column">
          <Form className="login-form" onSubmit={handleSubmit}>
            <label style={{ color: "white" }}>License Key <span style={{ color: 'white' }}>*</span></label>
            <textarea
              type="text"
              placeholder="Paste your license key here"
              className="customfiled"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);

                setError((prevErrors) => ({
                  ...prevErrors,
                  licenseKey: "", // Clear the licenseKey error
                }));
              }}
            />
            {error.licenseKey&& <p style={{ color: "red", margin: '0px' }} >{error.licenseKey}</p>}
            <div className="d-flex justify-content-end mt-2">
              <button type="submit" className="login-button" 
              // disabled={!licenseKey.trim()}
              >
                Apply
              </button>
            </div>
            {/* {error && <p className="error-text mt-3">{error}</p>} */}
          </Form>

        </Col>
      </Row>
    </Container>

  );
};

export default LicensePage;


