import { useSelector } from 'react-redux';
import ReusableBarChart from '../../../../../Common/Charts/BarChart/CommonBarChart';
// import '../../../../Summarymain/summary.css';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../../../Layout/loader';


const OrgGraph = () => {
    const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
    //     const token = Cookies.get("accessToken");
    //     const [barData, setBarData] = useState([]);
    //     const [loading, setLoading] = useState(false);

    //   const caseIds = Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [];
    //   const fileTypes = Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [];
    //   const keywords = Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [];
    //     useEffect(() => {
    //         const fetchData = async () => {
    //             try {
    //                 setLoading(true);
    //                 const payload = {
    //                     query: {
    //                         unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
    //                         file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
    //                         keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
    //                     },
    //                     aggs_fields: ["ORG"],
    //                     start_time: queryPayload?.start_time || "",
    //                     end_time: queryPayload?.end_time || ""
    //                 };
    //                 const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload,
    //                     {
    //                         headers: {
    //                             "Content-Type": "application/json",
    //                             Authorization: `Bearer ${token}`,
    //                         },
    //                     }

    //                 );

    //                 console.log("ORGBar data:", response.data);

    //                 const { ORG } = response.data;
    //                 const barData = (ORG || []).map(item => ({
    //                     name: item.key.split('-').slice(0, 3).join(''),
    //                     value: item.doc_count
    //                 }));

    //                 if (barData.length === 0) {
    //                     barData.push({ name: 'No Data', value: 0 });
    //                 }
    //                 setBarData(barData);

    //             } catch (error) {
    //                 console.error('Error fetching data:', error);
    //                 setBarData([{ name: 'No Data', value: 0 }]);

    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchData();
    //     }, [queryPayload, token]);

    //     const [activeIndex, setActiveIndex] = useState(null);
    //     if (loading) {
    //         return <Loader />;
    //     }
    return (
        <>
            <ReusableBarChart
                caseId={queryPayload?.case_id || []}
                aggsFields={["org"]}
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

export default OrgGraph;