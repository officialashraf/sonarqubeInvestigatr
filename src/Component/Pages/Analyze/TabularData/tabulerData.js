// //import { useState } from "react";
// import { Table, Pagination } from 'react-bootstrap';
// import React, { useState, useEffect } from 'react'
// import Cookies from "js-cookie";
// import axios from 'axios';
// //import Pagination from "./pagination";
// import '../../../../../Assets/Stlyes/Filter/caseTableData.css'
// import { useSelector,useDispatch } from 'react-redux';
// import '../../../../../services/pagination.css'
// import { setSumaryHeadersAction, setSummaryDataAction } from '../../../../../Redux/Action/filterAction';
// import { setSummaryData } from '../../../../../Redux/Action/caseAction';
// import Loader from '../../../Layout/loader';
// const TabulerData = () => {
//     const dispatch = useDispatch();
//     const data1 = useSelector((state) => state.caseData.caseData)
//     console.log("data1", data1)
//     const [headers, setHeaders] = useState([]);
// // const [summary, setSummary] = useState(second)
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 50;

//     useEffect(() => {
//         fetchCaseData();
//     }, []);

//     const fetchCaseData = async () => {
//           const token = Cookies.get("accessToken");
//         try {
//             const queryData = {
//                 query:{
//                   unified_case_id:`${data1.id}`
//                 }
//             }
//             const response = await axios.post('http://5.180.148.40:9005/api/das/search', queryData,{
//                 headers: {
//                     'Content-Type': 'application/json',
//                      'Authorization': `Bearer ${token}`
//                 },
//             });
//             console.log("Response:", response);
//             // if (!response.ok) {
//             //     // Handle HTTP errors
//             //     throw new Error(`HTTP error! status: ${response.status}`);
//             // }
//             // const data = await response.json();
//             //  dispatch(setSummaryData(data))
//             const dataArray =response.data.response;
//             // console.log("summaryData",)
//             console.log("datarray", dataArray)
//             if (Array.isArray(dataArray) && dataArray.length > 0 ) {
//                 const firstFiftyItems = dataArray;
//                 const allKeys = new Set();
//                 firstFiftyItems.forEach(item => {
//                   Object.keys(item).forEach(key => {
//                     allKeys.add(key);
//                   });
//                 });

//                 // Convert the set of keys to an array and set as headers
//                 setHeaders(Array.from(allKeys));
//                //setHeaders( Object.keys(firstFiftyItems[0]));
//                 setData(firstFiftyItems);

//                 console.log("First 50 items:", firstFiftyItems);
//             } else {
//                 console.error("Data array not found or is not an array.");
//             }

//             setLoading(false);

//         } catch (error) {
//             console.error('Fetch error:', error);
//             setError(error);
//         }
//     };

//     dispatch(setSummaryDataAction(data))
//     dispatch(setSumaryHeadersAction(headers))
//     if (loading) {
//         return <Loader/>;
//     }

//     if (error) {
//         return <div>Error: {error.message}</div>;
//     }
//     console.log("dataaaaaa", data)
//     //console.log("resposne dataa", data.response[0].data)

//     console.log("headersssss", headers)
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = data ? data.slice(indexOfFirstItem, indexOfLastItem) : [];

//     // Handle page change
//     const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

//     // Create page numbers
//     const pageNumbers = data ? Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => i + 1) : [];
//     return (
//         <>
//             <div className="case-t" style={{ overflowY: "auto", height: "450px", fontSize: "10px" }} >

//                 {data && data.length > 0 ? (
//                      <Table striped bordered hover>
//                        <thead>
//                          <tr>
//                            {headers.map((header) => (
//                              <th key={header} className="fixed-th">
//                                {header}
//                              </th>
//                            ))}
//                          </tr>
//                        </thead>
//                        <tbody>
//                          {currentItems.map((item, index) => (
//                            <tr key={index}>
//                              {headers.map((header) => (
//                               <td key={header} className="fixed-td">
//                               <div className="cell-content" title={item[header]}>
//                                 {item[header]}
//                               </div>
//                             </td>
//                              ))}
//                            </tr>
//                          ))}
//                        </tbody>
//                      </Table>

