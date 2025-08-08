import { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import axios from 'axios';
import Cookies from 'js-cookie';
import Loader from '../../Layout/loader';
import styles from "../../../Common/Table/table.module.css";
import style from "../../Analyze/TabularData/caseTableData.module.css";
import CommonTableComponent from '../../../Common/Table/CommonTableComponent';

const CriteriaCaseTable = () => {
  const token = Cookies.get("accessToken");
  const dispatch = useDispatch();
  const { totalPages, totalResults, searchResults, currentPage } = useSelector(state => state?.search || '');
  const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
  const keywords = useSelector((state) => state.criteriaKeywords?.keywords || '');
  // const [isLoading, setIsLoading] = useState(true);
  // console.log("setisloading",setIsLoading)
  const [loading, setLoading] = useState(false);

  const headers = searchResults.length > 0
    ? [...new Set(searchResults.flatMap(item => Object.keys(item)))]
    : [];
  // Fetch data when page changes
  useEffect(() => {
    const fetchPageData = async () => {
      setLoading(true);

      try {
        // Don't proceed if there are no keywords
        // if (!keywords || keywords.length === 0) {
        //   setLoading(false);
        //   return;
        // }


        const isValid = (v) =>
          Array.isArray(v) ? v.length > 0 :
            typeof v === 'string' ? v.trim() !== '' :
              v !== null && v !== undefined;

        const filteredPayload = {};
        Object.entries(payload).forEach(([key, value]) => {
          if (isValid(value)) {
            filteredPayload[key] = value;
          }
        });

        const paginatedQuery = {
          ...filteredPayload,
          page:currentPage
        };
        console.log("Sending queryQWQ:", paginatedQuery);

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

        // Update the Redux store with the new search results
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

    // Call the function to fetch data
    fetchPageData();
  }, [currentPage, dispatch, token, keywords, payload]);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage && pageNumber >= 1 && pageNumber <= totalPages) {
      dispatch(setPage(pageNumber));
    }
  };

  // Create a function to render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    // Calculate which page numbers to show
    const pageItems = [];

    // Always add first page
    pageItems.push(
      <Pagination.Item
        key={1}
        active={1 === currentPage}
        onClick={() => handlePageChange(1)}
        disabled={loading}
      >
        1
      </Pagination.Item>
    );


    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) { // Skip first and last as they're added separately
        pageItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
            disabled={loading}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Always add last page if different from first
    if (totalPages > 1) {
      pageItems.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
          disabled={loading}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return (
      <Pagination>
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1 || loading}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
        >Previous</Pagination.Prev>

        {pageItems}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}>
          Next
        </Pagination.Next>
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
        />
      </Pagination>
    );
  };

  if (loading) {
    <Loader />
  }

  return (
    <>
      <CommonTableComponent
        data={searchResults}
        headers={headers}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalResults={totalResults}
        handlePageChange={handlePageChange}
        useColumnMapping={false}
        specialColumns={["socialmedia_hashtags", "targets", "person", "gpe", "unified_case_id", "org", "loc"]}
        containerStyle={{ backgroundColor: "transparent" }}
        tableWrapperStyle={{ backgroundColor: "transparent" }}
      />

    </>
  );
};

export default CriteriaCaseTable;
