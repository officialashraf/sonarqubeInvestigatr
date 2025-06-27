import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProgressRow from "./progressBar.js";
import { Box, Table, TableContainer, TableFooter, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import AddFilter2 from '../Filters/addFilter.js';
import './summary.css';
import Cookies from "js-cookie";
import Cdr from '../CDR/cdr.js';


const Summary = ({ filters }) => {

  const token = Cookies.get("accessToken");
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const caseId = useSelector((state) => state.caseData.caseData.id);
  console.log("casiId", caseId)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`,{
          query: { unified_case_id: String(caseId) },

          aggs_fields: ["unified_record_type", "unified_date_only", "unified_type"]
        },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${ token }`,
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
  }, [caseId, token]);

const togglePopup = (value) => {
  if (typeof value === 'boolean') {
    setShowPopup(value); // set true or false explicitly
  } else {
    setShowPopup((prev) => !prev); // fallback toggle
  }
};
const COLORS = ["#B22222", "#556B2F", "#CC5500"]
// const togglePopup = () => {
//   setShowPopup((prev) => !prev);
// };
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
                    <Cell key={`cell - ${index}`} fill={COLORS[index % COLORS.length]} />
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
                      key={`cell - ${index}`}
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
              <Table width={300} height={300}>
                <TableHead >
                  <TableRow>
                    <TableCell >Type</TableCell>
                    <TableCell align="right" >No. of records</TableCell>
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
    {showPopup && <Cdr togglePopup={togglePopup} />}
  </>
);
};

export default Summary;
