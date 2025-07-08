import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import PopupModal from "../../Common/Popup/popup";
import DetailBox from "../../Common/DetailBox/DetailBox";
import styles from '../../Common/DetailBox/detailBox.module.css'
import AppButton from "../../Common/Buttton/button";

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

     const formatWatchers = () => {
    if (Array.isArray(item.watchers)) return item.watchers.join(", ");
    if (typeof item.watchers === "string")
      return item.watchers.split(",").map((w) => w.trim()).join(", ");
    return "";
  };

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
       <PopupModal title={'Case Details'} onClose={togglePopupA}>
         <div className={styles.container}>
         <div className={styles.grid}>
        <DetailBox label="Case ID" value={`CASE${String(item.id).padStart(4, "0")}`} />
        <DetailBox label="Status" value={item.status} isStatus />
        <DetailBox label="Description" value={item.description} />
        <DetailBox label="Created On" value={item.created_on?.slice(0, 12)} />
        <DetailBox label="Created By" value={item.created_by} />
        <DetailBox label="Edited On" value={item.editedOn} />
        <DetailBox label="Edited By" value={item.editedBy} />
        <DetailBox label="Assignee" value={item.assignee} />
        <DetailBox label="Watcher(s)" value={formatWatchers()} />
        <DetailBox label="Archived By" value={item.archivedBy} />
        <DetailBox label="Archived On" value={item.archivedOn} />
        <DetailBox label="Archival Reason" value={item.archivalReason} />
        <DetailBox label="Archival Comments" value={item.archivalComments} />
      </div>
    </div>
    <div className="d-flex justify-content-center mt-3">
          <AppButton children={"OK"}  onClick={togglePopupA} />
        </div>
           </PopupModal> 
    );
};

export default CaseDetails;
