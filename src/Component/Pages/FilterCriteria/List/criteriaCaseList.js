// import React, { useState, useEffect, useMemo } from 'react';
// import { Table, Pagination, Spinner } from 'react-bootstrap';
// import { shallowEqual, useDispatch, useSelector } from 'react-redux';
// import { setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const CriteriaCaseTable = ({ searchChips }) => {
//   const dispatch = useDispatch();
//   const [isLoading, setIsLoading] = useState(true);
//   const [showPopupA, setShowPopupA] = useState(false);
//   const [showPopupB, setShowPopupB] = useState(false);
//   const [selectedData, setSelectedData] = useState(null);

//   // Get the Redux state
//   const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state.search);
//   const itemsPerPage = 50;
//   const keywords = useSelector((state) => state.criteriaKeywords.keyword);

//   const payload = useSelector((state) => state.criteriaKeywords.queryPayload);
//   console.log("payload", payload)
//   console.log("SearchChips", searchChips)
//   // Get the token for API requests
//   const Token = localStorage.getItem('acessToken') || Cookies.get('acessToken');
  
  

  
  
//     const normalizedPayload = useMemo(() => ({
//       keyword: payload?.keyword?.map((v) => v?.toString().toLowerCase().trim()) || [],
//       case_id: payload?.case_id?.map((v) => Number(v)) || [],
//       file_type: payload?.file_type?.map((v) => v?.toString().toLowerCase().trim()) || [],
//     }), [payload]);
  
//     const normalizedChips = useMemo(() => {
//       const fileTypeKeywords = ['instagram', 'twitter', 'facebook', 'vk', 'youtube', 'linkedin', 'tiktok'];
//       const tempCaseId = [];
//       const tempFileType = [];
//       const tempKeywords = [];
  
//       searchChips?.forEach((item) => {
//         const val = item?.toString().toLowerCase().trim();
//         if (!val) return;
//         if (!isNaN(val)) {
//           tempCaseId.push(Number(val));
//         } else if (fileTypeKeywords.includes(val)) {
//           tempFileType.push(val);
//         } else {
//           tempKeywords.push(val);
//         }
//       });
  
//       return {
//         keyword: tempKeywords,
//         case_id: tempCaseId,
//         file_type: tempFileType,
//       };
//     }, [searchChips]);
  
//     const isMatchingQuery = useMemo(() => {
//       const isEqual = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
  
//       return (
//         isEqual(normalizedPayload.keyword, normalizedChips.keyword) &&
//         isEqual(normalizedPayload.case_id, normalizedChips.case_id) &&
//         isEqual(normalizedPayload.file_type, normalizedChips.file_type)
//       );
//     }, [normalizedPayload, normalizedChips]);
  
//     useEffect(() => {
//       const fetchPageData = async () => {
//         setIsLoading(true);
//         try {
//           const token = Token;
  
