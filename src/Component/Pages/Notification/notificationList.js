// import axios from 'axios';
// import { useEffect, useState } from 'react'
// import { NavDropdown} from 'react-bootstrap';
// import Cookies from 'js-cookie';
// import './notification.css'
// import Loader from "../Layout/loader";
// import { jwtDecode } from "jwt-decode";

// const NotificationList = ({ isOpen, setIsOpen }) => {
//     const token = Cookies.get('accessToken');
//     const [notifications, setNotifications] = useState([]);
//     const [loading, setLoading] = useState(true);
//   const [loggedInUser, setLoggedInUser] = useState(null);


//   useEffect(() => {
//         if (token) {
//           const decodedToken = jwtDecode(token);
//           setLoggedInUser(decodedToken.sub);
//           console.log("User:",decodedToken.sub); // Pura payload dekho
//           console.log("User ID:", loggedInUser); // Yahan se user ID mil jaayegi
//         }
//       }, [token,loggedInUser]);

//       useEffect(() => {
//         const fetchNotifications = async () => {
//             try {
//                 const response = await axios.get(`http://5.180.148.40:9009/api/notifications/${loggedInUser}`, {
//                     headers: {
//                         "Content-Type": "application/json",
//                         "Authorization": `Bearer ${token}`
//                     }
//                 });
//                 console.log("response_Data", response.data)
          
//                 setNotifications(response.data);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching Notifications:", error);
//                 setLoading(false);
//             }
//         };

//         fetchNotifications();
//     }, [token,loggedInUser]);

    

//     return (
//         <div style={{ height: '400px' }}>

//             {/* <NavDropdown
//                 id="profile-dropdown"
//                 align="end"
//                 show={isOpen}
//                 onToggle={(isOpen) => setIsOpen(isOpen)}
//                 style={{ display: isOpen ? "block" : "none", height: "500px", overflow: "auto" }}
//             >
//                 <button className='add-btn'>Mark As All Read</button>
//                 <button className="close-icon" onClick={() => setIsOpen()} style={{ padding: '0px' }}>
//                     &times;
//                 </button>
//                 {notifications.map((item) => (
//                     <NavDropdown.Item key={item.id} className="nav-dropdown-item" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                         <span>{item.message}</span> 
//                         <button className='add-btn'>Mark As Read</button> 
//                     </NavDropdown.Item>
//                 ))}
//             </NavDropdown> */}
            
// <NavDropdown id="profile-dropdown" align="end" show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}
//     style={{ display: isOpen ? "block" : "none", height: "500px", overflow: "auto" }}
//     >
//     <button className='add-btn'>Mark As All Read</button>
//                 <button className="close-icon" onClick={() => setIsOpen()} style={{ padding: '0px' }}>
//                     &times;
//                 </button>
//     {loading ? (
//         <NavDropdown.Item>
//          <span> <Loader/> </span>
//         </NavDropdown.Item>
//     ) : notifications.length === 0 ? (
//         <NavDropdown.Item>
//             <span>No notifications available</span> 
//         </NavDropdown.Item>
//     ) : (
//         notifications.map((item) => (
//             <NavDropdown.Item key={item.id} className="nav-dropdown-item">
//                 <span>{item.message}</span>
//                 <button className="add-btn">Mark as Read</button>
//             </NavDropdown.Item>
//         ))
//     )}
// </NavDropdown>

//         </div>
//     );
// }

// export default NotificationList


import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavDropdown} from 'react-bootstrap';
import Cookies from 'js-cookie';
import './notification.css'
import Loader from "../Layout/loader";
import { jwtDecode } from "jwt-decode";
import { toast } from 'react-toastify';

