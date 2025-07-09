import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import Cookies from "js-cookie";
import Loader from '../../../Modules/Layout/loader';
import { toast } from 'react-toastify';

const ReusableLineGraph = ({ 
  queryPayload = null, 
  caseId = null, 
  aggsFields = [], 
  recordLineField = null, 
  title = "" 
}) => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [recordTypes, setRecordTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Payload selection logic
        const payload = queryPayload
          ? {
              query: {
                unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
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
          },
        });

        const { unified_date_only } = response.data;
        const recordData = recordLineField ? response.data[recordLineField] : [];

        const sortedDateData = (unified_date_only || []).sort((a, b) => new Date(a.key) - new Date(b.key));
        setData(sortedDateData);
        setRecordTypes(recordData || []);

      } catch (error) {
        if (error.response?.data?.detail) {
          toast.error(error.response.data.detail);
        }
        console.error('Error fetching data:', error);
        setData([]);
        setRecordTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId, queryPayload, token]);

  if (loading) return <Loader style={{ marginTop: '-120px',color:'white' }} />;

  return (
    <div style={{ width: "100%", height: 250, overflowX: "auto", whiteSpace: "nowrap" }}>
      {data.length > 0 ? (
       <ResponsiveContainer minWidth={500} height={200}>
  <LineChart data={data} margin={{ right:20, top: 20 }}>
    <CartesianGrid horizontal={true} vertical={false} stroke="#38444d" strokeDasharray="3 3" />
    
    <XAxis dataKey="key" tick={{ fill: '#E0E0E0', fontSize: 12 }} />
    <YAxis tick={{ fill: '#E0E0E0', fontSize: 12 }} />
    
    <Tooltip
      content={({ payload }) =>
        payload?.length ? (
          <div style={{ background: "#fff", padding: "6px 10px", borderRadius: "6px", boxShadow: "0 0 4px rgba(0,0,0,0.2)" }}>
            <p style={{ margin: 0, color: "#333", fontWeight: "500" }}>{payload[0].payload.key}</p>
            <p style={{ margin: 0, color: "#555" }}>doc_count: {payload[0].value}</p>
          </div>
        ) : null
      }
    />

    {/* {recordTypes.length > 0 && recordLineField && recordTypes.map((type, index) => (
      <ReferenceLine
        key={index}
        y={type.doc_count}
        stroke="#8884d8"
        strokeWidth={1.5}
        strokeDasharray="4 4"
        label={{
          value: `${type.key} (${type.doc_count})`,
          position: 'right',
          fill: '#E0E0E0',
          fontSize: 11,
        }}
      />
    ))} */}

    <Line
      type="monotone"
      dataKey="doc_count"
      stroke="#0073CF"
      strokeWidth={2.5}
      dot={{ r: 4, stroke: '#fff', strokeWidth: 2, fill: '#0073CF' }}
      activeDot={{ r: 6 }}
    />
  </LineChart>
</ResponsiveContainer>

      ) : (
        <div className="h-[150px] flex items-center justify-center">
          <p className="text-gray-500 text-xl">No Data Available</p>
        </div>
      )}
    </div>
  );
};

export default ReusableLineGraph;
