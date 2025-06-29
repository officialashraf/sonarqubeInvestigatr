import React from 'react'
import "../Case/table.css"
import { Col } from 'react-bootstrap'
import { FaArrowLeft } from 'react-icons/fa'
import { Plus } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from "../Layout/loader.js"
import { toast } from 'react-toastify';
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Table } from 'react-bootstrap';
import {
  InputGroup,
  FormControl,
  Badge,
  Button,
} from "react-bootstrap";
import { FiMoreVertical } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import Dropdown from 'react-bootstrap/Dropdown';
import CreateConnection from './CreateConnection.js';
import EditConnection from './EditConnection.js';
import ConnectionDetails from './ConnectionDetails.js';
import styles from "../../Common/Table/table.module.css"
import TableModal from '../../Common/Table/table.js';

const ConnectionManagement = () => {
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupE, setShowPopupE] = useState(false);
  const [showPopupD, setShowPopupD] = useState(false);
  const [details, setDetails] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const fetchConnection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CONNECTION}/api/case-man/v1/connection`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },

      });
      console.log("API Response:", response);
      setData(response.data);
      setFilteredData(response.data);

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
  console.log("serrr", filteredData)
  useEffect(() => {
    const tri = fetchConnection();
    console.log("okk", tri)
    const handleDatabaseUpdated = () => {
      fetchConnection();
    };

    window.addEventListener("databaseUpdated", handleDatabaseUpdated);
    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
    };
  }, [])


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

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const togglePopupE = (details) => {
    setDetails(details);
    setShowPopupE(prev => !prev);
  };

  const togglePopupD = (details) => {
    setDetails(details);
    setShowPopupD(prev => !prev);
  };

  const confirmDelete = (id, name) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete {name} connection?</p>
        <button className='custom-confirm-button' onClick={() => { deleteConnection(id, name); toast.dismiss(t.id); }} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }}>Yes</button>
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

  const deleteConnection = async (id, name) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }
    try {

      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_CONNECTION}/api/case-man/v1/connection/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      // window.dispatchEvent(new Event("databaseUpdated"));
      toast.success(`Connection ${name} deleted successfully`)
      console.log("Connection deleted:", response.data);

      // After successful deletion, fetch the updated data
      fetchConnection(); // Optionally refresh data after deletion

    } catch (err) {
      // Error handling based on the type of error
      console.error('Error during deleteConnection:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
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

  if (loading) {
    return <Loader />
  }

  const connectionColumns = [
    { key: "name", label: "Connection Name" },
    { key: "connection_type", label: "Connection Type" },
    { key: "created_by", label: "Created By" },
    { key: "created_on", label: "Created On" },
    { key: "modified_on", label: "Edited On" },
    { key: "modified_by", label: "Edited By" },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      {data && data.length > 0 ? (
        <div className={styles.container}>
          <div className={styles.header} style={{ marginTop: "10px" }}>
            <Col
              xs={1}
              className="d-flex align-items-center justify-content-flex-start"
              style={{ width: "350px", minWidth: '350px' }}
            >
              <FaArrowLeft
                style={{
                  cursor: "pointer", margin: '0px 40px 0px 38px',
                  fontSize: '16px'
                }}
                onClick={() => navigate("/Cases")}
              />
              <div className={styles.searchBar} style={{ width: "100%" }}>
                <div className="input-group">
                  <input
                    type="text"
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
                Add New Connection
              </button>
            </div>
          </div>
          <div className={styles.tableWrapper} style={{ minHeight: isDropdownOpen ? "200px" : "auto" }}>
            <TableModal
              columns={connectionColumns}
              data={filteredData}
              idPrefix="CON"
              btnTitle="+ Add New Connection"
              // onAdd={togglePopup}
              onRowAction={{
                edit: (row) => togglePopupE(row),
                delete: (row) => confirmDelete(row.id, row.name),
                details: (row) => togglePopupD(row),
              }}
              enableRowClick={false}
            />
          </div>
        </div>
      ) : (
        <div className={styles.container} style={{ border: 'none' }}>
          <h3 className="title">Let's Get Started!</h3>
          <p className="content">Add connections to get started</p>
          <button className='add-btn' title='Add New Connection' onClick={togglePopup}><Plus size={20} />Add New Connection</button>
        </div>
      )}
      {showPopup && <CreateConnection togglePopup={togglePopup} />}
      {showPopupE && <EditConnection togglePopup={togglePopupE} id={details.id} />}
      {showPopupD && <ConnectionDetails togglePopup={togglePopupD} id={details.id} />}
    </>
  );
};

export default ConnectionManagement;
