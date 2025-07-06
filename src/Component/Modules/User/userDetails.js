import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import PopupModal from "../../Common/Popup/popup";
import DetailBox from "../../Common/DetailBox/DetailBox";
import styles from '../../Common/DetailBox/detailBox.module.css';
import AppButton from "../../Common/Buttton/button";

const UserDetails = ({ userId, toggleDetails }) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("accessToken");
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        setItem(response.data.data || response.data);
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to fetch user details");
        console.error("Error fetching user details:", err.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="popup-overlay">
        <div className="popup-containera">
          <div className="popup-content">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="popup-overlay">
        <div className="popup-containera">
          <div className="popup-content">
            <p>No user details found.</p>
            <button type="button" className="cancel-btn" onClick={toggleDetails}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PopupModal title={'User Details'} onClose={toggleDetails}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <DetailBox label="Username" value={item.username} />
          <DetailBox label="User ID" value={`USER${String(item.id).padStart(4, '0')}`} />
          <DetailBox label="Email" value={item.email} />
          <DetailBox label="Last Active" value={item.last_logout} />
          <DetailBox label="Status" value={item.status.charAt(0).toUpperCase() + item.status.slice(1)} isStatus />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-3">
        <AppButton onClick={toggleDetails}>OK</AppButton>
      </div>
    </PopupModal>
  );
};

export default UserDetails;
