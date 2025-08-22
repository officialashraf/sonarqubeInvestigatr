import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import style from "../Analyze/TabularData/caseTableData.module.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
import Loader from "../Layout/loader";
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from "../../Common/Table/table.module.css";
import AddButton from "../../Common/Buttton/button";
import Select from "react-select";
import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";


const GridView = () => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const data1 = useSelector((state) => state.caseData.caseData);
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
  const [loading, setLoading] = useState(false); // Initialize as false to prevent loader at first load
  const [dataAvailable, setDataAvailable] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track initial load
  const [data, setData] = useState([]);

  const [selectedFormat, setSelectedFormat] = useState(null);

  const formatOptions = [
    { value: "docx", label: "Word (.docx)" },
    { value: "csv", label: "CSV (.csv)" },
    { value: "pdf", label: "PDF (.pdf)" },
    { value: "json", label: "JSON (.json)" }
  ];


  useEffect(() => {
    setData(results || []);
  }, [results]);

  const itemsPerPage = 50;
  // const handleExportChange = async (selected) => {
  //   if (!selected) return;
  //   setSelectedFormat(selected);
  //   await exportData(selected.value); // तुरंत download होगा
  // };


  // Fetch report data function
  const fetchReportData = async () => {
    try {
      // Show loading indicator
      setLoading(true);

      const response2 = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report`,
        { rows: results },
        {
          responseType: 'blob',
          headers: {
            Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            Authorization: `Bearer ${Token}`,
          },
        }
      );
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
        const a = document.createElement('a');
        a.href = url;
        a.download = 'social_media_report.docx';
        a.click();
        a.remove();
      }

      console.log("Report saved successfully!");
    } catch (error) {
      console.error("Error downloading or saving .docx file:", error);
    } finally {
      // Hide loading indicator
      setLoading(false);
    }
  };
  // const exportData = async (format) => {
  //   try {
  //     setLoading(true);

  //     if (format === "json") {
  //       const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "records.json";
  //       a.click();
  //       return;
  //     }

  //     if (format === "csv") {
  //       const headers = [...new Set(data.flatMap(item => Object.keys(item)))];
  //       const csvRows = [
  //         headers.join(","),
  //         ...data.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(","))
  //       ];
  //       const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  //       const url = URL.createObjectURL(blob);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "records.csv";
  //       a.click();
  //       return;
  //     }

  //     if (format === "pdf") {
  //       const response = await axios.post(
  //         `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report/pdf`,
  //         { rows: data },
  //         {
  //           responseType: "blob",
  //           headers: { Accept: "application/pdf", Authorization: `Bearer ${Token}` },
  //         }
  //       );
  //       const url = URL.createObjectURL(response.data);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "records.pdf";
  //       a.click();
  //       return;
  //     }

  //     if (format === "docx") {
  //       const response = await axios.post(
  //         `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report`,
  //         { rows: data },
  //         {
  //           responseType: "blob",
  //           headers: {
  //             Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //             Authorization: `Bearer ${Token}`,
  //           },
  //         }
  //       );
  //       const url = URL.createObjectURL(response.data);
  //       const a = document.createElement("a");
  //       a.href = url;
  //       a.download = "social_media_report.docx";
  //       a.click();
  //     }
  //   } catch (err) {
  //     console.error("Export error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  //   // Handle data changes
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
  }, [reportLoading, isInitialLoad, data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true); // Set loading to true only during pagination
    dispatch(fetchSummaryData({
      queryPayload: { unified_case_id: data1?.id },
      page: page,
      itemsPerPage: 50
    }));
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
      <div className={styles.mainContainer} >
        <div
          className={styles.tableWrapper}
          style={{ marginTop: '12px', backgroundColor: '#101D2B' }}
        >
          {!dataAvailable ? (
            <Table hover responsive size="sm" className={styles.table}>            <thead></thead>
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
                  {data.length > 0 && [...new Set(data.flatMap(item => Object.keys(item)))]
                    .map((key, index) => (
                      <th key={index} className={style.fixedTh}>
                        {key
                          .split("_") // Split by underscores
                          .map(word => {
                            return word === word.toUpperCase() //  Check if it's fully uppercase
                              ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() //  Convert all except first letter to lowercase
                              : word.charAt(0).toUpperCase() + word.slice(1); //  Keep normal capitalization
                          })
                          .join(" ") // Rejoin words with space

                        }
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...new Set(data.flatMap(item => Object.keys(item)))].map((key, colIndex) => (
                        <td key={colIndex} className={style.fixedTd}>
                          <div
                            className="cell-content"
                            style={{
                              cursor: 'pointer',
                              // padding: "0px 0px 0px 5px",
                              // height: '37px',
                              // fontFamily: 'sans-serif',
                              fontWeight: "400",
                              overflow: 'auto',
                              //  textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              //  vertical- align: middle;
                              padding: '0px 5px 0px 5px',
                              fontSize: '12px',
                              fontFamily: 'roboto',
                              scrollbarWidth: 'none',
                              msOverflowStyle: 'none',
                            }}
                            title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}
                          >
                            {["socialmedia_hashtags", "targets", "person", "gpe", "unified_case_id", "org", "loc"].includes(key) && Array.isArray(item[key]) ? (
                              <div style={{ display: "flex", gap: "4px" }}>
                                {item[key].map((tag, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      backgroundColor: "#FFC107",
                                      color: "#000",
                                      padding: "2px 6px",
                                      borderRadius: "12px",
                                      fontSize: "11px",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : typeof item[key] === "object" && item[key] !== null ? (
                              JSON.stringify(item[key])
                            ) : (
                              item[key] || "-"
                            )}
                            {/* {typeof item[key] === 'object' && item[key] !== null
                              ? JSON.stringify(item[key])
                              : item[key] || '-'} */}
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
          <div className={style.paginationContainer}
            style={{
              // display: "flex",
              // alignItems: "self-end",
              // justifyContent: "space-between",
              // height: "80vh",
              // marginTop: "auto", 
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "auto", // push to bottom
              padding: "10px 20px",
              marginBottom: "10px",
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
                value={selectedFormat}
                onChange={(option) => {
                  setSelectedFormat(null);  // force back to placeholder
                  fetchReportData(option);
                }}

                styles={{
                  placeholder: (provided) => ({
                    ...provided,
                    color: '#d9d9d9', // 👈 Your desired placeholder color
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: '#FFFFFF'  // 👈 White color for selected text
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
                menuPlacement="top"   // dropdown हमेशा ऊपर खुलेगा
                isSearchable={false}  // search off
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
