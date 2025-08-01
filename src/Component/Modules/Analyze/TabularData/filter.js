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
  const [targetsOptions, setTargetsOptions] = useState([]);
  const [sentimentOptions, setSentimentOptions] = useState([]);
  const [showPopupD, setShowPopupD] = useState(false);
  const [searchPayload, setSearchPayload] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    searchQuery: '',
    dataType: [],
    fileType: [],
    platform: [],
    targets: [],
    sentiment: [],
    caseIds: [],
    startDate: null,
    endDate: null,
    includeArchived: false,
    latitude: '',
    longitude: '',
  });

  const existingFileTypes = caseFilter?.file_type || [];
  const existingTargets = caseFilter?.target || [];
  const existingSentiments = caseFilter?.sentiment || [];
  const existingStartTime = caseFilter?.start_time;
  const existingEndTime = caseFilter?.end_time;
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
  // useEffect(() => {
  //   const fetchFileTypes = async () => {
  //     try {
  //       const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${Token}`
  //         },
  //       });
  //       console.log("platforms", response.data)
  //       const fileTypeOptionsFormatted = response.data.data.map(platform => ({
  //         value: platform,
  //         label: platform
  //       }));

  //       setFileTypeOptions(fileTypeOptionsFormatted);
  //     } catch (error) {
  //       console.error('Error fetching file types:', error);
  //     }
  //   };

  //   fetchFileTypes();
  // }, [Token]);

  // Fetch targets and sentiment from API
  useEffect(() => {
    const fetchTargetsAndSentiment = async () => {
      try {
        const response = await axios.post('http://5.180.148.40:8005/api/das/distinct', {
          fields: ["targets", "sentiment","unified_record_type"]
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        });
        
        console.log("targets and sentiment response", response.data);
        
        // Format targets options from buckets
        if (response.data.targets && response.data.targets.buckets) {
          const targetsFormatted = response.data.targets.buckets.map(bucket => ({
            value: bucket.key,
            label: bucket.key
          }));
          setTargetsOptions(targetsFormatted);
        }
        
        // Format sentiment options from buckets
        if (response.data.sentiment && response.data.sentiment.buckets) {
          const sentimentFormatted = response.data.sentiment.buckets.map(bucket => ({
            value: bucket.key,
            label: bucket.key
          }));
          setSentimentOptions(sentimentFormatted);
        }
           if (response.data.unified_record_type && response.data.unified_record_type.buckets) {
           const fileTypeOptionsFormatted = response.data.unified_record_type.buckets.map(bucket => ({
          value: bucket.key,
          label: bucket.key
        }));
        setFileTypeOptions(fileTypeOptionsFormatted);
      }
        
      } catch (error) {
        console.error('Error fetching targets and sentiment:', error);
      }
    };

    if (Token) {
      fetchTargetsAndSentiment();
    }
  }, [Token]);
useEffect(() => {
  if (fileTypeOptions.length > 0 && existingFileTypes.length > 0) {
    const selectedPlatforms = fileTypeOptions.filter(option => 
      existingFileTypes.includes(option.value)
    );
    setFormData(prev => ({ ...prev, platform: selectedPlatforms }));
  }
}, [fileTypeOptions, existingFileTypes]);

useEffect(() => {
  if (targetsOptions.length > 0 && existingTargets.length > 0) {
    const selectedTargetsFormatted = targetsOptions.filter(option => 
      existingTargets.includes(option.value)
    );
    setFormData(prev => ({ ...prev, targets: selectedTargetsFormatted }));
  }
}, [targetsOptions, existingTargets]);

useEffect(() => {
  if (sentimentOptions.length > 0 && existingSentiments.length > 0) {
    const selectedSentimentsFormatted = sentimentOptions.filter(option => 
      existingSentiments.includes(option.value)
    );
    setFormData(prev => ({ ...prev, sentiment: selectedSentimentsFormatted }));
  }
}, [sentimentOptions, existingSentiments]);

useEffect(() => {
  if (existingStartTime && existingEndTime) {
    const startDate = new Date(existingStartTime);
    const endDate = new Date(existingEndTime);
    
    setSelectedDates({
      startDate: startDate,
      endDate: endDate,
      startTime: { 
        hours: startDate.getHours(), 
        minutes: startDate.getMinutes() 
      },
      endTime: { 
        hours: endDate.getHours(), 
        minutes: endDate.getMinutes() 
      }
    });
    
    setFormData(prev => ({
      ...prev,
      startDate: startDate,
      endDate: endDate,
    }));
  }
}, [existingStartTime, existingEndTime]);
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

    const selectedTargets = Array.isArray(formData.targets)
      ? formData.targets.map(t => t.value)
      : [];

    const selectedSentiments = Array.isArray(formData.sentiment)
      ? formData.sentiment.map(s => s.value)
      : [];

    const payload = {
   queryPayload : {
  unified_case_id: String(caseId)
}
    };

    // Add only if present
    if (selectedPlatforms.length > 0) payload.file_type = selectedPlatforms;
    if (selectedTargets.length > 0) payload.target = selectedTargets;
    if (selectedSentiments.length > 0) payload.sentiment = selectedSentiments;
    if (startTime) payload.starttime = startTime;
    if (endTime) payload.endtime = endTime;
    if (searchChips?.length > 0) {
      payload.keyword = searchChips;
    }
    if (caseFilter?.aggs_fields && caseFilter.aggs_fields.length > 0)
      payload.aggsFields = caseFilter.aggs_fields;
    
    console.log("fetchdat", payload)
    
    dispatch(fetchSummaryData(payload));

    // Save to Redux with new fields
    dispatch(saveCaseFilterPayload({
      keyword: caseFilter?.keyword,
      aggs_fields: caseFilter?.aggs_fields,
      caseId: caseId,
      file_type: selectedPlatforms,
      target: selectedTargets,
      sentiment: selectedSentiments,
      start_time: startTime,
      end_time: endTime
    }));

    setIsPopupVisible(false);
  };

  // Check if search is disabled
  const isSearchDisabled = !(
    (formData.platform && formData.platform.length > 0) ||
    (formData.targets && formData.targets.length > 0) ||
    (formData.sentiment && formData.sentiment.length > 0) ||
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

            {/* Targets Selection */}
            <div>
              <CommonMultiSelect
                label="Targets"
                isMulti
                options={targetsOptions}
                customStyles={customSelectStyles}
                className="com"
                value={formData.targets}
                onChange={(selected) => setFormData(prev => ({ ...prev, targets: selected }))}
                placeholder="Select targets"
              />
            </div>

            {/* Sentiment Selection */}
            <div>
              <CommonMultiSelect
                label="Sentiment"
                isMulti
                options={sentimentOptions}
                customStyles={customSelectStyles}
                className="com"
                value={formData.sentiment}
                onChange={(selected) => setFormData(prev => ({ ...prev, sentiment: selected }))}
                placeholder="Select sentiment"
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
