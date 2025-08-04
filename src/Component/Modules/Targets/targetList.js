import { useEffect, useState } from "react";
import "../Case/tableGlobal.css";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";
import Cookies from 'js-cookie';
import TargetCreate from "./targetCreate";
import TargetUpdate from "./targetUpdate";
import TargetDetails from "./targetDetails";
import Loader from "../Layout/loader.js"
import TableModal from "../../Common/Table/table.js";
import AppButton from "../../Common/Buttton/button.js";

const TargetList = () => {
  const token = Cookies.get("accessToken");
  const navigate = useNavigate();
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupE, setShowPopupE] = useState(false);
  const [showPopupD, setShowPopupD] = useState(false);
  const [details, setDetails] = useState([])
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const fetchTargets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": 'application/json'
        },

      });
      console.log("API Response:", response);
      setData(response.data);
      setFilteredData(response.data);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        console.error("An error occurred:", error.message);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  console.log("serrr", filteredData)
  useEffect(() => {
    const tri = fetchTargets();
    console.log("okk", tri)
    const handleDatabaseUpdated = () => {
      fetchTargets();
    };

    window.addEventListener("databaseUpdated", handleDatabaseUpdated);
    return () => {
      window.removeEventListener("databaseUpdated", handleDatabaseUpdated);
    };
  }, [])

  // const handleSearch = (event) => {
  //   const searchValue = event.target.value;
  //   setSearchTerm(searchValue);

  //   const filtered = data.filter(item => {
  //     return Object.values(item).some((value) => {
  //       if (value !== null && value !== undefined) {
  //         // Convert the value to a string and check if it includes the search value
  //         return value
  //           .toString()
  //           .toLowerCase()
  //           .includes(searchValue.toLowerCase());
  //       }
  //       return false;
  //     });
  //   });
  //   setFilteredData(filtered);
  // };

  // const handleSort = (key) => {
  //   let direction = "asc";

  //   if (sortConfig.key === key && sortConfig.direction === "asc") {
  //     direction = "desc";
  //   }

  //   setSortConfig({ key, direction });

  //   const sortedData = [...filteredData].sort((a, b) => {
  //     const aValue = a[key] ?? null;
  //     const bValue = b[key] ?? null;

  //     if (aValue === null && bValue === null) return 0;
  //     if (aValue === null) return 1;
  //     if (bValue === null) return -1;

  //     if (key === "last_logout" || key === "created_on") {
  //       const aDate = new Date(aValue);
  //       const bDate = new Date(bValue);
  //       return direction === "asc" ? aDate - bDate : bDate - aDate;
  //     }

  //     if (typeof aValue === "string" && typeof bValue === "string") {
  //       return direction === "asc"
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }

  //     if (typeof aValue === "number" && typeof bValue === "number") {
  //       return direction === "asc" ? aValue - bValue : bValue - aValue;
  //     }

  //     return 0;
  //   });
  //   setFilteredData(sortedData);
  // };

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  const togglePopupE = (details) => {
    setDetails(details);
    setShowPopupE(prev => !prev);
  };

  const togglePopupD = (details) => {
    setDetails(details);
    setShowPopupD(prev => !prev);
  };

  const confirmDelete = (id, name) => {
    toast((t) => (
      <div>
        <p>Are you sure you want to delete {name} target?</p>
        <button className='custom-confirm-button' onClick={() => { deleteTarget(id, name); toast.dismiss(t.id); }} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }}>Yes</button>
        <button className='custom-confirm-button' onClick={() => toast.dismiss(t.id)} style={{ padding: "4px 1px", fontSize: "12px", width: "20%" }} >No</button> </div>),
      {
        autoClose: false, closeOnClick: false, draggable: false, style: {
          position: 'fixed',
          top: '300px',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          zIndex: 9999,
          color: '#d2d2d2',
          background: '#101D2B'
        }
      },)
  };

  const deleteTarget = async (id, name) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }
    try {

      const response = await axios.delete(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      // window.dispatchEvent(new Event("databaseUpdated"));
      toast.success(`Target ${name} deleted successfully`)
      console.log("Target deleted:", response.data);

      // After successful deletion, fetch the updated data
      fetchTargets(); // Optionally refresh data after deletion

    } catch (err) {
      // Error handling based on the type of error
      console.error('Error during login:', err);

      if (err.response) {

        toast.error(err.response?.data?.detail || 'Something went wrong. Please try again');

      } else if (err.request) {
        // No response from the server
        toast.error('No response from the server. Please check your connection');
      } else {
        // Unknown error occurred
        toast.error('An unknown error occurred. Please try again');
      }
    }
  };

  if (loading) {
    return <Loader />
  }
  const targetColumns = [
    { key: "id", label: "Target ID" },
    { key: "name", label: "Target" },
    { key: "type", label: "Type" },
    { key: "synonyms", label: "Synonyms" },
    { key: "threat_weightage", label: "Threat Score(1-10)" },
    { key: "created_on", label: "Created On" },
    { key: "created_by", label: "Created By" },
    { key: "modified_on", label: "Edited On" },
    { key: "modified_by", label: "Edited By" },
    { key: "description", label: "Description" },
  ];


  return (
    <>{data &&
      data.length > 0 ? (
      // <div className="data-table-container">
      //   <div className="top-header" style={{ marginTop: "10px" }}>
      //     <Col
      //       xs={1}
      //       className="d-flex align-items-center justify-content-flex-start"
      //       style={{ width: "350px", minWidth: '350px' }}
      //     >
      //       <FaArrowLeft
      //         style={{
      //           cursor: "pointer", margin: '0px 40px 0px 38px',
      //           fontSize: '16px'
      //         }}
      //         onClick={() => navigate("/Cases")}
      //       />
      //       <div className="search-bar1" style={{ width: "100%" }}>
      //         <div className="input-group">
      //           <input
      //             type="text"
      //             className="form-control"
      //             value={searchTerm}
      //             onChange={handleSearch}
      //             placeholder="Search"
      //           />
      //         </div>
      //       </div>
      //     </Col>
      //     <div className="header-icons">
      //       <button className="add-btn"
      //         onClick={togglePopup}
      //       >

      //         <Plus size={14} style={{ marginRight: "5px" }} />
      //         Add New Target
      //       </button>
      //     </div>
      //   </div>
      //   <div className="data-table" style={{ minHeight: isDropdownOpen ? "200px" : "auto" }}>
      //     <Table striped bordered hover variant="light">
      //       <thead>
      //         <tr>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Target ID
      //               <span
      //                 onClick={() => handleSort("id")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "id" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Target
      //               <span
      //                 onClick={() => handleSort("name")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "name" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Type
      //               <span
      //                 onClick={() => handleSort("type")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "name" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>


      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Synonyms
      //               <span
      //                 onClick={() => handleSort("synonyms")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "synonyms" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Threat Score(1-10)
      //               <span
      //                 onClick={() => handleSort("threat_weightage")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "threat_weightage" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Modified On
      //               <span
      //                 onClick={() => handleSort("modified_on")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "modified_on" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Modified By
      //               <span
      //                 onClick={() => handleSort("modified_by")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "modified_by" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Created On
      //               <span
      //                 onClick={() => handleSort("created_on")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "created_on" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Created By
      //               <span
      //                 onClick={() => handleSort("created_by")}
      //                 style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
      //               >
      //                 {sortConfig.key === "created_by" ? (
      //                   sortConfig.direction === "asc" ? <ArrowDropUp /> : <ArrowDropDown />
      //                 ) : (
      //                   <ArrowDropDown />
      //                 )}
      //               </span>
      //             </div>
      //           </th>
      //           <th>
      //             <div
      //               style={{
      //                 display: "flex",
      //                 justifyContent: "space-between",
      //                 alignItems: "center"
      //               }}
      //             >
      //               Description
      //               <span
      //                 style={{
      //                   cursor: "pointer",
      //                   display: "inline-flex",
      //                   alignItems: "center"
      //                 }}
      //               >
      //               </span>
      //             </div>
      //           </th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {filteredData &&
      //           filteredData.map(item =>
      //             <tr
      //               key={item.id || Math.random()}
      //               style={{ position: "relative" }}
      //             >
      //               <td>
      //                 {`TAR${String(item.id).padStart(4, '0')}`}
      //               </td>
      //               <td>
      //                 {item.name}
      //               </td>
      //               <td>
      //                 {item.type}
      //               </td>
      //               <td>
      //                 {item.synonyms?.join(", ")}
      //               </td>
      //               <td>
      //                 {item.threat_weightage}
      //               </td>
      //               <td>
      //                 {(item.modified_on ? item.modified_on.slice(0, 10)
      //                   : "-")}
      //               </td>
      //               <td>
      //                 {(item.modified_by
      //                   || "-")}
      //               </td>
      //               <td>
      //                 {(item.created_on.slice(0, 10)
      //                   || "-")}
      //               </td>
      //               <td>
      //                 {(item.created_by
      //                   || "-")}
      //               </td>
      //               <td
      //                 style={{
      //                   display: "flex",
      //                   justifyContent: "space-between",
      //                   alignItems: "center",
      //                   textAlign: "center"
      //                 }}
      //               >
      //                 <span>{item.description}</span>
      //                 <Dropdown onToggle={(isOpen) => setIsDropdownOpen(isOpen)}>
      //                   <Dropdown.Toggle
      //                     className="menu-button"
      //                     style={{
      //                       background: "none",
      //                       border: "none",
      //                       justifyContent: "end",
      //                       cursor: "pointer"
      //                     }}
      //                   >

      //                     <FiMoreVertical size={16} />

      //                   </Dropdown.Toggle>
      //                   <Dropdown.Menu
      //                     className="custom-dropdown-menu"
      //                     style={{
      //                       minWidth: "150px",
      //                       textAlign: "left"
      //                     }}
      //                   >
      //                     <Dropdown.Item
      //                       onClick={() => togglePopupD(item)}
      //                       style={{ cursor: "pointer" }}
      //                     >
      //                       Details
      //                     </Dropdown.Item>
      //                     <Dropdown.Item
      //                       onClick={() => togglePopupE(item)}
      //                     >
      //                       Edit
      //                     </Dropdown.Item>
      //                     <Dropdown.Item
      //                       onClick={() => confirmDelete(item.id, item.name)}
      //                     >
      //                       Delete
      //                     </Dropdown.Item>
      //                   </Dropdown.Menu>
      //                 </Dropdown>
      //               </td>
      //             </tr>
      //           )}
      //       </tbody>
      //     </Table>
      //   </div>
      // </div>
      <div>
        <TableModal
          title="Target Details"
          data={data}
          columns={targetColumns}
          idPrefix="TAR"
          btnTitle=" + Add New Target"
          onRowAction={{
            edit: (row) => togglePopupE(row),
            delete: (row) => confirmDelete(row.id, row.name),
            details: (row) => togglePopupD(row),
          }}
          i
          onAddClick={() => togglePopup()}
        />
      </div>
    ) : (
      <div className="resourcesContainer" style={{ border: 'none' }}>
        <h3 className="title">Let's Get Started!</h3>
        <p className="content">Add targets to get started</p>
        {/* <button className='add-btn' title='Add New Case' onClick={togglePopup}><Plus size={20} />Add New Target</button> */}
        <AppButton onClick={togglePopup} children={" + Add New Target"} />
      </div>
    )
    }
      {showPopup && <TargetCreate togglePopup={togglePopup} existingTargets={filteredData} />}
      {showPopupE && <TargetUpdate togglePopup={togglePopupE} id={details.id} existingTargets={filteredData} />}
      {showPopupD && <TargetDetails togglePopup={togglePopupD} id={details.id} />}
    </>
  );
};

export default TargetList;
