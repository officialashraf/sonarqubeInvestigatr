import axios from 'axios';
import { useEffect, useState } from 'react'
import { NavDropdown } from 'react-bootstrap';
import Cookies from 'js-cookie';
import styles from './notification.module.css'
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

            const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_NOTIFICATION}/api/notifications/${loggedInUser}`, {
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
            // toast.error(error.response?.data?.details || "Error fetching Notifications")
            console.error(" Error fetching Notifications:", error);
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

            const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_NOTIFICATION}/api/notifications/mark-as-read/${loggedInUser}`, {
                notification_id: [notificationId]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("✅ Mark as read API response:", response.data);
            toast.success("Notification marked as read sucessfully")

            // Fetch latest notifications after marking as read
            await fetchNotifications();
            console.log("🔄 Fetched latest notifications after mark as read");

        } catch (error) {
            toast.error(error.response?.data?.detail || "Error marking notification as read")
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
            const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_NOTIFICATION}/api/notifications/mark-as-read/${loggedInUser}`, {
                notification_id: unreadIds  // Array of integers [1,2,3,4,5]
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log("✅ Mark all as read API response:", response.data);
            toast.success("Notifications marked as read sucessfully")
            // Fetch latest notifications after marking all as read
            await fetchNotifications();
            console.log("🔄 Fetched latest notifications after mark all as read");

        } catch (error) {
            toast.error(error.response?.data?.detail || "Error marking all notifications as read")
            console.error("❌ Error marking all notifications as read:", error);
            console.error("Error details:", error.response?.data);
        } finally {
            setMarkingAsRead(false);
        }
    };

    return (
        <div style={{ height: '500px', border: '1px solid #0073cf'}}>
            <NavDropdown
                id="profile-dropdown"
                align="end"
                 show={isOpen}
                 onToggle={(isOpen) => setIsOpen(isOpen)}
                style={{
                    display: isOpen ? "block" : "none", height: "500px", overflowY: "auto", position: 'relative', scrollbarColor: '#1e7df8 #0a192f',    
                    scrollbarWidth: 'thin',
                    zIndex: 9999}}
            >
                <div style={{ padding: '10px', borderBottom: '1px solid #0073cf', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#101D2B' }}>
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
                    <NavDropdown.Item
                        className={styles.navDropdownItem}
                        style={{ maxWidth: '252px', padding: '10px', display: 'flex', justifyContent: 'center' }}
                    >
                        <Loader />
                    </NavDropdown.Item>
                ) : notifications.length === 0 ? (
                    <NavDropdown.Item>
                        <span>No notifications available</span>
                    </NavDropdown.Item>
                ) : (
                    notifications.map((item) => (
                        <NavDropdown.Item
                            key={item.id}
                            className={styles.navDropdownItem}
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
                            <div style={{ flex: 1, marginRight: '10px', color: '#d2d2d2' }}>
      <div
        style={{
          whiteSpace: 'normal',
          wordBreak: 'break-word'
        }}
      >
        {item.message}
      </div>
      <div style={{ fontSize: '12px', color: '#888' }}>
        Created On: <strong>{new Date(item.created_on).toLocaleString()}</strong>
      </div>
    </div>

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