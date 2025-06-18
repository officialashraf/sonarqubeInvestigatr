import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import './lineChart.css'
import Cookies from "js-cookie";
import Loader from '../../Layout/loader';
import { toast } from 'react-toastify';

const LineGraph = () => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [recordTypes, setRecordTypes] = useState([]);
  const caseId = useSelector((state) => state.caseData.caseData.id);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {

    const fetchLineData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
          query: { unified_case_id: String(caseId) },

          aggs_fields: ["unified_date_only", "unified_record_type"]
        },
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

          console.log("LineGraph - recordTypes:", recordTypes);

        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.detail) {
          toast.error(error.response.data.detail)
          console.error("Backend error:", error.response.data.detail);
        } else {
          console.error("An error occurred:", error.message);
        }
        console.error('Error fetching data:', error);
        setData([]);
        setRecordTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLineData();
  }, [caseId, token]);

  if (loading) {
    console.log("Loading state is TRUE");
    return <  Loader style={{ marginTop: '-120px' }} />
  }

  return (

    <div style={{ width: "100%", height: 250, overflowX: "auto", whiteSpace: "nowrap" }}>
      {data.length > 0 ? (

        <ResponsiveContainer minWidth={600} height={200}> {/*  Ensures enough space */}

          <LineChart
            data={data}
            margin={{ right: 80 }}

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

export default LineGraph;
