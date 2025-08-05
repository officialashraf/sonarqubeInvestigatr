import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import axios from 'axios';
import Cookies from "js-cookie";
import Loader from '../../../Modules/Layout/loader';
import { IoIosArrowDropup } from "react-icons/io";
import { SlArrowDown } from "react-icons/sl";
import { SlArrowUp } from "react-icons/sl";

const KeywordTagList = ({ queryPayload = null, caseId = null, aggsFields }) => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false); // 🔁 Toggle state



  useEffect(() => {
    const fetchKeywordData = async () => {
      try {
        setLoading(true);

        // ✅ Always convert caseId(s) to string[]
        const caseIdArray = Array.isArray(queryPayload?.case_id)
          ? queryPayload.case_id
          : Array.isArray(queryPayload?.caseId)
            ? queryPayload.caseId
            : queryPayload?.case_id
              ? [queryPayload.case_id]
              : queryPayload?.caseId
                ? [queryPayload.caseId]
                : [];

        // ✅ Prepare raw query object

        const case_id = caseIdArray.map(String); // Ensure string[]

        let flatQuery = {
          case_id,
          aggs_fields: aggsFields,
          file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
          keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
          targets: Array.isArray(queryPayload?.target) ? queryPayload.target : [],
          sentiments: Array.isArray(queryPayload?.sentiments)
            ? queryPayload.sentiments
            : Array.isArray(queryPayload?.sentiment)
              ? queryPayload.sentiment
              : [],
          ...(queryPayload?.start_time && { start_time: queryPayload.start_time }),
          ...(queryPayload?.end_time && { end_time: queryPayload.end_time }),
          // page: 1,
          // size: 50,
        };

        //  Remove empty/null/undefined arrays or values
        flatQuery = Object.fromEntries(
          Object.entries(flatQuery).filter(
            ([, value]) =>
              Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== ""
          )
        );

        const payload = flatQuery;
        const response = await axios.post(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/aggregate`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const { socialmedia_hashtags } = response.data;
        setData(socialmedia_hashtags || []);
      } catch (error) {
        console.error("Error fetching keyword data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchKeywordData();
  }, [caseId, aggsFields.join(","), queryPayload, token]);



  const MAX_HASHTAGS = 50;
  const displayedData = showAll ? data : data.slice(0, MAX_HASHTAGS)


  if (loading) return <Loader />;

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px',
          backgroundColor: '#101d2b',
          borderRadius: '20px',
          p: 2,
          maxHeight: '280px',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',           // Firefox
          msOverflowStyle: 'none',          // IE/Edge
          '&::-webkit-scrollbar': {
            display: 'none',                // Chrome, Safari, Opera
          },
        }}
      >
        {displayedData.length > 0 ? (
          displayedData.map((item, index) => {
            const docCount = item.doc_count || 0;
            const fontSize = `${Math.min(18, Math.max(11, Math.log2(docCount + 1) * 2))}px`;
            return (
              <Tooltip
                key={index}
                title={
                  <Box sx={{ all: 'unset' }}>
                    <p>Hashtag: {item.key}</p>
                    <p>Hashtag Count: {docCount}</p>
                  </Box>
                }
                arrow
                placement="top"
              >
                <Box
                  sx={{
                    backgroundColor: 'rgba(0, 115, 207,0.1)',
                    color: '#0073CF',
                    padding: "4px 8px",
                    borderRadius: "30px",
                    fontSize: fontSize,
                    display: 'inline-flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap',
                    border: '1px solid #0073CF',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 115, 207, 0.5)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0, 115, 207, 0.3)',
                    },
                  }}
                >
                  {item.key}
                </Box>
              </Tooltip>
            );
          })
        ) : (
          <Typography
            color="#ccc"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              fontSize: '14px'
            }}
          >
            No Hashtags Found
          </Typography>
        )}
      </Box>

      {/*  Toggle Button */}
      {data.length > MAX_HASHTAGS && (
        <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
          <Typography
            variant="body2"
            onClick={() => setShowAll(!showAll)}
            sx={{
              color: '#0073CF',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: 'bold',
              fontSize: '15px',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#005999', // darken the blue on hover
              },
              '& svg': {
                transition: 'transform 0.2s',
              },
              '&:hover svg': {
                transform: 'scale(1.2)', // enlarge the icon slightly on hover
              }
            }}
          >
            {showAll ? <SlArrowUp /> : <SlArrowDown />}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default KeywordTagList;

