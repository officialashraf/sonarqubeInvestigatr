import React from "react";
import { FaRegHeart, FaRegCommentDots, FaRegBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatBold } from "react-icons/pi";
import { LiaThumbsUpSolid } from "react-icons/lia";
import { GoEye } from "react-icons/go";
import { LuRepeat2 } from "react-icons/lu";
import { MdRepeat, MdOutlineFileUpload } from "react-icons/md";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { ChatLeftText } from 'react-bootstrap-icons';
import AppButton from "../../Common/Buttton/button"
import AddComment from '../Comment/AddComment';

// Import all the logo images
import YoutubeLogo from '../../Assets/Images/youtube_image.png';
import Instagram from "../../Assets/Images/Instagram.jpg";
import TiktokLogo from "../../Assets/Images/tiktok.png";
import X_logo from "../../Assets/Images/X_logo.jpg";
import Facebook_logo from "../../Assets/Images/Facebook_logo.png";
import rss from "../../Assets/Images/rss.jpg";
import PlaceholderImg from "../../Assets/Images/placeholder-square.png";

function getYouTubeVideoId(url) {
    if (!url) return '';
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([^#&?]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : '';
}

// Main Component that can render both list view and detail view
export default function ResourceDetails({
    // Single resource detail view props
    resource,
    showCommentPopup = false,
    showPopup = false,
    setShowPopup = () => { },

    // List view props
    isListView = false,
    resources = [],
    selectedResource = null,
    loading = false,
    currentPage = 1,
    totalPages = 1,
    hasMore = false,
    handleResourceClick = () => { },
    containerRef = null,
    sidebarRef = null,
    title = "Resources Insights",
    noDataMessage = "No Data Load for this case,\nTry again after some time.",
    // noMoreDataMessage = "No more data available.",
    selectResourceMessage = "Select resource for better visibility"
}) {

    // Function to get the correct image source with fallback
    const getImageSource = (item) => {
        const baseImage = item.socialmedia_from_imageurl || item.socialmedia_media_url;

        switch (item.unified_record_type) {
            case "rss feed":
                return baseImage || rss;
            case "X":
                return baseImage || X_logo;
            case "Facebook":
                return baseImage || Facebook_logo;
            case "YouTube":
                return baseImage || YoutubeLogo;
            case "Tiktok":
                return baseImage || TiktokLogo;
            case "Instagram":
                return baseImage || Instagram;
            default:
                return baseImage || PlaceholderImg;
        }
    };

    // Function to handle image error
    const handleImageError = (e, item) => {
        e.target.onerror = null; // prevents infinite loop

        switch (item.unified_record_type) {
            case "Facebook":
                e.target.src = Facebook_logo;
                break;
            case "Instagram":
                e.target.src = Instagram;
                break;
            case "YouTube":
                e.target.src = YoutubeLogo;
                break;
            case "X":
                e.target.src = X_logo;
                break;
            case "rss feed":
                e.target.src = rss;
                break;
            case "Tiktok":
                e.target.src = TiktokLogo;
                break;
            default:
                e.target.src = PlaceholderImg;
        }
    };

    // Function to render resource items for list view
    const renderResourceItem = (item) => (
        <div
            key={item.row_id}
            className={`resourceItem ${selectedResource?.row_id === item.row_id ? "active" : ""}`}
            onClick={() => handleResourceClick(item)}
        >
            <img
                src={getImageSource(item)}
                onError={(e) => handleImageError(e, item)}
                alt="pic_not_found"
                className="resourceImage"
            />
            <div className="resourceDetails">
                <p className="resourceType">{item.unified_record_type || item.unified_type}</p>
                <p className="resourceContent">{item.socialmedia_activity}</p>
            </div>
        </div>
    );

    // Function to render loading indicator
    const renderLoading = () => (
        loading && (
            <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>
                Loading...
            </div>
        )
    );

    // Function to render no data message
    const renderNoData = () => (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "gray" }}>
            {noDataMessage.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                    {line}
                    {index < noDataMessage.split('\n').length - 1 && <br />}
                </React.Fragment>
            ))}
        </p>
    );

    // Function to render no more data message
    // const renderNoMoreData = () => {
    //     // For ScrollCriteriaViewer (uses currentPage and totalPages)
    //     if (currentPage >= totalPages && resources.length > 0) {
    //         return (
    //             <p style={{ textAlign: "center", marginTop: "2rem" }}>
    //                 {noMoreDataMessage}
    //             </p>
    //         );
    //     }

    //     // For Resources (uses hasMore)
    //     if (!hasMore && resources.length > 0) {
    //         return (
    //             <p style={{ textAlign: "center", marginTop: "2rem" }}>
    //                 {noMoreDataMessage}
    //             </p>
    //         );
    //     }

    //     return null;
    // };

    // Helper to show correct fallback image
    const fallbackImg = (type) => {
        switch (type) {
            case "Instagram": return Instagram;
            case "YouTube": return YoutubeLogo;
            case "Tiktok": return TiktokLogo;
            case "X": return X_logo;
            case "Facebook": return Facebook_logo;
            case "rss feed": return rss;
            default: return PlaceholderImg;
        }
    };

    // If it's list view, render the full component with sidebar
    if (isListView) {
        return (
            <div className="container-r">
                {/* Header Section */}
                <div className="top-header">
                    <div style={{ color: '#d9d9d9', fontSize: '16px', fontWeight: '600' }}>
                        <h5>{title}</h5>
                    </div>
                </div>

                {/* Content Section */}
                <div className="contents">
                    <div className="left-content">
                        <div className="overflow-wrapper">
                            <div
                                className="left-sidebar"
                                ref={containerRef || sidebarRef}
                            >
                                <div className="inner-content" style={{ paddingBottom: '60px' }}>
                                    <div className="sidebar-header">
                                        <div style={{ marginBottom: '10px', color: '#000' }}>
                                            {/* Header content can be added here if needed */}
                                        </div>
                                        {renderLoading()}
                                    </div>

                                    {/* Resource Items */}
                                    {resources && resources.length > 0 ? (
                                        resources.map(renderResourceItem)
                                    ) : (
                                        renderNoData()
                                    )}

                                    {/* No More Data Message */}
                                    {/* {renderNoMoreData()} */}

                                    {/* Loading at bottom (for infinite scroll) */}
                                    {renderLoading()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="right-content">
                        {selectedResource ? (
                            <div className="resourceDetailsContainer">
                                {/* Recursive call for detail view */}
                                <ResourceDetails
                                    resource={selectedResource}
                                    showCommentPopup={showCommentPopup}
                                    showPopup={showPopup}
                                    setShowPopup={setShowPopup}
                                    isListView={false}
                                />

                                {/* Comment Component (only if showCommentPopup is true) */}
                                {showCommentPopup && (
                                    <AddComment
                                        show={showPopup}
                                        onClose={() => setShowPopup(false)}
                                        selectedResource={selectedResource}
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="noDataWrapper">
                                <p>{selectResourceMessage}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // If not list view, render single resource detail (existing functionality)
    if (!resource) {
        return (
            <div className="noDataWrapper">
                <p>No Data Available</p>
            </div>
        );
    }

    return (
        <div className="resourceDetailsContainer">
            {/* --- Instagram --- */}
            {resource.unified_record_type === "Instagram" && (
                <div className="resourceDetailsView marginSides20">
                    <div className="profile-section">
                        <img
                            src={resource.socialmedia_from_imageurl}
                            onError={e => { e.target.onerror = null; e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; }}
                            alt="pic_not_found"
                            className="profileImage"
                        />
                        <div className="name-date">
                            <p className="displayName">{resource.socialmedia_from_displayname}</p>
                            <p className="postDate">{resource.unified_date_only}</p>
                        </div>
                    </div>
                    {resource.socialmedia_media_url && (() => {
                        let urls = [];
                        try {
                            urls = JSON.parse(resource.socialmedia_media_url);
                        } catch (error) {
                            return <p>Invalid media format</p>;
                        }
                        return (
                            <div className="imageGridWrapper">
                                {urls.map((url, index) => {
                                    url = url.trim();
                                    if (url.includes('video')) {
                                        return (
                                            <video key={index} controls className="postImage" preload="metadata">
                                                <source src={url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    } else if (url.includes('pbs') || url.includes('twimg')) {
                                        return (
                                            <img key={index} src={url} alt={`Post ${index}`} className="postMedia" />
                                        );
                                    } else {
                                        return <p key={index}>Media not available</p>;
                                    }
                                })}
                            </div>
                        );
                    })()}
                    <p className="activityContent">
                        {resource.unified_activity_content}
                    </p>
                    <div className="insta-icon" style={{ justifyContent: "initial" }}>
                        <div className="like-commment-share">
                            <div className="like">
                                <FaRegHeart style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_like_count}</span>
                            </div>
                            <div className="comment">
                                <FaRegComment style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_comment_count}</span>
                            </div>
                            <PiShareFatBold style={{ marginRight: '5px' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- LinkedIn --- */}
            {resource.unified_record_type === "LinkedIn" && (
                <div className="resourceDetailsView marginSides20">
                    <div className="profile-section">
                        <img
                            src={resource.socialmedia_from_imageurl}
                            onError={e => { e.target.onerror = null; e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; }}
                            alt="pic_not_found"
                            className="profileImage"
                        />
                        <div className="name-date">
                            <p className="displayName">{resource.socialmedia_from_displayname}</p>
                            <p className="postDate">{resource.unified_date_only}</p>
                        </div>
                    </div>
                    <p className="activityContent">{resource.unified_activity_content}</p>
                    {resource.socialmedia_media_url && (() => {
                        let urls = resource.socialmedia_media_url;
                        if (typeof urls === 'string') {
                            urls = urls.replace(/[\]"]+/g, '').split(',');
                        }
                        return (
                            <div className="imageGridWrapper">
                                {urls.map((url, index) => {
                                    url = url.trim();
                                    if (url.includes('video')) {
                                        return (
                                            <video key={index} controls className="postImage">
                                                <source src={url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    } else if (url.includes('pbs') || url.includes('twimg')) {
                                        return (
                                            <img key={index} src={url} alt={`Post ${index}`} className="postMedia" />
                                        );
                                    } else {
                                        return <p key={index}>Media not available</p>;
                                    }
                                })}
                            </div>
                        );
                    })()}
                    <div className="insta-icon">
                        <div className="like-commment-share">
                            <div className="like">
                                <LiaThumbsUpSolid style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_like_count} Like</span>
                            </div>
                            <div className="comment">
                                <FaRegCommentDots style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_comment_count} Comment</span>
                            </div>
                            <div className="comment"><span><MdRepeat style={{ marginRight: '5px' }} />Repost</span></div>
                            <div className="comment"><span><PiShareFatBold style={{ marginRight: '5px' }} />Share</span></div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Twitter/X --- */}
            {resource.unified_record_type === "X" && (
                <div className="resourceDetailsView marginSides20">
                    <div className="profile-section">
                        <img
                            src={resource.socialmedia_from_imageurl}
                            onError={e => { e.target.onerror = null; e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; }}
                            alt="pic_not_found"
                            className="profileImage"
                        />
                        <div className="name-date">
                            <p className="displayName">{resource.socialmedia_from_displayname}</p>
                            <p className="postDate">{resource.socialmedia_from_screenname}</p>
                        </div>
                    </div>
                    <p className="activityContent">{resource.unified_activity_content}</p>
                    {resource.socialmedia_media_url && (() => {
                        let urls = [];
                        try {
                            urls = JSON.parse(resource.socialmedia_media_url);
                        } catch (error) {
                            return <p>Invalid media format</p>;
                        }
                        return (
                            <div className="imageGridWrapper">
                                {urls.map((url, index) => {
                                    url = url.trim();
                                    if (url.includes('video')) {
                                        return (
                                            <video key={index} controls className="postImage" preload="metadata">
                                                <source src={url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    } else if (url.includes('pbs') || url.includes('twimg')) {
                                        return (
                                            <img key={index} src={url} alt={`Post ${index}`} className="postMedia" />
                                        );
                                    } else {
                                        return <p key={index}>Media not available</p>;
                                    }
                                })}
                            </div>
                        );
                    })()}
                    <div className="view" style={{ display: "flex", gap: "4px" }}>
                        <div className="time">
                            <span>
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                                .
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                                ,
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).getFullYear()}.
                            </span>
                        </div>
                        <span><strong>{resource.socialmedia_activity_view_count}</strong>Views</span>
                    </div>
                    <div className="insta-icon">
                        <div className="like-commment-share">
                            <div className="comment">
                                <FaRegComment style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_reply_count}</span>
                            </div>
                            <div className="repost">
                                <LuRepeat2 style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_retweet_count}</span>
                            </div>
                            <div className="like">
                                <FaRegHeart style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_like_count}</span>
                            </div>
                            <FaRegBookmark style={{ marginRight: '5px' }} />
                            <MdOutlineFileUpload style={{ marginRight: '5px' }} />
                        </div>
                    </div>
                </div>
            )}

            {/* --- Tiktok --- */}
            {resource.unified_record_type === "Tiktok" && (
                <div className="tiktok-container">
                    <video src={resource.socialmedia_from_imageurl} autoPlay muted loop></video>

                    <div className="right-panel">
                        <img src="your-profile.jpg" alt="pic_not_found" className="profile-pic" />
                        <div className="icon"><GoEye /><span>{resource.socialmedia_activity_view_count}</span></div>
                        <div className="icon">❤<span>{resource.socialmedia_activity_like_count}</span></div>
                        <div className="icon"><FaRegCommentDots /><span></span></div>
                        <div className="icon"><FaRegBookmark /><span></span></div>
                        <div className="icon"><PiShareFatBold /><span></span></div>
                    </div>

                    <div className="bottom-content">
                        <p className="username">{resource.socialmedia_from_displayname}</p>
                        <p>{resource.socialmedia_from_screenname}</p>
                        <p className="caption">
                            {resource.unified_activity_content}
                        </p>
                    </div>
                </div>
            )}

            {/* --- Facebook --- */}
            {resource.unified_record_type === "Facebook" && (
                <div className="resourceDetailsView marginSides20">
                    <div className="profile-section">
                        <img
                            src={resource.socialmedia_from_imageurl}
                            onError={e => { e.target.onerror = null; e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; }}
                            alt="pic_not_found"
                            className="profileImage"
                        />
                        <div className="name-date">
                            <p className="displayName">{resource.socialmedia_from_displayname}</p>
                           <p className="postDate">  {new Intl.DateTimeFormat(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            }).format(new Date(resource.socialmedia_activity_time))}</p>
                        </div>
                    </div>
                    <p className="activityContent">{resource.unified_activity_content}</p>
                {resource.socialmedia_media_url && (() => {
                        let urls = [];
                        try {
                            urls = typeof resource.socialmedia_media_url === 'string'
                                ? JSON.parse(resource.socialmedia_media_url)
                                : resource.socialmedia_media_url;
                        } catch (error) {
                            console.error("Media URL parse error:", error);
                            return <p>Invalid media format</p>;
                        }

                        // Filter valid media URLs
                        const validMedia = urls.filter(url =>
                            url &&
                            (/\.(jpg|jpeg|png|gif)$/i.test(url.trim()) ||
                                url.includes('scontent') ||
                                /\.(mp4|mov|webm|ogg)$/i.test(url.trim()) ||
                                url.includes('video'))
                        );

                        if (validMedia.length === 0) {
                            return <p></p>;
                        }

                        return (
                            <div className="imageGridWrapper">
                                {validMedia.map((url, index) => {
                                    url = url.trim();
                                    if (url.includes('video') || /\.(mp4|mov|webm|ogg)$/i.test(url)) {
                                        return (
                                            <video key={index} controls className="postImage" preload="metadata">
                                                <source src={url} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    }
                                    // Image case
                                    return (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={""}
                                            className="postMedia"
                                            loading="lazy"
                                          
                                        />
                                    );
                                })}
                            </div>
                        );
                    })()}

                    <div className="view" style={{ display: "flex", gap: "4px" }}>
                        <div className="time">
                            <span>
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).toLocaleString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                                .
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                })}
                                ,
                                {resource.unified_capture_time && new Date(resource.unified_capture_time).getFullYear()}.
                            </span>
                        </div>
                    </div>
                    <div className="insta-icon">
                        <div className="like-commment-share">
                            <div className="like">
                                <LiaThumbsUpSolid style={{ marginRight: '5px' }} />
                                <span>{resource.socialmedia_activity_like_count}</span>
                            </div>
                            <div className="comment">
                                <span>{resource.socialmedia_activity_reply_count} comments</span>
                            </div>
                            <div className="share">
                                <span>shares</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- RSS feed --- */}
            {resource.unified_record_type === "Rss Feed" && (
                <div className="resourceDetailsView">
                    <div className="profile-section">
                        <h3>{resource.unified_activity_title}</h3>
                    </div>
                    <div><p>Published Date: {resource.site_published_date}</p></div>
                    <p className="activityContent">
                        {resource.unified_activity_content}
                    </p>
                </div>
            )}

            {/* --- DarkWeb etc --- */}
            {["AhmiaFi", "Gibiru"].includes(resource.unified_record_type) && (
                <div className="resourceDetailsView">
                    <div className="profile-section">
                        <h3>{resource.unified_activity_title}</h3>
                    </div>
                    <p className="activityContent">
                        {resource.site_snippet}
                    </p>
                    {resource.unified_record_type === "Gibiru" &&
                        <img src={resource.socialmedia_media_url} alt="Post" className="postImage" />
                    }
                </div>
            )}

            {/* --- Many Sites --- */}
            {[
                "4chan.org", "gab.com", "icq.im", "t.me", "bitchute.com",
                "bitcointalk.org", "crax.pro", "stopscamfraud.com"
            ].includes(resource.unified_record_type) && (
                    <div className="resourceDetailsView">
                        <div className="profile-section">
                            <h3>{resource.unified_activity_title}</h3>
                        </div>
                        <p className="activityContent">{resource.unified_activity_content}</p>
                        <img src={resource.socialmedia_media_url} alt="Post" className="postImage" />
                    </div>
                )}

            {/* --- VK --- */}
            {resource.unified_record_type === "VK" && (
                <div className="resourceDetailsView marginSides20">
                    <div className="profile-section">
                        <img
                            src={resource.socialmedia_media_url}
                            onError={e => { e.target.onerror = null; e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"; }}
                            alt="pic_not_found"
                            className="profileImage"
                        />
                        <div className="name-date">
                            <p className="displayName">{resource.socialmedia_from_displayname}</p>
                        </div>
                    </div>
                    {resource.socialmedia_media_url &&
                        resource.socialmedia_media_url.match(/\.(mp4|mov|webm|ogg)$/i) ? (
                        <video
                            src={resource.socialmedia_media_url}
                            controls
                            className="postImage"
                            width="100%"
                            height="400"
                        />
                    ) : (
                        <img
                            src={resource.socialmedia_media_url}
                            className="postImage"
                            alt="Social Media"
                            onError={e => {
                                e.target.onerror = null;
                                e.target.src = "/images/placeholder-square.png";
                            }}
                        />
                    )}
                    <p className="activityContent">
                        {resource.unified_activity_content}
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
                                    <span>{resource.socialmedia_activity_share_count}</span>
                                </div>
                            </div>
                            <div className="date-text">{resource.unified_date_only}</div>
                        </div>
                    </div>
                    <div className="bottom-row">
                        <span className="red-heart">❤</span>
                        <span className="like-count">{resource.socialmedia_activity_like_count}</span>
                    </div>
                </div>
            )}

            {/* --- YouTube --- */}
            {resource.unified_record_type === "YouTube" && (
                <div className="resourceDetailsView yt">
                    <div className="videoWrapper">
                        {resource.socialmedia_media_url && (
                            <div className="youtube-video">
                                <iframe
                                    width="100%"
                                    height="400"
                                    src={`https://www.youtube.com/embed/${resource.socialmedia_activity_url ? getYouTubeVideoId(resource.socialmedia_activity_url) : ''}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        )}
                    </div>
                    <h4 className="videoTitle">
                        {resource.socialmedia_activity_title}
                    </h4>
                    <div className="channel-action">
                        <div className="channelInfo">
                            <img
                                src={resource.socialmedia_from_imageurl ?? resource.socialmedia_media_url}
                                alt="Channel Logo"
                                className="channelLogo"
                            />
                            <h6 className="channelName">{resource.socialmedia_from_displayname}</h6>
                            <button className="subscribeButton">Subscribe</button>
                        </div>
                        <div className="actions">
                            <button className="actionButton">
                                <span className="like">
                                    <AiOutlineLike />
                                </span>
                                Like
                                <span className="like">
                                    {" | "}
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
                                <span>
                                    <BsThreeDots />
                                </span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <strong>{resource.socialmedia_activity_view_count}</strong> Views
                    </div>
                </div>
            )}

            {/* --- Sentiment/Comment Section --- */}
            {resource?.unified_type && (
                <div className="sentimentSection" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                    <AppButton style={{ cursor: 'default', marginBottom: '5px' }}>
                        {resource.sentiment
                            ? resource.sentiment.charAt(0).toUpperCase() + resource.sentiment.slice(1)
                            : 'No Data'}
                    </AppButton>
                    {/* only show comment button+popup if showCommentPopup is true */}
                    {showCommentPopup && (
                        <>
                            <AppButton
                                onClick={() => setShowPopup(true)}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 0, background: 'transparent', boxShadow: 'none' }}
                            >
                                <ChatLeftText size={15} style={{ marginRight: '5px' }} />
                                Comment
                            </AppButton>
                            <AddComment show={showPopup} onClose={() => setShowPopup(false)} selectedResource={resource} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
