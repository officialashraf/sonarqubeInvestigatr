import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import "../../../../Analyze/GraphicalData/lineChart.css";
import Cookies from "js-cookie";
import Loader from '../../../../Layout/loader';

const CriteriaLineChart = () => {

  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [recordTypes, setRecordTypes] = useState([]);
  const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKeywordData = async () => {
      try {
        setLoading(true);
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
        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload,
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
console.log("CriteriaLineChart - recordTypes:", recordTypes);

        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setRecordTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();

  }, [queryPayload, token]);
  if (loading) {
    return <Loader style={{ marginTop: '-120px' }} />
  }

  return (
   <div style={{ width: "100%", height: 250, overflowX: "auto",}}>
      {data.length > 0 ? (
   <ResponsiveContainer minWidth={600} height={210}> 
          <LineChart
            data={data}
            margin={{ right: 80,top: 20 }}

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

      {/* <div className="w-full mt-2">
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
      </div> */}
    </div>
  );
};

export default CriteriaLineChart;