import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import DatePickera from '../../FilterCriteria/datepicker';
import '../../FilterCriteria/createCriteria.module.css';
import { fetchSummaryData } from '../../../../Redux/Action/filterAction';
import { saveCaseFilterPayload } from '../../../../Redux/Action/caseAction';
import { InputField } from '../../../Common/InpuField/inputField';
import CommonMultiSelect from '../../../Common/MultiSelect/CommonMultiSelect';
import customSelectStyles from '../../../Common/CustomStyleSelect/customSelectStyles';
import CommonDateInput from '../../../Common/DateField/DateField';
import styles from "../../../Common/Table/table.module.css";

const AddFilter = ({ handleCreateCase, searchChips, isPopupVisible, setIsPopupVisible }) => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const caseId = useSelector((state) => state.caseData.caseData.id);
  const caseFilter = useSelector((state) => state.caseFilter.caseFilters);
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [showPopupD, setShowPopupD] = useState(false);

  // STATE for form
  const [formData, setFormData] = useState({
    platform: [],
    startDate: null,
    endDate: null,
  });

  // STATE for selected time along with date
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 0, minutes: 0 },
    endTime: { hours: 0, minutes: 0 }
  });

  // ⏬ Set defaults from Redux (caseFilter) if caseId matches
  useEffect(() => {
    if (caseFilter && caseFilter.caseId === caseId) {
      const defaultPlatforms = (caseFilter.file_type || []).map(type => ({ label: type, value: type }));

      // convert string to Date
      const parsedStart = caseFilter.start_time ? new Date(caseFilter.start_time) : null;
      const parsedEnd = caseFilter.end_time ? new Date(caseFilter.end_time) : null;

      setFormData(prev => ({
        ...prev,
        platform: defaultPlatforms,
        startDate: parsedStart,
        endDate: parsedEnd
      }));

      setSelectedDates({
        startDate: parsedStart,
        endDate: parsedEnd,
        startTime: parsedStart ? { hours: parsedStart.getHours(), minutes: parsedStart.getMinutes() } : { hours: 0, minutes: 0 },
        endTime: parsedEnd ? { hours: parsedEnd.getHours(), minutes: parsedEnd.getMinutes() } : { hours: 0, minutes: 0 },
      });
    }
  }, [caseId, caseFilter]);

  // Fetch Platform Options
  useEffect(() => {
    const fetchFileTypes = async () => {
      try {
        const res = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
          headers: { Authorization: `Bearer ${Token}` }
        });

        const formatted = res.data.data.map(item => ({ label: item, value: item }));
        setFileTypeOptions(formatted);
      } catch (err) {
        console.error("Error loading platforms:", err);
      }
    };

    fetchFileTypes();
  }, [Token]);

  const toggleDatePickerPopup = () => setShowPopupD(!showPopupD);

  const handleDateSelection = (dateData) => {
    setSelectedDates(dateData);
    setFormData(prev => ({
      ...prev,
      startDate: dateData.startDate,
      endDate: dateData.endDate,
    }));
    toggleDatePickerPopup();
  };

  const formatDateRange = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
    }
    return 'Select date range';
  };

  // 🚀 Final Payload on Search
  const performSearch = () => {
    const startTime =
      selectedDates.startDate && selectedDates.startTime
        ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`
        : null;

    const endTime =
      selectedDates.endDate && selectedDates.endTime
        ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
        : null;

    const selectedPlatforms = Array.isArray(formData.platform)
      ? formData.platform.map(p => p.value)
      : [];

    const payload = {
      queryPayload: { unified_case_id: caseId }
    };

    // Add only if present
    if (selectedPlatforms.length > 0) payload.file_type = selectedPlatforms;
    if (startTime) payload.starttime = startTime;
    if (endTime) payload.endtime = endTime;
console.log("fetchdat",payload)
    dispatch(fetchSummaryData(payload)
);

    dispatch(saveCaseFilterPayload({
      caseId: caseId,
      file_type: selectedPlatforms,
      start_time: startTime,
      end_time: endTime
    }));

    setIsPopupVisible(false);
  };

  const isSearchDisabled = !(
    (formData.platform && formData.platform.length > 0) ||
    (selectedDates.startDate && selectedDates.endDate)
  );

  return (
    <>
      {isPopupVisible && (
        <div className="popup-overlay" style={{ justifyContent: 'center' }}>
          <div className="popup-container" style={{ width: '40%' }}>
            <div className="popup-content" style={{ marginTop: '4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "10px" }}>
                <h5 style={{ margin: 0, color: 'white' }}> Add Filter </h5>
                <span style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} onClick={() => setIsPopupVisible(false)}>&times;</span>
              </div>

              <form>
                <InputField
                  label="Case Id"
                  type="text"
                  value={caseId}
                  onChange={() => { }}
                  placeholder="Select case"
                  disabled={true}
                  customPaddingInput={styles.noPaddingcase}
                />

                <CommonMultiSelect
                  label="Platform"
                  isMulti
                  options={fileTypeOptions}
                  customStyles={customSelectStyles}
                  className="com"
                  value={formData.platform}
                  onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
                  placeholder="Select platforms"
                />

                <CommonDateInput
                  label="Date Range"
                  placeholder="Select date range"
                  value={formatDateRange()}
                  onClickIcon={toggleDatePickerPopup}
                />

                <div className="button-container" style={{ marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={performSearch}
                    className="add-btn"
                    disabled={isSearchDisabled}
                    style={{
                      backgroundColor: isSearchDisabled ? '#ddd' : '#000',
                      cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Apply
                  </button>

                  <button
                    type="button"
                    className="add-btn"
                    onClick={() => setIsPopupVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {showPopupD && (
            <DatePickera
              onSubmit={handleDateSelection}
              initialDates={selectedDates}
              onClose={toggleDatePickerPopup}
            />
          )}
        </div>
      )}
    </>
  );
};

export default AddFilter;

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import Cookies from 'js-cookie'
// import DatePickera from '../../FilterCriteria/datepicker';
// import '../../FilterCriteria/createCriteria.module.css';
// import { setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
// import CommonMultiSelect from '../../../Common/MultiSelect/CommonMultiSelect';
// import customSelectStyles from '../../../Common/CustomStyleSelect/customSelectStyles';
// import CommonDateInput from '../../../Common/DateField/DateField'
// import CommonTextInput from '../../../Common/MultiSelect/CommonTextInput';
// import { InputField } from '../../../Common/InpuField/inputField';
// import styles from "../../../Common/Table/table.module.css";
// import { fetchSummaryData } from '../../../../Redux/Action/filterAction';
// import { saveCaseFilterPayload } from '../../../../Redux/Action/caseAction';

// const AddFilter = ({ handleCreateCase, searchChips, isPopupVisible, setIsPopupVisible, }) => {

//     const Token = Cookies.get('accessToken');
//     const dispatch = useDispatch();
//     console.log("searaddnew", searchChips)
//     const [searchPayload, setSearchPayload] = useState(null);
//     const caseId = useSelector((state) => state.caseData.caseData.id);
//     console.log("caseeeee", caseId);
//     const  caseFilter  = useSelector((state) => state.caseFilter.caseFilters);
//      console.log("caseFilter", caseFilter);
//     // State for dynamic options
//     // const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');

//     const [showPopupD, setShowPopupD] = useState(false);

//     const [fileTypeOptions, setFileTypeOptions] = useState([]);

//     // State for form data
//     const [formData, setFormData] = useState({
//         searchQuery: '',
//         dataType: [],
//         fileType: [],
//         platform: [],
//         caseIds: [],
//         startDate: null,
//         endDate: null,
//         includeArchived: false,
//         latitude: '',
//         longitude: '',
//     });
//     console.log("formdatgertt...", formData)

//     // Fetch case data from API
//     useEffect(() => {

//         // Fetch file types from API
//         const fetchFileTypes = async () => {
//             try {
//                 const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${Token}`
//                     },
//                 });
//                 console.log("platforms", response.data)
//                 const fileTypeOptionsFormatted = response.data.data.map(platform => ({
//                     value: platform,
//                     label: platform
//                 }));

//                 setFileTypeOptions(fileTypeOptionsFormatted);
//             } catch (error) {
//                 console.error('Error fetching file types:', error);
//             }
//         };

//         // fetchCaseData();
//         fetchFileTypes();
//     }, [Token]);

//     // Date picker state and handlers
//     const [selectedDates, setSelectedDates] = useState({
//         startDate: null,
//         endDate: null,
//         startTime: { hours: 16, minutes: 30 },
//         endTime: { hours: 16, minutes: 30 }
//     });
//     console.log("selectedDates", selectedDates)

//     const toggleDatePickerPopup = () => {
//         setShowPopupD(!showPopupD);
//     };

//     const handleDateSelection = (dateData) => {
//         setSelectedDates(dateData);
//         setFormData(prev => ({
//             ...prev,
//             startDate: dateData.startDate,
//             endDate: dateData.endDate
//         }));
//         toggleDatePickerPopup();
//     };

//     const formatDateRange = () => {
//         if (selectedDates.startDate && selectedDates.endDate) {
//             return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
//         }
//         return 'Select date range';
//     };

//     const performSearch = () => {
//         const startTime =
//             selectedDates.startDate && selectedDates.startTime
//                 ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`
//                 : "";

//         const endTime =
//             selectedDates.endDate && selectedDates.endTime
//                 ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
//                 : "";

//         const fileTypes = Array.isArray(formData.platform)
//             ? formData.platform.map(type => type.value)
//             : [];

//         // Base payload with required fields
//         const payload = {
//             queryPayload: { unified_case_id: caseId }
//         };

//         // Only add fields if they have values
//         if (fileTypes.length > 0) {
//             payload.file_type = fileTypes;
//         }

//         if (startTime) {
//             payload.starttime = startTime;
//         }

//         if (endTime) {
//             payload.endtime = endTime;
//         }

//         setSearchPayload(payload);
//     };

//     // Perform search API call
//     useEffect(() => {
//         if (caseId && searchPayload) {
//             dispatch(fetchSummaryData({
//                 queryPayload: {
//                     unified_case_id: caseId,
//                 },
//                 fileType: searchPayload.file_type,
//                 starttime: searchPayload.starttime,
//                 endtime: searchPayload.endtime
//             }
//             ));
//              dispatch(saveCaseFilterPayload({
//       caseId:caseId,
//       file_type: searchPayload.file_type,
//       start_time: searchPayload.starttime,
//       end_time: searchPayload.endtime
//     }));
//              setIsPopupVisible(false);
//         }
//     }, [searchPayload, caseId, dispatch]);

//     const isSearchDisabled = !(
//         (formData.platform && formData.platform.length > 0) ||
//         (selectedDates.startDate && selectedDates.endDate)
//     );

//     return (
//         <>
//             {isPopupVisible && (
//                 <div className="popup-overlay" style={{ justifyContent: 'center' }}>
//                     <div className="popup-container" style={{ width: '40%' }}>
//                         <div className="popup-content" style={{ marginTop: '4rem' }}>
//                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "10px" }}>
//                                 <h5 style={{ margin: 0, color: 'white' }}> Add Filter </h5>
//                                 <span
//                                     style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
//                                     onClick={() => setIsPopupVisible(false)}
//                                 >
//                                     &times;
//                                 </span>
//                             </div>

//                             <form>

//                                 {/* Case Selection */}
//                                 <div >

//                                     <InputField
//                                         label="Case Id"
//                                         type="text"
//                                         value={caseId}
//                                         onChange={(e) => { }}
//                                         placeholder="Select case"
//                                         disabled={true}
//                                         customPaddingInput={styles.noPaddingcase}
//                                     />

//                                 </div>

//                                 {/* Platform Selection */}
//                                 <div >
//                                     {/* <label>Platform</label> */}
//                                     <CommonMultiSelect
//                                         label="Platform"
//                                         isMulti
//                                         options={fileTypeOptions}
//                                         customStyles={customSelectStyles}
//                                         className="com"
//                                         value={formData.platform}
//                                         onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
//                                         placeholder="Select platforms"
//                                     />
//                                 </div>

//                                 {/* Date Range */}
//                                 <div >
//                                     {/* <label>Date Range</label> */}
//                                     <CommonDateInput
//                                         label="Date Range"
//                                         placeholder="Select date range"
//                                         value={formatDateRange()}
//                                         onClickIcon={toggleDatePickerPopup}

//                                     />
//                                 </div>


//                                 {/* Buttons */}
//                                 <div className="button-container" style={{ marginTop: '10px' }}>
//                                     <button type="button" onClick={performSearch} className="add-btn" disabled={isSearchDisabled}
//                                         style={{
//                                             backgroundColor: isSearchDisabled ? '#fffff' : '#00000',
//                                             cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
//                                         }}>Apply</button>

//                                     <button
//                                         type="button"
//                                         className="add-btn"
//                                         onClick={() => setIsPopupVisible(false)}
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Date Picker Popup */}
//                     {showPopupD && (
//                         <DatePickera
//                             onSubmit={handleDateSelection}
//                             initialDates={selectedDates}
//                             onClose={toggleDatePickerPopup}
//                         />
//                     )}

//                 </div>
//             )}
//         </>
//     );
// };

// export default AddFilter;                        