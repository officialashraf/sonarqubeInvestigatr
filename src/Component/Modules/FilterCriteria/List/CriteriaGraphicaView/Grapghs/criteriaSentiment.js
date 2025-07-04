import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Cookies from "js-cookie";
import Loader from '../../../../Layout/loader';
import ReusablePieChart from '../../../../../Common/Charts/PieChrat/pieChart';


const CriteriaSentimentChart = () => {

  const token = Cookies.get("accessToken");
  let [data, setData] = useState([]);
  const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
  console.log("querUseselctor", queryPayload)
  const [loading, setLoading] = useState(true);

  const COLORS = {
    positive: "#556B2F",  //  Green for Positive
    negative: "#B22222",  //  Red for Negative
    neutral: "#CC5500"    //  Orange for Neutral
  };
  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setLoading(true);
        if (!token) {
          console.error("Token not found! Authentication required.");
          return;
        }
        console.log("querfunction", queryPayload)
        const payload = {
          query: {
            unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
            file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
            keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
          },
          aggs_fields: ["unified_type", "unified_record_type", "sentiment", "unified_date_only", "socialmedia_hashtags", "LOC", "EVENT", "ORG", "DATE", "LANGUAGE", "PERSON"],
          start_time: queryPayload?.start_time || "",
          end_time: queryPayload?.end_time || ""
        };

        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });

        console.log("queryPayload..", payload)
        console.log("Aggregate API Response:", response.data);
        // return response.data; // Return response for further use
        const { sentiment } = response.data;
        const chartData = Array.isArray(sentiment)
          ? sentiment.map(item => ({
            name: item.key, // Sentiment type (Positive/Negative)
            value: item.doc_count, // Count value
          }))
          : [];
        console.log("pieData", chartData)
        if (sentiment) {
          setData(chartData);
        } else {
          setData([]);
        }


      } catch (error) {
        console.error("API Request Failed:", error.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSentimentData();
  }, [queryPayload, token]);

  if (loading) {
    return <Loader />
  }
  return (
    <ReusablePieChart
  caseId={queryPayload.case_id}
  aggsFields={["sentiment"]}
  query={{
    file_type: queryPayload.file_type,
    keyword: queryPayload.keyword
  }}
  extraPayload={{
    start_time: queryPayload.start_time,
    end_time: queryPayload.end_time
  }}
/>

  );
};

export default CriteriaSentimentChart;

