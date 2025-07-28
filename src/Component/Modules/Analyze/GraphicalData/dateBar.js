import { useSelector } from 'react-redux';
import ReusableBarChart from '../../../Common/Charts/BarChart/CommonBarChart';
// import '../../Summarymain/summary.css';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';

const DateBar = () => {

  // const token = Cookies.get("accessToken");
  // const [barData, setBarData] = useState([]);
  // const [loading, setLoading] = useState(false);
  const caseID = useSelector((state) => state.caseData.caseData.id);
    const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
   const { agg_fields, ...filteredPayload } = caseFilter || {};
  // console.log("casiId", caseId)

  // useEffect(() => {
  //     const fetchData = async () => {

  //         try {
  //             setLoading(true);
  //             const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, {
  //                 query: { unified_case_id: String(caseId) },

  //                 aggs_fields: ["DATE"]
  //             },
  //                 {
  //                     headers: {
  //                         "Content-Type": "application/json",
  //                         Authorization: `Bearer ${token}`,
  //                     },
  //                 }

  //             );

  //             console.log("DATEationBar data:", response.data);

  //             const { DATE } = response.data;
  //             const barData = (DATE || []).map(item => ({
  //                 name: item.key.split('-').slice(0, 3).join(''),
  //                 value: item.doc_count
  //             }));

  //             if (barData.length === 0) {
  //                 barData.push({ name: 'No Data', value: 0 });
  //             }
  //             setBarData(barData);

  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //             setBarData([{ name: 'No Data', value: 0 }]);

  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchData();
  // }, [caseId, token]);

  // const [activeIndex, setActiveIndex] = useState(null);
  // if (loading) {
  //     return <Loader />;
  // }

  return (
    <>
      <ReusableBarChart
        caseId={caseID}
        aggsFields={["date"]}
        query={{}} // if extra filters needed
        chartHeight={280}
        transformData={(rawData) =>
          rawData.map(item => ({
            name: item.key.split('-').slice(0, 3).join(''),
            value: item.doc_count
          }))
        }
        queryPayload={filteredPayload}
      />
    </>
  );
};

export default DateBar;