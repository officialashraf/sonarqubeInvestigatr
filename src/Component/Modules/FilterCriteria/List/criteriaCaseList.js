import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../../Layout/loader';
import CommonTableComponent from '../../../Common/Table/CommonTableComponent';

const CriteriaCaseTable = () => {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state?.search || '');
  const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  const keywords = useSelector((state) => state.criteriaKeywords?.keywords || '');
  
  const [loading, setLoading] = useState(false);
  const [columnMapping, setColumnMapping] = useState([]);

  const headers = searchResults.length > 0
    ? [...new Set(searchResults.flatMap(item => Object.keys(item)))]
    : [];

  // Fetch column mapping
  useEffect(() => {
    const fetchMapping = async () => {
      try {
        const token = Cookies.get("accessToken");
        const response = await axios.get(
          `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/mappings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        setColumnMapping(response.data);
      } catch (error) {
        console.error("Mapping fetch failed", error);
      }
    };

    fetchMapping();
  }, []);

  // Fetch data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

      try {
        const isValid = (v) =>
          Array.isArray(v) ? v.length > 0 :
            typeof v === 'string' ? v.trim() !== '' :
              v !== null && v !== undefined;

        const filteredPayload = {};
        Object.entries(payload).forEach(([key, value]) => {
          if (isValid(value)) {
            if (key === "targets" && Array.isArray(value)) {
              filteredPayload[key] = value.map(v =>
                typeof v === "object" && v !== null ? String(v.value) : v
              );
            } else {
              filteredPayload[key] = value;
            }
          }
        });

        const paginatedQuery = {
          ...filteredPayload,
          page: currentPage
        };
        console.log("Sending query:", paginatedQuery);

        const response = await axios.post(
          `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
          paginatedQuery,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Search response:", response.data);

        dispatch(
          setSearchResults({
            results: response.data.results || [],
            total_pages: response.data.total_pages || 1,
            total_results: response.data.total_results || 0,
          })
        );
      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (payload && Object.keys(payload).length > 0) {
      fetchPageData();
    }
  }, [currentPage, dispatch, token, keywords, payload]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      dispatch(setPage(pageNumber));
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <CommonTableComponent
      data={searchResults}
      headers={headers}
      loading={loading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      handlePageChange={handlePageChange}
      columnMapping={columnMapping}
      useColumnMapping={true}
      specialColumns={["socialmedia_hashtags", "targets", "person", "gpe", "unified_case_id", "org", "loc"]}
      containerStyle={{ backgroundColor: "transparent" }}
      tableWrapperStyle={{ backgroundColor: "transparent" }}
      noDataMessage="No search results found"
    />
  );
};

export default CriteriaCaseTable;
