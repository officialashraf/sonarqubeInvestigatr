import { useState, useEffect } from "react";
import "../Case/createCase.css";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import Select from 'react-select';
import "./subtarget.css";

export const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
    boxShadow: 'none',
    outline: 'none'
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? 'black' : 'white',
    color: state.isSelected ? 'white' : 'black',
    '&:hover': {
      backgroundColor: 'black',
      color: 'white'
    }
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'white',
    color: 'black',
  }),
  multiValueLabel: (base) => ({
    ...base,
    backgroundColor: 'black',
    color: 'white',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'black',
    '&:hover': {
      backgroundColor: 'black',
      color: 'white'
    }
  })
};

const TargetCreate = ({ togglePopup, existingTargets = [] }) => {
  const token = Cookies.get("accessToken");

  const targetType = [
    { value: "watchword", label: "Watchword" },
    { value: "location", label: "Location" },
    { value: "application", label: "Application" },
    { value: "domain", label: "Domain" },
    { value: "protocol", label: "Protocol" },
    { value: "port", label: "Port" },
    { value: "ip address", label: "IP Address" },
    { value: "social media id", label: "Social Media ID" },
    { value: "target", label: "Target" },
    { value: "mobile_number", label: "Mobile Number" },
    { value: "email_id", label: "Email ID" },
    { value: "address", label: "Address" },
    { value: "landline", label: "Landline" },
    { value: "fax_number", label: "Fax Number" },
    { value: "IMEI", label: "IMEI" },
    { value: "IMSI", label: "IMSI" },
    { value: "organization_name", label: "Organization Name" },
    { value: "university_name", label: "University Name" },
    { value: "device_model_number", label: "Device Model Number" },
    { value: "bank_account_number", label: "Bank Account Number" },
    { value: "bank_account_holder_name", label: "Bank Account Holder Name" },
    { value: "bank_customer_id", label: "Bank Customer ID" },
    { value: "bank_holder_address", label: "Bank Holder Address" },
    { value: "property_owner_name", label: "Property Owner Name" },
    { value: "national_id", label: "National ID" },
    { value: "vehicle_number", label: "Vehicle Number" },
    { value: "vehicle_owner_name", label: "Vehicle Owner Name" },
    { value: "passport_number", label: "Passport Number" },
    { value: "criminal_history_offense", label: "Criminal History Offense" },
    { value: "criminal_history_prisoner_number", label: "Criminal History Prisoner Number" },
    { value: "arm_type", label: "Arm Type" },
    { value: "arm_model_number", label: "Arm Model Number" }
  ];

  const [synonymInput, setSynonymInput] = useState("");
  const [subTypeRows, setSubTypeRows] = useState([]);
  const [availableSubTypes, setAvailableSubTypes] = useState([]);
const [formData, setFormData] = useState({
  name: "",
  description: "",
  synonyms: [],
  type: "",
  threat_weightage: 0,
  target_id: []
});
  
  // Threat score options from 0 to 10
  const threatScoreOptions = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i.toString()
  }));

  useEffect(() => {
    // Update available subtypes when target type changes
    if (formData.type) {
      setAvailableSubTypes(formData.type);
    } else {
      setAvailableSubTypes([]);
    }

    // Clear existing subtype rows when target type changes
    if (formData.type === "target" ) {
      setSubTypeRows([{ sub_type: "", target_id: null, value: "" }]);
    } else {
      setSubTypeRows([]);
    }
  }, [formData.type]);

  const handleCreateKeyword = async () => {
    if (!token) {
      toast.error("Authentication error: No token found");
      return;
    }
   
    console.log("query payload", formData);
    
    try {
      // First, create the target
      const targetResponse = await axios.post('http://5.180.148.40:9001/api/case-man/v1/target', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
   console.log("targetzresponse", targetResponse)
     // Ensure valid entries

        // Check if there is data to send
  //       if (updatedSubTypeRows.length === 0) {
  //           console.warn("No valid subtypes to send.");
  //           return;
  //       }
  //       if (updatedSubTypeRows.length > 0) {
  // console.log("subtype",updatedSubTypeRows)
        // Make API request
        // const sub_type_response = await axios.post(
        //     "http://5.180.148.40:9001/api/case-man/v1/target-sub-type",
        //     { sub_type_rows: updatedSubTypeRows },
        //     {
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Authorization": `Bearer ${token}`
        //         }
        //     }
        // );console.log("sub_type_response",sub_type_response)
      // }
      window.dispatchEvent(new Event("databaseUpdated"));

      toast.success("Target created successfully");
      togglePopup();
    } catch (err) {
      console.error("Error:", err.response || err);
      toast.error((err.response?.data?.detail || err.message || "Error encountered during creation"));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
  const updateSubTypeRow = (index, field, value) => {
    const updatedRows = [...subTypeRows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setSubTypeRows(updatedRows);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-icon" onClick={togglePopup}>
          &times;
        </button>
        <div className="popup-content">
          <h5>Add New Target</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCreateKeyword();
            }}
          >

            <div>
              <label htmlFor="type">Type *</label>
              <Select
                options={targetType}
                styles={customStyles}
                placeholder="Select type"
                value={targetType.find(option => option.value === formData.type)}
                onChange={(selectedOption) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: selectedOption.value
                  }))
                }
                className="basic-single-select"
                classNamePrefix="select"
              />
            </div>
            
            <label htmlFor="name">Target *</label>
            <input
              className="com"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter Target"
              required
            />
            <label htmlFor="description">Description</label>
            <textarea
              className="com"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter Description"
            ></textarea>
            <label htmlFor="synonyms">Alternative Keywords/Synonym (up to 5 keywords)</label>
            <div className="synonym-input-container">
              <input
                className="com"
                type="text"
                id="synonyms"
                value={synonymInput}
                onChange={handleSynonymInputChange}
                onKeyDown={handleSynonymKeyDown}
                placeholder="Type in Keywords/Synonym and press Enter to add..."
                disabled={formData.synonyms.length >= 5}
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
            </div>

            <div>
              <label htmlFor="threat_weightage">Threat Score</label>
              <Select
                options={threatScoreOptions}
                styles={customStyles}
                className="com"
                placeholder="Select Threat Score"
                value={threatScoreOptions.find((option) => option.value === formData.threat_weightage) || null}
                onChange={handleThreatScoreChange}
              />
            </div>
            
            {/* Dynamic SubType Section */}
            {(formData.type === "target" ) && availableSubTypes.length > 0 && (
              <div className="subtype-section">
                              {subTypeRows.map((row, index) => (
                  <div key={index} className="subtype-row">
            
                    {existingTargets.length > 0 && (
  <div className="subtype-fields">
    <label>Targets:</label>
    <Select
      isMulti
   options={existingTargets
  .filter(target => target.type !== "target")
  .map(target => ({ 
    value: target.id, 
    label: `${target.id} - ${target.name} - ${target.type}` 
  }))
}

      styles={customStyles}
      placeholder="Select targets"
      value={
        formData.target_id.map(id => {
          const t = existingTargets.find(t => t.id === id);
          return t ? { value: t.id, label: `${t.id} - ${t.name} - ${t.type}` } : null;
        }).filter(Boolean)
      }
      onChange={(selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setFormData(prev => ({
          ...prev,
          target_id: selectedIds
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
              <button type="submit" className="create-btn">
                Create
              </button>
              <button type="button" className="cancel-btn" onClick={togglePopup}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TargetCreate;

// import { useState } from "react";
// import "../Case/createCase.css";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from 'react-toastify';
// import Select from 'react-select';
// import "./target.css";

// export const customStyles = {
//   control: (base) => ({
//     ...base,
//     backgroundColor: 'white',
//     color: 'black',
//     boxShadow: 'none',
//     outline: 'none'
//   }),
//   menu: (base) => ({
//     ...base,
//     backgroundColor: 'white',
//     color: 'black',
//   }),
//   option: (base, state) => ({
//     ...base,
//     backgroundColor: state.isSelected ? 'black' : 'white',
//     color: state.isSelected ? 'white' : 'black',
//     '&:hover': {
//       backgroundColor: 'black',
//       color: 'white'
//     }
//   }),
//   multiValue: (base) => ({
//     ...base,
//     backgroundColor: 'white',
//     color: 'black',
//   }),
//   multiValueLabel: (base) => ({
//     ...base,
//     backgroundColor: 'black',
//     color: 'white',
//   }),
//   multiValueRemove: (base) => ({
//     ...base,
//     color: 'black',
//     '&:hover': {
//       backgroundColor: 'black',
//       color: 'white'
//     }
//   })
// };

// const TargetCreate = ({ togglePopup }) => {
//    const token = Cookies.get("accessToken");
//    const targetType = [
//     { value: "Watchword", label: "Watchword" },
//     { value: "Location", label: "Location" },
//     { value: "Application", label: "Application" },
//     { value: "Domain", label: "Domain" },
//     { value: "Protocol", label: "Protocol" },
//     { value: "Port", label: "Port" },
//     { value: "IP Address", label: "IP Address" },
//     { value: "Social Media ID", label: "Social Media ID" },
//     { value: "Target", label: "Target" }
// ];
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     synonyms: [],
//     type: "",
//     threat_weightage: 0
//   });

//   const [synonymInput, setSynonymInput] = useState("");
  
//   // Threat score options from 0 to 10
//   const threatScoreOptions = Array.from({ length: 11 }, (_, i) => ({
//     value: i,
//     label: i.toString()
//   }));

//   const handleCreateKeyword = async () => {
//        if (!token) {
//       toast.error("Authentication error: No token found");
//       return;
//     }
//        console.log("querypayload",formData)
//     try {
//       const response = await axios.post('http://5.180.148.40:9001/api/case-man/v1/target', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
   
//       window.dispatchEvent(new Event("databaseUpdated"));
      
//       if (response.status === 200) {
//         toast.success("Keyword created successfully");
//         togglePopup();
       
//       } else {
//         toast.error("Unexpected response received from the server");
//       }
//     } catch (err) {
//       console.error("Error during keyword creation:", err.response || err);
//       toast.error((err.response?.data?.detail || err.message || "Error encountered during keyword creation"));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleThreatScoreChange = (selectedOption) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       threat_weightage: selectedOption ? selectedOption.value : 0
//     }));
//   };

//   const handleSynonymInputChange = (e) => {
//     setSynonymInput(e.target.value);
//   };

//   const handleSynonymKeyDown = (e) => {
//     if (e.key === 'Enter' && synonymInput.trim() !== '') {
//       e.preventDefault();
//       if (formData.synonyms.length < 5) {
//         setFormData((prevData) => ({
//           ...prevData,
//           synonyms: [...prevData.synonyms, synonymInput.trim()]
//         }));
//         setSynonymInput('');
//       } else {
//         toast.warning("Maximum 5 synonyms allowed");
//       }
//     }
//   };

//   const removeSynonym = (index) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       synonyms: prevData.synonyms.filter((_, i) => i !== index)
//     }));
//   };

//   return (
//     <div className="popup-overlay">
//       <div className="popup-container">
//         <button className="close-icon" onClick={togglePopup}>
//           &times;
//         </button>
//         <div className="popup-content">
//           <h5>Add New target</h5>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleCreateKeyword();
//             }}
//           >

//                  <div>
//               <label htmlFor="type">Type:</label>
//              <Select
//     options={targetType}
//     styles={customStyles} // Optional styling
//     placeholder="Select type"
//     value={targetType.find(option => option.value === formData.type)} // Set selected value
//     onChange={(selectedOption) =>
//         setFormData((prev) => ({
//             ...prev,
//             type: selectedOption.value
//         }))
//     }
//     className="basic-single-select"
//     classNamePrefix="select"
// />
//             </div>
            
//             <label htmlFor="name">Keyword:</label>
//             <input
//               className="com"
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               placeholder="Enter keyword"
//               required
//             />
            
       
//             <label htmlFor="description">Description:</label>
//             <textarea
//               className="com"
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleInputChange}
//               placeholder="Enter description"
//             ></textarea>

//             <label htmlFor="synonyms">Alternative Keywords/Synonym (up to 5 keywords):</label>
//             <div className="synonym-input-container">
//               <input
//                 className="com"
//                 type="text"
//                 id="synonyms"
//                 value={synonymInput}
//                 onChange={handleSynonymInputChange}
//                 onKeyDown={handleSynonymKeyDown}
//                 placeholder="Type in Keywords/Synonym and press Enter to add..."
//                 disabled={formData.synonyms.length >= 5}
//               />
//               <div className="synonym-chips">
//                 {formData.synonyms.map((synonym, index) => (
//                   <div key={index} className="synonym-chip">
//                     {synonym}
//                     <button
//                       type="button"
//                       className="synonym-remove"
//                       onClick={() => removeSynonym(index)}
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label htmlFor="threat_weightage">Threat Score:</label>
//               <Select
//                 options={threatScoreOptions}
//                 styles={customStyles}
//                 className="com"
//                 placeholder="Select Threat Score"
//                 value={threatScoreOptions.find((option) => option.value === formData.threat_weightage) || null}
//                 onChange={handleThreatScoreChange}
//               />
//             </div>
            
//             <div className="button-container">
//               <button type="submit" className="create-btn">
//                 Create
//               </button>
//               <button type="button" className="cancel-btn" onClick={togglePopup}>
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TargetCreate;
