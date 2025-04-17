import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Bell, PersonCircle } from 'react-bootstrap-icons'; // Bootstrap Icons
import "./header.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const  Header = () => {
  const navigate =  useNavigate()
   const [loggedInUserId, setLoggedInUserId] = useState('');
      const token = Cookies.get('accessToken');
  
      useEffect(() => {
          if (token) {
              try {
                  const decodedToken = jwtDecode(token);
                  setLoggedInUserId(decodedToken.id);
                  console.log(decodedToken); // Logs the full payload
                  console.log("User ID:", decodedToken.id); // Logs the user ID
              } catch (error) {
                  console.error("Error decoding token:", error.message);
              }
          } else {
              console.warn("No token found in cookies");
          }
      }, [token]);
  
      const handleLogout = async () => {
          if (!loggedInUserId) {
              console.warn("No logged-in user ID found");
              return;
          }
  
          try {
              const response = await fetch(`http://5.180.148.40:9000/api/user-man/v1/user/logout/${loggedInUserId}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
              });
  
              if (response.ok) {
                  console.log("Logout successful");
                  Cookies.remove('accessToken');
                  Cookies.remove('refreshToken'); // Remove the token after successful logout
                  toast(" Logout Successfull")
                  navigate("/");
              } else {
                  console.error("Logout failed:", response.statusText);
              }
          } catch (error) {
              console.error("Error during API call:", error.message);
          }
      };
 
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
