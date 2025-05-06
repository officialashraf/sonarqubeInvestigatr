import React, { useEffect, useRef } from "react";
import "./Resources.css";
import { LuPin } from "react-icons/lu";
import { RiInformation2Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatBold } from "react-icons/pi";
import { LiaThumbsUpSolid } from "react-icons/lia";
import { FaRegCommentDots } from "react-icons/fa";
import { MdRepeat } from "react-icons/md";
import { LuRepeat2 } from "react-icons/lu";
import { FaRegBookmark } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { LiaDownloadSolid } from "react-icons/lia";
import { BsThreeDots } from "react-icons/bs"
import {  PinAngle, ChatLeftText} from 'react-bootstrap-icons';
import AddComment from '../Comment/AddComment';
import { fetchSummaryData } from "../../../Redux/Action/filterAction";
import throttle from 'lodash.throttle';
import { toast } from "react-toastify";
const Resources = () => {

  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);
  const data1 = useSelector((state) => state.caseData.caseData);
  



  const {
    data,
    headers,
    page,
    totalPages,
    totalResults,
  
    error,
    } = useSelector((state) => state.filterData);
    const summaryData = data
  const summaryHeaders =headers
  console.log("totalresultes",totalResults)
    console.log("totalapges",totalPages)
  console.log("Summary Data from Redux:", summaryData);
  console.log("Summary Headers from Redux:", summaryHeaders);
  const [currentPage, setCurrentPage] = useState(page);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false); // Loader state
  const sidebarRef = useRef(null);
  const scrollDirectionRef = useRef(null);
  const [selectedResource, setSelectedResource] = useState(null); // State to track the selected resource


  const handleResourceClick = resource => {
    console.log("Selected Resource:", resource);
    setSelectedResource(resource); // Set the selected resource to display in the right content area
  };
 
  useEffect(() => {

    const sidebar = document.querySelector(".left-sidebar");

    const handleScroll = throttle(() => {
      const { scrollTop, scrollHeight, clientHeight } = sidebar;

      // Load NEXT page when user scrolls to bottom
      // if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
        
      //   scrollDirectionRef.current = 'down';
      //   setCurrentPage(prev => prev + 1);
      //   // skipScrollRef.current = true;
      // }
      if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
        if (currentPage < totalPages) {
            scrollDirectionRef.current = 'down';
            setCurrentPage(prev => prev + 1);
            // skipScrollRef.current = true;
        } else {
          toast("No more pages available")
            console.log("No more pages available"); // Replace with UI message
        }
    }
    
      // Load PREVIOUS page when user scrolls to top
      // Load PREVIOUS page when user scrolls to top
if (scrollTop <= 0 && currentPage > 1 && !loading) { 
  scrollDirectionRef.current = 'up';
  setCurrentPage(prev => Math.max(prev - 1, 1)); // Ensure it doesn't go below 1
}

    }, 500);

    sidebar.addEventListener("scroll", handleScroll);
    return () => sidebar.removeEventListener("scroll", handleScroll);
  }, [currentPage]);
  useEffect(() => {


    const scrollContainer = sidebarRef.current;
   if (currentPage > 1) {
     setLoading(true);
     dispatch(fetchSummaryData({
      queryPayload: { unified_case_id: data1.id },
      page: currentPage,
      itemsPerPage: 50
    })).then(() => {
      setLoading(false);
    });
    
       // Delay scroll position to avoid top scroll re-trigger
 setTimeout(() => {
   if (scrollDirectionRef.current === 'up') {
     scrollContainer.scrollTo({
       top: 80,
       // top: scrollContainer.scrollHeight - 150, // 👈 *Fix: Scroll should move smoothly*
       behavior: 'smooth',
     });
   } else {
     scrollContainer.scrollTo({
       top: 40,
       behavior: 'smooth',
     });
   }
 }, 300);
   }
 }, [currentPage,page]);
 
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
        <div className="title">
          <h5>All Resources</h5>
        </div>
        <div className="jobs">
          <div className="job-content">
            <h6>VIEW JOBS</h6>
            <IoChevronDown className="dropdown-icon" />
            <span className="icons">
              <LuPin />
              <RiInformation2Line />
              <BsThreeDotsVertical />
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="contents">
        <div className="left-sidebar" ref={sidebarRef}style={{marginBottom: "4rem"}}>
