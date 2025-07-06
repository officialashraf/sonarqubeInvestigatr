import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useAutoFocusWithManualAutofill } from "../../../utils/autoFocus";
import CommonTextInput from "../../Common/MultiSelect/CommonTextInput";
import CommonMultiSelect from "../../Common/MultiSelect/CommonSingleSelect";
import AppButton from "../../Common/Buttton/button";
import customSelectStyles from '../../Common/CustomStyleSelect/customSelectStyles';


const EditConnection = ({ togglePopup, id }) => {
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
    const [loading, setLoading] = useState(true);

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
    

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/connection/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            if (res.status === 200 && res.data) {
                setFormData({
                    name: res.data.name || "",
                    connection_type: res.data.connection_type || "",
                    connection_info: {
                        host: res.data.connection_info?.host || "",
                        port: res.data.connection_info?.port || "",
                        username: res.data.connection_info?.username || "",
                        password: "" // Do not prefill password for security
                    }
                });
            }
        })
        .catch(err => {
            console.error("Error fetching connection details:", err);
            toast.error("Failed to fetch connection details");
        })
        .finally(() => setLoading(false));
    }, [id, token]);

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
        const ci = formData.connection_info;

        if (!formData.name.trim()) errors.name = "Required";
        if (!formData.connection_type) errors.connection_type = "Required";
        if (!ci.host.trim()) errors.host = "Required";
        if (!ci.port) errors.port = "Required";
        if (!ci.username.trim()) errors.username = "Required";
        if (!ci.password.trim()) errors.password = "Required";
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return toast.error("Missing auth token");

        const errs = validateForm();
        if (Object.keys(errs).length) return setError(errs);

        setIsSubmitting(true);

        // Prepare payload, exclude password if empty
        const payload = {
            name: formData.name,
            connection_type: formData.connection_type,
            connection_info: {
                host: formData.connection_info.host,
                port: formData.connection_info.port,
                username: formData.connection_info.username,
            }
        };
        if (formData.connection_info.password) {
            payload.connection_info.password = formData.connection_info.password;
        }

        try {
            const res = await axios.put(
                `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/connection/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.status === 200) {
                toast.success("Connection updated");
                window.dispatchEvent(new Event("databaseUpdated"));
                togglePopup();
            } else {
                toast.error("Failed to update connection");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.detail || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="popup-overlay">
                <div className="popup-container" style={{height: '300px'}}>
                    <button className="close-icon" onClick={togglePopup}>&times;</button>
                    <div className="popup-content">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <button className="close-icon" onClick={togglePopup}>&times;</button>
                <div className="popup-content">
                    <h5>Edit Connection</h5>
                    <form onSubmit={handleSubmit}>
                        <CommonTextInput
                            label="Connection Name *"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter connection name"
                        />
                        {error.name && <p className="error">{error.name}</p>}

                       
                        <CommonMultiSelect
                            label="Connection Type *"
                            value={connectionTypes.find(opt => opt.value === formData.connection_type)}
                            onChange={(selectedOption) =>
                                setFormData(prev => ({
                                    ...prev,
                                    connection_type: selectedOption?.value || ""
                                }))
                            }
                            
                            ref={inputRef}
                            customStyles={customSelectStyles}
                            options={connectionTypes}
                        >
                            {/* <option value="">-- Select --</option>
                            {connectionTypes.map((ct) => (
                                <option key={ct.value} value={ct.value}>{ct.label}</option>
                            ))} */}
                        </CommonMultiSelect>
                        {error.connection_type && <p className="error">{error.connection_type}</p>}

                        {/* <label>Host *</label> */}
                        <CommonTextInput
                            label="Host *"
                            name="host"
                            value={formData.connection_info.host}
                            onChange={handleChange}
                            placeholder="Enter host"
                            className="com"
                        />
                        {error.host && <p className="error">{error.host}</p>}

                        <CommonTextInput
                            label="Port *"
                            name="port"
                            value={formData.connection_info.port}
                            type="number"
                            onChange={handleChange}
                            placeholder="Enter port"
                            className="com"
                        />
                        {error.port && <p className="error">{error.port}</p>}

                        <CommonTextInput
                            label="Username *"
                            name="username"
                            value={formData.connection_info.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="com"
                        />
                        {error.username && <p className="error">{error.username}</p>}

                        <CommonTextInput
                            label="Password *"
                            name="password"
                            value={formData.connection_info.password}
                            type="password"
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="com"
                        />
                        {error.password && <p className="error">{error.password}</p>}

                        <div className="button-container">
                            <AppButton type="submit" className="create-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Editing..." : "Edit"}
                            </AppButton>
                            <AppButton type="button" onClick={togglePopup} className="cancel-btn">Cancel</AppButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditConnection;