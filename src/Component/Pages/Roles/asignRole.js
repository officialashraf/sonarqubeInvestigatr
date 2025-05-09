// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import Select from 'react-select';
// import '../User/addUser.css';
// // import customStyles from '../Case/createCase'

// const AssignRole = ({ togglePopup ,  details}) => {
//     const token = Cookies.get('accessToken');
//     console.log ("details",details.role
// )
// const [checkEndpoints, setCheckEndpoint] = useState([])
//     // State for storing API data
//     console.log("ceckbos",checkEndpoints)
//     const [endpoints, setEndpoints] = useState([]);
//     const [roles, setRoles] = useState([]);
//     console.log('roles',roles)
//     // State for storing selected values
//     const [selectedRole, setSelectedRole] = useState(null);
//     const [selectedEndpoints, setSelectedEndpoints] = useState([]);
//     console.log('selectedEndpoints',endpoints)
//     // Loading states
//     const [loading, setLoading] = useState(false);
//     const [endpointsLoading, setEndpointsLoading] = useState(false);
//     const [rolesLoading, setRolesLoading] = useState(false);

//     // Fetch endpoints and roles on component mount
//     useEffect(() => {
//         fetchEndpoints();
//         fetchRoles();
//     }, []);

//     // Fetch available endpoints from API
//     const fetchEndpoints = async () => {
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
            
//             // Transform data for react-select
//             if (response.data && Array.isArray(response.data)) {
               
//                 const formattedEndpoints = response.data.map(item => ({
//                     value: item.endpoint,
//                     label: item.endpoint
//                 }));
//                 setEndpoints(formattedEndpoints);
//                  // Filter already assigned (having roles)
//     const preSelected = response.data
//     .filter(item => item.roles && item.roles.length > 0)
//     .map(item => ({
//         value: item.endpoint,
//         label: item.endpoint
//     }));
// setSelectedEndpoints(preSelected);
//             }
//             setEndpointsLoading(false);
//         } catch (error) {
//             console.error('Error fetching endpoints:', error);
//             toast.error('Failed to load endpoints');
//             setEndpointsLoading(false);
//         }
//     };

//     // Fetch available roles from API
//     const fetchRoles = async () => {
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
//             console.log("permission",response)
//             // Transform data for react-select
//             if (response.data && Array.isArray(response.data)) {
//                 const formattedRoles = response.data.map(item => ({
//                     value: item.role,
//                     label: item.role
//                 }));
//                 setRoles(formattedRoles);


//             }
//             setRolesLoading(false);
//         } catch (error) {
//             console.error('Error fetching roles:', error);
//             toast.error('Failed to load roles');
//             setRolesLoading(false);
//         }
//     };

//     // Handle assigning role to permissions
//     const assignRole = async () => {
//         if (!selectedRole) {
//             toast.warning('Please select a role');
//             return;
//         }
        
//         if (selectedEndpoints.length === 0) {
//             toast.warning('Please select at least one permission');
//             return;
//         }
        
//         setLoading(true);
        
//         try {
//             // Create an array of promises for each endpoint assignment
//             const assignmentPromises = selectedEndpoints.map(endpoint => {
//                 return axios.post(
//                     'http://5.180.148.40:9000/api/user-man/v1/assign-role',
//                     {
//                         role: selectedRole.value,
//                         permission: endpoint.value
//                     },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             "Content-Type": "application/json"
//                         }
//                     }
//                 );
//             });
            
//             // Wait for all assignment requests to complete
//             await Promise.all(assignmentPromises);
            
//             toast.success("Role assigned successfully");
//             window.dispatchEvent(new Event("databaseUpdated"));
//             togglePopup(false);
//         } catch (error) {
//             console.error('Error assigning role:', error);
//             toast.error( error.response.data.detail ||'Failed to assign role');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Custom styles for react-select
//     const customStyles = {
//         control: (base) => ({
//           ...base,
//           backgroundColor: 'white',
//           color: 'black',
//           boxShadow: 'none',
//           outline: 'none'
//         }),
//         menu: (base) => ({
//           ...base,
//           backgroundColor: 'white',
//           color: 'black',
//         }),
//         option: (base, state) => ({
//           ...base,
//           backgroundColor: state.isSelected ? 'black' : 'white',
//           color: state.isSelected ? 'white' : 'black',
//           '&:hover': {
//             backgroundColor: 'black',
//             color: 'white'
//           }
//         }),
//         multiValue: (base) => ({
//           ...base,
//           backgroundColor: 'white',
//         }),
//         multiValueLabel: (base) => ({
//           ...base,
//           backgroundColor: 'black',
//           color: 'white',
//         }),
//         multiValueRemove: (base) => ({
//           ...base,
//           color: 'black',
//           '&:hover': {
//             backgroundColor: 'black',
//             color: 'white'
//           }
//         })
//       };
    
     

