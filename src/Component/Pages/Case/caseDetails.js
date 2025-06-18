import { Table, CloseButton } from "react-bootstrap";
import "./caseDetails.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const CaseDetails = ({ caseId, togglePopupA }) => {
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCaseDetails = async () => {
            try {
                setLoading(true);
                const token = Cookies.get("accessToken");
                const response = await axios.get(
                    `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case/${caseId}`,
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

        if (caseId) {
            fetchCaseDetails();
        }
    }, [caseId]);

    if (loading) {
        return (
            <div className="popup-overlay">
                <div className="popup-containera">
                    <div className="popup-content">Loading case details...</div>
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
                        <button type="button" className="cancel-btn" onClick={togglePopupA}>
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
                        <h5>{item.title}</h5>
                        <CloseButton onClick={togglePopupA} />
                    </div>
                    <div className="case-details-container">
                        <Table bordered hover className="custom-table custom-table-th">
                            <tbody>
                                <tr>
                                    <th>Case ID</th>
                                    <td>{`CASE${String(item.id).padStart(4, "0")}`}</td>
                                </tr>
                                <tr>
                                    <th>Status</th>
                                    <td>{item.status}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{item.description}</td>
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
                                    <td>{item.editedOn}</td>
                                </tr>
                                <tr>
                                    <th>Edited By</th>
                                    <td>{item.editedBy}</td>
                                </tr>
                                <tr>
                                    <th>Last Data Uploaded On</th>
                                    <td>{item.lastDataUploadOn}</td>
                                </tr>
                                <tr>
                                    <th>Last Data Uploaded By</th>
                                    <td>{item.lastDataUploadBy}</td>
                                </tr>
                                <tr>
                                    <th>Last Data Processed On</th>
                                    <td>{item.lastDataProceedOn}</td>
                                </tr>
                                <tr>
                                    <th>Last Data Processed By</th>
                                    <td>{item.lastDataProceedBy}</td>
                                </tr>
                                <tr>
                                    <th>Assignee</th>
                                    <td>{item.assignee}</td>
                                </tr>
                                <tr>
                                    <th>Watcher(s)</th>
                                    <td> {Array.isArray(item.watchers)
                                        ? item.watchers.join(", ")
                                        : typeof item.watchers === "string"
                                            ? item.watchers.split(",").map((w) => w.trim()).join(", ")
                                            : ""}</td>
                                </tr>
                                <tr>
                                    <th>Archived By</th>
                                    <td>{item.archivedBy}</td>
                                </tr>
                                <tr>
                                    <th>Archived On</th>
                                    <td>{item.archivedOn}</td>
                                </tr>
                                <tr>
                                    <th>Archival Reason</th>
                                    <td>{item.archivalReason}</td>
                                </tr>
                                <tr>
                                    <th>Archival Comments</th>
                                    <td>{item.archivalComments}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                    <div className="button-container">
                        <button type="button" className="cancel-btn" onClick={togglePopupA}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaseDetails;
