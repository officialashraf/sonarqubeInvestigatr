import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import ResourceDetails from '../../Analyze/ResourceDetails';
import useInfiniteScroll from '../../../Hooks/useInfiniteScroll'; 

const ScrollCriteriaViewer = () => {
    // const containerRef = useRef(null);
    // const scrollDirectionRef = useRef(null);
    const dispatch = useDispatch();
    const token = Cookies.get('accessToken');
    const [selectedResource, setSelectedResource] = useState(null);
    const { currentPage, totalPages, searchResults } = useSelector((state) => state.search || {});
    const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
    const keywords = useSelector((state) => state.criteriaKeywords?.keywords || '');
    const [loading, setLoading] = useState(false);
    
    const { containerRef, scrollDirectionRef } = useInfiniteScroll({
        currentPage,
        totalPages,
        loading,
        onPageChange: (newPage) => {
            dispatch(setPage(newPage));
            fetchPageData(newPage);
        }
    });

    const fetchPageData = async (page) => {

        // if (!keywords || keywords.length === 0 || page < 1 || page > totalPages) return;

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
                page:currentPage
            };

            const response = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
               paginatedQuery,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            dispatch(
                setSearchResults({
                    results: response.data.results || [],
                    total_pages: response.data.total_pages || 1,
                    total_results: response.data.total_results || 0,
                })
            );
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
useEffect(() => {
        if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
            // Auto-select first resource from the current search results
            setSelectedResource(searchResults[0]);
        } else if (searchResults && Array.isArray(searchResults) && searchResults.length === 0) {
            // If no data, clear selected resource
            setSelectedResource(null);
        }
    }, [searchResults]);
    
    useEffect(() => {
        fetchPageData(currentPage);
    }, []);

    const handleResourceClick = (item) => {
        console.log("Selected Resource:", item);
        setSelectedResource(item);
    };

    return (
        
        <ResourceDetails
            isListView={true}
            resources={searchResults}
            selectedResource={selectedResource}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            handleResourceClick={handleResourceClick}
            containerRef={containerRef}
            showCommentPopup={false} 
            title="Resources Insights"
        />
    );
}
export default ScrollCriteriaViewer;
