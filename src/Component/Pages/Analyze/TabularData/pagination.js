// import React from 'react'
// import { useState } from 'react';
// import './pagination.css'

// const Pagination = ({
//     totalItems,
//     rowsPerPage,
//     currentPage,
//     onPageChange,
//     onRowsPerPageChange,
//     rowsPerPageOptions,
//   }) => {
//     const totalPages = Math.ceil(totalItems / rowsPerPage);
//     const [jumpPageInput, setJumpPageInput] = useState("");
  
//     const handlePageChange = (page) => {
//       if (page >= 1 && page <= totalPages) {
//         onPageChange(page);
//       }
//     };
  
//     const handleJumpToPage = (e) => {
//       e.preventDefault();
//       const page = parseInt(jumpPageInput, 7);
//       if (page >= 1 && page <= totalPages) {
//         onPageChange(page);
//       }
//       setJumpPageInput("");
//     };
  
//     return (
//       <div className="d-flex justify-content-between align-items-center mt-3">
//         <div>
//           <select
//             className="form-select d-inline-block ms-2 rows-per-page"
//             value={rowsPerPage}
//             onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
//           >
//             {rowsPerPageOptions.map((option) => (
//               <option key={option} value={option}>
//                 {option} per page
//               </option>
//             ))}
//           </select>
//         </div>
  
//         <nav>
//           <ul className="pagination mb-0 pagination-ul">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className=" pagination-li"
//                 onClick={() => handlePageChange(currentPage - 1)}
//               >
//                 <i className="fas fa-angle-left" ></i>
//               </button>
//             </li>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <li
//                 key={i + 1}
//                 className={`page-item ${currentPage === i + 1 ? "active" : ""} `}
//               >
//                 <button
//                   className="pagination-li"
//                   onClick={() => handlePageChange(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               </li>
//             ))}
//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="pagination-li"
//                 onClick={() => handlePageChange(currentPage + 1)}
//               >
//                 <i className="fas fa-angle-right" ></i>
//               </button>
//             </li>
//           </ul>
//         </nav>
  
//         <form className="d-inline-flex ms-3" onSubmit={handleJumpToPage}>
//           <input
//             className="form-control w-auto page-jump-input"
//             min="1"
//             max={totalPages}
//             value={jumpPageInput}
//             onChange={(e) => setJumpPageInput(e.target.value)}
//             type="text"
//           />
//           <button type="submit" className="btn btn-primary ms-2 invisible">
//             Go
//           </button>
//         </form>
//       </div>
//     );
//   };
  
//   export default Pagination;
