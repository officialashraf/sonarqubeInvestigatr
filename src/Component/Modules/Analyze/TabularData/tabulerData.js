import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import "./caseTableData.css";
import "../../Case/table.css"
import { useSelector, useDispatch } from "react-redux";
import "./pagination.css";
import { fetchSummaryData } from "../../../../Redux/Action/filterAction";
import Loader from "../../Layout/loader";
import styles from "../../../Common/Table/table.module.css";

const TabulerData = () => {
  const dispatch = useDispatch();
  const caseData = useSelector((state) => state.caseData.caseData);
  const {
    data,
    headers,
    page,
    totalPages,
    totalResults,
    loading,
    error,
  } = useSelector((state) => state.filterData);
  console.log("currentd", page)
  console.log("datwq", data)
  console.log("headerswq", headers)
  console.log("totalapgeswq", totalPages)
  console.log("totalresuktswq", totalResults)

  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    if (caseData?.id) {
      dispatch(fetchSummaryData({
        queryPayload: { unified_case_id: caseData.id },
        page: currentPage,
        itemsPerPage: 50
      }));
    }
  }, [caseData, currentPage, dispatch]);


  const handlePageChange = (page) => {
    setCurrentPage(page); // Update local state
    dispatch(fetchSummaryData({
      queryPayload: { unified_case_id: caseData?.id }, // dynamic query
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
      <div className={styles.mainContainer} styles={{ display: "grid", gap: "15px" }}>
      {/* Table Wrapper */}
      <div className={styles.tableWrapper} style={{ overflowY: "auto", height:"60vh"}}>
        {data && data.length > 0 ? (
          <Table hover responsive size="sm" className={styles.table}>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header} className="fixed-th">
                    {header
                      .split("_")
                      .map((word) =>
                        word === word.toUpperCase()
                          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                          : word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="fixed-td">
                      <div
                        className="cell-content"
                        style={{
                          cursor: "pointer",
                          fontWeight: "normal",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          padding: "0px 5px",
                          fontSize: "12px",
                          fontFamily: "Helvetica",
                        }}
                        title={item[header]}
                      >
                        {item[header]}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center" style={{ margin: "20px 0px", border: "1px solid #ccc" }}>
            No data available
          </p>
        )}
      </div>

      {/* Pagination Wrapper */}
      <div className={styles.paginationContainer}>
        <Pagination style={{ width: "200px" }}>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
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
                  className={`${styles.pageItem} ${number === currentPage ? styles.activePage : ""
                    }`}
                >
                  {number}
                </Pagination.Item>
              );
            } else if (number === "...") {
              return (
                <Pagination.Item key={index} disabled>
                  {number} className={styles.pageItem}
                </Pagination.Item>
              );
            }
            return null;
          })}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Pagination.Next>
          <Pagination.Last
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      </div>
    </>
  );
};

export default TabulerData;
  
//   return (
//     <>
//       <div
//         className={styles.tableWrapper}
//         style={{ overflowY: "auto", height: "65vh" }}
//       >
//         {data && data.length > 0 ? (
//           // <Table striped bordered hover variant="light">
//           <Table hover responsive size="sm" className={styles.table}>
//             <thead >
//               <tr>
//                 {headers.map((header) => (
//                   <th key={header} className="fixed-th">
//                     {header

//                       .split("_") // Split by underscores
//                       .map(word => {
//                         return word === word.toUpperCase() //  Check if it's fully uppercase
//                           ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() //  Convert all except first letter to lowercase
//                           : word.charAt(0).toUpperCase() + word.slice(1); //  Keep normal capitalization
//                       })
//                       .join(" ") // Rejoin words with space

//                     }
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, index) => (
//                 <tr key={index}>
//                   {headers.map((header) => (
//                     <td key={header} className="fixed-td">
//                       <div className="cell-content"
//                         style={{
//                           cursor: 'pointer',
//                           // padding: "0px 0px 0px 5px",
//                           // height: '37px',
//                           // fontFamily: 'sans-serif',
//                           fontWeight: 'normal',
//                           overflow: 'hidden',
//                           //  textOverflow: 'ellipsis',
//                           whiteSpace: 'nowrap',
//                           //  vertical- align: middle;
//                           padding: '0px 5px 0px 5px',
//                           fontSize: '12px',
//                           fontFamily: 'Helvetica'
//                         }}
//                         title={item[header]}>
//                         {item[header]}
//                       </div>
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         ) : (
//           <p className="text-center" style=
//             {{ margin: '20px 0px', border: '1px solid #ccc', }}>No data available</p>
//         )}
//       </div>


//       <div className={styles.paginationContainer}
//       // style={{
//       //   display: "flex",
//       //   alignItems: "center",
//       //   justifyContent: "center",
//       // }}
//       >

//         <>
//           <Pagination style={{ width: "200px" }}>
//             <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
//             <Pagination.Prev
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Pagination.Prev>
//             {pages.map((number, index) => {
//               if (
//                 number === 1 ||
//                 number === totalPages ||
//                 number === currentPage ||
//                 number === currentPage - 1 ||
//                 number === currentPage + 1
//               ) {
//                 return (
//                   <Pagination.Item
//                     key={index}
//                     active={number === currentPage}
//                     onClick={() => number !== "..." && handlePageChange(number)}
//                     className={`${styles.pageItem} ${number === currentPage ? styles.activePage : ""
//                       }`}
//                   >
//                     {number}
//                   </Pagination.Item>
//                 );
//               } else if (number === "...") {
//                 return <Pagination.Item key={index} disabled>{number} className={styles.pageItem}</Pagination.Item>;
//               }
//               return null;
//             })}
//             <Pagination.Next
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}>
//               Next
//             </Pagination.Next>
//             <Pagination.Last
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}
//             />
//           </Pagination>
//         </>
//         {/* <div style={{ fontSize: "12px", marginRight: "10px" }}>
//           Page {currentPage} of {totalPages} / Total Results: {totalResults}
//         </div> */}

//       </div>

//     </>
//   );
// };


// export default TabulerData;
