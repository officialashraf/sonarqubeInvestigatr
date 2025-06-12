import { Table, CloseButton } from "react-bootstrap";
import "../Case/caseDetails.css"
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

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
        console.log("response", response);
        setItem(response.data.data || response.data);
      }  catch (err) {
                  toast.error(err.response?.data?.detail||"Failed to fetch target details");
                 console.error("Error fetching target details:", err.response || err);
                //  togglePopup();
          } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  if (loading) {
    return <div className="popup-overlay"><div className="popup-containera"><div className="popup-content">Loading user details...</div></div></div>;
  }

  if (!item) {
    return <div className="popup-overlay"><div className="popup-containera"><div className="popup-content">No user details found.</div>
      <button type="button" className="cancel-btn" onClick={toggleDetails}>
        Cancel
      </button></div></div>;
  }

  return <div className="popup-overlay">
    <div className="popup-containera">
      <div className="popup-content">
        <div className="header">
          <h5>
            {item.username}
          </h5>
          <CloseButton onClick={toggleDetails} />
        </div>
        <div className="case-details-container">
          <Table bordered hover className="custom-table custom-table-th">
            <tbody>
              <tr>
                <th>Username</th>
                <td>
                  {item.username}
                </td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>
                  {`USER${String(item.id).padStart(4, '0')}`}
                </td>
              </tr>
              <tr>
                <th>Email</th>
                <td>
                  {item.email}
                </td>
              </tr>
              <tr>
                <th>Last Active</th>
                <td>
                  {item.last_logout}
                </td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className={item.status === "Active" ? "status-active-1" : "status-inactive"}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="button-container">
          <button type="button" className="cancel-btn" onClick={toggleDetails}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>;
};

export default UserDetails;
