import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import WordCloud from 'react-d3-cloud';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";
import Loader from '../../Layout/loader';
import { useRef } from 'react';


const KeywordChart = () => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const caseId = useSelector((state) => state.caseData.caseData.id);

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const payload = {
          query: { unified_case_id: String(caseId) },
          aggs_fields: ["unified_record_type", "unified_date_only", "unified_type", "socialmedia_hashtags"]

        }
        const response = await axios.post('http://5.180.148.40:9007/api/das/aggregate', payload
          , {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },

        );
        console.log("querypaylodkeyword", payload)
        console.log("KeywordCloud---", response);

        const { socialmedia_hashtags } = response.data;
        if (socialmedia_hashtags) {
          setData(socialmedia_hashtags);
        } else {
          setData([]); // Set data to an empty array if socialmedia_hashtags is undefined
        }
      } catch (error){
        setData([]);
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    }
      fetchData();
    },
      [caseId]);
  if (loading) {
    return <Loader />;
  }

  const dataa =
    data &&
    data.map(item => ({
      text: item.key, // ✅ WordCloud me "key" dikhega
      value: item.doc_count // ✅ "doc_count" ke mutaabiq size badhega
    }));

  const fontSizeMapper = word => Math.log2(word.value + 1) * 50; // Size adjust kiya
  const rotate = () => 0; //  Fixed rotation (seedha text dikhane ke liye)

  return (
    <Box width={600} height={230} style={{ marginTop: 0, padding: 0 }}>
      {data.length > 0
        ? <WordCloud
          data={dataa}
          fontSizeMapper={fontSizeMapper}
          rotate={rotate}
          margin={0}
          width={600}
          height={250}
        />
        : <Typography
          variant="h6"
          color="textSecondary"
          align="center"
          height={250}
        >
          No Data Available
        </Typography>}
    </Box>
  );
};

export default KeywordChart;
