

import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import '../User/addUser.css'

const EditRole = ({togglePopup,details}) => {
    const Token = Cookies.get('accessToken');
    
 console.log("editdetials",details)
    const [searchTitle, setSearchTitle] = useState('');

    const editRole = async () => {
       
        try {
          
            const criteriaPaylod = {
                new_role: searchTitle || "", 
            old_role: details
            };

            console.log("role Payload:", searchTitle); // Debug: Payload for API

            const response = await axios.put(
                `http://5.180.148.40:9000/api/user-man/v1/role`,
               criteriaPaylod, // empty body
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Token}`
                    }
                }
            );
            

            toast.success("Role Updated successfully");
            window.dispatchEvent(new Event("databaseUpdated"));
            // window.addEventListener("databaseUpdated", handleDatabaseUpdated)
            console.log('Role Updated successfully:', response.data); // Debug: API response
           togglePopup(false)
          } catch (error) {
            console.error('Error saving criteria:', error); // Debug: Error log
        }
    };

    return  (
        <div className="popup-overlay" style={{
            top: 0, left: 0, width: "100%", height: "100%", display: "flex",
            justifyContent: "center", alignItems: "center", zIndex: 1050
        }}>
            <div className="popup-container" style={{display:'flex', alignItems:'center'}}>
                <button
                    className="close-icon"
                    onClick={togglePopup}
                >
                    &times;
                </button>
              
                <div className="popup-content" style={{width:'70%'}}>
               
                    <form onSubmit={(e) => e.preventDefault()}> {/* Prevent form submission default */}
                        <label>UpdateRole</label>
                        <input
                            type="text"
                            placeholder="Enter Role"
                            className="com"
                            value={searchTitle} // Bind input value to state
                            onChange={(e) => setSearchTitle(e.target.value)} // Update state on input
                        />
                        <div className="button-container">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={togglePopup}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={editRole}
                            >
                              Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditRole;


