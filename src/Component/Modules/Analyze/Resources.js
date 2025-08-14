import React, { useEffect, useState } from "react";
import "./Resources.css";
import { useDispatch, useSelector } from "react-redux";
import AddComment from '../Comment/AddComment';
import { fetchSummaryData, clearFilterData } from "../../../Redux/Action/filterAction";
import useInfiniteScroll from '../../../Component/Hooks/useInfiniteScroll';
import YoutubeLogo from '../../Assets/Images/youtube_image.png'
import Instagram from "../../Assets/Images/Instagram.jpg"
import TiktokLogo from "../../Assets/Images/tiktok.png"
import X_logo from "../../Assets/Images/X_logo.jpg";
import Facebook_logo from "../../Assets/Images/Facebook_logo.png";
import rss from "../../Assets/Images/rss.jpg";
import PlaceholderImg from "../../Assets/Images/placeholder-square.png";
import ResourceDetails from "../Analyze/ResourceDetails";

const Resources = () => {

  const dispatch = useDispatch();
  const data1 = useSelector((state) => state.caseData.caseData);
  const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
  const {
    data,
    headers,
    page,
    totalPages,
    totalResults,
  } = useSelector((state) => state.filterData);

  const summaryData = data;
  const summaryHeaders = headers;

  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [dataloaded, setDataLoaded] = useState(false);

  const { containerRef: sidebarRef } = useInfiniteScroll({
    currentPage,
    totalPages,
    loading,
    onPageChange: (page) => setCurrentPage(page)
  });

  const [loadedPages, setLoadedPages] = useState([]);

  // Initialize data on mount or when data1.id changes
  useEffect(() => {
    if (data1?.id) {
      setLoading(true);
      // Clear previous data immediately when case changes
      dispatch(clearFilterData());
      setAllResources([]);
      setSelectedResource(null);

      //   const queryPayload = {
      //   unified_case_id: data1.id
      // };
      dispatch(fetchSummaryData({
        case_id: String(data1.id),
        ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
        ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.sentiment && { sentiments: caseFilter.sentiment }),
        ...(Array.isArray(caseFilter?.target) && {
          targets: caseFilter.target.map(t => String(t.value))
        }),
        ...(caseFilter?.keyword && { keyword: caseFilter.keyword }),
        ...(caseFilter?.start_time && { starttime: caseFilter.start_time }),
        ...(caseFilter?.end_time && { endtime: caseFilter.end_time }),
        page: currentPage,
        itemsPerPage: 50
      })).then(() => {
        setLoading(false);
        setDataLoaded(true);
      });
    }
  }, [data1?.id, dispatch]);
  // Load page data when currentPage changes (but not on initial load)
  useEffect(() => {
    if (data1?.id && currentPage !== (page || 1)) {
      setLoading(true);
      //    const queryPayload = {
      //   unified_case_id: data1.id
      // };
      dispatch(fetchSummaryData({
        case_id: String(data1.id),
        ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
        ...(caseFilter?.start_time && { starttime: caseFilter.start_time }),
        ...(caseFilter?.end_time && { endtime: caseFilter.end_time }),
        ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.sentiment && { sentiments: caseFilter.sentiment }),
        ...(Array.isArray(caseFilter?.target) && {
          targets: caseFilter.target.map(t => String(t.value))
        }),

        ...(caseFilter?.keyword && { keyword: caseFilter.keyword }),
        page: currentPage,
        itemsPerPage: 50,
      })).then(() => {
        setLoading(false);
      });
    }
  }, [currentPage, data1?.id, dispatch, page]);

  // Update allResources to only contain current page data
  useEffect(() => {
    if (summaryData && Array.isArray(summaryData)) {
      setAllResources(summaryData);
      setHasMore(currentPage < totalPages);
    }
  }, [summaryData, currentPage, totalPages]);

  const handleResourceClick = resource => {
    console.log("Selected Resource:", resource);
    setSelectedResource(resource);
  };
  return (
    <ResourceDetails
      isListView={true}
      resources={allResources}
      selectedResource={selectedResource}
      loading={loading}
      hasMore={hasMore}
      handleResourceClick={handleResourceClick}
      sidebarRef={sidebarRef}
      showCommentPopup={true} // Resources component shows comment popup
      showPopup={showPopup}
      setShowPopup={setShowPopup}
      title="Resources Insights"
    />
  );
};

export default Resources;