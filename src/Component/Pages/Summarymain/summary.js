// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import ProgressRow from "./Summary/progressBar.js";
// import { Container, Box, Typography, Table, TableContainer,TableFooter, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
// import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid,Cell, Tooltip as BarTooltip } from 'recharts';
// import AddFilter2 from '../AddExistingFilter/addFilter2.js';
// import { light } from '@mui/material/styles/createPalette.js';
// import  '../../../../Assets/Stlyes/summary.css'

// const Summary = ({filters}) => {
//   console.log(filters,"hshs")
//   const [pieData, setPieData] = useState([]);
//   const [barData, setBarData] = useState([]);
//   const [tableData, setTableData] = useState([]);
//   const [totalCount, setTotalCount] = useState(0);
//   const [showPopup, setShowPopup] = useState(false);

//   const caseId = useSelector((state) => state.caseData.caseData.id);
// console.log("caseId", caseId)
// const filterCount = useSelector((state) => state.filterCount.filterCount.count);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.post('http://5.180.148.40:9005/api/das/aggregate', {
//           query: {
//             unified_case_id: caseId
//           },
//           aggs_fields:["socialmedia_hashtags", "unified_record_type", "unified_date_only", "unified_type"]
//         });
//         console.log("summrydatata", response.data)
//         const { social_media, rss, dates } = response.data;

//         // Determine the data for the pie chart
//         let pieSource = [];
//         if (social_media) pieSource.push({ name: 'Social Media', value: social_media.length });
//         if (rss) pieSource.push({ name: 'RSS', value: rss.length });

//         if ( response.data.social_media.length === 0) {
//           pieSource.push({ name: 'No Data', value: 0 });
//         }


//         const isWithinLastWeek = (date) => {
//           const now = new Date();
//           const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
//           return new Date(date) >= oneWeekAgo && new Date(date) <= now;
//         };

//         // Filter dates for the last week and map to barData
//         const barData = dates.length > 0 ? dates
//           .filter(item => isWithinLastWeek(item.key))
//           .map(item => ({
//             name: item.key,
//             value: item.doc_count
//           })) : [{ name: 'No Data', value: 0 }];

//         // Determine the data for the table
//         const tableData = (social_media || []).concat(rss || []);
//         const totalCount = tableData.reduce((sum, item) => sum +(item.doc_count || 0), 0);

//         setPieData(pieSource);
//         setBarData(barData);
//         setTableData(tableData);
//         setTotalCount(totalCount);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setPieData([{ name: 'No Data', value: 0 }]);
//         setTableData([]);
//         setTotalCount(0);
//       }
//     };

//     fetchData();
//   }, [caseId]);
//   const togglePopup = () => {
//     setShowPopup((prev) => !prev);
//   }; 


//   return (
//     <>
//     <Container>
//       <Box width="100%">
//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} mt={2}>
//           <h5 variant="h5">Summary</h5>
//         </Box>
//         <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1} mt={2}>
//     <button  className="add-new-filter-button" onClick={togglePopup}>Add Resources</button>
//   </Box>
//   <ProgressRow  label="Overall Progress" />
//       <h5 style={{textAlign:"center"}}> FilterCount:{filters}</h5>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
//           <Box width={400} height={300} className="box">
//             <ResponsiveContainer width={400} height={300}>

//               <PieChart>
//               <Legend align="center" verticalAlign="top" />
//                 <Pie
//                   data={pieData}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={80}
//                   fill="#333"
//                   dataKey="value"
//                   label={({ name }) =>name }
//                 >
//                 {pieData.map((entry, index) => (
//           <Cell key={`cell-${index}`} fill="#333">


//           </Cell>))}
//                 </Pie>

//                 <Tooltip
//               formatter={() => ` Total: ${totalCount}`}
//                 />

//               </PieChart>
//             </ResponsiveContainer>
//           </Box>

//           <Box width={400} height={300} className="box">
//             <ResponsiveContainer width={400} height={300}>
//               <BarChart data={barData} style={{pointerEvents: 'none' }}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Bar dataKey="value" fill="#333" barSize={15}/>
//                 <BarTooltip />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>

//           <Box width={400} height={300}  className="box">
//             <TableContainer component={Paper} height={300}>
//               <Table width={400} height={300}>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Platform</TableCell>
//                     <TableCell align="right">No. of Records</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {tableData.map(item => (
//                     <TableRow key={item.key}>
//                       <TableCell>{item.key}</TableCell>
//                       <TableCell align="right">{item.doc_count}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//                 <TableFooter>
//                   <TableRow>
//                     <TableCell>Total</TableCell>
//                     <TableCell align="right">{totalCount}</TableCell>
//                   </TableRow>
//                 </TableFooter>
//               </Table>
//             </TableContainer>
//           </Box>
//         </div>
//       </Box>
//     </Container>
//      {showPopup && <AddFilter2 togglePopup={togglePopup} />}
//      </>
//   );
// };

