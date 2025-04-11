import React, { useState, useEffect, useCallback } from 'react';
import { Table, InputGroup, FormControl, Dropdown, DropdownButton, Badge, Pagination } from 'react-bootstrap';

import axios from 'axios';
import { ArrowDropDown, ArrowDropUp, Padding } from '@mui/icons-material';
import './table.css';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CaseDetails from '../../Case/caseDetails';
import EditCase from '../../Case/editCase';
import { useDispatch, useSelector } from 'react-redux';
import { setCaseData } from '../../../../Redux/Action/caseAction';
import { setPage } from '../../../../Redux/Action/criteriaAction';

const CriteriaCaseTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupA, setShowPopupA] = useState(false);
  const [showPopupB, setShowPopupB] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const searchResults = useSelector(state => state.search.searchResults);
  const currentPage = useSelector(state => state.search.currentPage);
  const {totalPages, totalResults} = useSelector(state => state.search);
  const itemsPerPage = 50;
  const savedResults = JSON.parse(localStorage.getItem('searchResults'))?.expiry > new Date().getTime() ? JSON.parse(localStorage.getItem('searchResults')).results : null;
  console.log("savedReasult", searchResults)
  const onFieldClick = (item) => {
    dispatch(setCaseData(item));
    const caseId = item.id // Set the case data in Redux store
    navigate(`/cases/${caseId}`); // Navigate to the new page
  };

  const fetchData = async () => {
    try {
      const Token = Cookies.get('accessToken');
      const response = await axios.get('http://5.180.148.40:9001/api/case-man/v1/case',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });
    
      setData(response.data.data);
      setFilteredData(response.data.data);
      console.log("data", response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

 useEffect(() => {
              fetchData()
              const handleDatabaseUpdate = () => {
                  fetchData()
              };
      
              window.addEventListener("databaseUpdated", handleDatabaseUpdate);
      
              return () => {
                  window.removeEventListener("databaseUpdated", handleDatabaseUpdate);
              };
          }, []);

  const confirmDelete = (id,title) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete {title} case?</p>
        <p>Warning: Deleting this case will unapply all filters</p>
        <button className='custom-confirm-button' onClick={() => { deleteCase(id,title); toast.dismiss(t.id); }}>Yes</button>
        <button className='custom-confirm-button' onClick={() => toast.dismiss(t.id)}>No</button> </div>),
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

  const deleteCase = async (id, title) => {
    //const caseId = parseInt(id.replace("CASE", ""), 10);
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }
    try {
      const authToken = Cookies.get('accessToken'); // Read the token from cookies 
      const response = await axios.delete(`http://5.180.148.40:9001/api/case-man/v1/case/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        });
        window.dispatchEvent(new Event("databaseUpdated"));
      toast(`Case ${title} Deleted Successfully`)
      console.log("Case Deleted:", response.data);

      // After successful deletion, fetch the updated data
      //fetchData(); // Optionally refresh data after deletion

    } catch (error) {
      toast("Error deleting case:", error)
      console.error("Error deleting case:", error);
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
        console.log("userss", user)
         } catch (error) { 
          console.error('There was an error usering the data!', error); 
        } };
      useEffect(() => {
      userData(); // Call the userData function
      }, []);


  // const handleStatusChange = (id, status) => {
  //   setFilteredData(filteredData.map(item => (item.id === id ? { ...item, status } : item)));
  // };

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
            const bValue = b[key]?? null;
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

 // Pagination logic remains the same
 const indexOfLastItem = currentPage * itemsPerPage;
 const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
   // Handle page change
   const handlePageChange = (pageNumber) => {
    dispatch(setPage(pageNumber));
  };
  return (
    <>
        <div className="data-table" style={{height:'320px', marginTop:'5px'}}>
          {/* <Table striped bordered hover variant="light"  >
            <thead>
              <tr>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    CaseId
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
              </tr>
            </thead>
            <tbody className='tb-1'>
            // {savedResults.length > 0 ? ( 
                //  savedResults.map((item, index) => ( 
                 {currentItems.length > 0 ? ( 
              currentItems.map((item, index) => (
                <tr key={item.id}>

                  <td onClick={() => onFieldClick(item)} style={{ cursor: 'pointer' }} >{item.unified_case_id}</td>
                  <td>{item.site_keywordsmatched || item.unified_activity_title}</td>
                  <td>{item.unified_capture_time.slice(0, 10)}</td>
                  <td>{item.socialmedia_from_screenname}</td>
                  <td>{item.assignee}</td>
                  <td>{item.watchers}</td>  
                  <td>{item.unified_date_only}</td>
                  <td disabled={true} >
                    <Badge pill bg="dark" className="badge-custom">
                      <span>{item.sentiment}</span>
                    </Badge>
                  </td>
                  <td className="d-flex justify-content-between align-items-center">
                    <span>{item.unified_activity_content
                    }</span>
                    

                  </td>
                </tr>
           
          ))) : (
            <div className="card-subtext"> No  Data Available</div>
          )}
           </tbody>
          </Table> */}
  <Table striped bordered hover>
  <thead>
    <tr>
      {/* Dynamically generate headers from all unique keys */}
      {currentItems.length > 0 && [...new Set(currentItems.flatMap(item => Object.keys(item)))]
        .map((key, index) => (
          <th key={index} className="fixed-th">
            {key.replace(/_/g, ' ').toUpperCase()} {/* Format headers */}
          </th>
        ))}
    </tr>
  </thead>
  <tbody>
    {currentItems.length > 0 ? (
      currentItems.map((item, rowIndex) => (
        <tr key={rowIndex}>
          {/* Dynamically generate table cells */}
          {[...new Set(currentItems.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
            <td key={colIndex} className="fixed-th">
              <div
                className="cell-content"
                style={{
                  cursor: 'pointer',
                  padding: "8px",
                  height: '37px',
                  fontFamily: 'sans-serif',
                  fontWeight: 'normal',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
              >
                {typeof item[key] === 'object' && item[key] !== null
                  ? JSON.stringify(item[key]) // Handle objects/arrays by converting to string
                  : item[key] || '-'} {/* Show '-' for missing keys */}
              </div>
            </td>
          ))}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={[...new Set(currentItems.flatMap(item => Object.keys(item)))].length} className="text-center">
          No Data Available
        </td>
      </tr>
    )}
  </tbody>
</Table>


        </div>
      <div className='d-flex justify-content-between mt-1'>
        <div style={{width:'300px', overflow:'auto'}}> 
        <Pagination> 
          {/* First Page */} 
          <Pagination.First  
            onClick={() => handlePageChange(1)}  
            disabled={currentPage === 1}  
          /> 
           
          {/* Previous Page */} 
          <Pagination.Prev  
            onClick={() => handlePageChange(currentPage - 1)}  
            disabled={currentPage === 1}  
          /> 
           
          {/* Page Numbers */} 
          {[...Array(totalPages)]
  .slice(0, 6) // Sirf 6 pages tak limit karna
  .map((_, index) => (
    <Pagination.Item
      key={index + 1}
      active={index + 1 === currentPage}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </Pagination.Item>
  ))}

          {/* Next Page */} 
          <Pagination.Next  
            onClick={() => handlePageChange(currentPage + 1)}  
            disabled={currentPage === totalPages}  
          /> 
           
          {/* Last Page */} 
          <Pagination.Last  
            onClick={() => handlePageChange(totalPages)}  
            disabled={currentPage === totalPages}  
          /> 
        </Pagination> 
        
      </div>
      <div style={{ fontSize: "12px"}}>
          Page {currentPage} - {itemsPerPage} / {totalResults}
        </div>
        </div>
      {showPopupB && <EditCase  item={selectedData} togglePopup={togglePopupB} />}
      {showPopupA && <CaseDetails item={selectedData} users={users} togglePopupA={togglePopupA} />}

    </>
  );
};

export default CriteriaCaseTable;
