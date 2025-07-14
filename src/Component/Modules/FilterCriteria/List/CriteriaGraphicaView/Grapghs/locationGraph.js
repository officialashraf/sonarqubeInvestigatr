import { useSelector } from 'react-redux';
import ReusableBarChart from '../../../../../Common/Charts/BarChart/CommonBarChart';
// import '../../../../Summarymain/summary.css';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../../../Layout/loader';


const LocationGraph = () => {
    const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
    // const token = Cookies.get("accessToken");
    // const [barData, setBarData] = useState([]);
    // const [activeIndex, setActiveIndex] = useState(null);
    // const [loading, setLoading] = useState(false);


    // useEffect(() => {
    //     const fetchData = async () => {

    //         try {
    //             setLoading(true)
    //             const payload = {
    //                 query: {
    //                     unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
    //                     file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
    //                     keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
    //                 },
    //                 aggs_fields: ["LOC"],
    //                 start_time: queryPayload?.start_time || "",
    //                 end_time: queryPayload?.end_time || ""
    //             };
    //             const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload,
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }

    //             );

    //             console.log("LocationBar data:", response.data);

    //             const { LOC } = response.data;
    //             const barData = (LOC || []).map(item => ({
    //                 name: item.key.split('-').slice(0, 3).join(''),
    //                 value: item.doc_count
    //             }));

    //             if (barData.length === 0) {
    //                 barData.push({ name: 'No Data', value: 0 });
    //             }
    //             setBarData(barData);

    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //             setBarData([{ name: 'No Data', value: 0 }]);

    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, [queryPayload, token]);

    // if (loading) {
    //     return <Loader />;
    // }
    return (
        <>
         <ReusableBarChart
          caseId={queryPayload?.case_id || []}
          aggsFields={["loc"]}
           queryPayload={queryPayload}
          transformData={(rawData) =>
            rawData.map(item => ({
              name: item.key,
              value: item.doc_count
            }))
          }
        />
        </>
    );
};

export default LocationGraph;