// export default Summary;

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProgressRow from "./progressBar.js";
import { Container, Box, Table, TableContainer, TableFooter, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import AddFilter2 from '../Filters/addFilter.js';
import './summary.css';
import Cookies from "js-cookie";


const Summary = ({ filters }) => {
  const token = Cookies.get("accessToken");
      
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);



  const caseId = useSelector((state) => state.caseData.caseData.id);
  // const filterCount = useSelector((state) => state.filterCount.filterCount.count);

  useEffect(() => {
    const fetchData = async () => {
      
          const token = Cookies.get("accessToken");
          console.log("token-----",token);
            console.log({
      Authorization: `Bearer ${token}`
    });

      try {
  
  
        const response = await axios.post('http://5.180.148.40:9007/api/das/aggregate', {
          query: { unified_case_id: String(caseId)},
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

        //  Fix Pie Chart Data (unified_record_type)
        // const pieSource = (unified_record_type || []).map(item => ({
        //   name: item.key,
        //   value: item.doc_count
        // }));

        // if (pieSource.length === 0) {
        //   pieSource.push({ name: 'No Data', value: 0 });
        // }
        const pieData = (unified_record_type || []).map(item => ({
          name: item.key,
          value: item.doc_count
        }));

        if (pieData.length === 0) {
          pieData.push({ name: 'No Data', value: 0 });
        }

        // const totalCount = pieData.reduce((sum, item) => sum + item.value, 0);

        // const colors = ['#8884d8', '#8dd1e1', '#a4de6c', '#d0ed57', '#ffc658'];
        //   Bar Chart Data (unified_date_only)
        const barData = (unified_date_only || []).map(item => ({
          name: item.key.split('-').slice(0, 3).join(''),
          value: item.doc_count
        }));

        if (barData.length === 0) {
          barData.push({ name: 'No Data', value: 0 });
        }

        //Table Data (unified_type)
        const tableData = (unified_type || []).map(item => ({
          name: item.key,
          value: item.doc_count
        }));

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
  }, [caseId]);

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };
  const [activeIndex, setActiveIndex] = useState(null);
  return (
    <>
      <div className='container-fluid'>
        <Box width="100%">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} mt={2}>
            <h5>Summary</h5>
          </Box>
          <Box display="flex" justifyContent="flex-end" alignItems="center" mb={1} mt={2}>
            <button className="add-new-filter-button" onClick={togglePopup}>Add Resources</button>
          </Box>
          <ProgressRow label="Overall Progress" />
          <h5 style={{ textAlign: "center" }}> FilterCount: {filters}</h5>

          <div className='graphchats'>
            {/* Pie Chart */}
            {/* <Box width={400} height={300} className="box">
              <ResponsiveContainer width={400} height={300}>
                <PieChart>
                  <Legend align="center" verticalAlign="top" />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#333"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#333" />
                    ))}
                  </Pie>
                  <Tooltip formatter={() => ` Total: ${totalCount}`} />
                </PieChart>
              </ResponsiveContainer>
            </Box> */}
            <Box className="box">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Legend align="center" verticalAlign="top"
                    formatter={(value, entry) => `${value} ${entry.payload.value}`} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#333"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#333" />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Total: ${value}`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            {/* Bar Chart */}
            <Box className="box">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", padding: "5px" }}
                  />

                  <Bar dataKey="value" fill="#333" barSize={15}
                    isAnimationActive={false}
                  >

                    {barData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === activeIndex ? "#333" : "#333"} // Hover pe color change
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
              <TableContainer component={Paper} width="100%" height={300}>
                <Table width={340} height={300}>
                  <TableHead >
                    <TableRow>
                      <TableCell >Type</TableCell>
                      <TableCell align="right" >No. of Records</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map(item => (
                      <TableRow key={item.key}>
                        <TableCell style={{ height: '20px', padding: '0px 5px' }}>{item.name}</TableCell>
                        <TableCell align="right" style={{ height: '20px', padding: '0px 5px' }}>{item.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell style={{ height: '20px', padding: '0px 5px' }}>Total</TableCell>
                      <TableCell align="right" style={{ height: '20px', padding: '0px 5px' }}>{totalCount}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Box>
          </div>
        </Box>
      </div>
      {showPopup && <AddFilter2 togglePopup={togglePopup} />}
    </>
  );
};

export default Summary;
