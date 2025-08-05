import React, { useEffect, useState } from "react";
import "./Resources.css";
import { useDispatch, useSelector } from "react-redux";
import AddComment from '../Comment/AddComment';
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
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

      //   const queryPayload = {
      //   unified_case_id: data1.id
      // };
      dispatch(fetchSummaryData({
        case_id: String(data1.id),
        ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
        ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.sentiment && { sentiments: caseFilter.sentiment }),
        ...(caseFilter?.target && { targets: caseFilter.target }),
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
        case_id:String(data1.id),
        ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
        ...(caseFilter?.start_time && { starttime: caseFilter.start_time }),
        ...(caseFilter?.end_time && { endtime: caseFilter.end_time }),
        ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.sentiment && { sentiments: caseFilter.sentiment }),
        ...(caseFilter?.target && { targets: caseFilter.target }),
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
    <div className="container-r">
      {/* Header Section */}
      <div className="top-header">
        <div style={{ color: '#d9d9d9', fontSize: '16px', fontWeight: '600' }}>
          <h5>Resources Insights</h5>
        </div>
      </div>

      {/* Content Section */}
      <div className="contents">
        <div className="left-content">
          <div class="overflow-wrapper">
            <div className="left-sidebar" ref={sidebarRef}>
              <div className="inner-content" style={{ paddingBottom: '60px' }}>
                <div className="sidebar-header">
                  <div style={{ marginBottom: '10px', color: '#000' }}>
                  </div>
                  {loading && (
                    <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>
                      Loading...
                    </div>
                  )}
                </div>

                {allResources && allResources.length > 0 ? (
                  allResources.map((resource) => (
                    <div
                      key={resource.row_id}
                      className={`resourceItem ${selectedResource?.row_id === resource.row_id ? "active" : ""
                        }`}
                      onClick={() => handleResourceClick(resource)}
                    >
                      <img
                        src={
                          resource.unified_record_type === "rss feed"
                            ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || rss.jpg
                            : resource.unified_record_type === "X"
                              ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || X_logo
                              : resource.unified_record_type === "Facebook"
                                ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || Facebook_logo
                              : resource.unified_record_type === "YouTube"
                                ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || YoutubeLogo
                                : resource.unified_record_type === "Tiktok"
                                ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || TiktokLogo
                              : resource.unified_record_type === "Instagram"
                                  ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || Instagram
                                   : resource.socialmedia_from_imageurl || resource.socialmedia_media_url || PlaceholderImg                        }
                        onError={(e) => {
                          e.target.onerror = null; // prevents infinite loop
                          if (resource.unified_record_type === "Facebook") {
                            e.target.src = Facebook_logo;
                          } else if (resource.unified_record_type === "Instagram") {
                            e.target.src = Instagram;
                          } else if (resource.unified_record_type === "YouTube") {
                            e.target.src = YoutubeLogo;
                          } else if (resource.unified_record_type === "X") {
                            e.target.src = X_logo;
                          } else if (resource.unified_record_type === "rss feed") {
                            e.target.src = rss.jpg;
                          }
                          else if (resource.unified_record_type === "Tiktok") {
                            e.target.src = TiktokLogo;
                          } else {
                            e.target.src = PlaceholderImg;
                          }
                        }}
                        alt="pic_not_found"
                        className="resourceImage"
                      />
                      <div className="resourceDetails">
                        <p className="resourceType">{resource.unified_record_type || resource.unified_type}</p>
                        <p className="resourceContent">{resource.socialmedia_activity}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: "center", marginTop: "2rem", color: "gray" }}>
                    No Data Load for this case,<br />
                    "Try again after some time."
                  </p>
                )}
                {/* No More Data Message */}
                {!hasMore && allResources.length > 0 && (
                  <p style={{ textAlign: "center", marginTop: "2rem" }}>
                    No more data available.
                  </p>
                )}
                <div style={{ marginBottom: '10px', color: '#000' }}>
                  {/* <strong>Current Page:</strong> {currentPage} */}
                </div>
                {loading && (
                  <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>
                    Loading...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="right-content">
          {selectedResource ? (
            <div className="resourceDetailsContainer">
              <ResourceDetails
                resource={selectedResource}
                showCommentPopup={true}
                showPopup={showPopup}
                setShowPopup={setShowPopup}
              />
              <AddComment
                show={showPopup}
                onClose={() => setShowPopup(false)}
                selectedResource={selectedResource}
              />
            </div>
          ) : (
            <div className="noDataWrapper">
              <p>Select resource for better visibility</p>
            </div>
          )}
        </div>
      </div>

    </div>);
  };

      export default Resources;