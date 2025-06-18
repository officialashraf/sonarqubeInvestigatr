import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../User/addUser.css'
import { CloseButton } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { closePopup } from '../../../Redux/Action/criteriaAction';

const Confirm = ({ formData, selectedDates, searchChips }) => {
    const dispatch = useDispatch();
    const Token = Cookies.get('accessToken');

    const [isVisible, setIsVisible] = useState(true);
    const [searchTitle, setSearchTitle] = useState('');
    console.log("formData", searchChips);
    console.log("selectedDates", selectedDates);

    const saveCriteria = async () => {
        let keywordSource = formData.searchQuery || searchChips;
        console.log("keys", keywordSource)
        try {

            if (searchTitle.trim() === "") {
                toast.info("Please enter the title");
                return;
            }
            const criteriaPaylod = {
                title: searchTitle || "",

                keyword: Array.isArray(keywordSource)
                    ? keywordSource
                    : keywordSource
                        ? [keywordSource]
                        : [],


                case_id: formData.caseIds?.length > 0
                    ? formData.caseIds.map((caseId) => caseId.value.toString())
                    : [], // Handle multiple `caseIds` and return array


                file_type: [
                    ...(formData.filetype?.length > 0 ? formData.filetype.map((file) => file.value) : []),
                    ...(formData.platform?.length > 0 ? formData.platform.map((platform) => platform.value) : [])
                ],

                latitude: formData.latitude || "",
                longitude: formData.longitude || "",
                start_time: selectedDates.startDate
                    ? `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`
                    : "" || null,
                end_time: selectedDates.endDate
                    ? `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`
                    : "" || null,
            };

            console.log("Criteria Payload:", criteriaPaylod); // Debug: Payload for API

            const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/criteria`, criteriaPaylod, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Token}`
                },
            });

            toast.success("Criteria saved successfully");

            console.log('Criteria saved successfully:', response.data); // Debug: API response
            setIsVisible(false)
        } catch (error) {
            toast.error(error.response.data.detail || "Error saving criteria");
            console.error('Error saving criteria:', error); // Debug: Error log
        }
    };

    return isVisible && (
        <div className="popup-overlay" style={{
            top: 0, left: 0, width: "100%", height: "100%", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1050
        }}>
            <div className="popup-container" style={{ display: 'flex', alignItems: 'center' }}>


                <div className="popup-content" style={{ width: '70%' }}>

                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                        <h5>Save Criteria</h5>
                        <CloseButton onClick={() => dispatch(closePopup())} />
                    </span>
                    <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission default */}

                        <label>Search Title *</label>

                        <input
                            type="text"
                            placeholder="Enter title"
                            className="com"
                            value={searchTitle} // Bind input value to state
                            onChange={(e) => setSearchTitle(e.target.value)} // Update state on input
                            onBlur={() => {
                                setSearchTitle((prev) => {
                                    if (!prev) return prev; // handle empty string or null
                                    // Capitalize first letter of the whole string only (sentence case)
                                    const formattedValue = prev.charAt(0).toUpperCase() + prev.slice(1);
                                    return formattedValue;
                                });
                            }}
                        />
                        <div className="button-container">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setIsVisible(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={saveCriteria}

                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Confirm;


