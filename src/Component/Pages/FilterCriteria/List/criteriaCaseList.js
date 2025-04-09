import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';

const CriteriaCaseTable = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopupA, setShowPopupA] = useState(false);
  const [showPopupB, setShowPopupB] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Get the Redux state
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state.search);
  console.log("search......",searchResults)
  const itemsPerPage = 50;
  const keywords = useSelector((state) => state.criteriaKeywords.keywords);
  
  console.log("Keywords from Redux:", keywords);
  // Get the token for API requests
  const Token = localStorage.getItem('token') || Cookies.get('token');
  
  // Fetch data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      
      try {
        // Get the current query parameters from localStorage
        const keyword = keywords
        
        if (!keyword) {
          setIsLoading(false);
          return;
        }
        
        // Add pagination parameters to the query
        const paginatedQuery = {
          keyword:keyword,
          page: currentPage,
        };
        console.log("pagination", paginatedQuery)
        const response = await axios.post('http://5.180.148.40:9006/api/das/search', 
          paginatedQuery
        , {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        });
        
        console.log("rsponsePaginated", response)
        // Update Redux store with the new page of results
        dispatch(setSearchResults({
            results: response.data.results,
            total_pages: response.data.total_pages || 1,
            total_results: response.data.total_results || 0,
        }));
        
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPageData();
  }, [currentPage, dispatch, Token]);

  const togglePopupB = (item) => {
    setShowPopupB((prev) => !prev);
    setSelectedData(item);
  };
  
  const togglePopupA = (item) => {
    setShowPopupA((prev) => !prev);
    setSelectedData(item);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    dispatch(setPage(pageNumber));
  };
  
  return (
    <>
      <div className="data-table" style={{ height: '420px', marginTop: '0px' }}>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <span className="ms-2">Loading data...</span>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                {/* Dynamically generate headers from all unique keys */}
                {searchResults.length > 0 && [...new Set(searchResults.flatMap(item => Object.keys(item)))]
                  .map((key, index) => (
                    <th key={index} className="fixed-th">
                      {key.replace(/_/g, ' ').toUpperCase()} {/* Format headers */}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.length > 0 ? (
                searchResults.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {/* Dynamically generate table cells */}
                    {[...new Set(searchResults.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
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
                          onClick={() => togglePopupA(item)}
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
                  <td colSpan={[...new Set(searchResults.flatMap(item => Object.keys(item)))].length || 1} className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
      
      <div className='d-flex justify-content-between mt-1'>
        <div style={{ width: '300px', overflow: 'auto' }}>
          

<Pagination>
  {/* Previous Page */}
  <Pagination.Prev
    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))} // Ensure it doesn't go below 1
    disabled={currentPage === 1 || isLoading}
  />

  {/* Dynamic Page Numbers */}
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(
      (page) =>
        page === 1 || // Always show the first page
        page === totalPages || // Always show the last page
        (page >= currentPage - 2 && page <= currentPage + 2) // Show 2 pages before and after the current page
    )
    .map((page) => (
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
        disabled={isLoading}
      >
        {page}
      </Pagination.Item>
    ))}

  {/* Next Page */}
  <Pagination.Next
    onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))} // Ensure it doesn't exceed totalPages
    disabled={currentPage === totalPages || isLoading}
  />

  {/* Last Page */}
  <Pagination.Last
    onClick={() => handlePageChange(totalPages)}
    disabled={currentPage === totalPages || isLoading}
  />
</Pagination>

        </div>
        <div style={{ fontSize: "12px" }}>
          {isLoading ? 'Loading...' : `Page ${currentPage} - ${totalPages} / ${totalResults}`}
        </div>
      </div>
    </>
  );
};

export default CriteriaCaseTable;
