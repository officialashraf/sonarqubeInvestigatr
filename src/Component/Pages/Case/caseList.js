import { useState, useEffect } from 'react';
import { Table, InputGroup, FormControl, Dropdown, Badge, Button } from 'react-bootstrap';
import { Search, Plus, FileEarmarkPlus } from 'react-bootstrap-icons';
import axios from 'axios';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import './table.css';
import CreateCase from '../Case/createCase';
import Cookies from "js-cookie";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CaseDetails from './caseDetails';
import EditCase from './editCase';
import { useDispatch } from 'react-redux';
import { setCaseData } from '../../../Redux/Action/caseAction';
import Loader from '../Layout/loader';
import { SET_PAGINATION } from '../../../Redux/Constants/filterConstant';

const DataTable = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupA, setShowPopupA] = useState(false);
  const [showPopupB, setShowPopupB] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);


  const onFieldClick = (item) => {
    dispatch(setCaseData(item));
    const caseId = item.id // Set the case data in Redux store
    navigate(`/cases/${caseId}`); // Navigate to the new page
  };

  useEffect(() => {
    if (location.pathname === "/cases") {
      dispatch({
        type: SET_PAGINATION,
        payload: { page: 1 } // Explicitly set page to 1
      });
    }
  }, [location.pathname, dispatch]);

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      const Token = Cookies.get('accessToken');
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });
      console.log("API Response:", response.data);

      setData(response.data.data);
      setFilteredData(response.data.data);
      console.log("data", response.data)
    } catch (error) {
      toast.error(error.response?.data?.detail || "Error fetching case data");
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCaseData()
    const handleDatabaseUpdate = () => {
      fetchCaseData()
    };

    window.addEventListener("databaseUpdated", handleDatabaseUpdate);

    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
    };
  }, []);

  const confirmDelete = (id, title) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete {title} case?</p>
        <p>Warning: Deleting this case will unapply all filters</p>
        <button className='custom-confirm-button' onClick={() => { deleteCase(id, title); toast.dismiss(t.id); }} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }}>Yes</button>
        <button className='custom-confirm-button' onClick={() => toast.dismiss(t.id)} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }}>No</button> </div>),
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

  const deleteCase = async (id, title) => {
    //const caseId = parseInt(id.replace("CASE", ""), 10);
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }
    try {
      const authToken = Cookies.get('accessToken'); // Read the token from cookies 
      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
      window.dispatchEvent(new Event("databaseUpdated"));
      toast(`Case ${title} Deleted Successfully`)
      console.log("Case Deleted:", response.data);

    } catch (error) {
      toast("Error deleting case:", error)
      console.error("Error deleting case:", error);
    }
  };

  const getUserData = async () => {
    const token = Cookies.get("accessToken");
    try {
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_USER_MAN}/api/user-man/v1/user`
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
    }
  };
  useEffect(() => {
    getUserData(); // Call the getUserData function
  }, []);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);


    const filtered = data.filter((item) => {
      return Object.values(item).some((value) => {
        if (value !== null && value !== undefined) {
          // Convert the value to a string and check if it includes the search value
          return value.toString().toLowerCase().includes(searchValue.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };
  const togglePopup = () => {

    setShowPopup((prev) => !prev);
  };
  const togglePopupB = (item) => {

    setShowPopupB((prev) => !prev);
    setSelectedData(item)
  };
  const togglePopupA = (item) => {
    setShowPopupA((prev) => !prev);
    setSelectedData(item)
  };


  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (typeof a[key] === 'number' && typeof b[key] === 'number') {
        return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
      } else {
        const aValue = a[key] ?? null;
        const bValue = b[key] ?? null;
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;
        if (aValue < bValue) {
          return direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    setFilteredData(sortedData);
  };
  if (loading) {
    return <Loader />
  }


  return (
<>{filteredData && filteredData.length> 0 ?
  (
          <div className="data-table-container"style={{border:'none'}}>
        <div className="top-header">
          <InputGroup className="search-bar1">
            <InputGroup.Text className="search-icon"><Search /></InputGroup.Text>
            <FormControl
              placeholder="Search case"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </InputGroup>

          <div className="header-icons">
            <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Case</button>
          </div>
        </div>
        <div className="data-table">
          <Table striped bordered hover variant="light"  >
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Case ID
                    <span onClick={() => handleSort('id')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'id' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Title
                    <span onClick={() => handleSort('title')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'title' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Description
                    <span onClick={() => handleSort('description')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'description' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Created On
                    <span onClick={() => handleSort('created_on')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'created_on' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Created By
                    <span onClick={() => handleSort('created_by')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'created_by' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Assignee
                    <span onClick={() => handleSort('assignee')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'assignee' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Watchers
                    <span onClick={() => handleSort('watchers')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'watchers' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Modified On
                    <span onClick={() => handleSort('modified_on')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'modified_on' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th className="sticky-column">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Status
                    <span onClick={() => handleSort('status')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'status' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className='tb-1'>
              {filteredData && filteredData.map((item, index) => (
                <tr key={item.id}  >

                  <td>
                    <a
                    title='Click here'
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Prevents page navigation
                        onFieldClick(item);
                      }}
                      style={{ textDecoration: "underline",borderBottom:'1px solid blue', color: "blue", cursor: "pointer" }} // Link styling
                    >
                      {`CASE${String(item.id).padStart(4, "0")}`}
                    </a>
                  </td>

                  <td>{item.title}</td>
                  <td>{item.description}</td>
                  <td>{item.created_on.slice(0, 10)}</td>
                  <td>{item.created_by}</td>
                  <td>{item.assignee}</td>

                  <td>
                    {Array.isArray(item.watchers)
                      ? item.watchers.join(', ')
                      : typeof item.watchers === 'string'
                        ? item.watchers.split(',').map(w => w.trim()).join(', ')
                        : ''}
                  </td>

                  <td>{item.modified_on}</td>
                  <td className="d-flex justify-content-between align-items-center" disabled={true}>
                    <Badge pill bg="dark" className="badge-custom">
                      <span>{item.status}</span>
                    </Badge>
                    <span> <Dropdown>
                      <Dropdown.Toggle className="custom-dropdown-toggle custom-btn"> ⋮ </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-dropdown-menu">
                        <Dropdown.Item onClick={() => { togglePopupA(item) }} style={{ cursor: "pointer" }}>Details</Dropdown.Item>
                        <Dropdown.Item onClick={() => { togglePopupB(item) }} >Edit</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => confirmDelete(item.id, item.title)}
                        >Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </span>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    ): (
      <div className="resourcesContainer"style={{border:'none'}}>
        <h3 className="title">Let's Get Started!</h3>
        <p className="content">Add cases to get started</p>
      <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Case</button>
      </div>
    )
}
      {showPopup && <CreateCase togglePopup={togglePopup} />}
      {showPopupB && <EditCase item={selectedData} togglePopup={togglePopupB} />}
      {showPopupA && <CaseDetails item={selectedData} users={users} togglePopupA={togglePopupA} />}
     
    </>
  );
};

export default DataTable;

