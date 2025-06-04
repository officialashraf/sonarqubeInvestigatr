import { useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetPassword = ({ onClose, id }) => {
    console.log("id", id)
    const [newPassword, setNewPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);

    const token = Cookies.get("accessToken");

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            console.log("newPassword", newPassword)
            const response = await axios.post(`http://5.180.148.40:9000/api/user-man/v1/user/resetpassword`,
                {
                    new_password: newPassword,
                    user_id: id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("response", response);
            toast.success("Password reset successfully");
            console.log("Passwrod reset :", response.data);
            onClose()

        } catch (error) {
            toast.error(error.response?.data?.detail || "Error while reset password");
            console.error("Error:", error.response ? error.response.data : error.message);
        }
    };

    return (

        <div className="popup-overlay" style={{ padding: '150px 100px 0px 0px' }}>
            <div className="popup-container">
                <button className="close-icon" onClick={onClose}>
                    &times;
                </button>
                <div className="popup-content">
                    <form onSubmit={handleReset}>

                        <label htmlFor="title">New Password *</label>
                        <div style={{ position: "relative", display: "inline-block",width: "100%" }}>
                            <input
                                className="com"
                                type={showPassword ? "text" : "password"}
                                id="title"
                                name="title"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter your new password"
                                required
                                />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                }}
                            >
                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>} {/* Changes icon based on visibility */}
                            </span>
                        </div>

                        <div className="button-container">
                            <button type="submit" className="create-btn">Reset</button>
                            <button type="button" className="cancel-btn" onClick={onClose}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default ResetPassword