//                 ) : (
//                     <p>No data available.</p>
//                 )}
//             </div>
//             <Pagination>
//                 {pageNumbers.map((number) => (
//                     <Pagination.Item
//                         key={number}
//                         active={number === currentPage}
//                         onClick={() => handlePageChange(number)}
//                     >
//                         {number}
//                     </Pagination.Item>
//                 ))}
//             </Pagination>

//         </>
//     )
// }

// export default TabulerData

import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import "../../../../Assets/Stlyes/Filter/caseTableData.css";
import { useSelector, useDispatch } from "react-redux";
import "../../../../Assets/Stlyes/pagination.css";
import {
  setSumaryHeadersAction,
  setSummaryDataAction,
} from "../../../../Redux/Action/filterAction";
import { setSummaryData } from "../../../../Redux/Action/caseAction";
import Loader from "../../Layout/loader";

const TabulerData = () => {
  const dispatch = useDispatch();
  const data1 = useSelector((state) => state.caseData.caseData);
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [items, setItems] = useState();
  const itemsPerPage = 50;

  useEffect(() => {
    fetchCaseData(currentPage);
  }, [currentPage]);

  const fetchCaseData = async (page) => {
    const token = Cookies.get("accessToken");
    try {
      const queryData = {
        query: {
          unified_case_id: `${data1.id}`,
        },
        page: page,
        // limit: itemsPerPage
      };

      const response = await axios.post(
        "http://5.180.148.40:9006/api/das/search",
        queryData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      const dataArray = responseData.results;
      console.log("dataaryy", dataArray);
      const totalItems = responseData.total_results; // Assuming backend returns total items count
      console.log("totalresluts", totalItems);
      if (Array.isArray(dataArray) && dataArray.length > 0) {
        const allKeys = new Set();
        dataArray.forEach((item) => {
          Object.keys(item).forEach((key) => {
            allKeys.add(key);
          });
        });

        setHeaders(Array.from(allKeys));
        setData(dataArray);
        setTotalPages(Math.ceil(totalItems / itemsPerPage));
        setItems(totalItems);
      }

      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setError(error);
      setLoading(false);
    }
  };

  dispatch(setSummaryDataAction(data));
  dispatch(setSumaryHeadersAction(headers));

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // const handlePageChange = (pageNumber) => {
  //     if (pageNumber !== currentPage) {
  //         setCurrentPage(pageNumber);
  //     }
  // };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // First 10% pages (rounded up)
  const visiblePages = Math.ceil(totalPages * 0.03);

  let pages = [];

  for (let i = 1; i <= visiblePages; i++) {
    pages.push(i);
  }
  if (currentPage > visiblePages && currentPage < totalPages) {
    pages.push(currentPage);
  }
  // Always include the last page
  if (totalPages > visiblePages + 1) {
    pages.push(".................");
    pages.push(totalPages);
  }

  //   const maxPagesBeforeEllipsis = Math.floor(totalPages * 0.1);

  // const handlePageChange = (pageNumber) => {
  //   if (pageNumber !== currentPage) {
  //     onPageChange(pageNumber);
  //   }
  // };
  return (
    <>
      <div
        className="case-t"
        style={{ overflowY: "auto", height: "450px", fontSize: "10px" }}
      >
        {data && data.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="fixed-th">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="fixed-td">
                      <div className="cell-content" title={item[header]}>
                        {item[header]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No data available.</p>
        )}
      </div>

      {/* {totalPages > 1 && (
                <Pagination>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <Pagination.Item
                            key={number}
                            active={number === currentPage}
                            onClick={() => handlePageChange(number)}
                        >
                            {number}
                        </Pagination.Item>
                    ))}
                </Pagination> 
            )} */}
      <div className="paginationstabs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pagination>
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />

          {pages.map((number, index) => (
            <Pagination.Item
              key={index}
              active={number === currentPage}
              onClick={() => number !== "..." && handlePageChange(number)}
              disabled={number === "..."}
            >
              {number}
            </Pagination.Item>
          ))}

          <Pagination.Next
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
        <div style={{ fontSize: "12px", marginRight: "10px" }}>
          Page {currentPage} - {itemsPerPage} / {items}
        </div>
      </div>
    </>
  );
};

export default TabulerData;
