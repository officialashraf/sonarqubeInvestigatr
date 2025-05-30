// Header.js - Fixed Implementation
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Bell, PersonCircle } from 'react-bootstrap-icons';
import "./header.css";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from "react-redux";
import NotificationList from '../Notification/notificationList';
import useWebSocket from "../../../utils/WebSocket/useWebsocket";
import { clearUsername, setUsername } from "../../../Redux/Action/userAction";
import { disconnectWebSocket } from '../../../utils/WebSocket/websocket';

const Header = ({ title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = Cookies.get('accessToken');
  const { notificationCount, setNotificationCount } = useWebSocket();
  
  const [loggedInUserId, setLoggedInUserId] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setLoggedInUserId(decodedToken.id);
        
        if (decodedToken?.sub) {
          dispatch(setUsername(decodedToken.sub));
        }
        
        console.log("Token decoded successfully for user:", decodedToken.sub);
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

      const response = await fetch(`http://5.180.148.40:9000/api/user-man/v1/user/logout/${loggedInUserId}`, {
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

  return (
    <>
      <Navbar bg="black" variant="dark">
        <Container className="containerss d-flex justify-content-between align-items-center">
          <Navbar.Brand className="custom-navbar-brand">
            {title}
          </Navbar.Brand>
          
          <Nav className="custom-nav">
            <div style={{ position: "relative", marginRight: "15px" }}>
              <Bell
                size={20}
                fill="white"
                style={{ cursor: "pointer" }}
                onClick={handleNotificationClick}
              />
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

            <NavDropdown
              title={<PersonCircle size={20} color="white" />}
              id="profile-dropdown"
              align="end"
            >
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
    </>
  );
};

export default Header;

// import React, { useEffect, useState } from 'react';
// import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
// import { Bell, PersonCircle } from 'react-bootstrap-icons'; // Bootstrap Icons
// import "./header.css";
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';
// import { useDispatch } from "react-redux";
// import NotificationList from '../Notification/notificationList';
// import useWebSocket from "../../../utils/WebSocket/useWebsocket";
// import { clearUsername, setUsername } from "../../../Redux/Action/userAction";
// import { disconnectWebSocket } from '../../../utils/WebSocket/websocket';

// const Header = ({ title }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate()
//   const token = Cookies.get('accessToken');
//   const { notificationCount, setNotificationCount } = useWebSocket(token);
//   // const notificationCount = "hi";
//   const [loggedInUserId, setLoggedInUserId] = useState('');
//   const [isPopupOpen, setIsPopupOpen] = useState(false);


//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserId(decodedToken.id);
//         if (decodedToken?.sub) {
//           dispatch(setUsername(decodedToken.sub));
//         }
//         console.log(decodedToken); // logs the full payload
//         console.log("User ID:", decodedToken.sub); // Logs the user ID
//       } catch (error) {
//         console.error("Error decoding token:", error.message);
//       }
//     } else {
//       console.warn("No token found in cookies");
//     }
//   }, [token]);

//   const handleLogout = async () => {
//     if (!loggedInUserId) {
//       console.warn("No logged-in user ID found");
//       return;
//     }

//     try {
//       const response = await fetch(`http://5.180.148.40:9000/api/user-man/v1/user/logout/${loggedInUserId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       if (response.ok) {
//         console.log("Logout successful");
//         Cookies.remove('accessToken');
//         Cookies.remove('refreshToken'); // Remove the token after successful logout
//         toast(" Logout successfull")
//         navigate("/");
//         disconnectWebSocket();
//          dispatch(clearUsername());
//       } else {
//         console.error("Logout failed:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error during API call:", error.message);
//     }
//   };

//   return (
//     <>
//       <Navbar bg="black" variant="dark">
//         <Container className="containerss d-flex justify-content-between align-items-center">
//           <Navbar.Brand className="custom-navbar-brand">

//             {title}

//           </Navbar.Brand>
//           {/* style={{verticalAlign: "middle", marginRight: "7px", marginTop:"10px"}} */}
//           <Nav className="custom-nav">
//             {/* <Bell size={20} fill="white" onClick={() => setIsPopupOpen(true)}style={{cursor:'pointer'}}/>
//             {notificationCount > 0 &&  <span>{notificationCount ||0}</span>} */}
//             <Bell
//               size={20}
//               fill="white"
//               style={{ cursor: "pointer", position: "relative" }}
//               onClick={() => {
//                 setNotificationCount(0); // ✅ Reset count to zero on click
//                 setIsPopupOpen(true);
//               }}
//             />
//             {/* {notificationCount > 0 && ( */}
//             <span
//               style={{
//                 position: "absolute",
//                 color: "white",
//                 borderRadius: "50%",
//                 marginLeft: '15px',
//                 marginBottom: '15px',
//                 fontSize: "12px"
//               }}
//             >
//               {notificationCount || 0}
//             </span>
//             {/* )} */}

//             <NavDropdown
//               title={<PersonCircle size={20} color="white" />}
//               id="profile-dropdown"
//               align="end"
//             >
//               <NavDropdown.Item onClick={handleLogout} >Logout</NavDropdown.Item>
//               {/* <NavDropdown.Item onClick={navigate('/profile')}>Profile</NavDropdown.Item> */}
//             </NavDropdown>
//           </Nav>

//         </Container>

//       </Navbar>
//       {isPopupOpen && <NotificationList isOpen={isPopupOpen} setIsOpen={setIsPopupOpen} />}

//     </>
//   );
// }

// export default Header;