const NotificationList = ({ isOpen, setIsOpen }) => {
    const token = Cookies.get('accessToken');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [markingAsRead, setMarkingAsRead] = useState(false);

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setLoggedInUser(decodedToken.sub);
            console.log("User:", decodedToken.sub);
        }
    }, [token]);

    const fetchNotifications = async () => {
        if (!loggedInUser) return;
        
        try {
            setLoading(true);
            console.log("🔄 Fetching notifications for user:", loggedInUser);
            
            const response = await axios.get(`http://5.180.148.40:9009/api/notifications/${loggedInUser}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            console.log("📥 Notifications API response:", response.data);
            console.log("📊 Total notifications:", response.data.length);
            
            // Debug each notification's is_read status
            // response.data.forEach(notification => {
            //     console.log(`📋 Notification ID: ${notification.id}, is_read: ${notification.is_read}, message: ${notification.message}`);
            // });
            
            setNotifications(response.data);
            
        } catch (error) {
             toast.error(error.response.data.details||"Error fetching Notifications")
            console.error("❌ Error fetching Notifications:", error);
            console.error("Error details:", error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [loggedInUser]);

    const markAsRead = async (notificationId) => {
        try {
            setMarkingAsRead(true);
            console.log("🔄 Marking notification as read:", notificationId);
            
            const response = await axios.post(`http://5.180.148.40:9009/api/notifications/mark-as-read/${loggedInUser}`, {
                notification_id: [notificationId]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("✅ Mark as read API response:", response.data);
            toast.success(response.data.response)
            
            // Fetch latest notifications after marking as read
            await fetchNotifications();
            console.log("🔄 Fetched latest notifications after mark as read");

        } catch (error) {
             toast.error(error.response.data.details||"Error marking notification as read")
            console.error("❌ Error marking notification as read:", error);
            console.error("Error details:", error.response?.data);
        } finally {
            setMarkingAsRead(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            setMarkingAsRead(true);
            const unreadNotifications = notifications.filter(n => !n.is_read);
            const unreadIds = unreadNotifications.map(n => n.id);
            
            console.log("🔄 Marking all notifications as read");
            console.log("📋 Unread notification IDs:", unreadIds);
            
            if (unreadIds.length === 0) {
                console.log("ℹ️ No unread notifications to mark");
                return;
            }

            // Send array of IDs to mark all as read
            const response = await axios.post(`http://5.180.148.40:9009/api/notifications/mark-as-read/${loggedInUser}`, {
                notification_id: unreadIds  // Array of integers [1,2,3,4,5]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("✅ Mark all as read API response:", response.data);
             toast.success(response.data.response)
            // Fetch latest notifications after marking all as read
            await fetchNotifications();
            console.log("🔄 Fetched latest notifications after mark all as read");

        } catch (error) {
            toast.error(error.response.data.details||"Error marking all notifications as read")
            console.error("❌ Error marking all notifications as read:", error);
            console.error("Error details:", error.response?.data);
        } finally {
            setMarkingAsRead(false);
        }
    };

    return (
        <div style={{ height: '400px' }}>
            <NavDropdown 
                id="profile-dropdown" 
                align="end" 
                show={isOpen} 
                onToggle={(isOpen) => setIsOpen(isOpen)}
                style={{ display: isOpen ? "block" : "none", height: "500px", overflow: "auto" }}
            >
                <div style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        className='add-btn' 
                        onClick={markAllAsRead}
                        disabled={markingAsRead || notifications.every(n => n.isRead)}
                        style={{ 
                            opacity: markingAsRead || notifications.every(n => n.isRead) ? 0.6 : 1,
                            cursor: markingAsRead || notifications.every(n => n.isRead) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {markingAsRead ? 'Marking...' : 'Mark All As Read'}
                    </button>
                    <button 
                        className="close-icon" 
                        onClick={() => setIsOpen(false)} 
                        style={{ 
                            padding: '5px 10px', 
                            background: 'none', 
                            border: 'none', 
                            fontSize: '18px',
                            cursor: 'pointer'
                        }}
                    >
                        &times;
                    </button>
                </div>

                {loading ? (
                    <NavDropdown.Item>
                        <span><Loader/></span>
                    </NavDropdown.Item>
                ) : notifications.length === 0 ? (
                    <NavDropdown.Item>
                        <span>No notifications available</span>
                    </NavDropdown.Item>
                ) : (
                    notifications.map((item) => (
                        <NavDropdown.Item 
                            key={item.id} 
                            className="nav-dropdown-item"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 20px',
                                // backgroundColor: item.is_read ? '#f8f9fa' : '#fff',
                                backgroundColor: item.is_read ? '3px solid #28a745' : '3px solid #007bff',
                                opacity: item.isRead ? 0.7 : 1
                            }}
                        >
                            <span style={{ 
                                flex: 1, 
                                marginRight: '10px',
                                color: item.is_read ? '#6c757d' : '#333'
                            }}>
                                {item.message}
                            </span>
                            
                            {item.is_read ? (
                                <span style={{ 
                                    color: '#28a745', 
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}>
                                    ✓ Read
                                </span>
                            ) : (
                                <button 
                                type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAsRead(item.id);
                                    }}
                                    disabled={markingAsRead}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#007bff',
                                        cursor: markingAsRead ? 'not-allowed' : 'pointer',
                                        fontSize: '16px',
                                        padding: '4px',
                                        opacity: markingAsRead ? 0.4 : 1
                                    }}
                                    title="Mark as read"
                                >
                                    📖
                                </button>
                            )}
                        </NavDropdown.Item>
                    ))
                )}
            </NavDropdown>
        </div>
    );
}

export default NotificationList;