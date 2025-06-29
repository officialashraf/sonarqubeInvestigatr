import { Table, CloseButton } from 'react-bootstrap'
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';


const ConnectionDetails = ({ togglePopup, id }) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnectionDetails = async () => {
            try {
                setLoading(true);
                const token = Cookies.get("accessToken");
                const response = await axios.get(
                    `${window.runtimeConfig.REACT_APP_API_CONNECTION}/api/case-man/v1/connection/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                console.log("Case details response:", response);
                setItem(response.data.data || response.data);
            } catch (err) {
                toast.error(
                    err.response?.data?.detail || "Failed to fetch case details"
                );
                console.error("Error fetching case details:", err.response || err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchConnectionDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="popup-overlay">
                <div className="popup-containera">
                    <div className="popup-content">Loading connection details...</div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="popup-overlay">
                <div className="popup-containera">
                    <div className="popup-content">
                        <p>No case details found.</p>
                        <button type="button" className="cancel-btn" onClick={togglePopup}>
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
                        <h5>{item.name}</h5>
                        <CloseButton onClick={togglePopup} />
                    </div>
                    <div className="case-details-container">
                        <Table bordered hover className="custom-table custom-table-th">
                            <tbody>
                                <tr>
                                    <th>Connection ID</th>
                                    <td>{`CONN${String(item.id).padStart(4, "0")}`}</td>
                                </tr>
                                <tr>
                                    <th>Connection Name</th>
                                    <td>{item.name}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{item.status}</td>
                                </tr>
                                <tr>
                                    <th>Created On</th>
                                    <td>{item.created_on?.slice(0, 12)}</td>
                                </tr>
                                <tr>
                                    <th>Created By</th>
                                    <td>{item.created_by}</td>
                                </tr>
                                <tr>
                                    <th>Edited On</th>
                                    <td>{item.modified_on}</td>
                                </tr>
                                <tr>
                                    <th>Edited By</th>
                                    <td>{item.modified_by}</td>
                                </tr>
                              
                                
                                
                                
                               
                            </tbody>
                        </Table>
                    </div>
                    <div className="button-container">
                        <button type="button" className="cancel-btn" onClick={togglePopup}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConnectionDetails;
