// import { Search, Plus } from "react-bootstrap-icons";
// import { Col, Table } from "react-bootstrap";
// import { FiMoreVertical } from "react-icons/fi";
// import "../Case/table.css";
// import "../Case/table.css";
// import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
// import Dropdown from "react-bootstrap/Dropdown";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";



// const RolesPermission = () => {
//     const navigate = useNavigate();

//     const [data, setData] = useState([]);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [filteredData, setFilteredData] = useState([]);
//     const [showAddForm, setShowAddForm] = useState(false);
//     const [sortKey, setSortKey] = useState(null); // 'role', 'endpoint', 'route'
//     const [sortOrder, setSortOrder] = useState('asc'); // ya 'desc'

//     const togglePopup = () => setShowAddForm(!showAddForm);

//     const fetchRoles = async () => {
//         try {
//             const token = Cookies.get("accessToken");
//             const response = await axios.get("http://5.180.148.40:9000/api/user-man/v1/role", {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": 'application/json'
//                 },

//             });
//             console.log("API Response Roles:", response);
//             setData(response.data);
//             console.log("setData", data)
//             setFilteredData(response.data);
//         } catch (error) {
//             toast.error("Failed to fetch users");
//             console.error(error);
//         }
//     };

//     useEffect(() => {

//         fetchRoles();
//         const handleDatabaseUpdated = () => {

//             fetchRoles();
//         };

//         window.addEventListener("databaseUpdated", handleDatabaseUpdated);

//         return () => {
//             window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
//         };
//     }, []);


//     const handleSearch = (event) => {
//         const searchValue = event.target.value.trim().toLowerCase();
//         setSearchTerm(searchValue);

//         const filtered = data.filter(item => {
//             return Object.values(item).some((value) => {
//                 if (value !== null && value !== undefined) {
//                     // Convert the value to a string and check if it includes the search value
//                     return value
//                         .toString()
//                         .toLowerCase()
//                         .includes(searchValue);
//                 }
//                 return false;
//             });
//         });
//         setFilteredData(filtered);
//     };

//     const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

//     const sortedData = [...data].map(roleItem => ({
//         ...roleItem,
//         permissions: [...roleItem.permissions].sort((a, b) => {
//             if (!sortKey) return 0;

//             let valA = a[sortKey].toLowerCase();
//             let valB = b[sortKey].toLowerCase();

//             if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
//             if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
//             return 0;
//         })
//     }));

//     const handleSort = (key) => {
//         if (sortKey === key) {
//             // same column pe dobara click -> order toggle
//             setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
//         } else {
//             setSortKey(key);
//             setSortOrder('asc');
//         }
//     };




//     return (
//         <div className="data-table-container">
//             <div className="top-header" style={{ marginTop: "10px" }}>
//                 <Col xs={1} className="d-flex align-items-center justify-content-flex-start" style={{ width: "20%" }}>
//                     <FaArrowLeft style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => navigate('/dashboard')} />
//                     <div className="search-bar1" style={{ width: '100%' }}>
//                         <div className="input-group">
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 value={searchTerm}
//                                 onChange={handleSearch}
//                                 placeholder="Search"
//                             />
//                         </div>
//                     </div>
//                 </Col>


//                 <div className="header-icons">
//                     <button className="add-btn" onClick={togglePopup}>
//                         <Plus size={14} style={{ marginRight: "5px" }} />
//                         Add New Role
//                     </button>
//                 </div>
//             </div>

//             <div className="data-table" style={{ height: "550px" }}>
//                 <Table striped bordered hover variant="light">
//                     <thead>
//                         <tr>
//                             <th>
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center"
//                                     }}
//                                 >
//                                     Roles
//                                     <span
//                                         onClick={() => handleSort("role")}
//                                         style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//                                     >
//                                         {sortConfig.key === "role" ? (
//                                             sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
//                                         ) : (
//                                             <ArrowDropDown />
//                                         )}
//                                     </span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center"
//                                     }}
//                                 >
//                                     Endpoints                 <span
//                                         onClick={() => handleSort("perm.endpoint")}
//                                         style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//                                     >
//                                         {sortConfig.key === "perm.endpoint" ? (
//                                             sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
//                                         ) : (
//                                             <ArrowDropDown />
//                                         )}
//                                     </span>
//                                 </div>
//                             </th>
//                             <th>
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center"
//                                     }}
//                                 >
//                                     Routes
//                                     <span
//                                         onClick={() => handleSort("perm.route")}
//                                         style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
//                                     >
//                                         {sortConfig.key === "perm.route" ? (
//                                             sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
//                                         ) : (
//                                             <ArrowDropDown />
//                                         )}
//                                     </span>
//                                 </div>


