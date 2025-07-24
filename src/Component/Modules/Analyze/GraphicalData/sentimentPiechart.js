import ReusablePieChart from '../../../Common/Charts/PieChrat/pieChart';
import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';


const SentimentPieChart = () => {
  const caseId = useSelector(state => state.caseData.caseData.id);
  
  // const token = Cookies.get("accessToken");
  // const [loading, setLoading] = useState(true); // Add loading state
  // let [data, setData] = useState([]);

  // const COLORS = {
  //   positive: "#556B2F",  //  Green for Positive
  //   negative: "#B22222",  //  Red for Negative
  //   neutral: "#CC5500"    //  Orange for Neutral
  // };

  // useEffect(
  //   () => {
  //     const fetchData = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await axios.post(
  //           `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`,
  //           {
  //             query: { unified_case_id: String(caseId) },
  //             aggs_fields: ["sentiment"]
  //           },
  //           {
  //             headers: {
  //               "Content-Type": "application/json",
  //               Authorization: `Bearer ${token}`
  //             }
  //           }
  //         );

  //         console.log("sentiment", response.data.sentiment);

  //         const { sentiment } = response.data;
  //         const chartData = Array.isArray(sentiment)
  //           ? sentiment.map(item => ({
  //             name: item.key, // Sentiment type (Positive/Negative)
  //             value: item.doc_count // Count value
  //           }))
  //           : [];
  //         console.log("pieData", chartData);
  //         if (sentiment) {
  //           setData(chartData);
  //         } else {
  //           setData([]);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //         setData([]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   },
  //   [caseId, token]

  // );

  // if (loading) {
  //   return <Loader />
  // }
  const aggsFields = ['sentiment'];
  return (
    <ReusablePieChart
      caseId={caseId}
      aggsFields={aggsFields}
    />
  )
};
SentimentPieChart.displayName = 'SentimentPieChart';
export default SentimentPieChart;

