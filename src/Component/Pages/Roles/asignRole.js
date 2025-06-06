import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Select from 'react-select';
import '../User/addUser.css';
import { CloseButton } from 'react-bootstrap';

const AssignRole = ({ togglePopup, details }) => {
    const token = Cookies.get('accessToken');

    const [endpoints, setEndpoints] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedEndpoints, setSelectedEndpoints] = useState([]);
    const [initialEndpoints, setInitialEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [endpointsLoading, setEndpointsLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

console.warn("detailsrole",details)
    console.log("selectedEndpoints", selectedEndpoints);

    useEffect(() => {
        if (details?.role) {
            setSelectedRole({
                value: details.id,
                label: details.role,
            });
        }
    }, [details]);

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
                    isAssigned: item.roles?.includes(details.role)
                }));
                setEndpoints(formatted);

                const preSelected = formatted.filter(item => item.isAssigned);
                setSelectedEndpoints(preSelected);
                setInitialEndpoints(preSelected.map(endpoint => endpoint.value));
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to load permissions');
        } finally {
            setEndpointsLoading(false);
        }
    }, [token, details.role]);

    const fetchRoles = useCallback(async () => {
        setRolesLoading(true);
        try {
            const response = await axios.get(
                `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/role`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.data && Array.isArray(response.data)) {
                const formattedRoles = response.data.map(item => ({
                    value: item.role,
                    label: item.role
                }));
                setRoles(formattedRoles);
            }
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to load roles');
        } finally {
            setRolesLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEndpoints();
        fetchRoles();
    }, [fetchEndpoints, fetchRoles]);

    const assignRole = async () => {
        if (!selectedRole) return toast.warning('Please select a role');
        
        setLoading(true);

        try {
            const currentSelectedValues = selectedEndpoints.map(endpoint => endpoint.value);
            
            // Find newly added permissions (permissions that weren't initially assigned)
            const permissionsToAdd = currentSelectedValues.filter(
                endpointValue => !initialEndpoints.includes(endpointValue)
            );
            
            // Find permissions to remove (permissions that were initially assigned but now unchecked)
            const permissionsToRemove = initialEndpoints.filter(
                endpointValue => !currentSelectedValues.includes(endpointValue)
            );

            console.log("Permissions to add:", permissionsToAdd);
            console.log("Permissions to remove:", permissionsToRemove);

            // Check if there are any changes
            if (permissionsToAdd.length === 0 && permissionsToRemove.length === 0) {
                toast.info("No changes to apply");
                setLoading(false);
                return;
            }

            // Prepare the request payload
            const payload = {
                role_id: selectedRole.value, // Assuming role value is the ID
                permissions: permissionsToAdd.map(permission => String(permission).toLowerCase()),
                permissions_to_remove: permissionsToRemove.map(permission => String(permission).toLowerCase())
            };

            console.warn("API Payload:", payload);

            // Make API call with the new structure
            await axios.post(
                `${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/assign-role`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
 window.dispatchEvent(new Event("databaseUpdated"));
            toast.success("Role permissions updated successfully");
                        togglePopup(false);


        } catch (error) {
            console.error("API Error:", error);
            toast.error(error.response?.data?.detail || 'Failed to update role permissions');
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
        <div className="popup-overlay" style={{ top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050 }}>
            <div className="popup-container" style={{ alignItems: 'center' }}>
                <div className="popup-content" style={{ width: '80%', minHeight: isDropdownOpen ? "60vh" : "230px", position: "relative"  }}>
                    <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                       <h5 >Assign Permissions to Role</h5>
                        <CloseButton onClick={togglePopup} />
                    </span>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Role</label>
                            <input
                             className="com"
                             style={{backgroundColor:'lightgray'}}
                            type='text'
                            value={details.role}
                            disabled
                            />
                                                  </div>

                        <div className="form-group" style={{ marginBottom: '15px',height:'50px' }}>
                            <label>Select Permissions</label>
                            <Select
                                options={[{ label: 'Select All', value: '_select_all_' }, ...endpoints]}
                                // options={endpoints}
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
                                onMenuOpen={() => setIsDropdownOpen(true)} //
                                
                            />
                            
                                                <small className="text-muted">
                                Check/uncheck permissions to add or remove them from the role
                            </small>
                            
                        </div>

                        <div   style={{
                            position: "absolute",
                            bottom: "10px",
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                            right: '10px'
                        }}>
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={assignRole}
                                disabled={loading}
                            >
                                {loading ? 'Assigning...' : 'Assign'}
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

export default AssignRole;

// import { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import Select from 'react-select';
// import '../User/addUser.css';
// import { CloseButton } from 'react-bootstrap';

// const AssignRole = ({ togglePopup, details }) => {
//     const token = Cookies.get('accessToken');

//     const [endpoints, setEndpoints] = useState([]);
//     const [roles, setRoles] = useState([]);
//     const [selectedRole, setSelectedRole] = useState(null);
//     const [selectedEndpoints, setSelectedEndpoints] = useState([]);
//     const [initialEndpoints, setInitialEndpoints] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [endpointsLoading, setEndpointsLoading] = useState(false);
//     const [rolesLoading, setRolesLoading] = useState(false);

//     console.log("selectedEndoints", selectedEndpoints)
//     useEffect(() => {
//         if (details?.role) {
//             setSelectedRole({
//                 value: details.role,
//                 label: details.role,
//             });
//         }
//     }, [details]);

//     const fetchEndpoints = useCallback(async () => {
//         setEndpointsLoading(true);
//         try {
//             const response = await axios.get(
//                 'http://5.180.148.40:9000/api/user-man/v1/endpoints',
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
//             if (response.data && Array.isArray(response.data)) {
//                 const formatted = response.data.map(item => ({
//                     value: item.endpoint,
//                     label: item.endpoint,
//                     isAssigned: item.roles?.includes(details.role)
//                 }));
//                 setEndpoints(formatted);

//                 const preSelected = formatted.filter(item => item.isAssigned);
//                 setSelectedEndpoints(preSelected);
//                 setInitialEndpoints(preSelected.map(endpoint => endpoint.value));
//             }
//         } catch (error) {
//             toast.error('Failed to load endpoints');
//         } finally {
//             setEndpointsLoading(false);
//         }
//     }, [token, details.role]);

//     const fetchRoles = useCallback(async () => {
//         setRolesLoading(true);
//         try {
//             const response = await axios.get(
//                 'http://5.180.148.40:9000/api/user-man/v1/role',
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
//             if (response.data && Array.isArray(response.data)) {
//                 const formattedRoles = response.data.map(item => ({
//                     value: item.role,
//                     label: item.role
//                 }));
//                 setRoles(formattedRoles);
//             }
//         } catch (error) {
//             toast.error('Failed to load roles');
//         } finally {
//             setRolesLoading(false);
//         }
//     }, [token]);

//     useEffect(() => {
//         fetchEndpoints();
//         fetchRoles();
//     }, [fetchEndpoints, fetchRoles]);

//     const assignRole = async () => {
//         if (!selectedRole) return toast.warning('Please select a role');
//         if (selectedEndpoints.length === 0) return toast.warning('Please select at least one permission');
//         setLoading(true);

//         try {
//             // Find newly added endpoints (endpoints that weren't initially assigned)
//             const newlySelectedEndpoints = selectedEndpoints.filter(
//                 endpoint => !initialEndpoints.includes(endpoint.value)
//             );
//             console.log("newlyse;ected", newlySelectedEndpoints)
//             // Only process newly selected endpoints
//             if (newlySelectedEndpoints.length === 0) {
//                 toast.info("No new permissions to assign");
//                 setLoading(false);
//                 return;
//             }

//             const requests = newlySelectedEndpoints.map(endpoint =>
//                 axios.post(
//                     'http://5.180.148.40:9000/api/user-man/v1/assign-role',
//                     {
//                         role: selectedRole.value,
//                         permission: String(endpoint.value).toLowerCase(),
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json"
//                         }
//                     }
//                 )
//             );

//             await Promise.all(requests);
//             toast.success("New permissions assigned successfully");
//             window.dispatchEvent(new Event("databaseUpdated"));
//             togglePopup(false);
//         } catch (error) {
//             toast.error(error.response?.data?.detail || 'Failed to assign role');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const customStyles = {
//         control: base => ({
//             ...base,
//             backgroundColor: 'white',
//             color: 'black',
//             boxShadow: 'none',
//             outline: 'none'
//         }),
//         menu: base => ({
//             ...base,
//             backgroundColor: 'white',
//             color: 'black',
//         }),
//         option: (base, state) => ({
//             ...base,
//             backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
//             color: 'black',
//             display: 'flex',
//             alignItems: 'center',
//             padding: '8px'
//         })
//     };

//     // Custom checkbox option
//     const CheckboxOption = props => {
//         const { data, isSelected, innerRef, innerProps } = props;
//         return (
//             <div ref={innerRef} {...innerProps} style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 padding: 5,
//                 backgroundColor: data.isAssigned ? '#f5f5f5' : 'white'
//             }}>
//                 <input
//                     type="checkbox"
//                     checked={isSelected}
//                     onChange={() => null}
//                     style={{ marginRight: 10 }}
//                 />
//                 <label>
//                     {data.label}
//                     {data.isAssigned && <span style={{ color: '#666', marginLeft: 5 }}>(already assigned)</span>}
//                 </label>
//             </div>
//         );
//     };

//     return (
//         <div className="popup-overlay" style={{ top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050 }}>
//             <div className="popup-container" style={{  alignItems: 'center' }}>
//                 <div className="popup-content" style={{ width: '80%' }}>
//                     <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
//                         <h5 >Assign role to permissions</h5>
//                         <CloseButton onClick={togglePopup} />
//                     </span>
//                     <form onSubmit={(e) => e.preventDefault()}>
//                         <div className="form-group" style={{ marginBottom: '15px' }}>
//                             <label>Select Role</label>
//                             <Select
//                                 options={roles}
//                                 styles={customStyles}
//                                 placeholder="Select a role"
//                                 isLoading={rolesLoading}
//                                 onChange={setSelectedRole}
//                                 value={selectedRole}
//                                 isDisabled={details?.role} // Disable if editing existing role
//                             />
//                         </div>

//                         <div className="form-group" style={{ marginBottom: '15px' }}>
//                             <label>Select Permissions</label>
//                             <Select
//                                 options={endpoints}
//                                 styles={customStyles}
//                                 placeholder="Select permissions"
//                                 isLoading={endpointsLoading}
//                                 value={selectedEndpoints}
//                                 onChange={setSelectedEndpoints}
//                                 isMulti
//                                 closeMenuOnSelect={false}
//                                 hideSelectedOptions={false}
//                                 components={{ Option: CheckboxOption, MultiValue: () => null }}
//                             />
//                             <small className="text-muted">
//                                 Only newly selected permissions will be assigned
//                             </small>
//                         </div>

//                         <div className="button-container">
//                             <button
//                                 type="submit"
//                                 className="create-btn"
//                                 onClick={assignRole}
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Assigning...' : 'Assign'}
//                             </button>
//                             <button
//                                 type="button"
//                                 className="cancel-btn"
//                                 onClick={() => togglePopup(false)}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>

//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssignRole;
