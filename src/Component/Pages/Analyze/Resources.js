import React from "react";
import "./Resources.css";
import { LuPin } from "react-icons/lu";
import { RiInformation2Line } from "react-icons/ri";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import { useState } from "react";
import { useSelector } from "react-redux";
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

const Resources = () => {
  const [showPopup, setShowPopup] = useState(false);

  const summaryData = useSelector(state => state.summaryData.data);
  const summaryHeaders = useSelector(state => state.summaryData.headers);
  console.log("Summary Data from Redux:", summaryData);
  console.log("Summary Headers from Redux:", summaryHeaders);


  const [selectedResource, setSelectedResource] = useState(null); // State to track the selected resource


  const handleResourceClick = resource => {
    console.log("Selected Resource:", resource);
    setSelectedResource(resource); // Set the selected resource to display in the right content area
  };
  const getSentimentColor = (sentiment) => {
    if (sentiment === "Negative") return "red";
    if (sentiment === "Positive") return "green";
    return "gray"; // Default color for neutral or undefined sentiment
  };


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
        <div className="left-sidebar">

          <div className="sidebar-header">
            <span className="search-icon">
              <i className="fa fa-search"></i> {/* Font Awesome Search Icon */}
            </span>
            <h5>Resources Insights</h5>
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
        </div>


        <div className="right-content">
          {selectedResource ? (
            <div className="resourceDetailsContainer">
              <div className="sentimentSection">
                <span
                  className="sentiment"
                  style={{
                    color: "white",
                    backgroundColor: getSentimentColor(
                      selectedResource.sentiment
                    ),
                    padding: "5px 10px",
                    borderRadius: "5px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {selectedResource.sentiment}
                </span>
              </div>

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
                  {/* Media Render (based on URL extension) */}
                  {/* {(() => {
      const url = selectedResource.socialmedia_from_imageurl;
      const extension = url?.split('.').pop()?.toLowerCase();

      if (['mp4', 'mov', 'webm'].includes(extension)) {
        return (
          <video controls className="postVideo">
            <source src={url} type={`video/${extension}`} />
            Your browser does not support the video tag.
          </video>
        );
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return (
          <img
            src={url}
            alt="Post"
            className="postImage"
          />
        );
      } else {
        return null; // unsupported format
      }
    })()} */}
                  <img
                    src={selectedResource.socialmedia_from_imageurl}
                    alt="Post"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src =
                    //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                    // }}
                    className="postImage"
                  />
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
                 
                  <img
                    src={selectedResource.socialmedia_from_imageurl}
                    alt="Post"
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src =
                    //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                    // }}
                    className="postImage"
                  />
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
                  <img
                    src={selectedResource.socialmedia_from_imageurl}
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
                    src={selectedResource.socialmedia_from_imageurl}
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
                  <img
                    src={selectedResource.socialmedia_media_url}
                    // className="vkIframe"
                    //                  allow="autoplay; encrypted-media"
                    // allowFullScreen
                    //                 width="100%"
                    // height="400"
                    // frameBorder="0"
                    // title="VK video"
                    // controls
                    // autoPlay={false}
                    // onError={(e) => {
                    //   e.target.onerror = null;
                    //   e.target.src =
                    //     "https://www.kurin.com/wp-content/uploads/placeholder-square.jpg";
                    // }}
                    className="postImage"
                  />
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
                    <img
                      className="postImage"
                      src={selectedResource.socialmedia_media_url}
                      title="Video Player"
                      allowFullScreen
                    />
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



            </div>
          
          ) : (
            <div className="placeholder">
              <p>Select a resource to view its details</p>
            </div>

          )}
           {selectedResource && (
    <div className="commentBar">
        <PinAngle size={15} className="me-2" onClick={() => setShowPopup(true)} />
        <ChatLeftText size={15} onClick={() => setShowPopup(true)} />
    </div>
)}
<AddComment show={showPopup} onClose={() => setShowPopup(false)}  selectedResource={selectedResource} />
        </div>
      </div>
    </div>
  );
};

export default Resources;