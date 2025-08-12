// import { useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";

// const useFilterDropdowns = () => {
//     const [platforms, setPlatforms] = useState([]);
//     const [targets, setTargets] = useState([]);
//     const [sentiments, setSentiments] = useState([]);
//     const [fileTypeOptions, setFileTypeOptions] = useState([]);

//     const Token = Cookies.get('accessToken');

//     const fetchDropdowns = async () => {
//         try {
//             // Fetch platforms from API
//             const platformResponse = await axios.post(
//                 `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
//                 {
//                     fields: ["unified_record_type"]
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${Token}`
//                     }
//                 }
//             );

//             if (platformResponse.data.unified_record_type && platformResponse.data.unified_record_type.buckets) {
//                 const fileTypeOptionsFormatted = platformResponse.data.unified_record_type.buckets.map(bucket => ({
//                     value: bucket.key,
//                     label: bucket.key
//                 }));
//                 setFileTypeOptions(fileTypeOptionsFormatted);
//                 setPlatforms(fileTypeOptionsFormatted);
//             }

//             // Fetch targets and sentiment from API
//             const response = await axios.post(
//                 `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
//                 {
//                     fields: ["targets", "sentiment"]
//                 },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${Token}`
//                     }
//                 }
//             );

//             if (response.data.targets && response.data.targets.buckets) {
//                 const targetsFormatted = response.data.targets.buckets.map(bucket => ({
//                     value: bucket.key,
//                     label: bucket.key
//                 }));
//                 setTargets(targetsFormatted);
//             }

//             if (response.data.sentiment && response.data.sentiment.buckets) {
//                 const sentimentsFormatted = response.data.sentiment.buckets.map(bucket => ({
//                     value: bucket.key,
//                     label: bucket.key
//                 }));
//                 setSentiments(sentimentsFormatted);
//             }
//         } catch (err) {
//             console.error("Error fetching dropdowns:", err);
//         }
//     };

//     return { platforms, targets, sentiments, fileTypeOptions, fetchDropdowns };
// };

// export default useFilterDropdowns;
