import  { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import WordCloud from 'react-d3-cloud';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import Loader from '../../../Layout/loader';
import {  ResponsiveContainer } from 'recharts';


const CriteriaKeywordChart = () => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);




  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        console.log("querfunction", queryPayload)
        const payload = {
          query: {
            unified_case_id: Array.isArray(queryPayload?.case_id) ? queryPayload.case_id : [],
            file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
            keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
          },
          aggs_fields: ["unified_type", "unified_record_type", "sentiment", "unified_date_only", "socialmedia_hashtags"],
          start_time: queryPayload?.start_time || "",
          end_time: queryPayload?.end_time || ""
        };

        const response = await axios.post('http://5.180.148.40:9007/api/das/aggregate', payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },

          },

        );


        console.log("KeywordCloud---", response);




        const { socialmedia_hashtags } = response.data;
        if (socialmedia_hashtags) {
          setData(socialmedia_hashtags);
        } else {
          setData([]); // Set data to an empty array if socialmedia_hashtags is undefined
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // Set data to an empty array on error
      }finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [queryPayload,token]);

  const dataa = data && data.map((item) => ({
    text: item.key, // ✅ WordCloud me "key" dikhega
    value: item.doc_count, // ✅ "doc_count" ke mutaabiq size badhega
  }));

  const fontSizeMapper = (word) => Math.log2(word.value + 1) * 50; // Size adjust kiya
  const rotate = () => 0; //  Fixed rotation (seedha text dikhane ke liye)
  if(loading){
    return <Loader/>
  }

  return (
    <div style={{ width: '100%', height: 250 }}>
     <ResponsiveContainer>
    <Box width='100%'  style={{ marginTop: 0, padding: 0 }}>
      {data.length > 0 ? (
        <WordCloud
          data={dataa}
          fontSizeMapper={fontSizeMapper}
          rotate={rotate}
          margin={0}
          width={600}
          height={250}
        />
      ) : (
        <Typography variant="h6" color="textSecondary" align="center" height={250}>
          No Data Available
        </Typography>
      )}
    </Box>
     </ResponsiveContainer>
    </div>
  );
}

export default CriteriaKeywordChart;
