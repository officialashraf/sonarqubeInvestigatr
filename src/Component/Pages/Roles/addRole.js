

import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../User/addUser.css'

const AddRole = ({ togglePopup }) => {
    const Token = Cookies.get('accessToken');


    const [searchTitle, setSearchTitle] = useState('');

    const addRole = async () => {

        try {
            console.log("Criteria Payload:", searchTitle); // Debug: Payload for API
if (!searchTitle.trim()) { 
    toast.error("Please enter Role before proceeding."); // Show toast error
    return; // Stop function execution
}
            const response = await axios.post(
                `http://5.180.148.40:9000/api/user-man/v1/role/${searchTitle}`,
                {}, // empty body
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );


            toast.success("Role created successfully");
            window.dispatchEvent(new Event("databaseUpdated"));
            console.log('Role created successfully:', response.data); // Debug: API response
            togglePopup(false)
        } catch (error) {
            toast(error.response.data.detail || "Role name already exists. Kindly use a different role name", );
            console.error('Error saving criteria:', error); // Debug: Error log
        }
    };

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
                        <label>Add Role <span style={{ color: 'black' }}>*</span></label>
                        <input
                            type="text"
                            placeholder="Enter Role"
                            className="com"
                            value={searchTitle} // Bind input value to state
                            onChange={(e) => setSearchTitle(e.target.value)} // Update state on input
                            onBlur={() => {
                                // Format to sentence case on blur
                                setSearchTitle((prev) =>
                                    prev.replace(/\b\w/g, (char) => char.toUpperCase())                                );
                              }}
                        />
                        <div className="button-container">
                             <button
                                type="submit"
                                className="create-btn"
                                onClick={addRole}
                            >
                                Create
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

export default AddRole;


