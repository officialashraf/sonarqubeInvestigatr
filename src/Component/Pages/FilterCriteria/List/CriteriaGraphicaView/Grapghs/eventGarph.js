import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import '../../../../Summarymain/summary.css';
import Cookies from "js-cookie";
import Loader from '../../../../Layout/loader';

const EventGraph = () => {

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
                    aggs_fields: ["EVENT"],
                    start_time: queryPayload?.start_time || "",
                    end_time: queryPayload?.end_time || ""
                };
                const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH }/api/das/aggregate`, payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }

                );

                console.log("EVENTBar data:", response.data);

                const { EVENT } = response.data;
                const barData = (EVENT || []).map(item => ({
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
            <div style={{ width: '100%', height: 280, overflowY: 'auto' }}>
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(barData.length * 30, 280)}>
                        <BarChart
                            data={barData}
                            layout="vertical" // Set layout to vertical for horizontal bars
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" /> {/* XAxis represents numerical values */}
                            <YAxis dataKey="name" type="category" /> {/* YAxis represents categories */}
                            <Tooltip
                                wrapperStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "5px",
                                    fontSize: "10px"
                                }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#333"
                                barSize={15}
                                isAnimationActive={false}
                            >
                                {barData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={index === activeIndex ? "#555" : "#333"} // Change color on hover
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onMouseLeave={() => setActiveIndex(null)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-[150px] flex items-center justify-center">
                        <p className="text-gray-500 text-xl">No Data Available</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default EventGraph;