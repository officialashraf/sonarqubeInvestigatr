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
    const [rawData, setRawData] = useState([]);
    const [showAll, setShowAll] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const MAX_BARS = 20
    const token = Cookies.get("accessToken");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const payload = queryPayload
                    ? {
                        query: {
                           unified_case_id: Array.isArray(queryPayload?.case_id)
                ? queryPayload.case_id
                : Array.isArray(queryPayload?.caseId)
                  ? queryPayload.caseId
                  : queryPayload?.case_id
                    ? [queryPayload.case_id]
                    : queryPayload?.caseId
                      ? [queryPayload.caseId]
                      : [],
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
                // const rawData = response.data[field] || [];
                // const transformed = transformData(rawData);
                // setBarData(transformed.length ? transformed : [{ name: 'No Data', value: 0 }]);

                const raw = response.data[field] || [];
                const transformed = transformData(raw);
                setRawData(transformed); //  Store full transformed data

                const limitedData = transformed.length > MAX_BARS ? transformed.slice(0, MAX_BARS) : transformed;
                setBarData(limitedData.length ? limitedData : [{ name: 'No Data', value: 0 }]);
            } catch (error) {
                console.error('Error fetching bar chart data:', error);
                setBarData([{ name: 'No Data', value: 0 }]);
            } finally {
                setLoading(false);
            }
        };

        if (caseId) fetchData();
    }, [caseId, aggsFields.join(','), queryPayload, token]);
useEffect(() => {
        if (showAll) {
            setBarData(rawData.length ? rawData : [{ name: 'No Data', value: 0 }]);
        } else {
            const limited = rawData.length > MAX_BARS ? rawData.slice(0, MAX_BARS) : rawData;
            setBarData(limited.length ? limited : [{ name: 'No Data', value: 0 }]);
        }
    }, [showAll, rawData]);
       
    if (loading) return <Loader />;
    return (
        <div className={styles.chartWrappers} >
            <div className={styles.chartWrapper} style={{ height: chartHeight }}>
                {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={Math.max(barData.length * 50, chartHeight)} >
                        <BarChart
                            data={barData}
                            layout="vertical"
                            barCategoryGap={30}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid horizontal={true} vertical={false} stroke='#F3F3F51A' />

                            <XAxis type="number"
                                tick={{ fill: '#fff', fontSize: 12 }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={200} // increase if needed
                                tick={<CustomYAxisTick />}
                                interval={0}
                            />

                            <Tooltip
                                wrapperStyle={{
                                    backgroundColor: "#0E2C46",
                                    border: "1px solid #3498db",
                                    borderRadius: "8px",
                                    padding: "8px",
                                    color: "#fff",
                                    maxWidth: "250px", // Fix max width
                                }}
                                contentStyle={{
                                    backgroundColor: "#0E2C46",
                                    border: "none",
                                    maxWidth: "250px",          //Add again for internal content box
                                    whiteSpace: "normal",       //Allow wrapping
                                    wordWrap: "break-word",     //Break long words
                                    overflowWrap: "break-word", //Better cross-browser wrapping
                                }}
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
            {rawData.length > MAX_BARS && (
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <span
                        onClick={() => setShowAll(!showAll)}
                        style={{
                            color: '#0073CF',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontWeight: 'bold',
                            fontSize: '14px',
                        }}
                    >
                        {showAll ? 'Show Less' : 'Show All'}
                    </span>
                </div>
            )}
        </div>
    );
};

export default ReusableBarChart;
const CustomYAxisTick = ({ x, y, payload }) => {
    const maxCharsPerLine = 25;

    // 🔹 Smart word break with hyphenation
    const breakTextWithHyphen = (text) => {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";

        for (let word of words) {
            // Long word - break it with hyphens
            if (word.length > maxCharsPerLine) {
                const parts = word.match(new RegExp(`.{1,${maxCharsPerLine - 1}}`, 'g')) || [];
                parts.forEach((part, index) => {
                    const withHyphen = index < parts.length - 1 ? `${part}-` : part;
                    if (currentLine.length + withHyphen.length <= maxCharsPerLine) {
                        currentLine += withHyphen;
                    } else {
                        lines.push(currentLine);
                        currentLine = withHyphen;
                    }
                });
            } else {
                if ((currentLine + word).length <= maxCharsPerLine) {
                    currentLine += (currentLine ? " " : "") + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    };

    const lines = breakTextWithHyphen(payload.value);

    return (
        <g transform={`translate(${x},${y})`}>
            <text
                x={0}
                y={0}
                textAnchor="end"
                fontSize={12}
                fill="#fff"
            >
                {lines.map((line, index) => (
                    <tspan
                        key={index}
                        x={0}
                        dy={index === 0 ? 0 : 14} // 14px spacing per line
                    >
                        {line}
                    </tspan>
                ))}
            </text>
        </g>
    );
};
