import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import "../Analyze/TabularData/caseTableData.css";
import { useSelector, useDispatch } from "react-redux";
import "../Layout/pagination.css";
import {  fetchSummaryData} from "../../../Redux/Action/filterAction";
import Loader from "../Layout/loader";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

const GridView = () => {
  const Token = Cookies.get('accessToken');
  const navigate = useNavigate();
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

  useEffect(() => {
    setData(results || []);
  }, [results]);

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
      
      <div
        className="data-table"
        style={{ height: '420px', marginTop: '12px' }}
      >
        {!dataAvailable ? (
          <Table striped bordered hover variant='light'>
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
          <Table striped bordered hover variant='light'>

            <thead>

              <tr>
                {data.length > 0 && [...new Set(data.flatMap(item => Object.keys(item)))]
                  .map((key, index) => (
                    <th key={index} className="fixed-th">
                      {key.split("_") // Split by underscores
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                        .join(" ")
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
            style={{ backgroundColor: "black", color: 'white', borderRadius: '5px' }}
            onClick={fetchReportData}
            disabled={loading}
          >
            {loading ? "Processing..." : "Print Records"}
          </button>
        </div>
      )}
    </>
  );
};

export default GridView;
