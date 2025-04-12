import React from 'react';
import { FaArrowLeft } from "react-icons/fa";
import "../../../Assets/Stlyes/headerfilter.css";
import { Navbar, Container, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PHeader = () => {

  const navigate = useNavigate();
  return (
    
      <Navbar expand="sm" className="justify-content-between" style={{ background: "lightgray" }}>
        <Container className="custom-containerH">
          <Row className="w-100">
            <Col xs={1} className="d-flex align-items-center justify-content-center">
              <FaArrowLeft style={{ cursor: 'pointer', margin: '0px' }} onClick={() => navigate('/cases')} />
            </Col>
            <Col xs={11}>
              <Nav className="flex-column">
                <Nav.Item>
                  <span className="tenant">USER DASHBAORD</span>
                </Nav.Item>
                {/* <Nav.Item>
                  <span className="caseName">Military Intelligence</span>
                </Nav.Item> */}
              </Nav>
            </Col>
          </Row>
        </Container>
      </Navbar>
  )
};

export default PHeader;
