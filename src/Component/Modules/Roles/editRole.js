import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../User/addUser.css'
import { CloseButton } from 'react-bootstrap';

const EditRole = ({ togglePopup, details }) => {
    const Token = Cookies.get('accessToken');
    console.log("editdetials", details)
    const [searchTitle, setSearchTitle] = useState('');

    const [initialSearchTitle, setInitialSearchTitle] = useState('');
    const [isBtnDisabled, setIsBtnDisabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const editRole = async () => {
        setIsSubmitting(true); // Set submitting state to true
        try {
            if (!searchTitle || searchTitle.trim() === "") {
                toast.info("Please enter the role");
                return; // Exit the function without making API call
            }
            const criteriaPaylod = {
                new_role: searchTitle || "",
                old_role: details
            };

            console.log("role Payload:", searchTitle); // Debug: Payload for API

            const response = await axios.put(
                `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/role`,
                criteriaPaylod, // empty body
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );

            toast.success("Role updated successfully");
            window.dispatchEvent(new Event("databaseUpdated"));
            console.log('Role Updated successfully:', response.data); // Debug: API response
            togglePopup(false)
        } catch (error) {
            toast.error(error.response?.data?.detail || "Error updating role")
            console.error('Error updating role:', error); // Debug: Error log
        } finally {
            setIsSubmitting(false); // Reset submitting state
        }
    };
    useEffect(
        () => {
            if (details) {
                setSearchTitle(details); // Assuming details is the current role name
                setInitialSearchTitle(details);
            }
        },
        [details]
    );
    useEffect(() => {
        const isSame = searchTitle.trim() === initialSearchTitle.trim();
        setIsBtnDisabled(isSame);
    }, [searchTitle, initialSearchTitle]);

    return (
        <div className="popup-overlay" style={{
            top: 0, left: 0, width: "100%", height: "100%", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1050
        }}>
            <div className="popup-container" style={{ display: 'flex', alignItems: 'center' }}>
                <button
                    className="close-icon"
                    onClick={togglePopup}
                >
                    &times;
                </button>

                <div className="popup-content" style={{ width: '70%' }}>

                    <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission default */}

                        <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                            <label>Edit Role *</label>
                            <CloseButton onClick={togglePopup} />
                        </span>
                        <input
                            type="text"
                            placeholder="Enter role"
                            className="com"
                            value={searchTitle} // Bind input value to state
                            onChange={(e) => setSearchTitle(e.target.value)} // Update state on input
                            onBlur={() => {
                                // Format to sentence case on blur
                                setSearchTitle((prev) =>
                                    prev.replace(/\b\w/g, (char) => char.toUpperCase()));
                            }}
                        />
                        <div className="button-container">
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={editRole}
                                disabled={isBtnDisabled || isSubmitting} // Disable button if no changes or submitting

                            >
                                {isSubmitting ? 'Editing...' : 'Edit'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={togglePopup}
                            >
                                Cancel
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRole;


