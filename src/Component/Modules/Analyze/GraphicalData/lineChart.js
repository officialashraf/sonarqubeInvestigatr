// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';
// import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import ReusableLineGraph from '../../../Common/Charts/LineGraph/lineGraph';

const LineGraph = () => {
  const caseId = useSelector((state) => state.caseData.caseData.id);
  // const token = Cookies.get("accessToken");
  // const [data, setData] = useState([]);
  // const [recordTypes, setRecordTypes] = useState([]);
  // const [loading, setLoading] = useState(true); // Add loading state

  // useEffect(() => {

  //   const fetchLineData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
  //         query: { unified_case_id: String(caseId) },

  //         aggs_fields: ["unified_date_only", "unified_record_type"]
  //       },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       console.log("line", response);

  //       const { unified_date_only, unified_record_type } = response.data;

  //       if (unified_date_only) {
  //         setData(unified_date_only);
  //       } else {
  //         setData([]);
  //       }

  //       if (unified_record_type) {
  //         setRecordTypes(unified_record_type);

  //         console.log("LineGraph - recordTypes:", recordTypes);

  //       }
  //     } catch (error) {
  //       if (error.response && error.response.data && error.response.data.detail) {
  //         toast.error(error.response.data.detail)
  //         console.error("Backend error:", error.response.data.detail);
  //       } else {
  //         console.error("An error occurred:", error.message);
  //       }
  //       console.error('Error fetching data:', error);
  //       setData([]);
  //       setRecordTypes([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchLineData();
  // }, [caseId, token]);

  // if (loading) {
  //   console.log("Loading state is TRUE");
  //   return <  Loader style={{ marginTop: '-120px' }} />
  // }

  return (
  <ReusableLineGraph
    caseId={caseId}
    aggsFields={["unified_date_only", "unified_type"]}
    recordLineField="unified_type"
  />

  );
};

export default LineGraph;
