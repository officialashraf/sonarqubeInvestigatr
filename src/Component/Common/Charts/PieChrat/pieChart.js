import { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Cookies from 'js-cookie';
import Loader from '../../../Modules/Layout/loader';

const getCSSVar = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const COLORS = [
  getCSSVar('--color-colors-warning'),
  getCSSVar('--color-colors-success'),
  getCSSVar('--color-colors-danger'),
  getCSSVar('--color-colors-primaryAccent'),
   getCSSVar('--color-colors-copper2')
];

const ReusablePieChart = ({

  aggsFields = [],
  queryPayload = null,
  caseId = null,
  chartHeight = 300,
  transformData = (rawData) =>
    rawData.map(item => ({
      name: item.key,
      value: item.doc_count
    }))
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get('accessToken');

  useEffect(() => {
    if (!caseId || !aggsFields || aggsFields.length === 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Always convert caseId to string[]
        const caseIdArray = Array.isArray(queryPayload?.case_id)
          ? queryPayload.case_id
          : Array.isArray(queryPayload?.caseId)
            ? queryPayload.caseId
            : queryPayload?.case_id
              ? [queryPayload.case_id]
              : queryPayload?.caseId
                ? [queryPayload.caseId]
                : [];

        const unified_case_id = caseIdArray.map(String); // Always string[]

        // ✅ Prepare raw query object
        let query = {
          unified_case_id,
          file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
          targets: Array.isArray(queryPayload?.target) ? queryPayload.target : [],
          sentiment: Array.isArray(queryPayload?.sentiment) ? queryPayload.sentiment : [],
          keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
        };

        // ✅ Filter out empty fields
        query = Object.fromEntries(
          Object.entries(query).filter(
            ([, value]) =>
              Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ""
          )
        );

        // ✅ Create payload with optional start/end time
        const payload = queryPayload
          ? {
            query,
            aggs_fields: aggsFields,
            ...(queryPayload?.start_time && { start_time: queryPayload.start_time }),
            ...(queryPayload?.end_time && { end_time: queryPayload.end_time }),
          }
          : {
            query: { unified_case_id: [String(caseId)] },
            aggs_fields: aggsFields,
          };

        const response = await axios.post(
          `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        const field = aggsFields[0];
        const rawData = response.data[field] || [];
        const transformed = transformData(rawData);
        setData(transformed.length ? transformed : [{ name: 'No Data', value: 0 }]);

      } catch (error) {
        console.error('Error fetching pie chart data:', error);
        setData([{ name: 'No Data', value: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [caseId, aggsFields, token]);


  if (loading) return <Loader />;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          dataKey="value"
          stroke="#fff"
          strokeWidth={2}
          minAngle={3}
        >
          {data.map((entry, index) => {
            let fillColor;

            if (entry.name === "positive") {
              fillColor = getCSSVar('--color-colors-success');
            } else if (entry.name === "negative") {
              fillColor = getCSSVar('--color-colors-danger');
            } else if (entry.name === "neutral") {
              fillColor = getCSSVar('--color-colors-warning');
            } else if (entry.name === "Social Media") {
              fillColor = getCSSVar('--color-colors-warning');
            } else if (entry.name === "Rss Feed") {
              fillColor = getCSSVar('--color-colors-success');
            } else if (entry.name === "DeepWeb") {
              fillColor = getCSSVar('--color-colors-copper2');
            } else if (entry.name === "Web Feed") {
              fillColor = getCSSVar('--color-colors-primaryAccent');
            } else if (entry.name === "Dark Web") {
              fillColor = "#5C4033";
            }
            else {
              fillColor = COLORS[index % COLORS.length];
            }

            return (
              <Cell
                key={`cell-${index}`}
                fill={fillColor}
                strokeWidth={1}
              />
            );
          })}

        </Pie>

        <Tooltip
          wrapperStyle={{
            backgroundColor: "#0E2C46",
            border: "1px solid #3498db",
            borderRadius: "8px",
            padding: "8px",
          }}
          contentStyle={{
            backgroundColor: "#0E2C46",
            border: "none",
            color: "#fff",
          }}
          labelStyle={{ color: "#fff" }}
          cursor={{ fill: "#fff" }}
        />

        <Legend
          align="center"
          verticalAlign="bottom"
          layout="horizontal"
          iconType="circle"
          content={({ payload }) => (
            <ul style={{ display: 'flex', justifyContent: 'center', padding: 0, listStyle: 'none' }}>
              {payload.map((entry, index) => (
                <li
                  key={`item-${index}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: 15,
                    color: entry.color,
                    fontSize: 12,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: entry.color,
                      marginRight: 5,
                    }}
                  />
                  {entry.value} ({entry.payload.value})
                </li>
              ))}
            </ul>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ReusablePieChart;
