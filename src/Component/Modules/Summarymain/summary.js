import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Box } from '@mui/material';
import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell } from 'recharts';
import { FaRss, FaFacebookF, FaTwitter, FaInstagram, FaVk, FaTiktok, FaYoutube, FaLinkedinIn } from "react-icons/fa";
import style from './summary.module.css';
import styles from "./record.module.css";
import Cookies from "js-cookie";
import ReusablePieChart from '../../Common/Charts/PieChrat/pieChart';

const Summary = ({ filters }) => {

  const token = Cookies.get("accessToken");
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
 

  const caseId = useSelector((state) => state.caseData.caseData.id);
  console.log("casiId", caseId)

  const iconMap = {
    facebook: <FaFacebookF size={20} />,
    x: <FaTwitter size={20} />,
    instagram: <FaInstagram size={20} />,
    youtube: <FaYoutube size={20} />,
    "rss feed": <FaRss size={20} />,
    linkedin: <FaLinkedinIn size={20} />,
    vk: <FaVk size={20} />,
    tiktok: <FaTiktok size={20} />,
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
        const pieData = (unified_type || []).map(item => ({
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
        const tableData = (unified_record_type || []).map(item => {
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
 
  return (
    <>
      <h6 style={{ textAlign: "center" }}> FilterCount: {filters}</h6>
      <div className={style.containerFluid}>
        <Box width="100%">
          <div className={style.graphchats}>
            <Box className={style.boxes}>

              <ReusablePieChart
                caseId={caseId}
                aggsFields={["unified_type"]}
              />

            </Box>

            {/* Bar Chart */}
            <Box className={style.boxes} >
              {/* <ResponsiveContainer width="100%" height={300} style={{ overflow: 'auto'}}>
                <BarChart data={barData}>


                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#D6D6D6", fontSize: 8 }}
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
              </ResponsiveContainer> */}
                <BarWithHover barData={barData}/>
            </Box>

            {/* Table */}
            <Box className={style.boxes} >
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

const BarWithHover = ({ barData}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
     <div style={{ overflowX: 'auto', width: '100%' }}>
    <div style={{ width: `${barData.length * 80}px` }}>
    <ResponsiveContainer width="100%" height={300} style={{ overflow: 'auto'}}>
                <BarChart  width={barData.length * 80} data={barData}>


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
                  </div>
  </div>
  );
};

