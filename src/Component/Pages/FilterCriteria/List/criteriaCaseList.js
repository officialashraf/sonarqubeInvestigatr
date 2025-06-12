import { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../../Layout/loader';

const CriteriaCaseTable = () => {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state?.search || '');
  const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  const keywords = useSelector((state) => state.criteriaKeywords?.keywords || '');
  // const [isLoading, setIsLoading] = useState(true);
  // console.log("setisloading",setIsLoading)
  const [loading, setLoading] = useState(false);

  // Fetch data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

      try {
        // Don't proceed if there are no keywords
        if (!keywords || keywords.length === 0) {
          setLoading(false);
          return;
        }

        // Determine if the current keywords match those in the payload
        let paginatedQuery;

        if (payload) {
          paginatedQuery = { ...payload, page: currentPage };
        }
        console.log("Sending queryQWQ:", paginatedQuery);

        const response = await axios.post(
          `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
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
        setLoading(false);
      }
    };

    // Call the function to fetch data
    fetchPageData();
  }, [currentPage, dispatch, token, keywords, payload]);

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

    // Always add first page
    pageItems.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
        disabled={loading}
      >
        1
      </Pagination.Item>
    );


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
            disabled={loading}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Always add last page if different from first
    if (totalPages > 1) {
      pageItems.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || loading}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        />

        {pageItems}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
        />
      </Pagination>
    );
  };

  if (loading) {
    <Loader />
  }

  return (
    <>
      <div className="tabs">
        <div
          className={`tab active`} // "Cases" will always be active
        // onClick={() => setActiveTab('Cases')}
        >
          Cases ({totalResults || "no results"})
        </div>

      </div>
      <div className="data-table" style={{ maxheight: '75vh', marginTop: '0px' }}>

        {loading ? (
          <div>
            <Loader />
          </div>
        ) : (
          <Table striped bordered hover variant='light'>
            <thead >
              <tr>
                {/* Dynamically generate headers from all unique keys */}
                {searchResults.length > 0 && [...new Set(searchResults.flatMap(item => Object.keys(item)))]
                  .map((key, index) => (
                    <th key={index} className="fixed-th">
                      {key
                        .split("_") // Split by underscores
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                        .join(" ") // Rejoin words with space
                      }
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
                      <td key={colIndex} className="fixed-td">
                        <div
                          className="cell-content"
                          style={{
                            cursor: 'pointer',
                            // padding: "0px 0px 0px 5px",
                            // height: '37px',
                            // fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                            overflow: 'hidden',
                            //  textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            //  vertical- align: middle;
                            padding: '0px 5px 0px 5px',
                            fontSize: '12px',
                            fontFamily: 'Helvetica'
                          }}
                          title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
                        // onClick={() => togglePopupA(item)}
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
                    No data available
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

        <div style={{ fontSize: "12px", marginRight: '5px' }}>
          {loading ? 'Loading...' : `Page ${currentPage} of ${totalPages} / Total Results: ${totalResults}`}
        </div>
      </div>
    </>
  );
};

export default CriteriaCaseTable;