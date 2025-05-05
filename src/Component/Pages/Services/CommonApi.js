// // utils/fetchCaseData.js
// import axios from "axios";
// import Cookies from "js-cookie";
// import { setSumaryHeadersAction, setSummaryDataAction } from "../../../Redux/Action/filterAction";
// const FetchCaseData = async ({ unified_case_id, page, dispatch, }) => {
//   const token = Cookies.get("accessToken");

//   try {
//     const response = await axios.post(
//       "http://5.180.148.40:9006/api/das/search",
//       {
//         query: { unified_case_id },
//         page,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     console.log("query from common", page)
// console.log("resposne from common", response)
//     const dataArray = response.data?.results || [];
//     const totalItems = response.data?.total_results || 0;
//     const totalPages = response.data?.total_pages || 1;

//     if (Array.isArray(dataArray) && dataArray.length > 0) {
//       const allKeys = new Set();
//       dataArray.forEach(item => {
//         Object.keys(item).forEach(key => allKeys.add(key));
//       });

//       const headers = Array.from(allKeys);
      
//       const data = dataArray.map(item =>
//         Object.keys(item).reduce((acc, key) => {
//           acc[key] = typeof item[key] === "object" ? JSON.stringify(item[key]) : item[key];
//           return acc;
//         }, {})
//       );


//       // ✅ **Redux se purana data clear karo**
//       dispatch(setSummaryDataAction([])); 
//       dispatch(setSumaryHeadersAction([]));
      
//       dispatch(setSumaryHeadersAction(headers));
//       dispatch(setSummaryDataAction(data));


//     }
   

//   } catch (error) {
//     console.error("fetchCaseData error:", error);
//   }
// };

// export default FetchCaseData;
