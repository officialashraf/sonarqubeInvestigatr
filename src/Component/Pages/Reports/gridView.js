import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import "../Analyze/TabularData/caseTableData.css";
import { useSelector, useDispatch } from "react-redux";
import "../Layout/pagination.css";
import {
  fetchSummaryData,
} from "../../../Redux/Action/filterAction";
import Loader from "../Layout/loader";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Col } from "react-bootstrap";
import axios from 'axios';
import Cookies from 'js-cookie';

const GridView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Token = Cookies.get('accessToken');
  
  const data1 = useSelector((state) => state.caseData.caseData);
  const {
    results,
    headers,
    page,
    total_pages,
    total_results,
    error,
    loading: reportLoading,
  } = useSelector((state) => state.report);
  
  const data = results || [];
  const totalPages = total_pages || 0;
  const totalResults = total_results || 0;

  // Local state
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [loading, setLoading] = useState(false); // Initialize as false to prevent loader at first load
  const [dataAvailable, setDataAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load
  
  const itemsPerPage = 50;

  // Fetch report data function
  const fetchReportData = async () => {
    try {
      // Show loading indicator
      setLoading(true);
      
      const response2 = await axios.post(
        'http://5.180.148.40:9002/api/osint-man/v1/report',
        { rows: results },
        {
          responseType: 'blob',
          headers: {
            Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            Authorization: `Bearer ${Token}`,
          },
        }
      );

      // Save the file using file picker
      // const fileHandle = await window.showSaveFilePicker({
      //   suggestedName: "social_media_report.docx",
      //   types: [
      //     {
      //       description: "Word Document",
      //       accept: {
      //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      //       },
      //     },
      //   ],
      // });

      // const writable = await fileHandle.createWritable();
      // await writable.write(response2.data);
      // await writable.close();
         const blob = await response2.data
    const url = window.URL.createObjectURL(blob);
if ('showSaveFilePicker' in window && window.isSecureContext) {
      // Use the new API
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'social_media_report.docx',
        types: [{
          description: 'Word Document',
          accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
          }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    } else {
      // Fallback for HTTP or unsupported browsers
      const link = document.createElement("a");
      link.href = url;
      link.download = "document.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);}
      console.log("Report saved successfully!");
    } catch (error) {
      console.error("Error downloading or saving .docx file:", error);
    } finally {
      // Hide loading indicator
      setLoading(false);
    }
  };

  // Handle data changes
  useEffect(() => {
    // Update loading state based on the redux state, but not for initial load
    if (!isInitialLoad) {
      setLoading(reportLoading);
    }
    
    // Check if data is available
    if (Array.isArray(data) && data.length > 0) {
      setDataAvailable(true);
    } else {
      setDataAvailable(false);
    }
    
    // After first data processing, mark initial load as complete
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [data, reportLoading, isInitialLoad]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true); // Set loading to true only during pagination
    dispatch(fetchSummaryData({
      queryPayload: { unified_case_id: data1?.id },
      page: page,
      itemsPerPage: 50
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // You can implement search functionality here
  };

  // Calculate pagination
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 1) {
      pages.push(i);
    } else if (
      (i === 2 && currentPage > 4) ||
      (i === totalPages - 1 && currentPage < totalPages - 3)
    ) {
      pages.push("...");
    }
  }

  // Render loading state - only if it's not the initial load
  if (loading && !isInitialLoad) {
    return <Loader />;
  }

  // Render error state
  if (error) {
    return (
      <div className="error-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        <h3>Error Loading Data</h3>
        <p>{error.message || "An unexpected error occurred while fetching data."}</p>
        <button 
          onClick={() => {
            setLoading(true);
            fetchReportData();
          }}
          className="btn btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="top-header" style={{ marginTop: "10px" }}>
        <Col xs={1} className="d-flex align-items-center justify-content-flex-start" style={{ width: "20%" }}>
          <FaArrowLeft
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => navigate('/dashboard')}
          />
          <div className="search-bar1" style={{ width: '100%' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </Col>
      </div>
      
      <div
        className="case-t"
        style={{ overflowY: "auto", height: "450px", fontSize: "10px" }}
      >
        {!dataAvailable ? (
          <div className="no-data-message" style={{ textAlign: 'center', padding: '50px' }}>
            <h4>No Data Available</h4>
            <p>There are no records to display.</p>
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                {data.length > 0 && [...new Set(data.flatMap(item => Object.keys(item)))]
                  .map((key, index) => (
                    <th key={index} className="fixed-th">
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {[...new Set(data.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
                      <td key={colIndex} className="fixed-td">
                        <div
                          className="cell-content"
                          style={{
                            cursor: 'pointer',
                            padding: "2px",
                            height: '17px',
                            fontFamily: 'sans-serif',
                            fontWeight: 'normal',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
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
                  <td colSpan={data.length > 0 ? 
                    [...new Set(data.flatMap(item => Object.keys(item)))].length : 1} 
                    className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      {dataAvailable && (
        <div className="paginationstabs"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pagination style={{ width: "200px" }}>
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

            {pages.map((number, index) => {
              if (
                number === 1 ||
                number === totalPages ||
                number === currentPage ||
                number === currentPage - 1 ||
                number === currentPage + 1
              ) {
                return (
                  <Pagination.Item
                    key={index}
                    active={number === currentPage}
                    onClick={() => number !== "..." && handlePageChange(number)}
                  >
                    {number}
                  </Pagination.Item>
                );
              } else if (number === "...") {
                return <Pagination.Item key={index} disabled>{number}</Pagination.Item>;
              }
              return null;
            })}

            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>

          <div style={{ fontSize: "12px", marginRight: "10px" }}>
            Page {currentPage} - {itemsPerPage} / {totalResults}
          </div>
          
          <button  
            style={{backgroundColor:"black", color:'white', borderRadius:'5px'}}
            onClick={fetchReportData}
            disabled={loading}
          >
            {loading ? "Processing..." : "Print Record"}
          </button>
        </div>
      )}
    </>
  );
};

export default GridView;
// import { useState, useEffect } from "react";
// import { Table, Pagination } from "react-bootstrap";
// import "../Analyze/TabularData/caseTableData.css";
// import { useSelector, useDispatch } from "react-redux";
// import "../Layout/pagination.css"
// import {
//   fetchSummaryData,

// } from "../../../Redux/Action/filterAction";
// import Loader from "../Layout/loader";
// import { FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import {  Plus } from "react-bootstrap-icons";
// import { Col } from "react-bootstrap";
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const GridView = () => {
//   const  navigate = useNavigate();
//   const dispatch = useDispatch();
//     const Token = Cookies.get('accessToken');
//     //   const result = useSelector((state) => state.report?.results || null);
//     // console.log("result",result)
//   const data1 = useSelector((state) => state.caseData.caseData);
//    const {
//    results,
//     headers,
//     page,
//     total_pages,
//     total_results,
 
//     error,
  
//   } = useSelector((state) => state.report);
//   const data = results
//   console.log("currentd",page)
//   console.log("datwq",data)
//   console.log("headerswq",headers)
//   const totalPages =total_pages
//   console.log("totalapgeswq",totalPages)
//   const  totalResults= total_results
//   console.log("totalresuktswq",totalResults)

//   const [currentPage, setCurrentPage] = useState(page);
//    const [dataAvailable, setDataAvailable] = useState(false);

//     const [loading, setLoading] = useState(true); 
//   const itemsPerPage = 50;

//  const fetchReportData = async () => {
//   try {
//     const response2 = await axios.post(
//       'http://5.180.148.40:9002/api/osint-man/v1/report',
//       { rows: results },
//       {
//         responseType: 'blob', // ✅ tell axios to expect binary Word file
//         headers: {
//           Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//           Authorization: `Bearer ${Token}`,
//         },
//       }
//     );

//     // ✅ Save the file using file picker
//     const fileHandle = await window.showSaveFilePicker({
//       suggestedName: "social_media_report.docx",
//       types: [
//         {
//           description: "Word Document",
//           accept: {
//             "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
//           },
//         },
//       ],
//     });

//     const writable = await fileHandle.createWritable();
//     await writable.write(response2.data); // use the blob directly
//     await writable.close();

//     console.log("Report saved successfully!");
//   } catch (error) {
//     console.error("Error downloading or saving .docx file:", error);
//   }
// };

//   useEffect(() => {
   
//       // dispatch(fetchSummaryData({
//       //   queryPayload: { unified_case_id: data1.id },
//       //   page: currentPage,
//       //   itemsPerPage: 50
//       // }));
//        if (data.length > 0) {
//                     setDataAvailable(true);
//                     setLoading(false)
//                 } else {
//                     setDataAvailable(false);
//                       setLoading(true)
//                 }
  
//   }, [data]);
  

//   const handlePageChange = (page) => {
//     setCurrentPage(page); // Update local state
//     dispatch(fetchSummaryData({
//       queryPayload: { unified_case_id: data1?.id }, // dynamic query
//       page: page,
//       itemsPerPage: 50
//     }));
//   };
  


//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }
  
//   const pages = [];
//   for (let i = 1; i <= totalPages; i++) {
//     if (
//       i === 1 ||
//       i === totalPages ||
//       Math.abs(currentPage - i) <= 1
//     ) {
//       pages.push(i);
//     } else if (
//       (i === 2 && currentPage > 4) ||
//       (i === totalPages - 1 && currentPage < totalPages - 3)
//     ) {
//       pages.push("");
//     }
//   }


 
//   return (
//     <>

//      <div className="top-header" style={{ marginTop: "10px" }}>
//                 <Col xs={1} className="d-flex align-items-center justify-content-flex-start" style={{ width: "20%" }}>
//                     <FaArrowLeft
//                         style={{ cursor: 'pointer', marginRight: '10px' }}
//                         onClick={() => navigate('/dashboard')}
//                     />
//                     <div className="search-bar1" style={{ width: '100%' }}>
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Search"
//                             // value={searchTerm}
//                             // onChange={handleSearch}
//                         />
//                     </div>
//                 </Col>
           
//             </div>
           
//        <div

//         className="case-t"
//         style={{ overflowY: "auto", height: "450px", fontSize: "10px" }}
//       >
    

//   <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   {/* Dynamically generate headers from all unique keys */}
//                   {data.length > 0 && [...new Set(data.flatMap(item => Object.keys(item)))]
//                     .map((key, index) => (
//                       <th key={index} className="fixed-th">
//                         {key.replace(/_/g, ' ').toUpperCase()} {/* Format headers */}
//                       </th>
//                     ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((item, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {/* Dynamically generate table cells */}
//                       {[...new Set(data.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
//                         <td key={colIndex} className="fixed-td">
//                           <div
//                             className="cell-content"
//                             style={{
//                               cursor: 'pointer',
//                               padding: "2px",
//                               height: '17px',
//                               fontFamily: 'sans-serif',
//                               fontWeight: 'normal',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                             }}
//                             title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
//                             // onClick={() => togglePopupA(item)}
//                           >
//                             {typeof item[key] === 'object' && item[key] !== null
//                               ? JSON.stringify(item[key]) // Handle objects/arrays by converting to string
//                               : item[key] || '-'} {/* Show '-' for missing keys */}
//                           </div>
//                         </td>
//                       ))}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={data.length > 0 ? 
//                       [...new Set(data.flatMap(item => Object.keys(item)))].length : 1} 
//                       className="text-center">
//                       No Data Available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//             </div>

                  
//       <div className="paginationstabs"
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//     }}
// >
 
// <>
//   <Pagination style={{ width: "200px" }}>
//     <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//     <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />

//     {pages.map((number, index) => {
//       if (
//         number === 1 ||
//         number === totalPages ||
//         number === currentPage ||
//         number === currentPage - 1 ||
//         number === currentPage + 1
//       ) {
//         return (
//           <Pagination.Item
//             key={index}
//             active={number === currentPage}
//             onClick={() => number !== "..." && handlePageChange(number)}
//           >
//             {number}
//           </Pagination.Item>
//         );
//       } else if (number === "...") {
//         return <Pagination.Item key={index} disabled>{number}</Pagination.Item>;
//       }
//       return null;
//     })}

//     <Pagination.Next
//       onClick={() => handlePageChange(currentPage + 1)}
//       disabled={currentPage === totalPages}
//     />
//     <Pagination.Last
//       onClick={() => handlePageChange(totalPages)}
//       disabled={currentPage === totalPages}
//     />
//   </Pagination>

// </>

//   <div style={{ fontSize: "12px", marginRight: "10px" }}>
//     Page {currentPage} - {itemsPerPage} / {totalResults}
     
//   </div>
//   {dataAvailable &&  <button  style={{backgroundColor:"black", color:'white' , borderRadius:'5px' }}
//                      onClick={fetchReportData}
//                      >
//                         {/* <Plus size={14} style={{ marginRight: "5px" }} /> */}
//                         Print Record
//                     </button>}
// </div> 
//     </>
//   );
// };

// export default GridView;
