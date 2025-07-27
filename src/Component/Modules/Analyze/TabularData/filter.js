// //                         
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import Cookies from 'js-cookie';

// import DatePickera from '../../FilterCriteria/datepicker';
// import '../../FilterCriteria/createCriteria.module.css';
// import { fetchSummaryData } from '../../../../Redux/Action/filterAction';
// import CommonMultiSelect from '../../../Common/MultiSelect/CommonMultiSelect';
// import customSelectStyles from '../../../Common/CustomStyleSelect/customSelectStyles';
// import CommonDateInput from '../../../Common/DateField/DateField';
// import { InputField } from '../../../Common/InpuField/inputField';
// import styles from "../../../Common/Table/table.module.css";

// const AddFilter = ({ isPopupVisible, setIsPopupVisible }) => {
//     const Token = Cookies.get('accessToken');
//     const dispatch = useDispatch();
//     const caseId = useSelector((state) => state.caseData.caseData.id);

//     const [fileTypeOptions, setFileTypeOptions] = useState([]);
//     const [showPopupD, setShowPopupD] = useState(false);
//     const [searchPayload, setSearchPayload] = useState(null);

//     const [formData, setFormData] = useState({
//         platform: [],
//         startDate: null,
//         endDate: null,
//     });

//     const [selectedDates, setSelectedDates] = useState({
//         startDate: null,
//         endDate: null,
//         startTime: { hours: 0, minutes: 0 },
//         endTime: { hours: 23, minutes: 59 }
//     });

//     // Fetch platforms
//     useEffect(() => {
//         const fetchFileTypes = async () => {
//             try {
//                 const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${Token}`
//                     },
//                 });
//                 const options = response.data.data.map(platform => ({
//                     value: platform,
//                     label: platform
//                 }));
//                 setFileTypeOptions(options);
//             } catch (error) {
//                 console.error('Error fetching platforms:', error);
//             }
//         };
//         fetchFileTypes();
//     }, [Token]);

//     const toggleDatePickerPopup = () => setShowPopupD(!showPopupD);

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
//         const platformValues = formData.platform.map(type => type.value);

//         const payload = {
//             unified_case_id: caseId,
//             file_type: platformValues,
//             start_time: `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`,
//             end_time: `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
//         };

//         setSearchPayload(payload); // This will trigger useEffect
//     };

//     // Trigger Redux search call when payload updates
//     useEffect(() => {
//         if (caseId && searchPayload) {
//             dispatch(fetchSummaryData({
//                 queryPayload: {
//                     unified_case_id: searchPayload.unified_case_id,
//                     file_type: searchPayload.file_type,
//                     start_time: searchPayload.start_time,
//                     end_time: searchPayload.end_time
//                 },
//                 page: 1
//             }));
//             setIsPopupVisible(false);
//         }
//     }, [searchPayload, caseId]);

//     const isSearchDisabled =
//         formData.platform.length === 0 ||
//         !selectedDates.startDate || !selectedDates.endDate;

//     return isPopupVisible ? (
//         <div className="popup-overlay" style={{ justifyContent: 'center' }}>
//             <div className="popup-container" style={{ width: '40%' }}>
//                 <div className="popup-content" style={{ marginTop: '4rem' }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "10px" }}>
//                         <h5 style={{ margin: 0, color: 'white' }}> Add Filter </h5>
//                         <span style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }} onClick={() => setIsPopupVisible(false)}>
//                             &times;
//                         </span>
//                     </div>

//                     <form>
//                         <div>
//                             <InputField
//                                 label="Case Id"
//                                 type="text"
//                                 value={caseId}
//                                 onChange={() => { }}
//                                 placeholder="Select case"
//                                 disabled
//                                 customPaddingInput={styles.noPaddingcase}
//                             />
//                         </div>

//                         <div>
//                             <CommonMultiSelect
//                                 label="Platform"
//                                 isMulti
//                                 options={fileTypeOptions}
//                                 customStyles={customSelectStyles}
//                                 className="com"
//                                 value={formData.platform}
//                                 onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
//                                 placeholder="Select platforms"
//                             />
//                         </div>

//                         <div>
//                             <CommonDateInput
//                                 label="Date Range"
//                                 placeholder="Select date range"
//                                 value={formatDateRange()}
//                                 onClickIcon={toggleDatePickerPopup}
//                             />
//                         </div>

//                         <div className="button-container" style={{ marginTop: '10px' }}>
//                             <button
//                                 type="button"
//                                 onClick={performSearch}
//                                 className="add-btn"
//                                 disabled={isSearchDisabled}
//                                 style={{
//                                     backgroundColor: isSearchDisabled ? '#ccc' : '#000',
//                                     color: isSearchDisabled ? '#666' : '#fff',
//                                     cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
//                                 }}
//                             >
//                                 Apply
//                             </button>

//                             <button type="button" className="add-btn" onClick={() => setIsPopupVisible(false)}>
//                                 Cancel
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>

//             {showPopupD && (
//                 <DatePickera
//                     onSubmit={handleDateSelection}
//                     initialDates={selectedDates}
//                     onClose={toggleDatePickerPopup}
//                 />
//             )}
//         </div>
//     ) : null;
// };