<div className="inner-content" style={{paddingBottom:'60px',paddingTop:'60px'}}>
          <div className="sidebar-header">
            <span className="search-icon">
              <i className="fa fa-search"></i> {/* Font Awesome Search Icon */}
            </span>
            <h5>Resources Insights</h5>
            <div style={{ marginBottom: '10px', color: '#000' }}>
          <strong>Current Page:</strong> {currentPage}
          </div>
              {loading && (
              <div style={{ textAlign: 'center', padding: '10px', color: 'black' }}>
              Loading...
              </div>
              )}
          </div>

          {summaryData && Array.isArray(summaryData) ? (
            summaryData.map((resource) => (
              <div
                key={resource.row_id}
                className={`resourceItem ${selectedResource?.row_id === resource.row_id ? "active" : ""
                  }`}
                onClick={() => handleResourceClick(resource)}
              >
                <img
                  src={resource.socialmedia_from_imageurl ?? resource.socialmedia_media_url}
                  // src={resource.socialmedia_from_imageurl} // Fallback to dummy image
                  // alt={resource.unified_type}
                  onError={(e) => {
                    e.target.onerror = null; // prevents infinite loop
                    e.target.src = 'https://www.kurin.com/wp-content/uploads/placeholder-square.jpg';
                  }}
                  className="resourceImage"
                />
                <div className="resourceDetails">
                  <p className="resourceType">{resource.unified_type}</p>
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
          <div style={{ marginBottom: '10px', color: '#000' }}>
          <strong>Current Page:</strong> {currentPage}
          </div>
              {loading && (
              <div style={{ textAlign: 'center', padding: '10px', color: 'black' }}>
              Loading...
              </div>
              )}
        </div>
        </div>

        <div className="right-content">
          {selectedResource ? (
            <div className="resourceDetailsContainer">
            
            
              {/*  Instagram Layout */}
              {selectedResource.unified_type === "Instagram" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">

                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }}
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
                      urls = urls.replace(/[\[\]"]+/g, '').split(',');
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
                  {/* <img
                  src={selectedResource.socialmedia_from_imageurl}
                  alt="Post"
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src =
                  //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                  // }}
                  className="postImage"
                /> */}
                  <div className="insta-icon " style={{ justifyContent: "initial" }}>
                    <div className="like-commment-share">
                      <div className="like">
                        <FaRegHeart />
                        <span>{selectedResource.socialmedia_activity_like_count}</span>
                      </div>
                      <div className="comment">
                        <FaRegComment />
                        <span>{selectedResource.socialmedia_activity_comment_count}</span>
                      </div>
                      <PiShareFatBold />
                    </div>
                  </div>
                </div>
              )}
              {/* LinkedIn Layout */}
              {selectedResource.unified_type === "LinkedIn" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
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
                      urls = urls.replace(/[\[\]"]+/g, '').split(',');
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
                        <LiaThumbsUpSolid />
                        <span>{selectedResource.socialmedia_activity_like_count} Like</span>
                      </div>
                      <div className="comment">
                        <FaRegCommentDots />
                        <span>{selectedResource.socialmedia_activity_comment_count} Comment</span>
                      </div>
                      <div className="comment"><span><MdRepeat />Repost</span></div>
                      <div className="comment"><span><PiShareFatBold />Share</span></div>
                    </div>
                  </div>
                </div>
              )}
              {/* Twitter Layout */}
              {selectedResource.unified_type === "Twitter" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
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
                    let urls = selectedResource.socialmedia_media_url;

                    // Step 1: Clean karo array ko
                    if (typeof urls === 'string') {
                      urls = urls.replace(/[\[\]"]+/g, '').split(',');
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
                    <span><strong>{selectedResource.socialmedia_activity_view_count}</strong>view</span>
                  </div>
                  <div className="insta-icon">
                    <div className="like-commment-share">
                      <div className="comment">
                        <FaRegComment />
                        <span>{selectedResource.socialmedia_activity_reply_count}</span>
                      </div>
                      <div className="repost">
                        <LuRepeat2 />
                        <span>{selectedResource.socialmedia_activity_retweet_count}</span>
                      </div>
                      <div className="like">
                        <FaRegHeart />
                        <span>{selectedResource.socialmedia_activity_like_count}</span>
                      </div>
                      <FaRegBookmark />
                      <MdOutlineFileUpload />
                    </div>
                  </div>
                </div>
              )}

              {/*tiktok*/}
              {selectedResource.unified_type === "Tiktok" && (
                <div class="tiktok-container">
                  <video src={selectedResource.socialmedia_from_imageurl} autoplay muted loop></video>

                  <div class="right-panel">
                    <img src="your-profile.jpg" class="profile-pic" />
                    <div class="icon"><GoEye /><span>{selectedResource.socialmedia_activity_view_count}</span></div>
                    <div class="icon">❤️<span>{selectedResource.socialmedia_activity_like_count}</span></div>
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

              {/*FaceBook*/}
              {selectedResource.unified_type === "Facebook" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">
                    <img
                      src={selectedResource.socialmedia_from_imageurl}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
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
                        <LiaThumbsUpSolid />
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
              {selectedResource.unified_type === "rss feed" && (
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
                  {/* <img
                  src={selectedResource.socialmedia_from_imageurl}
                  alt="Post"
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src =
                  //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                  // }}
                  className="postImage"
                /> */}
                </div>
              )}

              {/* VK */}
              {selectedResource.unified_type === "VK" && (
                <div className="resourceDetailsView marginSides20">
                  <div className="profile-section">

                    <img
                      src={selectedResource.socialmedia_media_url}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }}
                      className="profileImage"
                    />
                    <div className="name-date">
                      <p className="displayName">
                        {selectedResource.socialmedia_from_displayname}
                      </p>
                      {/* <p className="postDate">{selectedResource.unified_date_only}</p> */}
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
                        e.target.src = "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                      }}
                    />
                  )}
                  <p className="activityContent">
                    {selectedResource.unified_activity_content}
                  </p>
                  {/* <img
                  src={selectedResource.socialmedia_from_imageurl}
                  alt="Post"
                  // onError={(e) => {
                  //   e.target.onerror = null;
                  //   e.target.src =
                  //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                  // }}
                  className="postImage"
                /> */}
                  <div className="insta-icon" style={{ justifyContent: "initial" }}>
                    <div className="unified-date">
                      <div className="like-commment-share vk">
                        <div className="like">
                          <FaRegHeart />
                          <span>Like</span>
                        </div>
                        <div className="comment">
                          <PiShareFatBold />
                          <span>{selectedResource.socialmedia_activity_share_count}</span>
                        </div>
                      </div>
                      <div className="date-text">
                        {selectedResource.unified_date_only}
                      </div>
                    </div>
                  </div>
                  <div className="bottom-row">
                    <span className="red-heart">❤️</span>
                    <span className="like-count">{selectedResource.socialmedia_activity_like_count}</span>
                  </div>
                </div>
              )}

              {selectedResource.unified_type === "YouTube" && (
                <div className="resourceDetailsView yt">
                  <div className="videoWrapper">
                  {selectedResource.socialmedia_media_url && (
                      <div className="youtube-video">
                        <iframe
                          width="100%"
                          height="400"
                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedResource.socialmedia_activity_url)}`}
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
                      <button className="actionButton">
                        <span className="comment">
                          <LiaDownloadSolid />
                        </span>
                        Download
                      </button>
                      <button className="actionButton">
                        <span >
                          <BsThreeDots />
                        </span>
                      </button>
                    </div>
                  </div>
                  <div> 
                    <strong>{selectedResource.socialmedia_activity_view_count}</strong>{" "}View
                  </div>
                
                </div>
                
              )}
  <div className="sentimentSection">
                <span
                  className="sentiment"
                  style={{
                    color: "white",
                    backgroundColor: 'black',
                    padding: "5px 10px",
                    borderRadius: "5px",
                    display: "inline-block",
                    marginBottom: "10px",
                    marginRight:'10px'
                  }}
                >
                  {selectedResource.sentiment}
                </span>
                {selectedResource && (
    <div className="commentBar" style={{width:'60px'}}>
        <PinAngle size={15} className="me-2" onClick={() => setShowPopup(true)} />
        <ChatLeftText size={15} onClick={() => setShowPopup(true)} />
    </div>
)}
              </div>


            </div>
          
          ) : (
            <div className="placeholder">
              <p>Select a resource to view its details</p>
            </div>

          )}
          

<AddComment show={showPopup} onClose={() => setShowPopup(false)}  selectedResource={selectedResource} />
        </div>
       
      </div>
    </div>
  );
};

export default Resources;