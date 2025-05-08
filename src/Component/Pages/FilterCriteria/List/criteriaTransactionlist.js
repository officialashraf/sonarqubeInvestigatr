import React, { useState, useEffect, useCallback } from 'react';
import { Table, InputGroup, FormControl, Dropdown, DropdownButton, Badge } from 'react-bootstrap';

import axios from 'axios';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import './table.css';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CaseDetails from '../../Case/caseDetails';
import EditCase from '../../Case/editCase';
import { useDispatch } from 'react-redux';
import { setCaseData } from '../../../../Redux/Action/caseAction';

const CriteriaTransactionTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
 



  const onFieldClick = (item) => {
    dispatch(setCaseData(item));
    const caseId = item.id // Set the case data in Redux store
    navigate(`/cases/${caseId}`); // Navigate to the new page
  };

  const fetchData = async () => {
    try {
      const Token = Cookies.get('accessToken');
      const response = await axios.get('http://5.180.148.40:9000/api/case-man/v1/case',
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
  return (
    <>
      
       
        <div className="data-table" style={{height:'450px', marginTop:'5px'}}>
          <Table striped bordered hover variant="light"  >
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
                   Resource Name
                    <span onClick={() => handleSort('created_on')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'created_on' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   Datatype
                    <span onClick={() => handleSort('created_by')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'created_by' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  Activity Name
                    <span onClick={() => handleSort('assignee')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'assignee' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
                <th>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Target Time
                    <span onClick={() => handleSort('watchers')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                      {sortConfig.key === 'watchers' ? (
                        sortConfig.direction === 'asc' ? <ArrowDropUp /> : <ArrowDropDown />
                      ) : <ArrowDropDown />}
                    </span>
                  </div>
                </th>
               
              </tr>
            </thead>
            <tbody className='tb-1'>
              {filteredData && filteredData.map((item, index) => (
                <tr key={item.id} >

                  <td onClick={() => onFieldClick(item)} style={{ cursor: 'pointer' }} >{`CASE${String(item.id).padStart(4, '0')}`}</td>
                  <td>{item.title}</td>
                  <td></td>
                  <td>{item.created_on.slice(0, 12)}</td>
                  <td>{item.assignee}</td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
     
     

    </>
  );
};

export default CriteriaTransactionTable;
