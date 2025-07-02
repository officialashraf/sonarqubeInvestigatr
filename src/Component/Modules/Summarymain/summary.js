import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { FaRss, FaFacebookF, FaTwitter, FaInstagram, FaVk, FaTiktok, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import './summary.css';
import styles from "./record.module.css";
import Cookies from "js-cookie";


const Summary = ({ filters }) => {

  const token = Cookies.get("accessToken");
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const caseId = useSelector((state) => state.caseData.caseData.id);
  console.log("casiId", caseId)

const iconMap = {
  facebook: <FaFacebookF  size={20} />,
  twitter: <FaTwitter  size={20} />,
  instagram: <FaInstagram  size={20} />,
  youtube: <FaYoutube  size={20} />,
  "rss feed": <FaRss  size={20} />,
  linkedin: <FaLinkedinIn  size={20} />,
  vk: <FaVk  size={20} />,
  tiktok: <FaTiktok  size={20} />,
};
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
          query: { unified_case_id: String(caseId) },

          aggs_fields: ["unified_record_type", "unified_date_only", "unified_type"]
        },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }

        );
        console.log("summary data:", response.data);

        const { unified_record_type, unified_date_only, unified_type } = response.data;
        const pieData = (unified_record_type || []).map(item => ({
          name: item.key,
          value: item.doc_count
        }));

        if (pieData.length === 0) {
          pieData.push({ name: 'No Data', value: 0 });
        }
        const barData = (unified_date_only || []).map(item => ({
          name: item.key.split('-').slice(0, 3).join(''),
          value: item.doc_count,

        }));

        if (barData.length === 0) {
          barData.push({ name: 'No Data', value: 0 });
        }

        //Table Data (unified_type)
        const tableData = (unified_type || []).map(item => {
  const key = item.key.toLowerCase().trim();  // space, caps handle
  return {
    icon: iconMap[key] || <FaRss color="#ccc" size={22} />,  // fallback
    name: item.key,
    value: item.doc_count,
  };
});

        console.log("tabledtaa", tableData)
        //  Set States
        setPieData(pieData);
        setBarData(barData);
        setTableData(tableData);
        setTotalCount(tableData.reduce((sum, item) => sum + item.value, 0));

      } catch (error) {
        console.error('Error fetching data:', error);
        setPieData([{ name: 'No Data', value: 0 }]);
        setBarData([{ name: 'No Data', value: 0 }]);
        setTableData([]);
        setTotalCount(0);
      }
    };

    fetchData();
  }, [caseId, token]);

  const getCSSVar = (variable) =>
    getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

  const COLORS = [
    getCSSVar('--color-colors-warning'),
    getCSSVar('--color-colors-success'),
    getCSSVar('--color-colors-danger')
  ];

  // const togglePopup = () => {
  //   setShowPopup((prev) => !prev);
  // };
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <>
<h6 style={{ textAlign: "center" }}> FilterCount: {filters}</h6>
      <div className='container-fluid'>
        <Box width="100%">
          <div className='graphchats'>
            <Box className="box">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    stroke="#fff"             //  Pie section borders white
                    strokeWidth={2}           //  Partition thickness
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        // stroke="#000"        //  Outer boundary black
                        strokeWidth={1}
                      />
                    ))}
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
                      color: "#fff",     //  yeh add karo
                    }}
                    labelStyle={{ color: "#fff" }}  //  label ka text bhi white
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
                            {entry.value}({entry.payload.value})
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Bar Chart */}
            <Box className="box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>


                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#D6D6D6", fontSize: 12 }}
                    axisLine={{ stroke: "#1c2833" }}
                    tickLine={{ stroke: "#1c2833" }}
                  />
                  <YAxis
                    tick={{ fill: "#D6D6D6", fontSize: 12 }}
                    axisLine={{ stroke: "#1c2833" }}
                    tickLine={{ stroke: "#1c2833" }}
                  />

                  <Tooltip
                    wrapperStyle={{
                      backgroundColor: "#0E2C46",
                      border: "1px solid #3498db",
                      borderRadius: "8px",
                      padding: "8px",
                      color: "#fff"
                    }}
                    contentStyle={{ backgroundColor: "#0E2C46", border: "none" }}
                    labelStyle={{ color: "#D6D6D6" }}
                    cursor={{ fill: "#1c2833" }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#3498db"
                    barSize={15}
                    radius={[8, 8, 8, 8]}
                    isAnimationActive={false}
                  >
                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === activeIndex ? "#2980b9" : "#3498db"}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* Table */}
            <Box className="box">
              <div className={styles.card}>
      {tableData.map((item, index) => (
        <div className={styles.row} key={index}>
          <div className={styles.left}>
            <div className={styles.icon}>{item.icon}</div>
            <div>
             <p className={styles.name}>{item.name}</p>
             <p className={styles.count}>{item.value}</p>
             </div>
          </div>
         
        </div>
      ))}

      <div className={styles.footer}>
        <span>Total:</span>
        <span>{totalCount}</span>
      </div>
    </div>
            </Box>
          </div >
        </Box >
      </div >
    </>
  );

};

export default Summary;
