import React, { useEffect, useRef, useState } from "react";
import "./Resources.css";
import { LuPin, LuRepeat2 } from "react-icons/lu";
import { RiInformation2Line } from "react-icons/ri";
import { BsThreeDotsVertical, BsThreeDots } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaRegCommentDots, FaRegBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatBold } from "react-icons/pi";
import { LiaThumbsUpSolid, LiaDownloadSolid } from "react-icons/lia";
import { MdRepeat, MdOutlineFileUpload } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import throttle from 'lodash.throttle';
import { PinAngle, ChatLeftText } from 'react-bootstrap-icons';
import AddComment from '../Comment/AddComment';
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
import AppButton from "../../Common/Buttton/button"
import YoutubeLogo from '../../Assets/Images/youtube_image.png'
import Instagram from "../../Assets/Images/Instagram.png"
import X_logo from "../../Assets/Images/X_logo.jpg";
import Facebook_logo from "../../Assets/Images/Facebook_logo.png";
import rss from "../../Assets/Images/rss.jpg";

const Resources = () => {

  const dispatch = useDispatch();
  const caseFilter = useSelector((state) => state.caseFilter.caseFilters);
  const data1 = useSelector((state) => state.caseData.caseData);
  const {
    data,
    headers,
    page,
    totalPages,
    totalResults,
  } = useSelector((state) => state.filterData);

  const summaryData = data;
  const summaryHeaders = headers;
  console.log("totalresultes", totalResults);
  console.log("totalapges", totalPages);
  console.log("Summary Data from Redux:", summaryData);
  console.log("Summary Headers from Redux:", summaryHeaders);

  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sidebarRef = useRef(null);
  const scrollDirectionRef = useRef(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [allResources, setAllResources] = useState([]);
  const [loadedPages, setLoadedPages] = useState([]);
const [dataLoaded, setDataLoaded] = useState(false);
  // Initialize data on mount or when data1.id changes
  // useEffect(() => {
  //   if (data1?.id) {
  //     setLoading(true);
  //     const initialPage = page || 1;
  //     setCurrentPage(initialPage);

  //     dispatch(fetchSummaryData({
  //       queryPayload: { unified_case_id: data1.id },
  //       page: initialPage,
  //       itemsPerPage: 50,
  //     })).then(() => {
  //       setLoading(false);
  //     });
  //   }
  // }, [data1?.id, dispatch]); // Removed 'page' from dependencies
  useEffect(() => {
    const initialPage = page || 1;
    setCurrentPage(initialPage);

    const isDataAlreadyFetched = summaryData && summaryData.length > 0;

    if (data1?.id && !isDataAlreadyFetched) {
      setLoading(true);
      const queryPayload = {
      unified_case_id: data1.id
    };
     dispatch(fetchSummaryData({
      queryPayload,
       ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
      ...(caseFilter?.start_time && { start_time: caseFilter.start_time }),
      ...(caseFilter?.end_time && { end_time: caseFilter.end_time }),
      ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.keyword && { keyword: caseFilter.keyword }),
      page: currentPage,
      itemsPerPage: 50
    })).then(() => {
        setLoading(false);
        setDataLoaded(true);
      });
    }
  }, [data1?.id, summaryData, page, dispatch,caseFilter]);

  // Load page data when currentPage changes (but not on initial load)
  useEffect(() => {
    if ( currentPage !== (page || 1)) {
      setLoading(true);
      const queryPayload = {
      unified_case_id: data1.id
    };
      dispatch(fetchSummaryData({
      queryPayload,
       ...(caseFilter?.file_type && { file_type: caseFilter.file_type }),
      ...(caseFilter?.start_time && { start_time: caseFilter.start_time }),
      ...(caseFilter?.end_time && { end_time: caseFilter.end_time }),
      ...(caseFilter?.aggs_fields && { aggsFields: caseFilter.aggs_fields }),
        ...(caseFilter?.keyword && { keyword: caseFilter.keyword }),
      page: currentPage,
      itemsPerPage: 50,
  })).then(() => {
        setLoading(false);
      });
    }
  }, [currentPage, dispatch, page,caseFilter]);

  // Update allResources to only contain current page data
  useEffect(() => {
    if (summaryData && Array.isArray(summaryData)) {
      setAllResources(summaryData);
      setHasMore(currentPage < totalPages);
    }
  }, [summaryData, currentPage, totalPages]);

  useEffect(() => {
    const sidebarElement = sidebarRef.current;
    if (!sidebarElement) return;

    const handleInfiniteScroll = throttle(() => {
      if (
        sidebarElement.scrollTop + sidebarElement.clientHeight >=
        sidebarElement.scrollHeight - 10
      ) {
        if (!loading && hasMore) {
          scrollDirectionRef.current = 'down';
          setCurrentPage(prev => prev + 1);
        }
      } else if (
        sidebarElement.scrollTop <= 0
      ) {
        if (!loading && currentPage > 1) {
          scrollDirectionRef.current = 'up';
          setCurrentPage(prev => Math.max(prev - 1, 1));
        }
      }
    }, 500);

    sidebarElement.addEventListener("scroll", handleInfiniteScroll);
    return () => sidebarElement.removeEventListener("scroll", handleInfiniteScroll);
  }, [loading, hasMore, currentPage]);

  useEffect(() => {
    const scrollContainer = sidebarRef.current;
    if (!scrollContainer) return;

    if (scrollDirectionRef.current === 'up') {

      const newScrollTop = currentPage === 1
        ? scrollContainer.scrollHeight * 0 // Move slightly down when at page 1
        : scrollContainer.scrollHeight / 2 - scrollContainer.clientHeight / 2; // Default centering
      scrollContainer.scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      });
    } else if (scrollDirectionRef.current === 'down') {
      const newScrollTop = currentPage === totalPages
        ? scrollContainer.scrollHeight // Move to bottom when at last page
        : scrollContainer.scrollHeight / 2 - scrollContainer.clientHeight / 2; // Default centering
      scrollContainer.scrollTo({
        top: newScrollTop,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const handleResourceClick = resource => {
    console.log("Selected Resource:", resource);
    setSelectedResource(resource);
  };
  const getYouTubeVideoId = (url) => {
    console.log("url", url);
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^#&?]{11})/;
    const match = url.match(regExp);
    console.log("match", match);
    return match ? match[1] : null;
  }

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
                              : resource.unified_record_type === "Instagram"
                                  ? resource.socialmedia_from_imageurl || resource.socialmedia_media_url || Instagram
                                  : resource.socialmedia_from_imageurl || resource.socialmedia_media_url || "/images/placeholder-square.png"
                        }
                        onError={(e) => {
                          e.target.onerror = null; // prevents infinite loop
                          e.target.src = "/images/placeholder-square.png";
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


              {/*  Instagram Layout */}
              {selectedResource.unified_record_type === "Instagram" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">

                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }}
                      alt="pic_not_found"
                      className="profileImage"
                    />


                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                      <p className="postDate">{selectedResource.unified_date_only}</p>
                    </div>

                  </div>
                  {selectedResource.socialmedia_media_url && (() => {
                    let urls = selectedResource.socialmedia_media_url;

                    // Step 1: Clean karo array ko
                    if (typeof urls === 'string') {
                      urls = urls.replace(/[\]"]+/g, '').split(',');
                    }

                    // Step 2: Single URL nahi multiple URL array hai ab
                    return (
                      <div className="imageGridWrapper">
                        {urls.map((url, index) => {
                          url = url.trim(); // Remove spaces

                          if (url.includes('video')) {
                            return (
                              <video key={index} controls className="postImage">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            );
                          } else if (url.includes('pbs') || url.includes('twimg')) {
                            return (
                              <img
                                key={index}
                                src={url}
                                alt={`Post ${index}`}
                                className="postMedia"
                              />
                            );
                          } else {
                            return (
                              <p key={index}>Media not available</p>
                            );
                          }
                        })}
                      </div>
                    );
                  })()}
                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>
                  <div className="insta-icon " style={{ justifyContent: "initial" }}>
                    <div className="like-commment-share">
                      <div className="like">
                        <FaRegHeart style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_like_count}</span>
                      </div>
                      <div className="comment">
                        <FaRegComment style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_comment_count}</span>
                      </div>
                      <PiShareFatBold style={{ marginRight: '5px' }} />
                    </div>
                  </div>
                </div>
              )}
              {/* LinkedIn Layout */}
              {selectedResource.unified_record_type === "LinkedIn" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
                      alt="pic_not_found"
                      className="profileImage"
                    />
                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                      <p className="postDate">{selectedResource.unified_date_only}</p>
                    </div>
                  </div>

                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>

                  {selectedResource.socialmedia_media_url && (() => {
                    let urls = selectedResource.socialmedia_media_url;

                    // Step 1: Clean karo array ko
                    if (typeof urls === 'string') {
                      urls = urls.replace(/[\]"]+/g, '').split(',');
                    }

                    // Step 2: Single URL nahi multiple URL array hai ab
                    return (
                      <div className="imageGridWrapper">
                        {urls.map((url, index) => {
                          url = url.trim(); // Remove spaces

                          if (url.includes('video')) {
                            return (
                              <video key={index} controls className="postImage">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            );
                          } else if (url.includes('pbs') || url.includes('twimg')) {
                            return (
                              <img
                                key={index}
                                src={url}
                                alt={`Post ${index}`}
                                className="postMedia"
                              />
                            );
                          } else {
                            return (
                              <p key={index}>Media not available</p>
                            );
                          }
                        })}
                      </div>
                    );
                  })()}
                  <div className="insta-icon">
                    <div className="like-commment-share">
                      <div className="like">
                        <LiaThumbsUpSolid style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_like_count} Like</span>
                      </div>
                      <div className="comment">
                        <FaRegCommentDots style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_comment_count} Comment</span>
                      </div>
                      <div className="comment"><span><MdRepeat style={{ marginRight: '5px' }} />Repost</span></div>
                      <div className="comment"><span><PiShareFatBold style={{ marginRight: '5px' }} />Share</span></div>
                    </div>
                  </div>
                </div>
              )}
              {/* Twitter Layout */}
              {selectedResource.unified_record_type === "X" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
                      alt="pic_not_found"
                      className="profileImage"
                    />
                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                      <p className="postDate">{selectedResource.socialmedia_from_screenname}</p>
                    </div>
                  </div>

                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>
                  {selectedResource.socialmedia_media_url && (() => {
                    let urls = [];

                    try {
                      // Step 1: Parse the stringified array
                      urls = JSON.parse(selectedResource.socialmedia_media_url);
                    } catch (error) {
                      console.error("Failed to parse media URL:", error);
                      return <p>Invalid media format</p>;
                    }

                    // Step 2: Single URL nahi multiple URL array hai ab
                    return (
                      <div className="imageGridWrapper">
                        {urls.map((url, index) => {
                          url = url.trim(); // Remove spaces

                          if (url.includes('video')) {
                            return (
                              <video key={index} controls className="postImage" preload="metadata">
                                <source src={url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            );
                          } else if (url.includes('pbs') || url.includes('twimg')) {
                            return (
                              <img
                                key={index}
                                src={url}
                                alt={`Post ${index}`}
                                className="postMedia"
                              />
                            );
                          } else {
                            return (
                              <p key={index}>Media not available</p>
                            );
                          }
                        })}
                      </div>
                    );
                  })()}

                  <div className="view" style={{ display: "flex", gap: "4px" }}>
                    <div className="time">
                      <span>
                        {new Date(selectedResource.unified_capture_time).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}.
                        {new Date(selectedResource.unified_capture_time).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })},
                        {new Date(selectedResource.unified_capture_time).getFullYear()}.
                      </span>
                    </div>
                    <span><strong>{selectedResource.socialmedia_activity_view_count}</strong>Views</span>
                  </div>
                  <div className="insta-icon">
                    <div className="like-commment-share">
                      <div className="comment">
                        <FaRegComment style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_reply_count}</span>
                      </div>
                      <div className="repost">
                        <LuRepeat2 style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_retweet_count}</span>
                      </div>
                      <div className="like">
                        <FaRegHeart style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_like_count}</span>
                      </div>
                      <FaRegBookmark style={{ marginRight: '5px' }} />
                      <MdOutlineFileUpload style={{ marginRight: '5px' }} />
                    </div>
                  </div>
                </div>
              )}

              {/* {/tiktok/} */}
              {selectedResource.unified_record_type === "Tiktok" && (
                <div class="tiktok-container">
                  <video src={selectedResource.socialmedia_from_imageurl} autoplay muted loop></video>

                  <div class="right-panel">
                    <img src="your-profile.jpg" alt="pic_not_found" class="profile-pic" />
                    <div class="icon"><GoEye /><span>{selectedResource.socialmedia_activity_view_count}</span></div>
                    <div class="icon">❤<span>{selectedResource.socialmedia_activity_like_count}</span></div>
                    <div class="icon"><FaRegCommentDots /><span></span></div>
                    <div class="icon"><FaRegBookmark /><span></span></div>
                    <div class="icon"><PiShareFatBold /><span></span></div>
                  </div>

                  <div class="bottom-content">
                    <p class="username">{selectedResource.socialmedia_from_displayname}</p>
                    <p>{selectedResource.socialmedia_from_screenname}</p>
                    <p class="caption">
                      {selectedResource.unified_activity_content}
                    </p>
                  </div>
                </div>
              )}

              {/* {/FaceBook/} */}
              {selectedResource.unified_record_type === "Facebook" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
                      alt="pic_not_found"
                      className="profileImage"
                    />
                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                      <p className="postDate">{selectedResource.unified_date_only}</p>
                    </div>
                  </div>

                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>

                  <img
                    src={selectedResource.socialmedia_media_url}
                    alt="Post"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src =
                    //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                    // }}
                    className="postImage"
                  />

                  <div className="view" style={{ display: "flex", gap: "4px" }}>
                    <div className="time">
                      <span>
                        {new Date(selectedResource.unified_capture_time).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}.
                        {new Date(selectedResource.unified_capture_time).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })},
                        {new Date(selectedResource.unified_capture_time).getFullYear()}.
                      </span>
                    </div>
                  </div>
                  <div className="insta-icon">
                    <div className="like-commment-share">
                      <div className="like">
                        <LiaThumbsUpSolid style={{ marginRight: '5px' }} />
                        <span>{selectedResource.socialmedia_activity_like_count}</span>
                      </div>
                      <div className="comment">
                        <span>{selectedResource.socialmedia_activity_reply_count} comments</span>
                      </div>
                      <div className="share">
                        <span>shares</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* RSS feed*/}
              {selectedResource.unified_record_type === "rss feed" && (
                <div className="resourceDetailsView">
                  <div className="profile-section">
                    <h3>{selectedResource.unified_activity_title}</h3>
                  </div>
                  <div>
                    <p>Published Date : {selectedResource.site_published_date}</p>
                  </div>
                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>
                </div>
              )}
              {/* DarkWeb*/}
              {selectedResource.unified_record_type === "AhmiaFi" && (
                <div className="resourceDetailsView">
                  <div className="profile-section">
                    <h3>{selectedResource.unified_activity_title}</h3>
                  </div>
                  {/* <div>
                    <p>Published Date : {selectedResource.site_published_date}</p>
                  </div> */}
                  <p className="activityContent">
                    {selectedResource.site_snippet}
                  </p>
                </div>
              )}
              {/* DarkWeb*/}
              {selectedResource.unified_record_type === "Gibiru" && (
                <div className="resourceDetailsView">
                  <div className="profile-section">
                    <h3>{selectedResource.unified_activity_title}</h3>
                  </div>
                  {/* <div>
                    <p>Published Date : {selectedResource.site_published_date}</p>
                  </div> */}
                  <p className="activityContent">
                    {selectedResource.site_snippet}
                  </p>
                  <img
                    src={selectedResource.socialmedia_media_url}
                    alt="Post"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src =
                    //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                    // }}
                    className="postImage"
                  />
                </div>
              )}
              {/* VK */}
              {selectedResource.unified_record_type === "VK" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">

                    <img
                      src={selectedResource.socialmedia_media_url}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }}
                      alt="pic_not_found"
                      className="profileImage"
                    />
                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                    </div>

                  </div>
                  {selectedResource.socialmedia_media_url?.match(/\.(mp4|mov|webm|ogg)$/i) ? (

                    <video
                      src={selectedResource.socialmedia_media_url}
                      controls
                      className="postImage"
                      width="100%"
                      height="400"
                    />
                  ) : (
                    <img
                      src={selectedResource.socialmedia_media_url}
                      className="postImage"
                      alt="Social Media"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/images/placeholder-square.png";
                      }}
                    />
                  )}
                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>
                  <div className="insta-icon" style={{ justifyContent: "initial" }}>
                    <div className="unified-date">
                      <div className="like-commment-share vk">
                        <div className="like">
                          <FaRegHeart style={{ marginRight: '5px' }} />
                          <span>Like</span>
                        </div>
                        <div className="comment">
                          <PiShareFatBold style={{ marginRight: '5px' }} />
                          <span>{selectedResource.socialmedia_activity_share_count}</span>
                        </div>
                      </div>
                      <div className="date-text">
                        {selectedResource.unified_date_only}
                      </div>
                    </div>
                  </div>
                  <div className="bottom-row">
                    <span className="red-heart">❤</span>
                    <span className="like-count">{selectedResource.socialmedia_activity_like_count}</span>
                  </div>
                </div>
              )}

              {selectedResource.unified_record_type === "YouTube" && (
                <div className="resourceDetailsView yt">
                  <div className="videoWrapper">
                    {selectedResource.socialmedia_media_url && (
                      <div className="youtube-video">
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${selectedResource.socialmedia_activity_url ? getYouTubeVideoId(selectedResource.socialmedia_activity_url) : ''}`}
                          title="YouTube video player"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                  <h4 className="videoTitle">
                    {selectedResource.socialmedia_activity_title}
                  </h4>

                  {/* Channel Details */}
                  <div className="channel-action">
                    <div className="channelInfo">
                      <img
                        src={selectedResource.socialmedia_from_imageurl ?? selectedResource.socialmedia_media_url}
                        alt="Channel Logo"
                        className="channelLogo"
                      />
                      <h6 className="channelName">{selectedResource.socialmedia_from_displayname}</h6>
                      <button className="subscribeButton">Subscribe</button>
                    </div>


                    {/* Actions */}
                    <div className="actions">
                      <button className="actionButton">
                        <span className="like">
                          <AiOutlineLike />
                        </span>
                        Like
                        <span className="like">{" | "}
                          <AiOutlineDislike />
                        </span>
                      </button>
                      <button className="actionButton">
                        <span className="comment">
                          <PiShareFatBold />
                        </span>
                        Share
                      </button>
                      {/* <button className="actionButton">
                        <span className="comment">
                          <LiaDownloadSolid />
                        </span>
                        Download
                      </button> */}
                      <button className="actionButton">
                        <span >
                          <BsThreeDots />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <strong>{selectedResource.socialmedia_activity_view_count}</strong>{" "}Views
                  </div>

                </div>
              )}
              {selectedResource?.unified_type ? (
                <div className="sentimentSection" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                  <AppButton
                    style={{ cursor: 'default', marginBottom: '5px' }}
                  >
                    {selectedResource.sentiment ? selectedResource.sentiment?.charAt(0)?.toUpperCase() + selectedResource.sentiment?.slice(1) : 'No Data'}
                  </AppButton>
                  {selectedResource && (
                    <AppButton
                      onClick={() => setShowPopup(true)}
                      style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0, background: 'transparent', boxShadow: 'none' }}
                    >
                      <ChatLeftText size={15} style={{ marginRight: '5px' }} />
                      Comment
                    </AppButton>
                  )}
                </div>
              ) : (
                <div className="noDataWrapper">
                  <p>No Data Available</p>
                </div>
              )}

            </div>

          ) : (
            <div className="noDataWrapper">
              <p>No Data Available</p>
            </div>

          )}
          <AddComment show={showPopup} onClose={() => setShowPopup(false)} selectedResource={selectedResource} />
        </div>

      </div>
    </div>
  );
};

export default Resources;