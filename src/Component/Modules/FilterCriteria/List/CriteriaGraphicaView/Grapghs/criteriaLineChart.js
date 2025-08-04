import { useSelector } from 'react-redux';
import ReusableLineGraph from '../../../../../Common/Charts/LineGraph/lineGraph';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../../../Layout/loader';


const CriteriaLineChart = () => {
 const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
//   const token = Cookies.get("accessToken");
//   const [data, setData] = useState([]);
//   const [recordTypes, setRecordTypes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchKeywordData = async () => {
//       try {
//         setLoading(true);
//         const payload = {
//           query: {
//             unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
//             file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
//             keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
//           },
//           aggs_fields: ["unified_type", "unified_record_type", "sentiment", "unified_date_only", "socialmedia_hashtags"],
//           start_time: queryPayload?.start_time || "",
//           end_time: queryPayload?.end_time || ""
//         };
//         const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log("line", response);

//         const { unified_date_only, unified_record_type } = response.data;

//         if (unified_date_only) {
//           setData(unified_date_only);
//         } else {
//           setData([]);
//         }

//         if (unified_record_type) {
//           setRecordTypes(unified_record_type);
// console.log("CriteriaLineChart - recordTypes:", recordTypes);

//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setData([]);
//         setRecordTypes([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchKeywordData();

//   }, [queryPayload, token]);
//   if (loading) {
//     return <Loader style={{ marginTop: '-120px' }} />
//   }

  return (
 <ReusableLineGraph 
  queryPayload={queryPayload}
  aggsFields={["unified_date_only", "unified_type"]}
  recordLineField="unified_type"
/>

  );
};

export default CriteriaLineChart;