import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";

const CreateConnection = ({ togglePopup, id }) => {
    const token = Cookies.get("accessToken");
    const { inputRef } = useAutoFocusWithManualAutofill();

    const [connectionTypes, setConnectionTypes] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        connection_type: "",
        connection_info: {
            host: "",
            port: "",
            username: "",
            password: ""
        }
    });
    const [error, setError] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchConnectionTypes = async () => {
            try {
                const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/connection-type`);
                const formattedConnectionTypes = (response.data || []).map(type => ({
                    value: type.name, 
                    label: type.name
                }));
                setConnectionTypes(formattedConnectionTypes);
            } catch (err) {
                console.error("Error fetching connection types:", err);
                toast.error("Could not fetch connection types");
            }
        };

        fetchConnectionTypes();
    }, [token]);
      

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (["host", "port", "username", "password"].includes(name)) {
            setFormData(prev => ({
                ...prev,
                connection_info: {
                    ...prev.connection_info,
                    [name]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError(prev => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errors = {};
        const pwRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
        const ci = formData.connection_info;

        if (!formData.name.trim()) errors.name = "Required";
        if (!formData.connection_type) errors.connection_type = "Required";
        if (!ci.host.trim()) errors.host = "Required";
        if (!ci.port) errors.port = "Required";
        if (!ci.username.trim()) errors.username = "Required";
        if (!ci.password.trim()) errors.password = "Required";
        else if (!pwRegex.test(ci.password))
            errors.password = "6+ chars, 1 uppercase & 1 special char";

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return toast.error("Missing auth token");

        const errs = validateForm();
        if (Object.keys(errs).length) return setError(errs);

        setIsSubmitting(true);

        try {
            const res = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/connection`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200 || res.status === 201) {
                toast.success("Connection saved");
                window.dispatchEvent(new Event("databaseUpdated"));
                togglePopup();
            } else {
                toast.error("Failed to create connection");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <button className="close-icon" onClick={togglePopup}>&times;</button>
                <div className="popup-content">
                    <h5>Create Connection</h5>
                    <form onSubmit={handleSubmit}>
                        <label>Connection Name *</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter connection name"
                            className="com"
                        />
                        {error.name && <p className="error">{error.name}</p>}
                        <label>Connection Type *</label>
                        <select
                            name="connection_type"
                            value={formData.connection_type}
                            onChange={handleChange}
                            className="com"
                        >
                            <option value="">Select connection type</option>
                            {connectionTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        {error.connection_type && <p className="error">{error.connection_type}</p>}
                        <label>Host *</label>
                        <input
                            name="host"
                            value={formData.connection_info.host}
                            onChange={handleChange}
                            placeholder="Enter host"
                            className="com"
                        />
                        {error.host && <p className="error">{error.host}</p>}

                        <label>Port *</label>
                        <input
                            name="port"
                            value={formData.connection_info.port}
                            type="number"
                            onChange={handleChange}
                            placeholder="Enter port"
                            className="com"
                        />
                        {error.port && <p className="error">{error.port}</p>}

                        <label>Username *</label>
                        <input
                            name="username"
                            value={formData.connection_info.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="com"
                        />
                        {error.username && <p className="error">{error.username}</p>}

                        <label>Password *</label>
                        <input
                            name="password"
                            value={formData.connection_info.password}
                            type="password"
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="com"
                        />
                        {error.password && <p className="error">{error.password}</p>}

                        <div className="button-container">
                            <button type="submit" className="create-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create"}
                            </button>
                            <button type="button" onClick={togglePopup} className="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateConnection;