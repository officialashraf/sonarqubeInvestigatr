import { Search, Plus } from "react-bootstrap-icons";
import { Table } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import { FaRegCopy } from "react-icons/fa6";
import AddUserForm from "./AddUserForm";
import "../Case/table.css";
import Details from "./Details";
import EditUserForm from "./EditUserForm";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';


const UserManagement = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  // const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  console.log(selectedUser);


  const togglePopup = () => setShowAddForm(!showAddForm);
  // const toggleDetails = () => setShowDetail(!showDetail);
  const toggleDetails = (item) => {
     console.log("Selected item for details:", item);
    setSelectedUser(item);
    setShowDetail((prev) => !prev);
    };

  // const toggleEditForm = () => setShowEditForm(!showEditForm);
  const toggleEditForm = (item) => {
    setSelectedUser(item); 
    setShowEditForm((prev) => !prev); 
  };

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get("http://5.180.148.40:9000/api/user-man/v1/user", {
        headers: {
          Authorization: `Bearer ${token}`,

        },
       
      });
       console.log("API Response:", response);
    setData(response.data.data);
    setFilteredData(response.data.data);
  } catch (error) {
    toast.error("Failed to fetch users");
    console.error(error);
  }
};
// console.log("users",users)
//   useEffect(() => {
//     fetchUsers();
//   }, []);

  useEffect(() => {
             fetchUsers();
             const handleDatabaseUpdated = () => {
             fetchUsers();
            };

    window.addEventListener("databaseUpdated", handleDatabaseUpdated);

    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
    };
  }, []);


  const confirmDelete = (id, username) => {
      toast((t) => (
        <div>
          <p>Are you sure you want to delete {username} user?</p>
          <button className='custom-confirm-button' onClick={() => { deleteUser(id, username); toast.dismiss(t.id); }} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }}>Yes</button>
          <button className='custom-confirm-button' onClick={() => toast.dismiss(t.id)} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }} >No</button> </div>),
        { autoClose: false, closeOnClick: false, draggable: false, style: {
          position: 'fixed',
          top: '300px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          zIndex: 9999, 
        }
        },)
    };

    const deleteUser = async (id) => {
        //const caseId = parseInt(id.replace("CASE", ""), 10);
        const token = Cookies.get("accessToken");
        if (!token) {
          console.error("No token found in cookies.");
          return;
        }
        try {
          const authToken = Cookies.get('accessToken'); // Read the token from cookies 
          const response = await axios.delete(`http://5.180.148.40:9000/api/user-man/v1/user/${id}`,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
              }
            });
            window.dispatchEvent(new Event("databaseUpdated"));
          toast(`User ${id}} Deleted Successfully`)
          console.log("User Deleted:", response.data);
    
          // After successful deletion, fetch the updated data
          //fetchData(); // Optionally refresh data after deletion
    
        } catch (error) {
          toast("Error deleting case:", error)
          console.error("Error deleting User:", error);
        }
      };

   const userData = async () => {
      const token = Cookies.get("accessToken");
       try { 
        const response = await axios.get('http://5.180.148.40:9000/api/user-man/v1/user'
          , {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
         const user = response.data;
          setUsers(user); // Update the state with usered data
          console.log("users", user)
           } catch (error) { 
            console.error('There was an error usering the data!', error); 
          } };
        useEffect(() => {
        userData(); // Call the userData function
        }, []);


        const handleSearch = (event) => {
          const searchValue = event.target.value.trim().toLowerCase();
          setSearchTerm(searchValue);

          const filtered = data.filter(item => {
            return Object.values(item).some((value) => {
              if (value !== null && value !== undefined) {
                // Convert the value to a string and check if it includes the search value
                return value
                  .toString()
                  .toLowerCase()
                  .includes(searchValue);
              }
              return false;
            });
          });
          setFilteredData(filtered);
        };

          const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

        
      const handleSort = (key) => {
           let direction = "asc";
         
           if (sortConfig.key === key && sortConfig.direction === "asc") {
             direction = "desc";
           }
         
           setSortConfig({ key, direction });
         
           const sortedData = [...filteredData].sort((a, b) => {
             const aValue = a[key] ?? null;
             const bValue = b[key] ?? null;
         
             if (aValue === null && bValue === null) return 0;
             if (aValue === null) return 1;
             if (bValue === null) return -1;
         
             if (key === "last_logout" || key === "created_on") {
               const aDate = new Date(aValue);
               const bDate = new Date(bValue);
               return direction === "asc" ? aDate - bDate : bDate - aDate;
             }
         
             if (typeof aValue === "string" && typeof bValue === "string") {
               return direction === "asc"
                 ? aValue.localeCompare(bValue)
                 : bValue.localeCompare(aValue);
             }
         
             if (typeof aValue === "number" && typeof bValue === "number") {
               return direction === "asc" ? aValue - bValue : bValue - aValue;
             }
         
             return 0;
           });
         
           setFilteredData(sortedData);
          }         ;



  
return (
  <div className="data-table-container">
    <div className="top-header" style={{ marginTop: "10px" }}>
      <div className="search-bar1">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
          />
        </div>
      </div>
      <div className="header-icons">
        <button className="add-btn" onClick={togglePopup}>
          <Plus size={14} style={{ marginRight: "5px" }} />
          Add New User
        </button>
      </div>
    </div>

    <div className="data-table" style={{ height: "550px"}}>
      <Table striped bordered hover variant="light">
        <thead>
          <tr>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                UserName
                 <span
                    onClick={() => handleSort("username")}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    {sortConfig.key === "username" ? (
                      sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
                    ) : (
                      <ArrowDropDown />
                    )}
                  </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                First Name
                 <span
                    onClick={() => handleSort("first_name")}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    {sortConfig.key === "first_name" ? (
                      sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
                    ) : (
                      <ArrowDropDown />
                    )}
                  </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Last Name
               <span
                    onClick={() => handleSort("last_name")}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    {sortConfig.key === "last_name" ? (
                      sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
                    ) : (
                      <ArrowDropDown />
                    )}
                  </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Role
                <span
                    onClick={() => handleSort("role")}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    {sortConfig.key === "role" ? (
                      sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
                    ) : (
                      <ArrowDropDown />
                    )}
                  </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Email
                <span
                    onClick={() => handleSort("email")}
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                  >
                    {sortConfig.key === "email" ? (
                      sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
                    ) : (
                      <ArrowDropDown />
                    )}
                  </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Last Active
                <span
          onClick={() => handleSort("last_logout")}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        >
          {sortConfig.key === "last_logout" ? (
            sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
          ) : (
            <ArrowDropDown />
          )}
        </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Last Modified
                <span
          onClick={() => handleSort("created_on")}
          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
        >
          {sortConfig.key === "created_on" ? (
            sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
          ) : (
            <ArrowDropDown />
          )}
        </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Status
               <span onClick={() => handleSort('status')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                                     {sortConfig.key === 'status' ? (
                                       sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                                     ) : <ArrowDropDown />}
                </span>
              </div>
            </th>
            <th>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                Action
                <span
                  style={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center"
                  }}
                >
                  <ArrowDropDown />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData &&
           filteredData.map(item =>
              <tr
                key={item.id || Math.random()}
                style={{ position: "relative" }}
              >
                <td>
                  {item.username}
                </td>
                <td>
                  {item.first_name || "-"}
                </td>
                <td>
                  {item.last_name || "-"}
                </td>
                <td>
                  {item.role}
                </td>
                <td>
                  {item.email}
                </td>
                <td>
                  {(item.last_logout || "-")}
                </td>
                <td>
                  {
                    (item.updatedOn || "-")
                  }
                </td>
                <td>
                  <Badge pill bg="dark" className="badge-custom">
                    <span>
                      {item.status === "active" ? "Active" : "Deactivate"}
                    </span>
                  </Badge>
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  />
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
                    <Dropdown.Menu
                      className="custom-dropdown-menu"
                      style={{
                        minWidth: "150px",
                        textAlign: "left"
                      }}
                    >
                      <Dropdown.Item
                        onClick={() => toggleDetails(item)}
                        style={{ cursor: "pointer" }}
                      >
                        Details
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => toggleEditForm(item)}>
                        Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => confirmDelete(item.id, item.username)}
                      >
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item>Update Role</Dropdown.Item>
                      <Dropdown.Item>Deactivate</Dropdown.Item>
                      <Dropdown.Item>View Password</Dropdown.Item>
                      <Dropdown.Item>Reset Password</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            )}
        </tbody>
      </Table>
    </div>


    {showAddForm && <AddUserForm onClose={togglePopup} />}
    {showDetail && <Details item={selectedUser} users={users} toggleDetails={toggleDetails}/>}
    {showEditForm &&
      <EditUserForm
        togglePopup={toggleEditForm}
        item={selectedUser} // Pass selected user data
        // onUserUpdated={() => fetchUsers()} // Refresh the user list after updating
      />}
  </div>
);
};

export default UserManagement;