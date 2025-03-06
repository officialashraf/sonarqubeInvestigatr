import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Bell, PersonCircle } from 'react-bootstrap-icons'; // Bootstrap Icons
import "../../../Assets/Stlyes/header.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const  Header = () => {
  const navigate =  useNavigate()
  const handleLogout = () => { // Remove tokens from cookies
   Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    toast(" Logout Successfull")
    navigate("/");
  }
  return (
    <Navbar bg="black" variant="dark">
      <Container className="containerss d-flex justify-content-between align-items-center">
        <Navbar.Brand  className="custom-navbar-brand">
          Cases
        </Navbar.Brand>
        {/* style={{verticalAlign: "middle", marginRight: "7px", marginTop:"10px"}} */}
        <Nav className="custom-nav">
        <Bell size={20} fill="white" />
          <NavDropdown
            title={<PersonCircle size={20} color="white" />}
             id="profile-dropdown"
            align="end"
          >
            <NavDropdown.Item onClick={handleLogout} >Logout</NavDropdown.Item>
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>  
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
