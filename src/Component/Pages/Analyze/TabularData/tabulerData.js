
import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import "./caseTableData.css";
import { useSelector, useDispatch } from "react-redux";
import "./pagination.css";
import {
  fetchSummaryData,

} from "../../../../Redux/Action/filterAction";
import Loader from "../../Layout/loader";
import { useRef } from "react";

const TabulerData = () => {
  const dispatch = useDispatch();
  const data1 = useSelector((state) => state.caseData.caseData);
   const {
    data,
    headers,
    page,
    totalPages,
    totalResults,
    loading,
    error,
  
  } = useSelector((state) => state.filterData);
  console.log("currentd",page)
  console.log("datwq",data)
  console.log("headerswq",headers)
  console.log("totalapgeswq",totalPages)
  console.log("totalresuktswq",totalResults)

  const [currentPage, setCurrentPage] = useState(page);
  
  const itemsPerPage = 50;
  // const initialRender = useRef(true);

  useEffect(() => {
    // if (initialRender.current) {
    //   initialRender.current = false; // Mark first render as completed
    //   return; // Avoid making the request initially
    // }
    if (data1?.id) {
      dispatch(fetchSummaryData({
        queryPayload: { unified_case_id: data1.id },
        page: currentPage,
        itemsPerPage: 50
      }));
    }
  }, [data1, currentPage, dispatch]);
  

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update local state
    dispatch(fetchSummaryData({
      queryPayload: { unified_case_id: data1?.id }, // dynamic query
      page: page,
      itemsPerPage: 50
    }));
  };
  


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }
  
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      Math.abs(currentPage - i) <= 1
    ) {
      pages.push(i);
    } else if (
      (i === 2 && currentPage > 4) ||
      (i === totalPages - 1 && currentPage < totalPages - 3)
    ) {
      pages.push("");
    }
  }
  
 
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

     
      <div className="paginationstabs"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}
>
 
<>
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

</>

  <div style={{ fontSize: "12px", marginRight: "10px" }}>
    Page {currentPage} - {itemsPerPage} / {totalResults}
  </div>
</div>

    </>
  );
};

export default TabulerData;
// import { useState, useEffect } from "react";
// import { Table, Pagination } from "react-bootstrap";
// import Cookies from "js-cookie";
// import axios from "axios";
// import "./caseTableData.css";
// import { useSelector, useDispatch } from "react-redux";
// import "./pagination.css";
// import {
//   setSumaryHeadersAction,
//   setSummaryDataAction,
// } from "../../../../Redux/Action/filterAction";
// import { setSummaryData } from "../../../../Redux/Action/caseAction";
// import Loader from "../../Layout/loader";
// import  FetchCaseData  from "../../Services/CommonApi"

//  const TabulerData = () => {
//   const dispatch = useDispatch();
//   const data1 = useSelector((state) => state.caseData.caseData);
//   const data = useSelector((state) => state.summaryData.data);
//   const headers = useSelector((state) => state.summaryData.headers);
  
//   console.log("Summary Datatable from Redux:", data);
//   console.log("Summary Headerstable from Redux:", headers);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [items, setItems] = useState();
//   const itemsPerPage = 50;


//    // **Step 1: Component Mount hone par Redux se Data Fetch karein**
//   useEffect(() => {
//     if (!data || data.length === 0) {
//        setLoading(true);
//       FetchCaseData({ unified_case_id: data1.id, page: currentPage, dispatch })
//       .then(()=> setLoading(false))
//       .catch((err) =>{
//       setLoading(false);
//       });
//     } else {
//       setLoading(false);
//     }
//   }, [data1]); // Sirf ek baar initial load par Redux se data check hoga


//    // **Step 2: Jab Page Change Ho Tab API Call Karein**
//   useEffect(() => {
//     if (data1?.id) {
//       setLoading(true);
//       FetchCaseData({ unified_case_id: data1.id, page: currentPage, dispatch })
//         .then(() => {
//           setLoading(false);
//           setTotalPages(Math.ceil(items / itemsPerPage));
//           setItems(items);
//         })
//         .catch((err) => {
//           setError(err);
//           setLoading(false);
//         });
//     }
//   }, [currentPage]);

  
// //   const FetchCaseData = async (page) => {
// //     const token = Cookies.get("accessToken");
// //     try {
// //       const queryData = {
// //         query: {
// //           unified_case_id: `${data1.id}`,
// //         },
// //         page: page,
// //         // limit: itemsPerPage
// //       };
// // console.log("queryArray",queryData)
// //       const response = await axios.post(
// //         "http://5.180.148.40:9006/api/das/search",
// //         queryData,
// //         {
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );

