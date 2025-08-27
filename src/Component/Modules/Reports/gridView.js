import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import style from "../Analyze/TabularData/caseTableData.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setReportResults } from "../../../Redux/Action/reportAction";
import { setPage } from "../../../Redux/Action/criteriaAction";
import Loader from "../Layout/loader";
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from "../../Common/Table/table.module.css";
import Select from "react-select";

const GridView = () => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const reportFilter = useSelector(state => state.reportFilter?.reportFilters);
  const caseData = useSelector(state => state.case?.caseData); // Assuming case data is available in Redux
  
  const {
    results,
    page,
    total_pages,
    total_results,
    error,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const totalPages = total_pages || 0;
  const totalResults = total_results || 0;

  // Local state
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [loading, setLoading] = useState(false);
  const [dataAvailable, setDataAvailable] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [data, setData] = useState([]);
  const [columnMapping, setColumnMapping] = useState([]);

  const formatOptions = [
    { value: "docx", label: "Word (.docx)" },
    { value: "csv", label: "CSV (.csv)" },
    { value: "pdf", label: "PDF (.pdf)" },
    { value: "json", label: "JSON (.json)" }
  ];

  const specialColumns = ["socialmedia_hashtags", "targets", "person", "gpe", "unified_case_id", "org", "loc"];
  
  const tagStyle = {
    backgroundColor: "#FFC107",
    color: "#000",
    padding: "2px 6px",
    borderRadius: "12px",
    fontSize: "11px",
    whiteSpace: "nowrap",
  };

  // Fetch column mapping
  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const token = Cookies.get("accessToken");
        console.log("Fetching column mapping..."); // Debug log
        
        // If you need case_id in the API call, get it from reportFilter or other source
        // const caseId = reportFilter?.case_id?.[0] || null;
        // const url = caseId 
        //   ? `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings?case_id=${caseId}`
        //   : `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`;
        
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log("Column mapping response:", response.data); // Debug log
        setColumnMapping(response.data);
      } catch (error) {
        console.error("Mapping fetch failed", error);
        setColumnMapping([]); // Set empty array on error
      }
    };

    // Always fetch mapping when component mounts or when data changes
    if (Token) {
      fetchMapping();
    }
  }, [Token, reportFilter?.case_id]); // Dependency on Token and case_id from reportFilter

  useEffect(() => {
    setData(results || []);
  }, [results]);

  const itemsPerPage = 50;

  // Get filtered columns based on mapping and show_in_report
  const getFilteredColumns = () => {
    if (!data || data.length === 0) return [];
    
    // Get all unique keys from data
    const allKeys = [...new Set(data.flatMap(item => Object.keys(item)))];
    console.warn("allkeys", allKeys)
    // If no mapping available, show all columns with formatted names
    if (!columnMapping || columnMapping.length === 0) {
      return allKeys.map(key => ({
        key,
        displayName: key
          .split("_")
          .map(word => {
            return word === word.toUpperCase()
              ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              : word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(" ")
      }));
    }

    // Filter columns based on mapping and show_in_report
    return allKeys
      .map(key => {
        const mapping = columnMapping.find(m => m.column_name === key);
        return {
          key,
          displayName: mapping?.display_name || key
            .split("_")
            .map(word => {
              return word === word.toUpperCase()
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" "),
          showInReport: mapping?.show_in_report !== false // Default to true if not specified
        };
      })
      .filter(col => col.showInReport);
  };

  const renderCellContent = (item, colKey) => {
    const value = item[colKey];

    // Handle special columns with tags
    if (specialColumns.includes(colKey)) {
      let tags = [];
      try {
        if (Array.isArray(value)) {
          tags = value;
        } else if (typeof value === 'string') {
          tags = JSON.parse(value?.replace(/'/g, '"') || "[]");
        }
      } catch (err) {
        tags = [];
      }

      if (tags.length > 0) {
        return (
          <div style={{ display: "flex", gap: "4px" }}>
            {tags.map((tag, i) => (
              <span key={i} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        );
      }
    }

    // Handle objects/arrays
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return value || "-";
  };

  // Fetch report data for export
  const fetchReportData = async (format = "docx") => {
    try {
      setLoading(true);

      // Build query payload dynamically
      const queryObject = {
        report_generation: true,
      };

      if (reportFilter?.keyword?.length > 0) {
        queryObject.keyword = reportFilter.keyword;
      }

      if (reportFilter?.file_type?.length > 0) {
        queryObject.file_type = reportFilter.file_type;
      }

      if (reportFilter?.target?.length > 0) {
        queryObject.targets = reportFilter.target.map(t => String(t.value || t));
      }

      if (reportFilter?.sentiment?.length > 0) {
        queryObject.sentiments = reportFilter.sentiment;
      }

      if (reportFilter?.case_id?.length > 0) {
        queryObject.case_id = reportFilter.case_id.map(c => String(c));
      }

      if (reportFilter?.start_time && reportFilter?.end_time) {
        queryObject.start_time = reportFilter.start_time;
        queryObject.end_time = reportFilter.end_time;
      }

      // Final payload (as per your example)
      const payload = {
        file_extension: format,   // "pdf" | "docx" | "csv" | "json"
        query: queryObject,
      };

      console.log("Report generation payload:", payload);

      const endpoint = `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report`;

      const response = await axios.post(endpoint, payload, {
        responseType: "blob",
        headers: {
          Accept:
            format === "pdf"
              ? "application/pdf"
              : format === "docx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : format === "csv"
              ? "text/csv"
              : "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });

      // filename based on extension
      const filename = `social_media_report.${format}`;
      downloadBlob(response.data, filename);

    } catch (error) {
      console.error(`Error downloading ${format} file:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to download blob
  const downloadBlob = async (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    
    if ('showSaveFilePicker' in window && window.isSecureContext) {
      try {
        const extension = filename.split('.').pop();
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: `${extension.toUpperCase()} File`,
            accept: {
              [`application/${extension}`]: [`.${extension}`]
            }
          }]
        });

        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } catch (err) {
        // User cancelled or error occurred, fallback to direct download
        directDownload(url, filename);
      }
    } else {
      // Fallback for HTTP or unsupported browsers
      directDownload(url, filename);
    }
    
    window.URL.revokeObjectURL(url);
  };

  const directDownload = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    a.remove();
  };

  // Handle data changes
  useEffect(() => {
    if (!isInitialLoad) {
      setLoading(reportLoading);
    }

    if (Array.isArray(data) && data.length > 0) {
      setDataAvailable(true);
    } else {
      setDataAvailable(false);
    }

    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [reportLoading, isInitialLoad, data]);

  const handlePageChange = async (newPage) => {
    try {
      setCurrentPage(newPage);
      setLoading(true);

      // Build query for pagination from current filter state
      const queryObject = {
        report_generation: true,
        page: newPage
      };

      if (reportFilter?.keyword?.length > 0) {
        queryObject.keyword = reportFilter.keyword;
      }

      if (reportFilter?.file_type?.length > 0) {
        queryObject.file_type = reportFilter.file_type;
      }

      if (reportFilter?.target?.length > 0) {
        queryObject.targets = reportFilter.target.map(t => String(t.value || t));
      }

      if (reportFilter?.sentiment?.length > 0) {
        queryObject.sentiments = reportFilter.sentiment;
      }

      if (reportFilter?.case_id?.length > 0) {
        queryObject.case_id = reportFilter.case_id;
      }

      if (reportFilter?.start_time && reportFilter?.end_time) {
        queryObject.start_time = reportFilter.start_time;
        queryObject.end_time = reportFilter.end_time;
      }

      console.log("Pagination payload", queryObject);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        queryObject,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      dispatch(setReportResults({
        results: response.data.results,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      }));

      dispatch(setPage(newPage));

    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setLoading(false);
    }
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

  // Get filtered columns for rendering
  const filteredColumns = getFilteredColumns();

  // Render loading state
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
            handlePageChange(currentPage);
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
      <div className={styles.mainContainer}>
        <div
          className={styles.tableWrapper}
          style={{ marginTop: '12px', backgroundColor: '#101D2B' }}
        >
          {!dataAvailable ? (
            <Table hover responsive size="sm" className={styles.table}>
              <thead></thead>
              <tbody>
                <tr>
                  <td className="text-center">
                    No data available
                  </td>
                </tr>
              </tbody>
            </Table>
          ) : (
            <Table hover className={styles.table}>
              <thead>
                <tr>
                  {filteredColumns.map((column, index) => (
                    <th key={index} className={style.fixedTh}>
                      {column.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {filteredColumns.map((column, colIndex) => (
                        <td key={colIndex} className={style.fixedTd}>
                          <div
                            className="cell-content"
                            style={{
                              cursor: 'pointer',
                              fontWeight: "400",
                              overflow: 'auto',
                              whiteSpace: 'nowrap',
                              padding: '0px 5px 0px 5px',
                              fontSize: '12px',
                              fontFamily: 'roboto',
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                            }}
                            title={typeof item[column.key] === 'object' ? JSON.stringify(item[column.key]) : item[column.key]}
                          >
                            {renderCellContent(item, column.key)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={filteredColumns.length || 1} className="text-center">
                      No Data Available
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>

        {dataAvailable && (
          <div className={style.paginationContainer}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto",
              boxShadow: "0 -2px 5px rgba(0,0,0,0.05)",
              backgroundColor: '#101D2B',
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px'
            }}
          >
            <Pagination style={{ width: "200px" }}>
              <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} >
                Previous
              </Pagination.Prev>

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
              >Next
              </Pagination.Next>
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Select
                options={formatOptions}
                value={null}
                onChange={(option) => {
                  if (option) {
                    fetchReportData(option.value);
                  }
                }}
                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#d9d9d9',
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#FFFFFF'
                  }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#0073CF',
                    color: '#E8F5E9',
                    borderRadius: '15px',
                    border: 'none'
                  }),
                  menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#080E17',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    border: "1px solid #0073CF",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#0073CF' : '#080E17',
                    color: '#D9D9D9',
                    cursor: 'pointer'
                  })
                }}
                menuPlacement="top"
                isSearchable={false}
                placeholder="Print Record"
                getOptionLabel={(option) => option.label}
                formatOptionLabel={(option) => option.label}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GridView;
// import { useState, useEffect } from "react";
// import { Table, Pagination } from "react-bootstrap";
// import style from "../Analyze/TabularData/caseTableData.module.css";
// import { useSelector, useDispatch } from "react-redux";
// import { setReportResults } from "../../../Redux/Action/reportAction";
// import { setPage } from "../../../Redux/Action/criteriaAction";
// import Loader from "../Layout/loader";
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import styles from "../../Common/Table/table.module.css";
// import Select from "react-select";

// const GridView = () => {
//   const Token = Cookies.get('accessToken');
//   const dispatch = useDispatch();
//   const reportFilter = useSelector(state => state.reportFilter?.reportFilters);
//     const {
//     results,
//     page,
//     total_pages,
//     total_results,
//     error,
//     loading: reportLoading,
//   } = useSelector((state) => state.report);

//   const totalPages = total_pages || 0;
//   const totalResults = total_results || 0;

//   // Local state
//   const [currentPage, setCurrentPage] = useState(page || 1);
//   const [loading, setLoading] = useState(false);
//   const [dataAvailable, setDataAvailable] = useState(false);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [data, setData] = useState([]);

//   const formatOptions = [
//     { value: "docx", label: "Word (.docx)" },
//     { value: "csv", label: "CSV (.csv)" },
//     { value: "pdf", label: "PDF (.pdf)" },
//     { value: "json", label: "JSON (.json)" }
//   ];

//   useEffect(() => {
//     setData(results || []);
//   }, [results]);

//   const itemsPerPage = 50;

//   // Fetch report data for export
// const fetchReportData = async (format = "docx") => {
//   try {
//     setLoading(true);

//     // Build query payload dynamically
//     const queryObject = {
//       report_generation: true,
//       // page: newPage,   // <-- pagination
//     };

//     if (reportFilter?.keyword?.length > 0) {
//       queryObject.keyword = reportFilter.keyword;
//     }

//     if (reportFilter?.file_type?.length > 0) {
//       queryObject.file_type = reportFilter.file_type;
//     }

//     if (reportFilter?.target?.length > 0) {
//       queryObject.targets = reportFilter.target.map(t => String(t.value || t));
//     }

//     if (reportFilter?.sentiment?.length > 0) {
//       queryObject.sentiments = reportFilter.sentiment;
//     }

//     if (reportFilter?.case_id?.length > 0) {
//       queryObject.case_id = reportFilter.case_id.map(c => String(c));
//     }

//     if (reportFilter?.start_time && reportFilter?.end_time) {
//       queryObject.start_time = reportFilter.start_time;
//       queryObject.end_time = reportFilter.end_time;
//     }

//     // Final payload (as per your example)
//     const payload = {
//       file_extension: format,   // "pdf" | "docx" | "csv" | "json"
//       query: queryObject,
//     };

//     console.log("Report generation payload:", payload);

//     const endpoint = `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report`;

//     const response = await axios.post(endpoint, payload, {
//       responseType: "blob",
//       headers: {
//         Accept:
//           format === "pdf"
//             ? "application/pdf"
//             : format === "docx"
//             ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//             : format === "csv"
//             ? "text/csv"
//             : "application/json",
//         Authorization: `Bearer ${Token}`,
//       },
//     });

//     // filename based on extension
//     const filename = `social_media_report.${format}`;
//     downloadBlob(response.data, filename);

//   } catch (error) {
//     console.error(`Error downloading ${format} file:`, error);
//   } finally {
//     setLoading(false);
//   }
// };


//   // Helper function to download blob
//   const downloadBlob = async (blob, filename) => {
//     const url = window.URL.createObjectURL(blob);
    
//     if ('showSaveFilePicker' in window && window.isSecureContext) {
//       try {
//         const extension = filename.split('.').pop();
//         const fileHandle = await window.showSaveFilePicker({
//           suggestedName: filename,
//           types: [{
//             description: `${extension.toUpperCase()} File`,
//             accept: {
//               [`application/${extension}`]: [`.${extension}`]
//             }
//           }]
//         });

//         const writable = await fileHandle.createWritable();
//         await writable.write(blob);
//         await writable.close();
//       } catch (err) {
//         // User cancelled or error occurred, fallback to direct download
//         directDownload(url, filename);
//       }
//     } else {
//       // Fallback for HTTP or unsupported browsers
//       directDownload(url, filename);
//     }
    
//     window.URL.revokeObjectURL(url);
//   };

//   const directDownload = (url, filename) => {
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     a.click();
//     a.remove();
//   };

//   // Handle data changes
//   useEffect(() => {
//     if (!isInitialLoad) {
//       setLoading(reportLoading);
//     }

//     if (Array.isArray(data) && data.length > 0) {
//       setDataAvailable(true);
//     } else {
//       setDataAvailable(false);
//     }

//     if (isInitialLoad) {
//       setIsInitialLoad(false);
//     }
//   }, [reportLoading, isInitialLoad, data]);

//   const handlePageChange = async (newPage) => {
//     try {
//       setCurrentPage(newPage);
//       setLoading(true);

//       // Build query for pagination from current filter state
//       const queryObject = {
//         report_generation: true,
//         page: newPage
//       };

//       if (reportFilter?.keyword?.length > 0) {
//         queryObject.keyword = reportFilter.keyword;
//       }

//       if (reportFilter?.file_type?.length > 0) {
//         queryObject.file_type = reportFilter.file_type;
//       }

//       if (reportFilter?.target?.length > 0) {
//         queryObject.targets = reportFilter.target.map(t => String(t.value || t));
//       }

//       if (reportFilter?.sentiment?.length > 0) {
//         queryObject.sentiments = reportFilter.sentiment;
//       }

//     if (reportFilter?.case_id?.length > 0) {
//       queryObject.case_id = reportFilter.case_id;
//     }

//       if (reportFilter?.start_time && reportFilter?.end_time) {
//         queryObject.start_time = reportFilter.start_time;
//         queryObject.end_time = reportFilter.end_time;
//       }

//       console.log("Pagination payload", queryObject);

//       const response = await axios.post(
//         `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
//         queryObject,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${Token}`
//           }
//         }
//       );

//       dispatch(setReportResults({
//         results: response.data.results,
//         total_pages: response.data.total_pages,
//         total_results: response.data.total_results,
//       }));

//       dispatch(setPage(newPage));

//     } catch (error) {
//       console.error('Error fetching page data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate pagination
//   const pages = [];
//   for (let i = 1; i <= totalPages; i++) {
//     if (i === 1 || i === totalPages || Math.abs(currentPage - i) <= 1) {
//       pages.push(i);
//     } else if (
//       (i === 2 && currentPage > 4) ||
//       (i === totalPages - 1 && currentPage < totalPages - 3)
//     ) {
//       pages.push("...");
//     }
//   }

//   // Render loading state
//   if (loading && !isInitialLoad) {
//     return <Loader />;
//   }

//   // Render error state
//   if (error) {
//     return (
//       <div className="error-container" style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
//         <h3>Error Loading Data</h3>
//         <p>{error.message || "An unexpected error occurred while fetching data."}</p>
//         <button
//           onClick={() => {
//             setLoading(true);
//             handlePageChange(currentPage);
//           }}
//           className="btn btn-primary"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className={styles.mainContainer}>
//         <div
//           className={styles.tableWrapper}
//           style={{ marginTop: '12px', backgroundColor: '#101D2B' }}
//         >
//           {!dataAvailable ? (
//             <Table hover responsive size="sm" className={styles.table}>
//               <thead></thead>
//               <tbody>
//                 <tr>
//                   <td className="text-center">
//                     No data available
//                   </td>
//                 </tr>
//               </tbody>
//             </Table>
//           ) : (
//             <Table hover className={styles.table}>
//               <thead>
//                 <tr>
//                   {data.length > 0 && [...new Set(data.flatMap(item => Object.keys(item)))]
//                     .map((key, index) => (
//                       <th key={index} className={style.fixedTh}>
//                         {key
//                           .split("_")
//                           .map(word => {
//                             return word === word.toUpperCase()
//                               ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
//                               : word.charAt(0).toUpperCase() + word.slice(1);
//                           })
//                           .join(" ")
//                         }
//                       </th>
//                     ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((item, rowIndex) => (
//                     <tr key={rowIndex}>
//                       {[...new Set(data.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
//                         <td key={colIndex} className={style.fixedTd}>
//                           <div
//                             className="cell-content"
//                             style={{
//                               cursor: 'pointer',
//                               fontWeight: "400",
//                               overflow: 'auto',
//                               whiteSpace: 'nowrap',
//                               padding: '0px 5px 0px 5px',
//                               fontSize: '12px',
//                               fontFamily: 'roboto',
//                               scrollbarWidth: 'none',
//                               msOverflowStyle: 'none',
//                             }}
//                             title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
//                           >
//                             {["socialmedia_hashtags", "targets", "person", "gpe", "unified_case_id", "org", "loc"].includes(key) && Array.isArray(item[key]) ? (
//                               <div style={{ display: "flex", gap: "4px" }}>
//                                 {item[key].map((tag, i) => (
//                                   <span
//                                     key={i}
//                                     style={{
//                                       backgroundColor: "#FFC107",
//                                       color: "#000",
//                                       padding: "2px 6px",
//                                       borderRadius: "12px",
//                                       fontSize: "11px",
//                                       whiteSpace: "nowrap",
//                                     }}
//                                   >
//                                     {tag}
//                                   </span>
//                                 ))}
//                               </div>
//                             ) : typeof item[key] === "object" && item[key] !== null ? (
//                               JSON.stringify(item[key])
//                             ) : (
//                               item[key] || "-"
//                             )}
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
//           )}
//         </div>

//         {dataAvailable && (
//           <div className={style.paginationContainer}
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginTop: "auto",
//               // padding: "10px 20px",
//               // marginBottom: "10px",
//               boxShadow: "0 -2px 5px rgba(0,0,0,0.05)",
//               backgroundColor: '#101D2B',
//               borderBottomLeftRadius: '12px',
//               borderBottomRightRadius: '12px'
//             }}
//           >
//             <Pagination style={{ width: "200px" }}>
//               <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//               <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} >
//                 Previous
//               </Pagination.Prev>

//               {pages.map((number, index) => {
//                 if (
//                   number === 1 ||
//                   number === totalPages ||
//                   number === currentPage ||
//                   number === currentPage - 1 ||
//                   number === currentPage + 1
//                 ) {
//                   return (
//                     <Pagination.Item
//                       key={index}
//                       active={number === currentPage}
//                       onClick={() => number !== "..." && handlePageChange(number)}
//                     >
//                       {number}
//                     </Pagination.Item>
//                   );
//                 } else if (number === "...") {
//                   return <Pagination.Item key={index} disabled>{number}</Pagination.Item>;
//                 }
//                 return null;
//               })}

//               <Pagination.Next
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >Next
//               </Pagination.Next>
//               <Pagination.Last
//                 onClick={() => handlePageChange(totalPages)}
//                 disabled={currentPage === totalPages}
//               />
//             </Pagination>

//             <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//               <Select
//                 options={formatOptions}
//                 value={null}
//                 onChange={(option) => {
//                   if (option) {
//                     fetchReportData(option.value);
//                   }
//                 }}
//                 styles={{
//                   placeholder: (provided) => ({
//                     ...provided,
//                     color: '#d9d9d9',
//                   }),
//                   singleValue: (provided) => ({
//                     ...provided,
//                     color: '#FFFFFF'
//                   }),
//                   control: (provided) => ({
//                     ...provided,
//                     backgroundColor: '#0073CF',
//                     color: '#E8F5E9',
//                     borderRadius: '15px',
//                     border: 'none'
//                   }),
//                   menu: (provided) => ({
//                     ...provided,
//                     backgroundColor: '#080E17',
//                     borderRadius: '15px',
//                     overflow: 'hidden',
//                     border: "1px solid #0073CF",
//                   }),
//                   option: (provided, state) => ({
//                     ...provided,
//                     backgroundColor: state.isFocused ? '#0073CF' : '#080E17',
//                     color: '#D9D9D9',
//                     cursor: 'pointer'
//                   })
//                 }}
//                 menuPlacement="top"
//                 isSearchable={false}
//                 placeholder="Print Record"
//                 getOptionLabel={(option) => option.label}
//                 formatOptionLabel={(option) => option.label}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default GridView;