import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Select from 'react-select';
import '../User/addUser.css';
import { CloseButton } from 'react-bootstrap';

const AddRole = ({ togglePopup }) => {
    const token = Cookies.get('accessToken');

    const [endpoints, setEndpoints] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedEndpoints, setSelectedEndpoints] = useState([]);
    const [initialEndpoints, setInitialEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [endpointsLoading, setEndpointsLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const fetchEndpoints = useCallback(async () => {
        setEndpointsLoading(true);
        try {

            const response = await axios.get(
                `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/endpoints`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.data && Array.isArray(response.data)) {
                const formatted = response.data.map(item => ({
                    value: item.endpoint,
                    label: item.endpoint,
                }));
                setEndpoints(formatted);
                console.log("response.data", endpoints)

                setSelectedEndpoints(endpoints);
                setInitialEndpoints(selectedEndpoints.map(endpoint => endpoint.value));
                console.log("initialEndpoints", initialEndpoints)
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to load permissions');
        } finally {
            setEndpointsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEndpoints();
    }, [fetchEndpoints]);

    const assignRole = async () => {
        if (!selectedRole) return toast.warning('Please select a role');
        if (selectedEndpoints.length === 0) return toast.warning('Please select at least one permission');
        setLoading(true);

        try {
            // Find newly added endpoints (endpoints that weren't initially assigned)
            const newlySelectedEndpoints = selectedEndpoints.filter(
                endpoint => !initialEndpoints.includes(endpoint.value)
            );
            console.log("newlyse;ected", newlySelectedEndpoints)

            // Only process newly selected endpoints console.log("selectedrole", selectedRole)
            if (!selectedRole.trim()) {
                toast.error("Please enter role before proceeding."); // Show toast error
                return; // Stop function execution
            }
            if (newlySelectedEndpoints.length === 0) {
                toast.info("No new permissions to assign");
                setLoading(false);
                return;
            }
            const payload = {
                role: selectedRole,
                permissions: newlySelectedEndpoints.map(endpoint => endpoint.value),
            }
            console.log("payload", payload)
            const response =
              await axios.post(
                    `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/role`, payload
                    ,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                )
     
            if (response.status === 200) {
                toast.success("New role created successfully");
                window.dispatchEvent(new Event("databaseUpdated"));
                togglePopup(false);
            }
            console.log(response)
        } catch(error) {
            console.error("Error during role creation:", error.response || error);
            toast.error(error.response?.data?.detail || error.message  || 'Failed to assign role');
        } finally {
            setLoading(false);
        }
    };

    const customStyles = {
        control: base => ({
            ...base,
            backgroundColor: 'white',
            color: 'black',
            boxShadow: 'none',
            outline: 'none'
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '150px',
            overflowY: 'auto',
        }),
        menu: base => ({
            ...base,
            backgroundColor: 'white',
            color: 'black',
            maxHeight: 'unset'
        }),

        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            padding: '8px'
        })
    };

    // Custom checkbox option
    const CheckboxOption = props => {
        const { data, isSelected, innerRef, innerProps } = props;
        const isSelectAll = data.value === '_select_all_';
        return (
            <div ref={innerRef} {...innerProps} style={{
                display: 'flex',
                alignItems: 'center',
                padding: 5,
                backgroundColor: data.isAssigned ? '#f5f5f5' : 'white'
            }}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => null}
                    style={{ marginRight: 10 }}
                />
                {/* <label>
                    {data.label}
                    {data.isAssigned && <span style={{ color: '#666', marginLeft: 5 }}>(already assigned)</span>}
                </label> */}

                <label>
                    {isSelectAll ? 'Select All' : data.label}
                    {!isSelectAll && data.isAssigned}
                </label>
            </div>
        );
    };

    return (
        <div className="popup-overlay" style={{ top: 0, left: 0, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050 }}>
            <div className="popup-container" style={{ alignItems: 'center' }}>
                <div className="popup-content" style={{ width: '80%', minHeight: isDropdownOpen ? "60vh" : "230px", position: "relative" }}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>

                        <h5 >Assign role to permissions</h5>
                        <CloseButton onClick={togglePopup} />
                    </span>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Add Role</label>
                            <input
                                type="text"
                                placeholder="Enter Role"
                                className="com"
                                value={selectedRole} // Bind input value to state
                                onChange={(e) => setSelectedRole(e.target.value)} // Update state on input
                                onBlur={() => {
                                    // Format to sentence case on blur
                                    setSelectedRole((prev) =>
                                        prev?.replace(/\b\w/g, (char) => char.toUpperCase()));
                                }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Select Permissions</label>
                            <Select
                                options={[{ label: 'Select All', value: '_select_all_' }, ...endpoints]}
                                styles={customStyles}
                                placeholder="Select permissions"
                                isLoading={endpointsLoading}
                                value={selectedEndpoints}
                                // onChange={setSelectedEndpoints}
                                onChange={(selected) => {
                                    if (!selected) return setSelectedEndpoints([]);

                                    const isSelectAllClicked = selected.find(opt => opt.value === '_select_all_');

                                    if (isSelectAllClicked) {
                                        const areAllSelected = selectedEndpoints.length === endpoints.length;
                                        if (areAllSelected) {
                                            setSelectedEndpoints([]);
                                        } else {
                                            setSelectedEndpoints(endpoints);
                                        }
                                    } else {
                                        setSelectedEndpoints(selected);
                                    }
                                }}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{ Option: CheckboxOption, MultiValue: () => null }}
                                onMenuOpen={() => setIsDropdownOpen(true)} // ✅ Set dropdown open
                            />
                            <small className="text-muted">
                                Only newly selected permissions will be assigned
                            </small>
                        </div>

                        <div style={{
                            position: "absolute",
                            bottom: "10px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                            right: '10px'
                        }}
                        >
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={assignRole}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => togglePopup(false)}
                                disabled={loading}
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