import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import '../../Summarymain/summary.css';
import Cookies from "js-cookie";
import Loader from '../../Layout/loader';

const DateBar = () => {

    const token = Cookies.get("accessToken");
    const [barData, setBarData] = useState([]);
    const [loading, setLoading] = useState(false);
    const caseId = useSelector((state) => state.caseData.caseData.id);
    console.log("casiId", caseId)

    useEffect(() => {
        const fetchData = async () => {

            try {
                setLoading(true);
                const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
                    query: { unified_case_id: String(caseId) },

                    aggs_fields: ["DATE"]
                },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }

                );

                console.log("DATEationBar data:", response.data);

                const { DATE } = response.data;
                const barData = (DATE || []).map(item => ({
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
    }, [caseId, token]);

    const [activeIndex, setActiveIndex] = useState(null);
    if (loading) {
        return <Loader />;
    }
    return (
        <>
            <div style={{ width: '100%', height: 280,overflowY:'auto' }}>
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(barData.length * 30, 280)}>
                        <BarChart
                            data={barData}
                            layout="vertical" // Set layout to vertical for horizontal bars
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" /> {/* XAxis represents numerical values */}
                            <YAxis dataKey="name" type="category" tick={{ fontSize: 8, width: 150 ,wordWrap: "break-word",color:'black'}}/> {/* YAxis represents categories */}
                            <Tooltip
                                wrapperStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    padding: "5px",
                                                                   }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#333"
                                barSize={15}
                                isAnimationActive={false}
                                fontSize={1}
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

export default DateBar;