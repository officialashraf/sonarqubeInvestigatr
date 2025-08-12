// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Cookies from "js-cookie";
// import useFilterDropdowns from "./useFilterDropdown";
// import CommonModal from "./CommonModel";
// import CommonMultiSelect from "../../Common/MultiSelect/CommonMultiSelect";
// import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";
// import CommonDateInput from "../../Common/DateField/DateField";
// import CommonTextInput from "../../Common/MultiSelect/CommonTextInput";

// const FilterForm = ({ mode = "add", initialData = {}, onSubmit, onClose, caseId }) => {
//     const { platforms, targets, sentiments, fetchDropdowns } = useFilterDropdowns();
//     const dispatch = useDispatch();
//     const Token = Cookies.get("accessToken");

//     // 🆕 State for case list options
//     const [caseOptions, setCaseOptions] = useState([]);

//     const [formData, setFormData] = useState({
//         searchQuery: initialData.searchQuery || "",
//         fileType: initialData.fileType || [],
//         platform: initialData.platform || [],
//         targets: initialData.targets || [],
//         sentiment: initialData.sentiment || [],
//         caseIds: initialData.caseIds || [],
//         startDate: initialData.startDate || null,
//         endDate: initialData.endDate || null,
//         includeArchived: initialData.includeArchived || false,
//         latitude: initialData.latitude || "",
//         longitude: initialData.longitude || "",
//     });

//     const [selectedDates, setSelectedDates] = useState({
//         startDate: initialData.startDate || null,
//         endDate: initialData.endDate || null,
//         startTime: { hours: 16, minutes: 30 },
//         endTime: { hours: 16, minutes: 30 },
//     });

//     const [showPopupD, setShowPopupD] = useState(false);

//     // Fetch all dropdowns (platforms, targets, sentiments)
//     useEffect(() => {
//         fetchDropdowns();
//     }, []);

//     // 🆕 Fetch case list for dropdown
//     useEffect(() => {
//         if (mode === "criteria" || !caseId) {
//             const fetchCases = async () => {
//                 try {
//                     const res = await axios.get(
//                         `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`,
//                         {
//                             headers: {
//                                 "Content-Type": "application/json",
//                                 Authorization: `Bearer ${Token}`,
//                             },
//                         }
//                     );

//                     if (res.data?.data) {
//                         const formatted = res.data.data.map((c) => ({
//                             value: c.id,
//                             label: `CASE${String(c.id).padStart(4, "0")}${c.title ? " - " + c.title : ""}`,
//                         }));
//                         setCaseOptions(formatted);

//                         // Optional: preselect in edit mode
//                         if (initialData.caseIds?.length) {
//                             setFormData((prev) => ({ ...prev, caseIds: initialData.caseIds }));
//                         }
//                     }
//                 } catch (err) {
//                     console.error("Error fetching cases", err);
//                 }
//             };
//             fetchCases();
//         }
//     }, [mode, caseId, Token, initialData.caseIds]);

//     const handleFormChange = (field, value) => {
//         setFormData((prev) => ({ ...prev, [field]: value }));
//     };

//     const handleDateSelection = (dateData) => {
//         setSelectedDates(dateData);
//         setFormData((prev) => ({
//             ...prev,
//             startDate: dateData.startDate,
//             endDate: dateData.endDate,
//         }));
//         setShowPopupD(false);
//     };

//     const formatDateRange = () => {
//         if (selectedDates.startDate && selectedDates.endDate) {
//             return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
//         }
//         return "Select date range";
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         const startTime = selectedDates.startDate
//             ? `${selectedDates.startDate.toISOString().split("T")[0]}T${String(selectedDates.startTime.hours).padStart(2, "0")}:${String(selectedDates.startTime.minutes).padStart(2, "0")}:00`
//             : null;

//         const endTime = selectedDates.endDate
//             ? `${selectedDates.endDate.toISOString().split("T")[0]}T${String(selectedDates.endTime.hours).padStart(2, "0")}:${String(selectedDates.endTime.minutes).padStart(2, "0")}:00`
//             : null;

//         const payload = {
//             case_id: caseId ? [String(caseId)] : formData.caseIds.map((c) => String(c.value)),
//             file_type: formData.platform.map((p) => p.value),
//             targets: formData.targets.map((t) => t.value),
//             sentiment: formData.sentiment.map((s) => s.value),
//             starttime: startTime,
//             endtime: endTime,
//             keyword: formData.searchQuery ? [formData.searchQuery] : [],
//         };

//         if (onSubmit) {
//             onSubmit(payload);
//         }
//     };

//     return (
//         <CommonModal title={mode === "edit" ? "Edit Filter" : "Add Filter"} onClose={onClose}>
//             <form onSubmit={handleSubmit}>
//                 {/* Cases dropdown */}
//                 {mode === "criteria" && (
//                     <div className="form-group">
//                         <label>Cases</label>
//                         <CommonMultiSelect
//                             label="Cases"
//                             isMulti
//                             options={caseOptions}
//                             customStyles={customSelectStyles}
//                             value={formData.caseIds}
//                             onChange={(selected) => handleFormChange("caseIds", selected)}
//                             placeholder="Select cases"
//                         />
//                     </div>
//                 )}

//                 {/* Platforms */}
//                 <div className="form-group">
//                     <label>Platform</label>
//                     <CommonMultiSelect
//                         label="Platform"
//                         isMulti
//                         options={platforms}
//                         customStyles={customSelectStyles}
//                         value={formData.platform}
//                         onChange={(selected) => handleFormChange("platform", selected)}
//                         placeholder="Select platforms"
//                     />
//                 </div>

//                 {/* Targets */}
//                 <div className="form-group">
//                     <label>Targets</label>
//                     <CommonMultiSelect
//                         label="Targets"
//                         isMulti
//                         options={targets}
//                         customStyles={customSelectStyles}
//                         value={formData.targets}
//                         onChange={(selected) => handleFormChange("targets", selected)}
//                         placeholder="Select targets"
//                     />
//                 </div>

//                 {/* Sentiments */}
//                 <div className="form-group">
//                     <label>Sentiment</label>
//                     <CommonMultiSelect
//                         label="Sentiment"
//                         isMulti
//                         options={sentiments}
//                         customStyles={customSelectStyles}
//                         value={formData.sentiment}
//                         onChange={(selected) => handleFormChange("sentiment", selected)}
//                         placeholder="Select sentiments"
//                     />
//                 </div>

//                 {/* Keywords */}
//                 <div className="form-group">
//                     <label>Keywords</label>
//                     <CommonTextInput
//                         type="text"
//                         value={formData.searchQuery}
//                         onChange={(e) => handleFormChange("searchQuery", e.target.value)}
//                         placeholder="Enter keywords"
//                     />
//                 </div>

//                 {/* Date Range */}
//                 <div className="form-group">
//                     <label>Date Range</label>
//                     <CommonDateInput
//                         label="Date Range"
//                         placeholder="Select date range"
//                         value={formatDateRange()}
//                         onClickIcon={() => setShowPopupD(true)}
//                     />
//                 </div>

//                 <div className="button-container">
//                     <button type="submit" className="add-btn">
//                         {mode === "edit" ? "Update" : "Add"} Filter
//                     </button>
//                     <button type="button" className="add-btn" onClick={onClose}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </CommonModal>
//     );
// };

// export default FilterForm;
