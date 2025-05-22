import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import "./caseTableData.css";
import { useSelector, useDispatch } from "react-redux";
import "./pagination.css";
import {
  fetchSummaryData,

} from "../../../../Redux/Action/filterAction";
import Loader from "../../Layout/loader";


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
  console.log("currentd", page)
  console.log("datwq", data)
  console.log("headerswq", headers)
  console.log("totalapgeswq", totalPages)
  console.log("totalresuktswq", totalResults)

  const [currentPage, setCurrentPage] = useState(page);



  // const itemsPerPage = 50;


  useEffect(() => {


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
        className="data-table"
        style={{ overflowY: "auto", height: "420px" }}
      >
        {data && data.length > 0 ? (
          <Table striped bordered hover variant="light">
            <thead >
              <tr>
    {headers.map((header) => (
        <th key={header} className="fixed-th">
            {header
                .split("_") // Split by underscores
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
                .join(" ") // Rejoin words with space
            }
        </th>
    ))}
</tr>

            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header} className="fixed-td">
                      <div className="cell-content"
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
                      title={item[header]}>
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
          Page {currentPage} of {totalPages} / Total Results: {totalResults}
        </div>

      </div>

    </>
  );
};


export default TabulerData;
