import { useSelector } from 'react-redux';
import ReusableBarChart from '../../../Common/Charts/BarChart/CommonBarChart';
// import '../../Summarymain/summary.css';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';

const LanguageBar = () => {
    const caseId = useSelector((state) => state.caseData.caseData.id);
    // console.log("casiId", caseId)
    // const token = Cookies.get("accessToken");
    // const [barData, setBarData] = useState([]);
    // const [loading, setLoading] = useState(false);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             setLoading(true)
    //             const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
    //                 query: { unified_case_id: String(caseId) },

    //                 aggs_fields: ["LANGUAGE"]
    //             },
    //                 {
    //                     headers: {
    //                         "Content-Type": "application/json",
    //                         Authorization: `Bearer ${token}`,
    //                     },
    //                 }

    //             );

    //             console.log("LANGUAGEBar data:", response.data);

    //             const { LANGUAGE } = response.data;
    //             const barData = (LANGUAGE || []).map(item => ({
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
    // }, [caseId, token]);


    // if (loading) {
    //     return <Loader />;
    // }
    return (
        <>
            <ReusableBarChart
                caseId={caseId}
                aggsFields={["language"]}
                query={{}} // if extra filters needed
                chartHeight={280}
                transformData={(rawData) =>
                    rawData.map(item => ({
                        name: item.key.split('-').slice(0, 3).join(''),
                        value: item.doc_count
                    }))
                }
            />
        </>
    );
};

export default LanguageBar;