import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from "js-cookie";
import Loader from '../../Layout/loader';

const SentimentPieChart = () => {
  const token = Cookies.get("accessToken");
  const [loading, setLoading] = useState(true); // Add loading state
  let [data, setData] = useState([]);

  const caseId = useSelector(state => state.caseData.caseData.id);

const COLORS = {
  positive: "#556B2F",  //  Green for Positive
  negative: "#B22222",  //  Red for Negative
  neutral: "#CC5500"    //  Orange for Neutral
};

  useEffect(
    () => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`,
            {
              query: { unified_case_id: String(caseId) },
              aggs_fields: ["sentiment"]
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              }
            }
          );

          console.log("sentiment", response.data.sentiment);

          const { sentiment } = response.data;
          const chartData = Array.isArray(sentiment)
            ? sentiment.map(item => ({
              name: item.key, // Sentiment type (Positive/Negative)
              value: item.doc_count // Count value
            }))
            : [];
          console.log("pieData", chartData);
          if (sentiment) {
            setData(chartData);
          } else {
            setData([]);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    },
    [caseId, token]

  );

  if (loading) {
    return <Loader />
  }
  return <div style={{ width: "100%", height: 250, overflowX: "auto" }}> {/* Enables horizontal scroll */}
    {data.length > 0 ? (
        <ResponsiveContainer width={350}> {/* Set fixed width to allow scrolling */}
            <PieChart height={250}>
                <Legend align="center" verticalAlign="top" formatter={(value, entry) => `${value}: ${entry.payload.value}`} />
                <Pie 
                    data={data} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={80} 
                    fill="#000000" 
                    dataKey="value" 
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name] || "#000000"} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => `Total: ${value}`} />
            </PieChart>
        </ResponsiveContainer>
    ) : (
        <div className="h-[150px] flex items-center justify-center">
            <p className="text-gray-500 text-xl">No data available</p>
        </div>
    )}
</div>;
};

export default SentimentPieChart;

