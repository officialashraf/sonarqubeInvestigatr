import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePickera from './datepicker';
import '../FilterCriteria/createCriteria.module.css';
import { customStyles } from '../Case/createCase';
import { setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import Confirm from './confirmCriteria';
import CommonMultiSelect from '../../Common/MultiSelect/CommonMultiSelect';
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';
import CommonDateInput from '../../Common/DateField/DateField'

const AddNewCriteria = ({ handleCreateCase, searchChips, isPopupVisible, setIsPopupVisible, }) => {

    const Token = Cookies.get('accessToken');
    const dispatch = useDispatch();
    console.log("searaddnew", searchChips)

    // State for dynamic options
    const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');

    const [showPopupD, setShowPopupD] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [caseOptions, setCaseOptions] = useState([]);
    const [fileTypeOptions, setFileTypeOptions] = useState([]);
    const [targetsOptions, setTargetsOptions] = useState([]);
    const [sentimentOptions, setSentimentOptions] = useState([]);

    // State for form data
    const [formData, setFormData] = useState({
        searchQuery: '',
        dataType: [],
        fileType: [],
        platform: [],
        caseIds: [],
        sentiments: [],
        targets: [],
        startDate: null,
        endDate: null,
        includeArchived: false,
        latitude: '',
        longitude: '',
    });

    // Function to convert payload values to dropdown format
    const convertPayloadToDropdownFormat = () => {
        if (!payload) return;

        // Convert case_id to dropdown format
        const existingCaseIds = Array.isArray(payload.case_id)
            ? payload.case_id
            : JSON.parse(payload.case_id || "[]");

        const caseIdsFormatted = existingCaseIds.map(caseId => {
            const caseOption = caseOptions.find(option => String(option.value) === String(caseId));
            return caseOption || { value: caseId, label: `CASE${String(caseId).padStart(4, "0")}` };
        });

        // Convert file_type to dropdown format
        const existingPlatforms = Array.isArray(payload.file_type)
            ? payload.file_type
            : JSON.parse(payload.file_type || "[]");

        const platformsFormatted = existingPlatforms.map(platform => {
            const platformOption = fileTypeOptions.find(option => option.value === platform);
            return platformOption || { value: platform, label: platform };
        });

        // Convert targets to dropdown format
        const existingTargets = Array.isArray(payload.targets)
            ? payload.targets
            : JSON.parse(payload.targets || "[]");

        const targetsFormatted = existingTargets.map(target => {
            const targetOption = targetsOptions.find(option => option.value === target);
            return targetOption || { value: target, label: target };
        });

        // Convert sentiment to dropdown format
        const existingSentiments = Array.isArray(payload.sentiments)
            ? payload.sentiments
            : JSON.parse(payload.sentiments || "[]");

        const sentimentsFormatted = existingSentiments.map(sentiment => {
            const sentimentOption = sentimentOptions.find(option => option.value === sentiment);
            return sentimentOption || { value: sentiment, label: sentiment };
        });

        // Update form data with existing values
        setFormData(prev => ({
            ...prev,
            caseIds: caseIdsFormatted,
            platform: platformsFormatted,
            targets: targetsFormatted,
            sentiments: sentimentsFormatted
        }));
    };
    console.log("formdatgertt...", formData)

    // Fetch case data from API
    useEffect(() => {
        const fetchCaseData = async () => {
            try {
                const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    },
                });

                const caseOptionsFormatted = response.data.data.map(caseItem => ({
                    value: caseItem.id,
                    label: `${`CASE${String(caseItem.id).padStart(4, "0")}`} - ${caseItem.title || 'Untitled'}`
                }));

                setCaseOptions(caseOptionsFormatted);
            } catch (error) {
                console.error('Error fetching case data:', error);
            }
        };

        // Fetch file types from API
        // const fetchFileTypes = async () => {
        //     try {
        //         const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${Token}`
        //             },
        //         });
        //         console.log("platforms", response.data)
        //         const fileTypeOptionsFormatted = response.data.data.map(platform => ({
        //             value: platform,
        //             label: platform
        //         }));

        //         setFileTypeOptions(fileTypeOptionsFormatted);
        //     } catch (error) {
        //         console.error('Error fetching file types:', error);
        //     }
        // };

        // Fetch targets and sentiment data
        const fetchTargetsAndSentiment = async () => {
            try {
                const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`, {

                    fields: ["targets", "sentiment", "unified_record_type"]

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
            fetchCaseData();
            // fetchFileTypes();
            fetchTargetsAndSentiment();
        }
    }, [Token]);

    // Effect to populate form data when payload or options change
    useEffect(() => {
        if (payload && caseOptions.length > 0 && fileTypeOptions.length > 0 &&
            targetsOptions.length > 0 && sentimentOptions.length > 0) {
            convertPayloadToDropdownFormat();
        }
    }, [payload, caseOptions, fileTypeOptions, targetsOptions, sentimentOptions]);

    // Effect to populate dates from payload
    useEffect(() => {
        if (payload && payload.start_time && payload.end_time) {
            const startDate = new Date(payload.start_time);
            const endDate = new Date(payload.end_time);

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
        }
    }, [payload]);

    // Date picker state and handlers
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
        startTime: { hours: 16, minutes: 30 },
        endTime: { hours: 16, minutes: 30 }
    });
    console.log("selectedDates", selectedDates)

    const toggleDatePickerPopup = () => {
        setShowPopupD(!showPopupD);
    };

    const handleDateSelection = (dateData) => {
        setSelectedDates(dateData);
        setFormData(prev => ({
            ...prev,
            startDate: dateData.startDate,
            endDate: dateData.endDate
        }));
        toggleDatePickerPopup();
    };

    const formatDateRange = () => {
        if (selectedDates.startDate && selectedDates.endDate) {
            return `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`;
        }
        return 'Select date range';
    };

    // Perform search API call
    console.log("payload---", payload)

    const performSearch = async (e) => {
        e.preventDefault();

        console.log(e);
        try {
            // Build the query payload with the correct structure
            const payloadS = {
                keyword: Array.isArray(payload.keyword) ? payload.keyword : JSON.parse(payload.keyword || "[]"),
                case_id: Array.isArray(formData.caseIds) ? formData.caseIds.map(caseId => String(caseId.value)) : [],
                file_type: Array.isArray(formData.platform) ? formData.platform.map(type => type.value) : [],
                targets: Array.isArray(formData.targets) ? formData.targets.map(target => target.value) : [],
                sentiments: Array.isArray(formData.sentiments) ? formData.sentiments.map(sentiment => sentiment.value) : [],
                page: payload.page || 1,
                latitude: payload.latitude || null,
                longitude: payload.longitude || null
            };

            // Handle start_time - combine existing payload and new selection
            if (payload.start_time || (selectedDates.startDate && selectedDates.startTime)) {
                payloadS.start_time = payload.start_time ||
                    `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
            } else {
                payloadS.start_time = null;
            }

            // Handle end_time - combine existing payload and new selection
            if (payload.end_time || (selectedDates.endDate && selectedDates.endTime)) {
                payloadS.end_time = payload.end_time ||
                    `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
            } else {
                payloadS.end_time = null;
            }

            console.log("Query Payload being sent to API:", payloadS);
            const isValid = (v) =>
                Array.isArray(v) ? v.length > 0 :
                    typeof v === 'string' ? v.trim() !== '' :
                        v !== null && v !== undefined;

            const filteredPayload = {};
            Object.entries(payloadS).forEach(([key, value]) => {
                if (isValid(value)) {
                    filteredPayload[key] = value;
                }
            });

            const paginatedQuery = {
                ...filteredPayload,
            };
            console.log("pagintedQuery",paginatedQuery)
            // Make the API request with the correct payload structure
            const response = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
                paginatedQuery,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    }
                }
            );

            console.log("API Response:", response);

            // Dispatch search results
            dispatch(setSearchResults({
                results: response.data.results,
                total_pages: response.data.total_pages || 1,
                total_results: response.data.total_results || 0,
            }));

            dispatch(setKeywords({
                keyword: searchChips,
                queryPayload: response.data.input
            }));

            // Dispatch the initial page number
            dispatch(setPage(1));
            console.log("Dispatched setSearchResults with:", response.data.results);

            console.log('Search results:', response.data);
            setIsPopupVisible(false);

            // Reset form data to initial values
            setFormData({
                searchQuery: '',
                dataType: [],
                fileType: [],
                platform: [],
                caseIds: [],
                sentiments: [],
                targets: [],
                includeArchived: false,
                latitude: '',
                longitude: '',
            });

            // Reset selected dates
            setSelectedDates({
                startDate: null,
                endDate: null,
                startTime: { hours: 16, minutes: 30 },
                endTime: { hours: 16, minutes: 30 }
            });

            // Handle the search results, if applicable
            if (handleCreateCase) {
                handleCreateCase(response.data);
            }

        } catch (error) {
            console.error('Error performing search:', error);
            console.log('Error details:', error.response?.data);
        }
    };

    const handleSaveCriteriaChange = () => {
        setShowSavePopup(true);
    };

    const isSearchDisabled =
        (!formData.caseIds || formData.caseIds.length === 0) &&
        (!formData.platform || formData.platform.length === 0) &&
        (!formData.targets || formData.targets.length === 0) &&
        (!formData.sentiments || formData.sentiments.length === 0) &&
        (!selectedDates.startDate || !selectedDates.endDate);

    return (
        <>
            {isPopupVisible && (
                <div className="popup-overlay" style={{ justifyContent: 'center' }}>
                    <div className="popup-container" style={{ width: '40%' }}>
                        <div className="popup-content" style={{ marginTop: '4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h5 style={{ margin: 0, color: 'white' }}>Filter Criteria</h5>
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
                                    <CommonMultiSelect
                                        label="Cases"
                                        isMulti
                                        options={caseOptions}
                                        customStyles={customSelectStyles}
                                        className="com"
                                        value={formData.caseIds}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
                                        placeholder="Select cases"
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

                                {/* Target Selection */}
                                <div>
                                    <CommonMultiSelect
                                        label="Target"
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
                                        value={formData.sentiments}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, sentiments: selected }))}
                                        placeholder="Select sentiments"
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
                                            backgroundColor: isSearchDisabled ? '#fffff' : '#00000',
                                            cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Search
                                    </button>
                                    <button
                                        type="button"
                                        className="add-btn"
                                        onClick={handleSaveCriteriaChange}
                                    >
                                        Create
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
                    {
                        showSavePopup && (
                            <Confirm formData={formData} selectedDates={selectedDates} searchChips={searchChips} />
                        )
                    }
                </div>
            )}
        </>
    );
};

export default AddNewCriteria;
