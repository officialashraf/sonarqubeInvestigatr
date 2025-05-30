
import { Table, CloseButton } from 'react-bootstrap'
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Loader from '../Layout/loader'


const TargetDetails = ({ togglePopup, id }) => {
// const id = details
// console.log("id", id)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    synonyms: [],
    type: "",
    threat_weightage: 0,
    target_id: [],
    remove_target: [],
    created_on: null,
    created_by: null,
    modified_on: null,
    modified_by: null,
    is_active: null,
    linked_to: ""
  });

  const [loading, setLoading] = useState(true);
  const token = Cookies.get("accessToken");

  // Fetch target details by ID
  const fetchTargetDetails = async () => {
    if (!token || !id) {
      console.log("token:", token, "id:", id);
      toast.error("Authentication error or missing target ID");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://5.180.148.40:9001/api/case-man/v1/target/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("response", response)
      if (response.status === 200 && response.data) {
        const targetData = response.data;

        // Extract parent IDs from the parents array
        const parentIds = targetData.parents ? targetData.parents.map(parent => parent.id) : [];
        const parentNames = targetData.parents && targetData.parents.length > 0
          ? targetData.parents.map(p => `${p.name} (${p.id})`).join(", ")
          : "None";

        setFormData({
          name: targetData.name || "",
          description: targetData.description || "",
          synonyms: targetData.synonyms || [],
          type: targetData.type || "",
          threat_weightage: targetData.threat_weightage || 0,
          target_id: parentIds,
          remove_target: [],
          created_on: targetData.created_on,
          created_by: targetData.created_by,
          modified_on: targetData.modified_on,
          modified_by: targetData.modified_by,
          is_active: targetData.is_active,
          linked_to: parentNames
        });
      }
    } catch (err) {
      console.error("Error fetching target details:", err.response || err);
      toast.error("Failed to fetch target details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargetDetails();
  }, [id, token]);


  return (

    <div className="popup-overlay">
      <div className="popup-containera">
        <div className="popup-content">

          <div className="header">
            <span> <h5>Target Details</h5></span>
            <CloseButton onClick={togglePopup} />
          </div>
          <div className="case-details-container">
            <Table bordered hover className='custom-table custom-table-th' >
              <tr> <th>Name</th> <td>{formData.name}</td> </tr>
              <tbody>
                <tr> <th>ID</th> <td>{id}</td> </tr>
                <tr> <th>Created On</th> <td>{formData?.created_on ? formData.created_on.slice(0, 18) : '-'}</td> </tr>
                <tr> <th>Created By</th> <td>{formData?.created_by ? formData.created_by.slice(0, 12) : '-'}</td> </tr>
                <tr> <th>Modified On</th> <td>{formData?.modified_on ? formData.modified_on.slice(0, 18) : '-'}</td> </tr>
                <tr> <th>Modified By</th> <td>{formData?.modified_by ? formData.modified_by.slice(0, 12) : '-'}</td> </tr>
                <tr> <th>Description</th> <td>{formData.description || '-'}</td> </tr>
                <tr> <th>Synonyms</th> <td>{formData.synonyms.join(', ') || '-'}</td> </tr>
                <tr> <th>Threat-Score</th> <td>{formData.threat_weightage}</td> </tr>
                <tr> <th>Type</th> <td>{formData.type || '-'}</td> </tr>
                <tr> <th>Active</th>  <td>{formData.is_active ? 'active' : 'deactive'}</td> </tr>
                <tr> <th>Linked To</th> <td>{formData.linked_to}</td> </tr>


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

  )
}

export default TargetDetails