//                             </th>
//                             <th>
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         justifyContent: "space-between",
//                                         alignItems: "center"
//                                     }}
//                                 >
//                                     Action
//                                     <span
//                                         style={{
//                                             cursor: "pointer",
//                                             display: "inline-flex",
//                                             alignItems: "center"
//                                         }}
//                                     >
//                                         <ArrowDropDown />
//                                     </span>
//                                 </div>
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredData && filteredData.map((roleItem, roleIndex) =>
//                             roleItem.permissions.map((perm, permIndex) => (
//                                 <tr key={`${roleIndex}-${permIndex}`}>
//                                     <td>{roleItem.role}</td>
//                                     <td>{perm.endpoint}</td>
//                                     <td>{perm.route}</td>

//                                     <td
//                                         style={{
//                                             display: "flex",
//                                             justifyContent: "end",
//                                             alignItems: "center",
//                                             textAlign: "center"
//                                         }}
//                                     >
//                                         <div
//                                             style={{
//                                                 display: "flex",
//                                                 alignItems: "center",
//                                                 gap: "10px"
//                                             }}
//                                         />
//                                         <Dropdown>
//                                             <Dropdown.Toggle
//                                                 className="menu-button"
//                                                 style={{
//                                                     background: "none",
//                                                     border: "none",
//                                                     cursor: "pointer"
//                                                 }}
//                                             >
//                                                 <FiMoreVertical size={16} />
//                                             </Dropdown.Toggle>
//                                             <Dropdown.Menu
//                                                 className="custom-dropdown-menu"
//                                                 style={{
//                                                     minWidth: "150px",
//                                                     textAlign: "left"
//                                                 }}
//                                             >
//                                                 <Dropdown.Item
//                                                     // onClick={() => toggleDetails(item)}
//                                                     style={{ cursor: "pointer" }}
//                                                 >
//                                                     Details
//                                                 </Dropdown.Item>
//                                                 <Dropdown.Item
//                                                 //   onClick={() => toggleEditForm(item)}
//                                                 >
//                                                     Edit
//                                                 </Dropdown.Item>
//                                                 <Dropdown.Item
//                                                 // onClick={() => confirmDelete(item.id, item.username)}
//                                                 >
//                                                     Delete
//                                                 </Dropdown.Item>
//                                                 <Dropdown.Item>Re Assign  Role</Dropdown.Item>

//                                             </Dropdown.Menu>
//                                         </Dropdown>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </Table>
//             </div>

//         </div>
//     );
// };

// export default RolesPermission;

import { Search, Plus } from "react-bootstrap-icons";
import { Col, Table } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import "../Case/table.css";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Dropdown from "react-bootstrap/Dropdown";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AddRole from "./addRole";
import Details_Permisson from "./details_Permisson";
import AssignRole from "./asignRole";
import EditRole from "./editRole";

const RolesPermission = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupB, setShowPopupB] = useState(false);
    const [showPopupC, setShowPopupC] = useState(false);
    const [showPopupD, setShowPopupD] = useState(false);

