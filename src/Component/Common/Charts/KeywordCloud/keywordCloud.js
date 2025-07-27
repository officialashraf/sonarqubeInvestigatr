import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import axios from 'axios';
import Cookies from "js-cookie";
import Loader from '../../../Modules/Layout/loader';

const KeywordTagList = ({ queryPayload = null, caseId = null, aggsFields = ["socialmedia_hashtags"] }) => {
  const token = Cookies.get("accessToken");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    const fetchKeywordData = async () => {
      try {
        setLoading(true);

        // Dynamic payload handling
        const payload = queryPayload
          ? {
            query: {
              unified_case_id: Array.isArray(queryPayload?.case_id)
                ? queryPayload.case_id
                : Array.isArray(queryPayload?.caseId)
                  ? queryPayload.caseId
                  : queryPayload?.case_id
                    ? [queryPayload.case_id]
                    : queryPayload?.caseId
                      ? [queryPayload.caseId]
                      : [],
              file_type: Array.isArray(queryPayload?.file_type) ? queryPayload.file_type : [],
              keyword: Array.isArray(queryPayload?.keyword) ? queryPayload.keyword : [],
            },
            aggs_fields: aggsFields,
            start_time: queryPayload?.start_time || "",
            end_time: queryPayload?.end_time || ""
          }
          : {
            query: { unified_case_id: String(caseId) },
            aggs_fields: aggsFields
          };

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
  }, [caseId, queryPayload, token]);


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
            }}
          >
            {showAll ? 'Show Less' : 'Show All'}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default KeywordTagList;

