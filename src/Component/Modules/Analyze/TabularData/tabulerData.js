import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import style from "./caseTableData.module.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchSummaryData } from "../../../../Redux/Action/filterAction";
import Loader from "../../Layout/loader";
import styles from "../../../Common/Table/table.module.css";
import axios from "axios";
import Cookies from "js-cookie";

const TabulerData = () => {
  const dispatch = useDispatch();
  const caseData = useSelector((state) => state.caseData.caseData);
  const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
  const {
    data,
    headers,
    page,
    totalPages,
    loading,
    error,
    totalResults,
  } = useSelector((state) => state.filterData);

  
  const [currentPage, setCurrentPage] = useState(page);
  const [columnMapping, setColumnMapping] = useState([]);

  // Group color logic
  const groupColors = {};
  const getGroupColor = (groupName) => {
    if (groupColors[groupName]) return groupColors[groupName];

 const colorList = [
  "#67e467ff", // Very Dark Green
  "#ce2020ff", // Very Dark Red
  "#ecf012ff", // Very Dark Orange
  "#bb6dd4ff", // Very Dark Purple
  "#060a35ff", // Very Dark Indigo
  "#1a0a03ff", // Very Dark Brown
  "#d44c90ff", // Very Dark Pink
  "#e6f517ff", // Very Dark Blue
  "#e76570ff", // Very Dark Deep Orange
  "#45dbcfff", // Very Dark Blue Grey
 ]


    const color = colorList[Object.keys(groupColors).length % colorList.length];
    groupColors[groupName] = color;
    return color;
  };

  useEffect(() => {
    if (caseData?.id && !data) {
      // const queryPayload = {
      //   unified_case_id: caseData.id
      // };
          const rawPayload = {
      case_id: String(caseData.id),
      file_type: caseFilter?.file_type,
      start_time: caseFilter?.start_time,
      end_time: caseFilter?.end_time,
      aggsFields: caseFilter?.aggs_fields,
      keyword: caseFilter?.keyword,
      page: currentPage,
      itemsPerPage: 50,
    };
        const summaryPayload =Object.fromEntries(
      Object.entries(rawPayload).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0) &&
          !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      )
    ); 
      dispatch(fetchSummaryData(summaryPayload));
       console.log("su mardtaatbulerr", summaryPayload)
    }
  }, [caseData?.id]);

 useEffect(() => {
  const fetchMapping = async () => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setColumnMapping(response.data);
    } catch (error) {
      console.error("Mapping fetch failed", error);
    }
  };

  
    fetchMapping();
  
}, [caseData?.id, page]);


  const processedHeaders = headers.map((header) => {
    const mapping = columnMapping.find((col) => col.column_name === header);
    return {
      key: header,
      displayName: mapping?.display_name || header.split("_").map((word) =>
        word === word.toUpperCase()
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      groupName: mapping?.group_name || "Others"
    };
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // const queryPayload = {
    //   unified_case_id: caseData.id
    // };
  const rawPayload = {
      case_id: String(caseData.id),
      file_type: caseFilter?.file_type,
      start_time: caseFilter?.start_time,
      end_time: caseFilter?.end_time,
      aggsFields: caseFilter?.aggs_fields,
      keyword: caseFilter?.keyword,
      page,
      itemsPerPage: 50,
    };
        const pageChangePayload =Object.fromEntries(
      Object.entries(rawPayload).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          !(Array.isArray(value) && value.length === 0) &&
          !(typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      )
    ); 
    dispatch(fetchSummaryData(pageChangePayload));
    console.log("paageechngepayloadda",pageChangePayload)
  };

  if (loading) return <Loader />;
  if (error) return <div>{error.message}</div>;

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

  return (
    <>
      <div className={styles.mainContainer}>
      <div className={styles.tableWrapper} style={{ overflowY: "auto", overflowX: "auto"}}>
          {data && data.length > 0 ? (
            <Table hover className={styles.table}>
              <thead>
                {/* Group Headers */}
                {/* <tr>
                  {(() => {
                    const groupMap = {};
                    processedHeaders.forEach((col) => {
                      if (!groupMap[col.groupName]) groupMap[col.groupName] = [];
                      groupMap[col.groupName].push(col);
                    });

                    return Object.entries(groupMap).map(([group, cols]) => {
                      const visibleCols = cols.filter(col => headers.includes(col.key));
                      if (visibleCols.length > 0) {
                        return (
                          <th
                            key={`group-${group}`}
                            colSpan={visibleCols.length}
                            className={style.groupTh}
                            style={{
                              textAlign: "center",
                              backgroundColor: "#f0f0f0",
                              fontWeight: "600",
                              fontSize: "13px",
                              borderBottom: "1px solid #ccc"
                            }}
                          >
                            {group}
                          </th>
                        );
                      }
                      return null;
                    });
                  })()}
                </tr> */}

                {/* Column Headers */}
                <tr>
                  {processedHeaders
                    .filter(col => headers.includes(col.key))
                    .map((col) => (
                      <th
                        key={col.key}
                        className={style.fixedTh}
                      >
                        <div
                          // style={{
                          //   color: getGroupColor(col.groupName),
                          //    fontWeight: "600"
                          // }}
                        >
                          {col.displayName}
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    {processedHeaders.map((col) => (
                      <td
                        key={col.key}
                        className={style.fixedTd}
                        style={{ backgroundColor: getGroupColor(col.groupName) }}
                      >
                        <div
                          className="cell-content"
                          style={{
                            cursor: "pointer",
                            fontWeight: "400",
                            overflow: "auto",
                            whiteSpace: "nowrap",
                            padding: "0px 5px",
                            fontSize: "12px",
                            fontFamily: "roboto",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none"
                          }}
                          title={item[col.key]}
                        >
                         {["targets", "person", "gpe", "unified_case_id", "org","loc", "socialmedia_hashtags"].includes(col.key) ? (() => {
                            let tags = [];
                            try {
                              tags = JSON.parse(item[col.key]?.replace(/'/g, '"') || "[]");
                            } catch (err) {
                              tags = [];
                            }
                            return (
                              <div style={{ display: "flex", gap: "4px" }}>
                                {tags.map((tag, i) => (
                                  <span
                                    key={i}
                                    style={{
                                      backgroundColor: "#FFC107",
                                      color: "#000",
                                      padding: "2px 6px",
                                      borderRadius: "12px",
                                      fontSize: "11px",
                                      whiteSpace: "nowrap"
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            );
                          })() : item[col.key]}
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

        {/* Pagination */}
      <div
  className={style.paginationContainer}
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // updated
    width: "100%",                   // ensure full width
    padding: "0 16px"                // optional padding
  }}
>
  {/* Pagination centered inside a wrapper */}
  <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
    <Pagination>
      <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
      {pages.map((number, index) =>
        number === "..." ? (
          <Pagination.Item key={index} className={style.pageItem} disabled>
            ...
          </Pagination.Item>
        ) : (
          <Pagination.Item
            key={index}
            active={number === currentPage}
            onClick={() => handlePageChange(number)}
            className={`${styles.pageItem} ${number === currentPage ? styles.activePage : ""}`}
          >
            {number}
          </Pagination.Item>
        )
      )}
      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  </div>

  {/* Total results on the right */}
  <div style={{ fontSize: "12px", color: "#ccc" }}>
    (Total Results - { totalResults })
  </div>
</div>


        {/* Group Color Legend */}
        {/* <div
          className={style.legendContainer}
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "12px"
          }}
        >
          {Object.entries(groupColors).map(([group, color]) => (
            <div key={group} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "14px", height: "14px", backgroundColor: color, borderRadius: "50%", border: "1px solid #999" }} />
              <span style={{ fontSize: "12px" }}>{group}</span>
            </div>
          ))}
        </div> */}
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
