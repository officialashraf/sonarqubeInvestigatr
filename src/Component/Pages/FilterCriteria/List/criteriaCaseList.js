import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';

const CriteriaCaseTable = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showPopupA, setShowPopupA] = useState(false);
  const [showPopupB, setShowPopupB] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Get the Redux state
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state.search);
  const payload = useSelector((state) => state.criteriaKeywords.queryPayload);
  const keywords = useSelector((state) => state.criteriaKeywords.keywords);
  
  // Get the token for API requests
  const Token = localStorage.getItem('token') || Cookies.get('token');
  
  // Fetch data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
  
      try {
        const token = Token;
  
        // Don't proceed if there are no keywords
        if (!keywords || keywords.length === 0) {
          setIsLoading(false);
          return;
        }
  
        // Determine if the current keywords match those in the payload
        let paginatedQuery;
        
        if (payload && payload.keyword) {
          // Check if current keywords match any part of the payload
          const keywordMatches = Array.isArray(keywords) && 
            keywords.every(kw => 
              (Array.isArray(payload.case_id) && payload.case_id.includes(kw)) ||
              (Array.isArray(payload.keyword) && payload.keyword.includes(kw)) ||
              (Array.isArray(payload.file_type) && payload.file_type.includes(kw))
            );
            
          if (keywordMatches) {
            // Use the full payload with the updated page number
            paginatedQuery = { ...payload, page: currentPage };
          } else {
            // Just use the keywords for search
            paginatedQuery = {
              keyword: keywords,
              page: currentPage
            };
          }
        } else {
          // If no payload exists, use simple keyword search
          paginatedQuery = {
            keyword: keywords,
            page: currentPage
          };
        }
  
        console.log("Sending query:", paginatedQuery);
  
        const response = await axios.post(
          'http://5.180.148.40:9006/api/das/search',
          paginatedQuery,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        console.log("Search response:", response.data);
  
        // Update the Redux store with the new search results
        dispatch(
          setSearchResults({
            results: response.data.results || [],
            total_pages: response.data.total_pages || 1,
            total_results: response.data.total_results || 0,
          })
        );
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    // Call the function to fetch data
    fetchPageData();
  }, [currentPage, dispatch, Token, keywords, payload]);
  
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
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      dispatch(setPage(pageNumber));
    }
  };

  // Create a function to render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Calculate which page numbers to show
    const pageItems = [];
    const maxPagesToShow = 5;
    
    // Always add first page
    pageItems.push(
      <Pagination.Item 
        key={1} 
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
        disabled={isLoading}
      >
        1
      </Pagination.Item>
    );
    
    // Add ellipsis if needed
    // if (currentPage > 3) {
    //   pageItems.push(<Pagination.Ellipsis key="ellipsis1" disabled />);
    // }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) { // Skip first and last as they're added separately
        pageItems.push(
          <Pagination.Item 
            key={i} 
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
            disabled={isLoading}
          >
            {i}
          </Pagination.Item>
        );
      }
    }
    
    // Add ellipsis if needed
    // if (currentPage < totalPages - 2) {
    //   pageItems.push(<Pagination.Ellipsis key="ellipsis2" disabled />);
    // }
    
    // Always add last page if different from first
    if (totalPages > 1) {
      pageItems.push(
        <Pagination.Item 
          key={totalPages} 
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
          disabled={isLoading}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination>
        <Pagination.First 
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || isLoading}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        />
        
        {pageItems}
        
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
        />
      </Pagination>
    );
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
                  <td colSpan={searchResults.length > 0 ? 
                    [...new Set(searchResults.flatMap(item => Object.keys(item)))].length : 1} 
                    className="text-center">
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
          {renderPagination()}
        </div>
        <div style={{ fontSize: "12px" }}>
          {isLoading ? 'Loading...' : `Page ${currentPage} of ${totalPages} / Total Results: ${totalResults}`}
        </div>
      </div>
    </>
  );
};

export default CriteriaCaseTable;