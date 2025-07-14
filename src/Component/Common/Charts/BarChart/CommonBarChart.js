// ✅ src/components/common/BarChart/ReusableBarChart.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import Cookies from 'js-cookie';
import Loader from '../../../Modules/Layout/loader';
import styles from './barchart.module.css';

const ReusableBarChart = ({
    aggsFields = [],
queryPayload = null,
 caseId = null,
    chartHeight = 280,
    transformData = (rawData) => rawData.map(item => ({
        name: item.key.split('-').slice(0, 3).join(''),
        value: item.doc_count
    })),
    // query = {},
}) => {
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const token = Cookies.get("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                 const payload = queryPayload
          ? {
              query: {
                unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
                file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
                keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
              },
              aggs_fields: aggsFields,
              start_time: queryPayload?.start_time || "",
              end_time: queryPayload?.end_time || ""
            }
          : {
              query: { unified_case_id: String(caseId) },
              aggs_fields: aggsFields
            };

                const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

                const field = aggsFields[0];
                const rawData = response.data[field] || [];
                const transformed = transformData(rawData);
                setBarData(transformed.length ? transformed : [{ name: 'No Data', value: 0 }]);

            } catch (error) {
                console.error('Error fetching bar chart data:', error);
                setBarData([{ name: 'No Data', value: 0 }]);
            } finally {
                setLoading(false);
            }
        };

        if (caseId) fetchData();
    }, [caseId, aggsFields.join(','), queryPayload, token]);

    if (loading) return <Loader />;
    return (
         <div className={styles.chartWrappers} >
        <div className={styles.chartWrapper} style={{ height: chartHeight }}>
            {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={Math.max(barData.length * 30, chartHeight)} >
                    <BarChart
                        data={barData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid  horizontal={true} vertical={false}  stroke='#F3F3F51A'/>

                        <XAxis type="number"
         tick={{ fill: '#fff', fontSize:10 }}
                        />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fontSize: 8, width: 150, wordWrap: "break-word", fill: '#fff' }} 
                        />
                     <Tooltip
                    wrapperStyle={{
                      backgroundColor: "#0E2C46",
                      border: "1px solid #3498db",
                      borderRadius: "8px",
                      padding: "8px",
                      color: "#fff"
                    }}
                    contentStyle={{ backgroundColor: "#0E2C46", border: "none" }}
                    labelStyle={{ color: "#D6D6D6" }}
                    cursor={{ fill: "#1c2833" }}
                  />
                        <Bar
                            dataKey="value"
                            fill="#0073CF"
                            barSize={15}
                            isAnimationActive={false}
                        >
                            {barData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === activeIndex ? "#2980b9" : "#0073CF"}
                                    radius={8}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(null)}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className={styles.noData}>No Data Available</div>
            )}
        </div>
        </div>
    );
};

export default ReusableBarChart;
