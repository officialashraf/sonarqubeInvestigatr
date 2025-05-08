import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box, Slider } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid,ResponsiveContainer, ReferenceLine } from 'recharts';
import  "../../../Analyze/GraphicalData/lineChart.css";
import Cookies from "js-cookie";

const CriteriaLineChart = () => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [recordTypes, setRecordTypes] = useState([]);
  // const caseId = useSelector((state) => state.caseData.caseData.id);
  const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const payload = {
          query: {
              unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
              file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
              keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
          },
          aggs_fields: ["unified_type", "unified_record_type", "sentiment", "unified_date_only", "socialmedia_hashtags"],
          start_time: queryPayload?.start_time || "",
          end_time: queryPayload?.end_time || ""
      };
        const response = await axios.post('http://5.180.148.40:9007/api/das/aggregate', payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

        console.log("line", response);

        const { unified_date_only, unified_record_type } = response.data;

        if (unified_date_only) {
          setData(unified_date_only);
        } else {
          setData([]);
        }

        if (unified_record_type) {
          setRecordTypes(unified_record_type);
         

        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setRecordTypes([]);
      }
    };

    fetchData();
  }, [queryPayload]);

  return (
    <Box className="mt-1 h-[200px]">
      {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={150}>
        <LineChart 
          // width={1200} 
          // height={150} 
          data={data}
          margin={{  right: 50}}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="key" 
            tick={{ fontSize: 12 }} 
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
          />
          <Tooltip 
            content={({ payload }) => 
              payload?.length ? (
                <div className="bg-white p-2 border rounded shadow">
                  <p>{payload[0].payload.key}</p>
                  <p>doc_count: {payload[0].value}</p>
                </div>
              ) : null
            } 
          />
          <Legend />

          {/* Horizontal Reference Lines for each record type */}
        {recordTypes.length > 0 ? recordTypes.map((type, index) => (
  <ReferenceLine
    key={index}
    y={type.doc_count}
    stroke="black"
    strokeWidth={2}
    // strokeDasharray="5 5"
    label={{
      value: `${type.key} (${type.doc_count})`,
      position: 'right',
      fill: 'black',
      fontSize: 12,
      fontWeight: 'bold'
    }}
  />
)) : console.log("No Record Types Found")}

          {/* Curved Line for date-wise doc_count */}
          <Line
            type="monotone"
            dataKey="doc_count"
            stroke="black"
            fill="black"
            strokeWidth={2}
            dot={{ r: 3 }} // Small dots on points
          />
        </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[150px] flex items-center justify-center">
          <p className="text-gray-500 text-xl">No Data Available</p>
        </div>
      )}

      <div className="w-full mt-2">
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          step={1}
          className="w-full"
          stroke="gray"
          style={{
       
          }}
        />
      </div>
    </Box>
  );
};

export default CriteriaLineChart;