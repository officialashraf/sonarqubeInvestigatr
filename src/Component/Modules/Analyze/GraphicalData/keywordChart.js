// import React, { useState, useEffect } from 'react';
// import { Box, Typography } from '@mui/material';
// import axios from 'axios';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';
import { useSelector } from 'react-redux';
import KeywordTagList from '../../../Common/Charts/KeywordCloud/keywordCloud';

const KeywordChart = () => {
   const caseID = useSelector((state) => state.caseData.caseData.id);
       const caseFilter = useSelector((state) => state.caseFilter.caseFilters);
    const { agg_fields, ...filteredPayload } = caseFilter;
  // const token = Cookies.get("accessToken");
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);
 

  // useEffect(() => {
  //   const fetchKeywordData = async () => {
  //     try {
  //       setLoading(true);
  //       const payload = {
  //         query: { unified_case_id: String(caseId) },
  //         aggs_fields: ["socialmedia_hashtags"]
  //       }
  //       const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const { socialmedia_hashtags } = response.data;
  //       if (socialmedia_hashtags) {
  //         setData(socialmedia_hashtags);
  //       } else {
  //         setData([]);
  //       }
  //     } catch (error) {
  //       setData([]);
  //       console.error("error", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchKeywordData();
  // }, [caseId, token]);

  // if (loading) {
  //   return <Loader />;
  // }

  return (
  <KeywordTagList 
  caseId={caseID} 
  aggsFields={["socialmedia_hashtags"]}
  queryPayload={filteredPayload}
  />

  );
};

export default KeywordChart;

