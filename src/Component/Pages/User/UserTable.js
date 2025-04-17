
import React, { useState } from "react";
import { Search, Plus } from "react-bootstrap-icons";
import { Table } from "react-bootstrap";
import { FiMoreVertical } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { TbPassword } from "react-icons/tb";
import { FaRegCopy } from "react-icons/fa6";
import "../Case/table.css";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import Dropdown from "react-bootstrap/Dropdown";
import UserDetails from "./userDetails";
import EditUser from "./editUser";
import CreateUser from "./CreateUser";


const UserTable = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const togglePopup = () => setShowAddForm(!showAddForm);
  const toggleDetails = () => setShowDetail(!showDetail);
  const toggleEditForm = () => setShowEditForm(!showEditForm);


  const users = [
    {
      username: "suresh_kumar",
      name: "Suresh Kumar",
      role: "CT Admin",
      email: "rh@nia.gov.in",
      lastActive: "Apr 12, 2024 12:34 PM",
      lastModified: "Apr 12, 2024 12:34 PM",
      status: "active"
    },
    {
      username: "mahesh.joy",
      name: "Mahesh Joy",
      role: "Customer Admin",
      email: "rh@nia.gov.in",
      lastActive: "Apr 12, 2024 12:34 PM",
      lastModified: "Apr 12, 2024 12:34 PM",
      status: "active"
    },
    {
      username: "saniaa",
      name: "Sania Arya",
      role: "Customer Admin",
      email: "rh@nia.gov.in",
      lastActive: "Apr 12, 2024 12:34 PM",
      lastModified: "Apr 12, 2024 12:34 PM",
      status: "inactive"
    },
    {
      username: "g_linda",
      name: "Linda Grey",
      role: "CT Admin",
      email: "rh@nia.gov.in",
      lastActive: "Apr 12, 2024 12:34 PM",
      lastModified: "Apr 12, 2024 12:34 PM",
      status: "inactive"
    },
    {
      username: "g_linda",
      name: "Linda Grey",
      role: "CT Admin",
      email: "rh@nia.gov.in",
      lastActive: "Apr 12, 2024 12:34 PM",
      lastModified: "Apr 12, 2024 12:34 PM",
      status: "inactive"
    }
  ];
return(
<>
 <div className="data-table-container">
      <div className="top-header" style={{marginTop:'10px'}}>
        <div className="search-bar1">
          <div className="input-group">
            {/* <span className="input-group-text search-icon">
              <Search size={16} />
            </span> */}
            <input type="text" className="form-control" placeholder="Search" />
          </div>
        </div>
        <div className="header-icons">
          <button className="add-btn" onClick={togglePopup}>
            <Plus size={14} style={{ marginRight: "5px" }} />
            Add New User
          </button>
        </div>
      </div>

      <div className="data-table">
        <Table striped bordered hover variant="light">
          <thead>
            <tr>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  UserName
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Name
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Role
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Email
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Last Active
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Last Modified
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Status
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
              <th>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  Action
                  <span style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}>
                    <ArrowDropDown />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) =>
              <tr key={user.username} style={{ position: "relative" }}>
                <td>
                  {user.username}
                </td>
                <td>
                  {user.name}
                </td>
                <td>
                  {user.role}
                </td>
                <td>
                  {user.email}
                </td>
                <td>
                  {user.lastActive}
                </td>
                <td>
                  {user.lastModified}
                </td>
                <td>
                  <span
                    className={`status-badge ${user.status === "active"
                      ? "status-active"
                      : "status-inactive"}`}
                  >
                    {user.status === "active" ? "Active" : "Deactivate"}
                  </span>
                </td>
                <td
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    textAlign: "center"
                  }}
                >
                  {/* <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0px"
                      }}
                    >
                      <TbPassword />
                      <TbPassword />
                    </div>
                    <FaRegEye />
                    <FaRegCopy />
                  </div> */}
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
                        onClick={toggleDetails}
                        style={{ cursor: "pointer" }}
                      >
                        Details
                      </Dropdown.Item>
                      <Dropdown.Item onClick={toggleEditForm}>
                        Edit
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
    </div>
    {showAddForm && <CreateUser onClose={togglePopup} />}
      {showDetail && <UserDetails onClose={toggleDetails} />}
      {showEditForm && <EditUser onClose={() => setShowEditForm(false)} />}
    </>
    )
};

export default UserTable;