const [popupDetails, setPopupDetails] = useState(null);

     const togglePopup = () => {
    setShowPopup(prev => !prev);
  };
  const togglePopupB = (details) => {
    setPopupDetails(details); // Store details in state
    setShowPopupB(prev => !prev);
  };
  
  const togglePopupC= (details) => {
    setPopupDetails(details);
    setShowPopupC(prev => !prev);
  };
  const togglePopupD = (details) => {
    setPopupDetails(details);
    setShowPopupD(prev => !prev);
  };

    const fetchRoles = async () => {
        try {
            const token = Cookies.get("accessToken");
            const response = await axios.get("http://5.180.148.40:9000/api/user-man/v1/role", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            console.log("resposne from roles", response)
            setData(response.data);
            console.log("data from roles", response)
            setFilteredData(response.data);
        } catch (error) {
            toast.error("Failed to fetch roles");
            console.error(error);
        }
    };

    // Flattens roles/permissions to a single row per permission
    // const flattenPermissions = (rolesData) => {
    //     return rolesData.flatMap(role => {
    //       if (Array.isArray(role.permissions) && role.permissions.length > 0) {
    //         return role.permissions.map(perm => ({
    //           role: role.role,
    //           endpoint: perm.endpoint,
    //           route: perm.route
    //         }));
    //       } else {
    //         // अगर permissions नहीं है या खाली है, तब भी role दिखाओ
    //         return [{
    //           role: role.role,
    //           endpoint: "-",
    //           route: "-"
    //         }];
    //       }
    //     });
    //   };
      

    useEffect(() => {
        fetchRoles();

        const handleDatabaseUpdated = () => {
            fetchRoles();
        };

        window.addEventListener("databaseUpdated", handleDatabaseUpdated);
        return () => {
            window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
        };
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = data.filter(item =>
            Object.values(item).some(val =>
                val?.toString().toLowerCase().includes(value)
            )
        );
        setFilteredData(filtered);   
    };
    console.log("filterdata", filteredData)
    // const handleSort = (key) => {
    //     let direction = 'asc';
    //     if (sortConfig.key === key && sortConfig.direction === 'asc') {
    //         direction = 'desc';
    //     }
    //     setSortConfig({ key, direction });

    //     const sorted = [...filteredData].sort((a, b) => {
    //         if (!a[key]) return 1;
    //         if (!b[key]) return -1;
    //         const aVal = a[key].toLowerCase();
    //         const bVal = b[key].toLowerCase();
    //         if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    //         if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    //         return 0;
    //     });
    //     setFilteredData(sorted);
    // };
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    console.log("sort",sortConfig)
        const sorted = [...filteredData].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
    
            // Handle null or undefined
            if (aVal === undefined || aVal === null) return 1;
            if (bVal === undefined || bVal === null) return -1;
    
            // Special case for created_on (date sorting)
            if (key === 'created_on') {
                const dateA = new Date(aVal);
                const dateB = new Date(bVal);
                return direction === 'asc' ? dateA - dateB : dateB - dateA;
            }
    
            // If both values are numbers
            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }
    
            // Default string comparison
            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();
            if (aStr < bStr) return direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    
        setFilteredData(sorted);
    };
    
    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />;
        }
        return <ArrowDropDown />;
    };

    return (
        <div className="data-table-container">
            <div className="top-header" style={{ marginTop: "10px" }}>
                <Col xs={1} className="d-flex align-items-center justify-content-flex-start" style={{ width: "20%" }}>
                    <FaArrowLeft
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                        onClick={() => navigate('/dashboard')}
                    />
                    <div className="search-bar1" style={{ width: '100%' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </Col>
                <div className="header-icons">
                    <button className="add-btn" onClick={togglePopup}>
                        <Plus size={14} style={{ marginRight: "5px" }} />
                        Add New Role
                    </button>
                </div>
            </div>

            <div className="data-table" style={{ height: "500px", overflowY: 'auto' }}>
                <Table striped bordered hover variant="light">
                    <thead>
                    <tr>
  <th onClick={() => handleSort('role')} style={{ cursor: 'pointer', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>Roles</span>
      {getSortIcon('role')}
    </div>
  </th>
  <th onClick={() => handleSort('created_by')} style={{ cursor: 'pointer', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>Created_BY</span>
      {getSortIcon('created_by')}
    </div>
  </th>
  <th onClick={() => handleSort('created_on')} style={{ cursor: 'pointer', textAlign: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span>Created_On</span>
      {getSortIcon('created_on')}
    </div>
  </th>
  <th style={{ textAlign: 'center' }}>Action</th>
</tr>
                    </thead>
                    <tbody>
                        {filteredData && filteredData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.role}</td>
                                <td>{item.created_by}</td>
                                <td>{item.created_on}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            className="menu-button"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer"
                                            }}
                                        >
                                            <FiMoreVertical size={16} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="custom-dropdown-menu">
                                            <Dropdown.Item  onClick={() => togglePopupB(item)}>Details</Dropdown.Item>
                                            <Dropdown.Item  onClick={() => togglePopupC(item.role)}>Edit</Dropdown.Item>
                                            <Dropdown.Item>Delete</Dropdown.Item>
                                            <Dropdown.Item  onClick={() => togglePopupD(item)}>Assign Role&Permissions</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
              {showPopup && <AddRole togglePopup={togglePopup}/>}
              {showPopupB && <Details_Permisson togglePopup={togglePopupB} details={popupDetails}/>}
              {showPopupC && <EditRole togglePopup={togglePopupC} details={popupDetails}/>}
              {showPopupD && <AssignRole togglePopup={togglePopupD}  details={popupDetails}/>}
        </div>
    );
};

export default RolesPermission;
