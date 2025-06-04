import { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DatePickera from './datepicker';
import '../FilterCriteria/createCriteria.css';
import { customStyles } from '../Case/createCase';
import { setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import Confirm from './confirmCriteria';

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
                    label: `${caseItem.id} - ${caseItem.title || 'Untitled'}`
                }));

                setCaseOptions(caseOptionsFormatted);
            } catch (error) {
                console.error('Error fetching case data:', error);
            }
        };

        // Fetch file types from API
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

        fetchCaseData();
        fetchFileTypes();
    }, [Token]);

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
        return 'Select Date Range';
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
                case_id: [
                    ...(Array.isArray(payload.case_id) ? payload.case_id : JSON.parse(payload.case_id || "[]")),
                    ...(Array.isArray(formData.caseIds) ? formData.caseIds.map(caseId => String(caseId.value)) : [])
                ],

                file_type: [
                    ...(Array.isArray(payload.file_type) ? payload.file_type : JSON.parse(payload.file_type || "[]")),
                    ...(Array.isArray(formData.platform) ? formData.platform.map(type => type.value) : [])
                ],
                page: payload.page || 1
            };

            // Combine start time from both sources
            if (payload.start_time || (selectedDates.startDate && selectedDates.startTime)) {
                payload.start_time = payload.start_time || `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
            }

            // Combine end time from both sources
            if (payload.end_time || (selectedDates.endDate && selectedDates.endTime)) {
                payload.end_time = payload.end_time || `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
            }

            console.log("Query Payload:", payloadS);

            // Make the API request with the correct payload structure
            const response = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
                payloadS,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`,
                    }
                }
            );
            console.log("response of addnew", response)
            // Dispatch search results
            dispatch(setSearchResults({
                results: response.data.results,
                total_pages: response.data.total_pages || 1,
                total_results: response.data.total_results || 0,
            }));

            dispatch(setKeywords({
                keyword: searchChips,
                queryPayload: response.data.input  // or other fields if needed
            }));
            // Dispatch the initial page number
            dispatch(setPage(1));
            console.log("Dispatched setSearchResults with:", response.data.results);


            console.log('Search results:', response.data);
            setIsPopupVisible(false);
            // Reset form data to initial values
            setFormData({
                searchQuery: '',
                datatype: [],
                filetype: [],
                caseIds: [],
                includeArchived: false,
                latitude: '',
                longitude: '',
            });

            // Handle the search results, if applicable
            if (handleCreateCase) {
                handleCreateCase(response.data);
            }

            // Show the "saved" popup
            // dispatch(openPopup("saved"));
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };
    const handleSaveCriteriaChange = () => {
        setShowSavePopup(true); // Open the popup  
    };
    const isSearchDisabled =
        (!formData.caseIds || formData.caseIds.length === 0) &&
        (!formData.platform || formData.platform.length === 0) &&
        (!selectedDates.startDate || !selectedDates.endDate);

    return (
        <>
            {isPopupVisible && (
                <div className="popup-overlay" style={{ justifyContent: 'center' }}>
                    <div className="popup-container" style={{ width: '40%' }}>
                        <div className="popup-content" style={{ marginTop: '4rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h5 style={{ margin: 0 }}>Filter Criteria</h5>
                                <span
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                    onClick={() => setIsPopupVisible(false)}
                                >
                                    &times;
                                </span>
                            </div>



                            <form>

                                {/* Case Selection */}
                                <div className="mb-3">
                                    <label>Case</label>
                                    <Select
                                        isMulti
                                        options={caseOptions}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.caseIds}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, caseIds: selected }))}
                                        placeholder="Select cases"
                                    />
                                </div>

                                {/* Platform Selection */}
                                <div className="mb-3">
                                    <label>Platform</label>
                                    <Select
                                        isMulti
                                        options={fileTypeOptions}
                                        styles={customStyles}
                                        className="com"
                                        value={formData.platform}
                                        onChange={(selected) => setFormData(prev => ({ ...prev, platform: selected }))}
                                        placeholder="Select platforms"
                                    />
                                </div>

                                {/* Date Range */}
                                <div className="mb-3">
                                    <label>Date Range</label>
                                    <TextField
                                        fullWidth
                                        className="com mb-3"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <CalendarTodayIcon
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={toggleDatePickerPopup}
                                                    />
                                                </InputAdornment>
                                            ),
                                            style: { height: '38px', padding: '0 8px' },
                                        }}
                                        placeholder="Select date range"
                                        value={formatDateRange()}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': { border: 'none' },
                                                '&:hover fieldset': { border: 'none' },
                                                '&.Mui-focused fieldset': { border: 'none' },
                                            }
                                        }}
                                    />
                                </div>


                                {/* Buttons */}
                                <div className="button-container">
                                    <button type="button" onClick={performSearch} className="add-btn" disabled={isSearchDisabled}
                                        style={{
                                            backgroundColor: isSearchDisabled ? '#fffff' : '#00000',
                                            cursor: isSearchDisabled ? 'not-allowed' : 'pointer'
                                        }}>Search</button>
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