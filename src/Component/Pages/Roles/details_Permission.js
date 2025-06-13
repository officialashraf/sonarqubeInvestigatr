import { Table, CloseButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const DetailsPermission = ({ roleId, toggleDetails }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        setLoading(true);
        const token = Cookies.get('accessToken');
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/role/${roleId}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Role details response:', response);
        setDetails(response.data);
      } catch (err) {
        toast.error(err.response?.data?.detail || 'Failed to fetch role details');
        console.error('Error fetching role details:', err.response || err);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchRoleDetails();
    }
  }, [roleId]);

  if (loading) {
    return (
      <div className="popup-overlay">
        <div className="popup-containera">
          <div className="popup-content">Loading role details...</div>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="popup-overlay">
        <div className="popup-containera">
          <div className="popup-content">
            <p>No role details found.</p>
            <button type="button" className="cancel-btn" onClick={toggleDetails}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-containera">
        <div className="popup-content">
          <div className="header">
            <h5>{details.role}</h5>
            <CloseButton onClick={toggleDetails} />
          </div>
          <div className="case-details-container">
            <Table bordered hover className="custom-table custom-table-th">
              <tbody>
                <tr>
                  <th>Role</th>
                  <td>{details.role}</td>
                </tr>
                <tr>
                  <th>Created On</th>
                  <td>{details?.created_on ? details.created_on.slice(0, 12) : '-'}</td>
                </tr>
                <tr>
                  <th>Created By</th>
                  <td>{details?.created_by ? details.created_by.slice(0, 8) : '-'}</td>
                </tr>
                <tr>
                  <th>Edited On</th>
                  <td>{details.editedOn || '-'}</td>
                </tr>
                <tr>
                  <th>Edited By</th>
                  <td>{details.editedBy || '-'}</td>
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
    </div>
  );
};

export default DetailsPermission;
