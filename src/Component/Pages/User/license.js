// import React, { useState } from 'react';
// import { Container, Row, Col, Form } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import './login.css';

// import {  toast } from 'react-toastify';

// const LicensePage = () => {
//     const navigate = useNavigate();
//     const [error, setError] = useState('');    
//     return (
//         <Container fluid className="login-container">
//             <Row className="login-row">
//                 <Col md={6} className="left-column">
//                     <h1>DataSearch</h1>
//                 </Col>
//                 <Col md={6} className="right-column">
//                     <Form className="login-form" onSubmit={handleLogin} >
                       
//                         <label style={{color:'white'}}>License Key</label>
//                    <textarea type='text' placeholder='Paste your license key here'  className='customfiled'/>
//                         <div className="d-flex justify-content-end mt-2">
                            
//                             <button type="submit" className="login-button">
//                                 Apply
//                             </button>
//                         </div>
//                         {error && <p className="error-text mt-3">{error}</p>}
//                     </Form>
//                 </Col>
//             </Row>
//         </Container>
//     );
// };

// export default LicensePage;

import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles

import "./login.css";

const LicensePage = () => {
  const navigate = useNavigate();
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  console.log("key",licenseKey)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("key",licenseKey)
    try {
        console.log("key",typeof licenseKey)
      const response = await axios.post("http://5.180.148.40:9008/api/license/register", 
        { key: licenseKey }, // Ensure key is passed correctly
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
    );
      console.log("key",licenseKey)
      toast.success("License registered successfully!");
      console.log("License Response:", response);

      // Redirect to login page upon success
      navigate("/login");
    } catch (error) {
      toast.error("License registration failed!"|| error)
    //   setError(error.response ? error.response.data.message : "Registration error");
      console.error("Error:", error);
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
            <label style={{ color: "white" }}>License Key</label>
            <textarea
              type="text"
              placeholder="Paste your license key here"
              className="customfiled"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
            />
            <div className="d-flex justify-content-end mt-2">
              <button type="submit" className="login-button">
                Apply
              </button>
            </div>
            {error && <p className="error-text mt-3">{error}</p>}
          </Form>
       
        </Col>
      </Row>
    </Container>

  );
};

export default LicensePage;


