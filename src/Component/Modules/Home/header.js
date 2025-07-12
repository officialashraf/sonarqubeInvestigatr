// Header.js - Fixed Implementation
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Bell, PersonCircle } from 'react-bootstrap-icons';
<<<<<<< HEAD
import { FaArrowLeft } from "react-icons/fa";
import "./header.css";
=======
import { FaArrowLeft } from 'react-icons/fa';
import styles from "./header.module.css";
>>>>>>> 7588038cf42dd7390974b28da672b0b1119e1a72
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from "react-redux";
import NotificationList from '../Notification/notificationList';
import useWebSocket from "../../../utils/WebSocket/useWebsocket";
import { clearUsername, setUsername } from "../../../Redux/Action/userAction";
import { disconnectWebSocket } from '../../../utils/WebSocket/websocket';
import { CLEAR_SEARCH } from '../../../Redux/Constants/piiConstant';
import LicenseRenew from '../User/licenseRenew';
import AboutUs from './aboutUs';
import ProfileImage from '.././../Assets/Images/prifileImage.jpg'

const Header = ({ title }) => {
  console.log("Header title prop:", title);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get('accessToken');
  const { notificationCount, setNotificationCount } = useWebSocket();

  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [abouUsOpen, setAbouUsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [username, setusername] = useState('');
  const [role, setRole] = useState('');
  const [firstname,setfirstName] = useState('');
  const [lastname,setLastName] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(prev => !prev);
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setLoggedInUserId(decodedToken.id);

        if (decodedToken?.sub) {
          dispatch(setUsername(decodedToken.sub));
          setusername(decodedToken.sub)
        }
          setRole(decodedToken.role);
          setfirstName(decodedToken.first_name);
          setLastName(decodedToken.last_name);

        console.log("Token decoded successfully for user:", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        // If token is invalid, logout
        handleTokenError();
      }
    } else {
      console.warn("No token found in cookies");
    }
  }, [token, dispatch]);

  const handleTokenError = () => {
    console.log("Invalid token detected, clearing session");
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    dispatch(clearUsername());
    disconnectWebSocket();
    navigate("/");
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      console.log("Logout already in progress");
      return;
    }

    if (!loggedInUserId) {
      console.warn("No logged-in user ID found");
      return;
    }

    setIsLoggingOut(true);

    try {
      // First disconnect WebSocket and clear Redux state
      dispatch(clearUsername());
      disconnectWebSocket();

      const response = await fetch(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user/logout/${loggedInUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add authorization header
        },
      });

      if (response.ok) {
        console.log("Logout API call successful");
      } else {
        console.error("Logout API failed:", response.statusText);
        // Continue with client-side logout even if API fails
      }
    } catch (error) {
      console.error("Error during logout API call:", error.message);
      // Continue with client-side logout even if API fails
    } finally {
      // Always perform client-side cleanup
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      dispatch({ type: CLEAR_SEARCH }); // ✅ Triggers reset

      // Clear any remaining state
      setLoggedInUserId('');
      setIsPopupOpen(false);
      setIsLoggingOut(false);

      toast.success("Logout successful");
      navigate("/");
    }
  };


  const handleNotificationClick = () => {
    setNotificationCount(0); // Reset count to zero on click
    setIsPopupOpen(true);
  };

  const toggleAboutUs = () => {
    setAbouUsOpen(prevState => !prevState); // True ko False aur False ko True karega
  };

  return (
    <>

      <Navbar>
  <Container className={`${styles.containerss} d-flex justify-content-between align-items-center`}>
   
    <Navbar.Brand className={styles.navbarBrand}>
       {["Users", "Roles", "Connections", "Case Analysis"].includes(title) && (
              <FaArrowLeft
                style={{ color: 'white', cursor: 'pointer', marginRight: '10px' }}
                onClick={() => navigate(-1)}
                size={20}
              />
            )}
      {title}
    </Navbar.Brand>

    <Nav className={styles.customNav}>
            <div style={{ position: "relative", marginRight: "15px" }}>
              <div
                style={{
                  backgroundColor: "#0C1622",
                  borderRadius: "50%",
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={handleNotificationClick}
              >
                <Bell size={20} color="#3498db" />
              </div>
              {notificationCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    minWidth: "16px",
                    textAlign: "center"
                  }}
                >
                  {notificationCount}
                </span>
              )}

            </div>
            <div style={{ marginTop: '5px', display: "flex", flexDirection: "column", alignItems: 'flex-start' }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#FFFFFF" }}>
              <span>
  {(firstname || lastname)
    ? `${firstname || ''}${firstname && lastname ? ' ' : ''}${lastname || ''}`
    : 'Name not available'}
</span>

              </p>
              <p style={{ margin: 0,paddingBottom:'5px', fontSize: "10px", color: "#C0C0C0" }}>
                {role}
              </p>
            </div>

            <NavDropdown
              title={<img
                src={ProfileImage}  // replace with your actual image URL
                alt="User"
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  cursor: "pointer"
                }}
              />}
              id="profile-dropdown"
              align="end"
            >

             
              <NavDropdown.Item onClick={togglePopup}>
                {"License Renew"}
              </NavDropdown.Item>
              <NavDropdown.Item

                onClick={toggleAboutUs} >
                About Us
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>

      {isPopupOpen && (
        <NotificationList
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
        />
      )}
      {showPopup && <LicenseRenew togglePopup={togglePopup} />}

      {abouUsOpen && (
        <AboutUs togglePopup={toggleAboutUs} />
      )}
    </>
  );
};
export default Header;
