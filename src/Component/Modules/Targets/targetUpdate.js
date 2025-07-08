import { useState, useEffect } from "react";
import "../Case/createCase.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from 'react-select';
import "./target.css";
import Loader from '../Layout/loader'
import { customStyles } from "../Case/createCase";
import CommonSingleSelect from "../../Common/MultiSelect/CommonSingleSelect";
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import CommonChipsInput from "../../Common/MultiSelect/CommonChipsInput";
import CommonTextArea from "../../Common/MultiSelect/CommonText";
import CommonTextInput from "../../Common/MultiSelect/CommonTextInput";
import AppButton from "../../Common/Buttton/button";

const TargetUpdate = ({ togglePopup, id, existingTargets = [] }) => {
  const token = Cookies.get("accessToken");
  const targetType = [
    { value: "watchword", label: "Watchword" },
    { value: "location", label: "Location" },
    { value: "application", label: "Application" },
    { value: "domain", label: "Domain" },
    { value: "protocol", label: "Protocol" },
    { value: "port", label: "Port" },
    { value: "ipaddress", label: "IP Address" },
    { value: "socialmedia id", label: "Social Media ID" },
    { value: "target", label: "Target" },
    { value: "mobilenumber", label: "Mobile Number" },
    { value: "emailid", label: "Email ID" },
    { value: "address", label: "Address" },
    { value: "landline", label: "Landline" },
    { value: "faxnumber", label: "Fax Number" },
    { value: "IMEI", label: "IMEI" },
    { value: "IMSI", label: "IMSI" },
    { value: "organizationname", label: "Organization Name" },
    { value: "universityname", label: "University Name" },
    { value: "devicemodelnumber", label: "Device Model Number" },
    { value: "bankaccountnumber", label: "Bank Account Number" },
    { value: "bankaccountholdename", label: "Bank Account Holder Name" },
    { value: "bancustomerid", label: "Bank Customer ID" },
    { value: "bankholderaddress", label: "Bank Holder Address" },
    { value: "propertyownername", label: "Property Owner Name" },
    { value: "nationalid", label: "National ID" },
    { value: "vehiclnumber", label: "Vehicle Number" },
    { value: "vehicleownername", label: "Vehicle Owner Name" },
    { value: "passportnumber", label: "Passport Number" },
    { value: "criminalhistoryoffense", label: "Criminal History Offense" },
    { value: "criminalhistoryprisonernumber", label: "Criminal History Prisoner Number" },
    { value: "armtype", label: "Arm Type" },
    { value: "armmodelnumber", label: "Arm Model Number" }
  ];

  const [synonymInput, setSynonymInput] = useState("");
  const [subTypeRows, setSubTypeRows] = useState([]);
  const [availableSubTypes, setAvailableSubTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    synonyms: [],
    type: "",
    threat_weightage: 0,
    target_id: [],
    remove_target: []
  });
  
  const validateForm = () => {
    const errors = {};

    if (!formData.name) {
      errors.name = "Target is required";
    }

    if (!formData.description) {
      errors.description = "Description is required";
    }
    if (!formData.type) {
      errors.type = "Type is required";
    }

    return errors;
  };

  
  // Threat score options from 0 to 10
  const threatScoreOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i.toString()
  }));

  // Fetch target details by ID
  const fetchTargetDetails = async () => {
    if (!token || !id) {
      toast.error("Authentication error or missing target ID");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("response", response)
      if (response.status === 200 && response.data) {
        const targetData = response.data;

        // Extract parent IDs from the parents array
        const parentIds = targetData.parents ? targetData.parents.map(parent => parent.id) : [];

        const newData = {
          name: targetData.name || "",
          description: targetData.description || "",
          synonyms: targetData.synonyms || [],
          type: targetData.type || "",
          threat_weightage: targetData.threat_weightage || 0,
          target_id: parentIds
        };

        setFormData(newData);
        setInitialFormData(newData);
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
  }, [id]);

  useEffect(() => {
    // Update available subtypes when target type changes
    if (formData.type) {
      setAvailableSubTypes(formData.type);
    } else {
      setAvailableSubTypes([]);
    }

    // Clear existing subtype rows when target type changes
    if (formData.type === "target") {
      setSubTypeRows([{ sub_type: "", target_id: null, value: "" }]);
    } else {
      setSubTypeRows([]);
    }
  }, [formData.type]);

  const handleUpdateKeyword = async () => {
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    const payloadData = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
    setIsSubmitting(true);
    console.log("Update payload", formData);

    try {
      const response = await axios.put(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target/${id}`, payloadData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      window.dispatchEvent(new Event("databaseUpdated"));

      if (response.status === 200) {
        toast.success("Target updated successfully");
        togglePopup();
      } else {
        toast.error("Unexpected response received from the server");
      }
    } catch (err) {
      console.error("Error during target update:", err.response || err);
      toast.error((err.response?.data?.detail || err.message || "Error encountered during target update"));
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    const isSame =
      formData.name === initialFormData.name &&
      formData.description === initialFormData.description &&
      JSON.stringify(formData.synonyms) === JSON.stringify(initialFormData.synonyms) &&
      formData.type === initialFormData.type &&
      formData.threat_weightage === initialFormData.threat_weightage &&
      JSON.stringify(formData.target_id) === JSON.stringify(initialFormData.target_id);

    setIsBtnDisabled(isSame);
  }, [formData, initialFormData]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: ""  // Remove the specific error message
    }));
    setError((prevErrors) => ({
      ...prevErrors,
      type: "" // Clear the type error when a type is selected
    }));
  };

  const handleThreatScoreChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      threat_weightage: selectedOption ? selectedOption.value : 0
    }));
  };

  const handleSynonymInputChange = (e) => {
    setSynonymInput(e.target.value);
    setError((prevErrors) => ({
      ...prevErrors,
      synonyms: ""  // Clear synonym-related errors
    }));
  };

  const handleSynonymKeyDown = (e) => {
    if (e.key === 'Enter' && synonymInput.trim() !== '') {
      e.preventDefault();
      if (formData.synonyms.length < 5) {
        setFormData((prevData) => ({
          ...prevData,
          synonyms: [...prevData.synonyms, synonymInput.trim()]
        }));
        setSynonymInput('');
      } else {
        toast.warning("Maximum 5 synonyms allowed");
      }
    }
  };

  const removeSynonym = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      synonyms: prevData.synonyms.filter((_, i) => i !== index)
    }));
  };

  // Update subtype row data
  // const updateSubTypeRow = (index, field, value) => {
  //   const updatedRows = [...subTypeRows];
  //   updatedRows[index] = { ...updatedRows[index], [field]: value };
  //   setSubTypeRows(updatedRows);
  // };

  if (loading) {
    return (
      <div className="popup-overlay">
        <div className="popup-container">
           <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
          <div className="popup-content"style={{height:'300px'}}>
            <div>   <Loader /></div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Edit Target</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateKeyword();
            }}
          >
            <div>
              {/* <label htmlFor="type">Type *</label> */}
              <CommonSingleSelect
                label="Type * "
                options={targetType}
                customStyles={customSelectStyles}
                placeholder="Select type"
                value={targetType.find(option => option.value === formData.type)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: selectedOption.value
                  }))
                }
              
              />
              {error.type && <p style={{ color: "red", margin: '0px' }} >{error.type}</p>}
            </div>

            {/* <label htmlFor="name">Target *</label> */}
            <CommonTextInput
              label="Target *"    
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter target"
            />
            {error.name && <p style={{ color: "red", margin: '0px' }} >{error.name}</p>}

            {/* <label htmlFor="description">Description *</label> */}
            <CommonTextArea
              label="Description *"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter description"
            />
            {error.description && <p style={{ color: "red", margin: '0px' }} >{error.description}</p>}
            {/* <label htmlFor="synonyms">Alternative Keywords/Synonym (up to 5 keywords)</label> */}
            <div className="synonym-input-container">
              <CommonChipsInput
                label="Alternative Keywords/Synonym (up to 5 keywords)"
              type="text"
                id="synonyms"
                value={synonymInput}
                onChange={handleSynonymInputChange}
                onKeyDown={handleSynonymKeyDown}
                placeholder="Type in keywords/synonym and press Enter to add..."
                disabled={formData.synonyms.length >= 5}
                // required
              />
              <div className="synonym-chips">
                {formData.synonyms.map((synonym, index) => (
                  <div key={index} className="synonym-chip">
                    {synonym}
                    <button
                      type="button"
                      className="synonym-remove"
                      onClick={() => removeSynonym(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              {error.synonyms && <p style={{ color: "red", margin: '0px' }} >{error.synonyms}</p>}
            </div>

            <div>
              <CommonSingleSelect
                label="Threat Score"
                options={threatScoreOptions}
                customStyles={customSelectStyles}
               
                placeholder="Select threat score"
                value={threatScoreOptions.find((option) => option.value === formData.threat_weightage) || null}
                onChange={handleThreatScoreChange}
              />
            </div>

            {/* Dynamic SubType Section */}
            {(formData.type === "target") && availableSubTypes.length > 0 && (
              <div className="subtype-section">
                {subTypeRows.map((row, index) => (
                  <div key={index} className="subtype-row">
                    {existingTargets.length > 0 && (
                      <div className="subtype-fields">
                        <label>Targets:</label>
                        <Select
                          isMulti
                          options={existingTargets
                            .filter(target => (target.type !== "target") && (target.id !== parseInt(id)))
                            .map(target => ({
                              value: target.id,
                              label: `${target.id} - ${target.name} - ${target.type}`
                            }))
                          }
                          styles={customStyles}
                          placeholder="Select targets"
                          value={
                            formData.target_id.map(targetId => {
                              const t = existingTargets.find(t => t.id === targetId);
                              return t ? { value: t.id, label: `${t.id} - ${t.name} - ${t.type}` } : null;
                            }).filter(Boolean)
                          }
                          onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            const removedIds = formData.target_id.filter(id => !selectedIds.includes(id));
                            setFormData(prev => ({
                              ...prev,
                              target_id: selectedIds,
                              remove_target: [...(prev.remove_target || []), ...removedIds]
                            }));
                          }}
                          className="target-select"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="button-container">
              <AppButton type="submit" className="create-btn" disabled={isBtnDisabled || isSubmitting}
              >
                {isSubmitting ? 'Editing...' : 'Edit'}
              </AppButton>
              <AppButton type="button" className="cancel-btn" onClick={togglePopup}>
                Cancel
              </AppButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TargetUpdate;
