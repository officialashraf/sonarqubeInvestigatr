import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from "js-cookie";

const SentimentPieChart = () => {
  const token = Cookies.get("accessToken");
  let [data, setData] = useState([]);

  const caseId = useSelector((state) => state.caseData.caseData.id);
  //  data = [
  //   { name: 'Positive', value: 120 },
  //   { name: 'Negative', value: 80 },
  // ];

  const COLORS = [ '#000000','#000000'];

  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.post('http://5.180.148.40:9007/api/das/aggregate', {
            query: { unified_case_id: String(caseId) },
            aggs_fields: ["sentiment"]
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
          console.log("sentiment", response.data.sentiment);
  
          const { sentiment } = response.data;
          const chartData = Array.isArray(sentiment)
  ? sentiment.map(item => ({
      name: item.key, // Sentiment type (Positive/Negative)
      value: item.doc_count, // Count value
    }))
  : [];
  console.log("pieData",chartData)
          if (sentiment) {
            setData(chartData);
          } else {
            setData([]);
          }
  
        
        } catch (error) {
          console.error('Error fetching data:', error);
          setData([]);
        
        }
      };
  
      fetchData();
    }, [caseId]);
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
      <PieChart  height={250}>
  <Legend
    align="center"
    verticalAlign="top"
    formatter={(value, entry) => `${value}: ${entry.payload.value}`}
  />
  <Pie
 
    data={data}
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={80}
    fill='#000000'
    dataKey="value"
    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip formatter={(value) => `Total: ${value}`} />
</PieChart>

      </ResponsiveContainer>
    </div>
  );
};

export default SentimentPieChart;