// export default AddFilter;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie'
import DatePickera from '../../FilterCriteria/datepicker';
import '../../FilterCriteria/createCriteria.module.css';
import { setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import CommonMultiSelect from '../../../Common/MultiSelect/CommonMultiSelect';
import customSelectStyles from '../../../Common/CustomStyleSelect/customSelectStyles';
import CommonDateInput from '../../../Common/DateField/DateField'
import CommonTextInput from '../../../Common/MultiSelect/CommonTextInput';
import { InputField } from '../../../Common/InpuField/inputField';
import styles from "../../../Common/Table/table.module.css";
import { fetchSummaryData } from '../../../../Redux/Action/filterAction';
import { saveCaseFilterPayload } from '../../../../Redux/Action/caseAction';

const AddFilter = ({ searchChips, isPopupVisible, setIsPopupVisible }) => {
  console.log("searhleywords", searchChips)
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const caseId = useSelector((state) => state.caseData.caseData.id);
  const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
  
  const [fileTypeOptions, setFileTypeOptions] = useState([]);
  const [showPopupD, setShowPopupD] = useState(false);
  const [searchPayload, setSearchPayload] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    searchQuery: '',
    dataType: [],
    fileType: [],
    platform: [],
    caseIds: [],
    startDate: null,
    endDate: null,
    includeArchived: false,
    latitude: '',
    longitude: '',
  });

  // Date picker state
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });

  console.log("formdata...", formData)
  console.log("selectedDates", selectedDates)

  // Fetch platforms
  useEffect(() => {
    const fetchFileTypes = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });
        console.log("platforms", response.data)
        const fileTypeOptionsFormatted = response.data.data.map(platform => ({
          value: platform,
          label: platform
        }));

        setFileTypeOptions(fileTypeOptionsFormatted);
      } catch (error) {
        console.error('Error fetching file types:', error);
      }
    };

    fetchFileTypes();
  }, [Token]);

  // Perform search API call
  useEffect(() => {
    if (caseId && searchPayload) {
      dispatch(fetchSummaryData({
        queryPayload: {
          unified_case_id: caseId,
        },
        fileType: searchPayload.file_type,
        starttime: searchPayload.starttime,
        endtime: searchPayload.endtime
      }));
      setIsPopupVisible(false);
    }
  }, [searchPayload, caseId, dispatch, setIsPopupVisible]);

  // Toggle date picker popup
  const toggleDatePickerPopup = () => setShowPopupD(!showPopupD);

  // Handle date selection
  const handleDateSelection = (dateData) => {
    setSelectedDates(dateData);
    setFormData(prev => ({
      ...prev,
      startDate: dateData.startDate,
      endDate: dateData.endDate,
    }));
    toggleDatePickerPopup();
  };

  // Format date range for display
  const formatDateRange = () => {
    if (selectedDates.startDate && selectedDates.endDate) {
      return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
    }
    return 'Select date range';
  };

  // Final Payload on Search
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
    if (searchChips?.length > 0) {
      payload.keyword = searchChips;
    }
    if (caseFilter?.aggs_fields && caseFilter.aggs_fields.length > 0)
      payload.aggsFields = caseFilter.aggs_fields;
    
    console.log("fetchdat", payload)
    
    dispatch(fetchSummaryData(payload));

    dispatch(saveCaseFilterPayload({
      keyword: caseFilter?.keyword,
      aggs_fields: caseFilter?.aggs_fields,
      caseId: caseId,
      file_type: selectedPlatforms,
      start_time: startTime,
      end_time: endTime
    }));

    setIsPopupVisible(false);
  };

  // Check if search is disabled
  const isSearchDisabled = !(
    (formData.platform && formData.platform.length > 0) ||
    (selectedDates.startDate && selectedDates.endDate)
  );

  // Return null if popup is not visible
  if (!isPopupVisible) {
    return null;
  }

  return (
    <div className="popup-overlay" style={{ justifyContent: 'center' }}>
      <div className="popup-container" style={{ width: '40%' }}>
        <div className="popup-content" style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "10px" }}>
            <h5 style={{ margin: 0, color: 'white' }}> Add Filter </h5>
            <span
              style={{ cursor: 'pointer', fontSize: '20px', color: 'white' }}
              onClick={() => setIsPopupVisible(false)}
            >
              &times;
            </span>
          </div>

          <form>
            {/* Case Selection */}
            <div>
              <InputField
                label="Case Id"
                type="text"
                value={caseId}
                onChange={(e) => { }}
                placeholder="Select case"
                disabled={true}
                customPaddingInput={styles.noPaddingcase}
              />
            </div>

            {/* Platform Selection */}
            <div>
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
            </div>

            {/* Date Range */}
            <div>
              <CommonDateInput
                label="Date Range"
                placeholder="Select date range"
                value={formatDateRange()}
                onClickIcon={toggleDatePickerPopup}
              />
            </div>

            {/* Buttons */}
            <div className="button-container" style={{ marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={performSearch} 
                className="add-btn" 
                disabled={isSearchDisabled}
                style={{
                  backgroundColor: isSearchDisabled ? '#ccc' : '#0073CF',
                  color: isSearchDisabled ? '#666' : '#fff',
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

      {/* Date Picker Popup */}
      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={toggleDatePickerPopup}
        />
      )}
    </div>
  );
};

export default AddFilter;