//           let paginatedQuery;
//           if (isMatchingQuery) {
//             paginatedQuery = { ...payload, page: currentPage };
//           } else {
//             paginatedQuery = {
//               keyword: searchChips.map((chip) => chip?.toString().toLowerCase().trim()),
//               case_id: [],
//               file_type: [],
//               page: currentPage,
//             };
//           }
//   console.log("paginatedQuery", paginatedQuery)
//           const response = await axios.post(
//             'http://5.180.148.40:9006/api/das/search',
//             paginatedQuery,
//             {
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${Token}`,
//               },
//             }
//           );
//   console.log("searchQ",response)
//           dispatch(
//             setSearchResults({
//               results: response.data.results,
//               total_pages: response.data.total_pages || 1,
//               total_results: response.data.total_results || 0,
//             })
//           );
  
//           dispatch(setKeywords({ queryPayload: response.data.input }));
//         } catch (err) {
//           console.error('Fetch error:', err);
//         } finally {
//           setIsLoading(false);
//         }
//       };
  
//       fetchPageData();
//     }, [currentPage]); // Only track what’s necessary!
  
  

//   const togglePopupB = (item) => {
//     setShowPopupB((prev) => !prev);
//     setSelectedData(item);
//   };
  
//   const togglePopupA = (item) => {
//     setShowPopupA((prev) => !prev);
//     setSelectedData(item);
//   };

//   // Handle page change
//   const handlePageChange = (pageNumber) => {
//     dispatch(setPage(pageNumber));
//   };
  
//   // Get unique headers from search results
//   const getUniqueHeaders = () => {
//     if (!searchResults || searchResults.length === 0) {
//       return [];
//     }
//     return [...new Set(searchResults.flatMap(item => Object.keys(item)))];
//   };
  
//   const uniqueHeaders = getUniqueHeaders();
  
//   return (
//     <>
//       <div className="data-table" style={{ height: '420px', marginTop: '0px' }}>
//         {isLoading ? (
//           <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
//             <Spinner animation="border" role="status" variant="primary">
//               <span className="visually-hidden">Loading...</span>
//             </Spinner>
//             <span className="ms-2">Loading data...</span>
//           </div>
//         ) : (
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 {uniqueHeaders.map((key, index) => (
//                   <th key={index} className="fixed-th">
//                     {key.replace(/_/g, ' ').toUpperCase()}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {searchResults && searchResults.length > 0 ? (
//                 searchResults.map((item, rowIndex) => (
//                   <tr key={rowIndex}>
//                     {uniqueHeaders.map((key, colIndex) => (
//                       <td key={colIndex} className="fixed-th">
//                         <div
//                           className="cell-content"
//                           style={{
//                             cursor: 'pointer',
//                             padding: "8px",
//                             height: '37px',
//                             fontFamily: 'sans-serif',
//                             fontWeight: 'normal',
//                             overflow: 'hidden',
//                             textOverflow: 'ellipsis',
//                             whiteSpace: 'nowrap',
//                           }}
//                           title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
//                           onClick={() => togglePopupA(item)}
//                         >
//                           {typeof item[key] === 'object' && item[key] !== null
//                             ? JSON.stringify(item[key])
//                             : item[key] || '-'}
//                         </div>
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={uniqueHeaders.length || 1} className="text-center">
//                     No Data Available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         )}
//       </div>
      
//       <div className='d-flex justify-content-between mt-1'>
//         <div style={{ width: '300px', overflow: 'auto' }}>
//           <Pagination>
//             <Pagination.Prev
//               onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
//               disabled={currentPage === 1 || isLoading}
//             />

//             {Array.from({ length: totalPages }, (_, i) => i + 1)
//               .filter(
//                 (page) =>
//                   page === 1 ||
//                   page === totalPages ||
//                   (page >= currentPage - 2 && page <= currentPage + 2)
//               )
//               .map((page) => (
//                 <Pagination.Item
//                   key={page}
//                   active={page === currentPage}
//                   onClick={() => handlePageChange(page)}
//                   disabled={isLoading}
//                 >
//                   {page}
//                 </Pagination.Item>
//               ))}

//             <Pagination.Next
//               onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
//               disabled={currentPage === totalPages || isLoading}
//             />

//             <Pagination.Last
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages || isLoading}
//             />
//           </Pagination>
//         </div>
//         <div style={{ fontSize: "12px" }}>
//           {isLoading ? 'Loading...' : `Page ${currentPage} of ${totalPages} / Total: ${totalResults} results`}
//         </div>
//       </div>
//     </>
//   );
// };

// export default CriteriaCaseTable;


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Table, Pagination, Spinner } from 'react-bootstrap';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setKeywords, setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import isEqual from 'lodash/isEqual'; // Using lodash for deep comparison

const CriteriaCaseTable = ({ searchChips }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showPopupA, setShowPopupA] = useState(false);
  const [showPopupB, setShowPopupB] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Get Redux state
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state.search);
  const itemsPerPage = 50;
  const keywords = useSelector((state) => state.criteriaKeywords.keyword);
  const payload = useSelector((state) => state.criteriaKeywords.queryPayload);
  const Token = localStorage.getItem('acessToken') || Cookies.get('acessToken');

  // Memoize normalized payload and chips
  const normalizedPayload = useMemo(() => ({
    keyword: payload?.keyword?.map((v) => v?.toString().toLowerCase().trim()) || [],
    case_id: payload?.case_id?.map((v) => Number(v)) || [],
    file_type: payload?.file_type?.map((v) => v?.toString().toLowerCase().trim()) || [],
  }), [payload]);

  const normalizedChips = useMemo(() => {
    const fileTypeKeywords = ['instagram', 'twitter', 'facebook', 'vk', 'youtube', 'linkedin', 'tiktok'];
    const tempCaseId = [];
    const tempFileType = [];
    const tempKeywords = [];

    searchChips?.forEach((item) => {
      const val = item?.toString().toLowerCase().trim();
      if (!val) return;
      if (!isNaN(val)) {
        tempCaseId.push(Number(val));
      } else if (fileTypeKeywords.includes(val)) {
        tempFileType.push(val);
      } else {
        tempKeywords.push(val);
      }
    });

    return { keyword: tempKeywords, case_id: tempCaseId, file_type: tempFileType };
  }, [searchChips]);

  // Deep comparison to check if payload matches chips
  const isMatchingQuery = useMemo(() => 
    isEqual(normalizedPayload, normalizedChips),
  [normalizedPayload, normalizedChips]);

  // Track previous search criteria
  const prevSearchCriteria = useRef({ normalizedChips, currentPage });

  useEffect(() => {
    const fetchPageData = async () => {
      // Check if criteria or page changed
      const isCriteriaChanged = !isEqual(prevSearchCriteria.current.normalizedChips, normalizedChips);
      const isPageChanged = prevSearchCriteria.current.currentPage !== currentPage;

      if (!isCriteriaChanged && !isPageChanged) return;

      setIsLoading(true);
      try {
        let query;
        if (isMatchingQuery) {
          query = { ...payload, page: currentPage };
        } else {
          // Use search chips and reset to page 1
          if (currentPage !== 1) dispatch(setPage(1));
          query = {
            keyword: normalizedChips.keyword,
            case_id: normalizedChips.case_id,
            file_type: normalizedChips.file_type,
            page: 1,
          };
        }

        const response = await axios.post(
          'http://5.180.148.40:9006/api/das/search',
          query,
          { headers: { Authorization: `Bearer ${Token}` } }
        );

        dispatch(setSearchResults({
          results: response.data.results,
          total_pages: response.data.total_pages || 1,
          total_results: response.data.total_results || 0,
        }));

        // Update Redux payload only if using search chips
        if (!isMatchingQuery) {
          dispatch(setKeywords({ 
            queryPayload: {
              keyword: normalizedChips.keyword,
              case_id: normalizedChips.case_id,
              file_type: normalizedChips.file_type,
            }
          }));
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
        prevSearchCriteria.current = { normalizedChips, currentPage };
      }
    };

    fetchPageData();
  }, [currentPage, normalizedChips, isMatchingQuery, dispatch, Token, payload]);

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
      
      // Get unique headers from search results
      const getUniqueHeaders = () => {
        if (!searchResults || searchResults.length === 0) {
          return [];
        }
        return [...new Set(searchResults.flatMap(item => Object.keys(item)))];
      };
      
      const uniqueHeaders = getUniqueHeaders();
      
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
                    {uniqueHeaders.map((key, index) => (
                      <th key={index} className="fixed-th">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {searchResults && searchResults.length > 0 ? (
                    searchResults.map((item, rowIndex) => (
                      <tr key={rowIndex}>
                        {uniqueHeaders.map((key, colIndex) => (
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
                                ? JSON.stringify(item[key])
                                : item[key] || '-'}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={uniqueHeaders.length || 1} className="text-center">
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
                <Pagination.Prev
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                />
    
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 2 && page <= currentPage + 2)
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
    
                <Pagination.Next
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                />
    
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || isLoading}
                />
              </Pagination>
            </div>
            <div style={{ fontSize: "12px" }}>
              {isLoading ? 'Loading...' : `Page ${currentPage} of ${totalPages} / Total: ${totalResults} results`}
            </div>
          </div>
        </>
      );
    };
export default CriteriaCaseTable;