// //       const responseData = response.data;
// //       const dataArray = responseData.results;

// //       console.log("dataaryy", response);

// //       const totalItems = responseData.total_results; // Assuming backend returns total items count
// //       // console.log("totalresluts", totalItems);
// //       if (Array.isArray(dataArray) && dataArray.length > 0) {
// //         const allKeys = new Set();
// //         dataArray.forEach((item) => {
// //           Object.keys(item).forEach((key) => {
// //             allKeys.add(key);
// //           });
// //         });

// //         setHeaders(Array.from(allKeys));
// //         // setData(dataArray);
// //         setData(dataArray.map(item => {
// //           return Object.keys(item).reduce((acc, key) => {
// //             acc[key] = typeof item[key] === "object" ? JSON.stringify(item[key]) : item[key];
// //             return acc;


// //           }, {});
// //         }));

// //         setTotalPages(Math.ceil(totalItems / itemsPerPage));
// //         setItems(totalItems);

// //         // dispatch(setSummaryDataAction(data));
// //         // dispatch(setSumaryHeadersAction(headers));
// //       }

// //       setLoading(false);
// //     } catch (error) {
// //       console.error("Fetch error:", error);
// //       setError(error);
// //       setLoading(false);
// //     }
// //   };

// //   dispatch(setSummaryDataAction(data));
// //   dispatch(setSumaryHeadersAction(headers));

//   if (loading) {
//     return <Loader />;
//   }

//   if (error) {
//     return <div>Error: {error.message}</div>;
//   }

//   // const handlePageChange = (pageNumber) => {
//   //     if (pageNumber !== currentPage) {
//   //         setCurrentPage(pageNumber);
//   //     }
//   // };
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // First 10% pages (rounded up)
//   const visiblePages = Math.ceil(totalPages * 0.03);

//   let pages = [];

//   for (let i = 1; i <= visiblePages; i++) {
//     pages.push(i);
//   }
//   if (currentPage > visiblePages && currentPage < totalPages) {
//     pages.push(currentPage);
//   }
//   // Always include the last page
//   if (totalPages > visiblePages + 1) {
//     pages.push(".................");
//     pages.push(totalPages);
//   }

//     // const maxPagesBeforeEllipsis = Math.floor(totalPages * 0.1);

//   // const handlePageChange = (pageNumber) => {
//   //   if (pageNumber !== currentPage) {
//   //     onPageChange(pageNumber);
//   //   }
//   // };
//   return (
//     <>
//       <div
//         className="case-t"
//         style={{ overflowY: "auto", height: "450px", fontSize: "10px" }}
//       >
//         {data && data.length > 0 ? (
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 {headers.map((header) => (
//                   <th key={header} className="fixed-th">
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index}>
//                   {headers.map((header) => (
//                     <td key={header} className="fixed-td">
//                       <div className="cell-content" title={item[header]}>
//                         {item[header]}
//                       </div>
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           <p>No data available.</p>
//         )}
//       </div>

//       {/* {totalPages > 1 && (
//                 <Pagination>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
//                         <Pagination.Item
//                             key={number}
//                             active={number === currentPage}
//                             onClick={() => handlePageChange(number)}
//                         >
//                             {number}
//                         </Pagination.Item>
//                     ))}
//                 </Pagination> 
//             )} */}
//       <div className="paginationstabs"
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//     }}
// >
//   <Pagination style={{ width: "200px" }}>
//     <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//     <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

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

//     <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
//     <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
//   </Pagination>

//   <div style={{ fontSize: "12px", marginRight: "10px" }}>
//     Page {currentPage} - {itemsPerPage} / {items}
//   </div>
// </div>

//     </>
//   );
// };

// export default TabulerData;
