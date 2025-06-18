import { Plus } from "react-bootstrap-icons";
import { Col, Table } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import "../Case/table.css";
import AddUser from "./addUser";
import "../Case/table.css";
import EditUser from "./editUser";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Dropdown from "react-bootstrap/Dropdown";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import UserDetails from "./userDetails";
import Loader from "../Layout/loader";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./resetPassword";

const UserManagement = () => {

  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  console.log(selectedUser);


  const togglePopup = () => setShowAddForm(!showAddForm);
  const toggleDetails = (item) => {
    console.log("Selected item for details:", item);
    setSelectedUser(item.id);
    setShowDetail((prev) => !prev);
  };

  const toggleEditForm = (item) => {
    setSelectedUser(item);
    setShowEditForm((prev) => !prev);
  };

  const toggleResetForm = (item) => {
    setSelectedUser(item);
    setShowResetForm((prev) => !prev);
  };
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = Cookies.get("accessToken");
      const response = await axios.get((`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },

      });

      console.log("API Response:", response);
      setData(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        console.error("An error occurred:", error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
      {
        autoClose: false, closeOnClick: false, draggable: false, style: {
          position: 'fixed',
          top: '300px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          zIndex: 9999,
        }
      },)
  };

  const deleteUser = async (id, username) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }
    try {

      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      window.dispatchEvent(new Event("databaseUpdated"));
      toast.success(`User ${username} deleted successfully`)
      console.log("User Deleted:", response.data);

    } catch (err) {
      // Error handling based on the type of error
      console.error('Error during login:', err);

      if (err.response) {

        toast.error(err.response?.data?.detail || 'Something went wrong. Please try again');

      } else if (err.request) {
        // No response from the server
        toast.error('No response from the server. Please check your connection');
      } else {
        // Unknown error occurred
        toast.error('An unknown error occurred. Please try again');
      }
    }
  };

  const getUserData = async () => {
    const token = Cookies.get("accessToken");
    try {
      await axios.get((`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`)
        , {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

    } catch (error) {
      console.error('There was an error usering the data!', error);
    }
  };
  useEffect(() => {
    getUserData(); // Call the getUserData function
  }, []);


  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);

    const filtered = data.filter(item => {
      return Object.values(item).some((value) => {
        if (value !== null && value !== undefined) {
          // Convert the value to a string and check if it includes the search value
          return value
            .toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };

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
  };

  if (loading) {
    return <Loader />
  }


  return (
    <>
      {data && data.length > 0 ?
        (
          <div className="data-table-container">
            <div className="top-header" style={{ marginTop: "10px" }}>
              <Col xs={1} className="d-flex align-items-center justify-content-flex-start" style={{ width: "350px", minWidth: '350px' }}>
                <FaArrowLeft style={{
                  cursor: 'pointer', margin: '0px 40px 0px 38px',
                  fontSize: '16px'
                }} onClick={() => navigate('/admin')} />
                <div className="search-bar1" style={{ width: '100%' }}>
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
              </Col>
              <div className="header-icons">
                <button className="add-btn" onClick={togglePopup}>
                  <Plus size={14} style={{ marginRight: "5px" }} />
                  Add New User
                </button>
              </div>
            </div>

            <div className="data-table" style={{ minHeight: isDropdownOpen ? "200px" : "auto" }}>
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
                        User ID
                        <span
                          onClick={() => handleSort("id")}
                          style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
                        >
                          {sortConfig.key === "id" ? (
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
                        Username
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
                          {`USER${String(item.id).padStart(4, '0')}`}
                        </td>
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
                          {(item.last_logout ? item.last_logout.slice(0, 10) : "-")}
                        </td>
                        <td>
                          {
                            (item.updatedOn ? item.updatedOn.slice(0, 10) : "-")
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
                          <Dropdown onToggle={(isOpen) => setIsDropdownOpen(isOpen)}>
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
                              <Dropdown.Item onClick={() => toggleResetForm(item)}>
                                Reset Password
                              </Dropdown.Item>
                              <Dropdown.Item
                                onClick={() => confirmDelete(item.id, item.username)}
                              >
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    )}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="resourcesContainer" style={{ border: 'none' }}>
            <h3 className="title">Let's Get Started!</h3>
            <p className="content">Add users to get started</p>
            <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Users</button>
          </div>
        )
      }
      {showResetForm && <ResetPassword onClose={toggleResetForm} item={selectedUser} />}
      {showAddForm && <AddUser onClose={togglePopup} />}
      {showDetail && <UserDetails userId={selectedUser} toggleDetails={toggleDetails} />}
      {showEditForm &&
        <EditUser
          togglePopup={toggleEditForm}
          item={selectedUser} // Pass selected user data
        />}
    </>
  );
};

export default UserManagement;
