import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import '../../../../Summarymain/summary.css';
import Cookies from "js-cookie";
import Loader from '../../../../Layout/loader';
import ReusableBarChart from '../../../../../Common/Charts/BarChart/CommonBarChart';

const PersonGraph = () => {

    const token = Cookies.get("accessToken");
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(false);
    const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const payload = {
                    query: {
                        unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
                        file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
                        keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
                    },
                    aggs_fields: ["PERSON"],
                    start_time: queryPayload?.start_time || "",
                    end_time: queryPayload?.end_time || ""
                };
                const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }

                );

                console.log("PERSONGraph data:", response.data);

                const { PERSON } = response.data;
                const barData = (PERSON || []).map(item => ({
                    name: item.key.split('-').slice(0, 3).join(''),
                    value: item.doc_count
                }));

                if (barData.length === 0) {
                    barData.push({ name: 'No Data', value: 0 });
                }
                setBarData(barData);

            } catch (error) {
                console.error('Error fetching data:', error);
                setBarData([{ name: 'No Data', value: 0 }]);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [queryPayload, token]);

    const [activeIndex, setActiveIndex] = useState(null);
    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <ReusableBarChart
  caseId={queryPayload?.case_id || []}
  aggsFields={["person"]}
  query={{
    file_type: queryPayload?.file_type || [],
    keyword: queryPayload?.keyword || [],
    start_time: queryPayload?.start_time || "",
    end_time: queryPayload?.end_time || ""
  }}
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

export default PersonGraph;