//     return (
//         <div className="popup-overlay" style={{
//             top: 0, left: 0, width: "100%", height: "100%", display: "flex",
//             justifyContent: "center", alignItems: "center", zIndex: 1050
//         }}>
//             <div className="popup-container" style={{ display: 'flex', alignItems: 'center' }}>
               

//                 <div className="popup-content" style={{ width: '80%' }}>
//                     <h5 style={{ marginBottom: '20px', textAlign: 'center' }}>Assign Role to Permissions</h5>
//                     <button
//                     className="close-icon"
//                     onClick={() => togglePopup(false)}
//                 >
//                     &times;
//                 </button>
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
//                                 className="basic-select"
//                                 classNamePrefix="select"
//                             />
//                         </div>

//                         <div className="form-group" style={{ marginBottom: '15px' }}>
//                             <label>Select Permissions (Endpoints)</label>
//                             <Select
//                                 options={endpoints}
//                                 styles={customStyles}
//                                 placeholder="Select permissions"
//                                 isLoading={endpointsLoading}
//                                 onChange={setSelectedEndpoints}
//                                 value={selectedEndpoints}
//                                 isMulti
//                                 className="basic-multi-select"
//                                 classNamePrefix="select"
//                             />
//                         </div>

//                         <div className="button-container">
//                             <button
//                                 type="button"
//                                 className="cancel-btn"
//                                 onClick={() => togglePopup(false)}
//                                 disabled={loading}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 type="submit"
//                                 className="create-btn"
//                                 onClick={assignRole}
//                                 disabled={loading}
//                             >
//                                 {loading ? 'Assigning...' : 'Assign'}
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AssignRole;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Select, { components } from 'react-select';
import '../User/addUser.css';

const AssignRole = ({ togglePopup, details }) => {
    const token = Cookies.get('accessToken');
    const [endpoints, setEndpoints] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedEndpoints, setSelectedEndpoints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [endpointsLoading, setEndpointsLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);


    useEffect(() => {
        if (details?.role) {
            setSelectedRole({
                value: details.role,
                label: details.role,
            });
        }
    }, [details]);
    useEffect(() => {
        fetchEndpoints();
        fetchRoles();
    }, []);

    const fetchEndpoints = async () => {
        setEndpointsLoading(true);
        try {
            const response = await axios.get(
                'http://5.180.148.40:9000/api/user-man/v1/endpoints',
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
                console.log("formatted",formatted)

                const preSelected = formatted.filter(item => item.isAssigned);
                setSelectedEndpoints(preSelected);
                console.log("preSelected",preSelected)
            }

           
               
        } catch (error) {
            toast.error('Failed to load endpoints');
        } finally {
            setEndpointsLoading(false);
        }
    };

    const fetchRoles = async () => {
        setRolesLoading(true);
        try {
            const response = await axios.get(
                'http://5.180.148.40:9000/api/user-man/v1/role',
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
            toast.error('Failed to load roles');
        } finally {
            setRolesLoading(false);
        }
    };

    const assignRole = async () => {
        if (!selectedRole) return toast.warning('Please select a role');
        if (selectedEndpoints.length === 0) return toast.warning('Please select at least one permission');
        setLoading(true);
        try {
            const requests = selectedEndpoints.map(endpoint =>
                axios.post(
                    'http://5.180.148.40:9000/api/user-man/v1/assign-role',
                    {
                        role: selectedRole.value,
                        permission: endpoint.value
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                )
            );
            await Promise.all(requests);
            toast.success("Role assigned successfully");
            window.dispatchEvent(new Event("databaseUpdated"));
            togglePopup(false);
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Failed to assign role');
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
        menu: base => ({
            ...base,
            backgroundColor: 'white',
            color: 'black',
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
        return (
            <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: 5 }}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => null}
                    style={{ marginRight: 10 }}
                />
                <label>{data.label}</label>
            </div>
        );
    };

    return (
        <div className="popup-overlay" style={{ top: 0, left: 0, width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050 }}>
            <div className="popup-container" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="popup-content" style={{ width: '80%' }}>
                    <h5 style={{ marginBottom: '20px', textAlign: 'center' }}>Assign Role to Permissions</h5>
                    <button className="close-icon" onClick={() => togglePopup(false)}>&times;</button>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Select Role</label>
                            <Select
                                options={roles}
                                styles={customStyles}
                                placeholder="Select a role"
                                isLoading={rolesLoading}
                                onChange={setSelectedRole}
                                value={selectedRole}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label>Select Permissions (Endpoints)</label>
                            <Select
                                options={endpoints}
                                styles={customStyles}
                                placeholder="Select permissions"
                                isLoading={endpointsLoading}
                                value={selectedEndpoints}
                                onChange={setSelectedEndpoints}
                                isMulti
                                closeMenuOnSelect={false}
                                hideSelectedOptions={false}
                                components={{ Option: CheckboxOption, MultiValue: () => null }}
                            />
                        </div>

                        <div className="button-container">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => togglePopup(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="create-btn"
                                onClick={assignRole}
                                disabled={loading}
                            >
                                {loading ? 'Assigning...' : 'Assign'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssignRole;
