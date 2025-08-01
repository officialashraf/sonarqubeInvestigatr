import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import { FaRegHeart, FaRegCommentDots, FaRegBookmark } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { PiShareFatBold } from "react-icons/pi";
import { PinAngle, ChatLeftText } from 'react-bootstrap-icons';
import { MdRepeat, MdOutlineFileUpload } from "react-icons/md";
import { LiaThumbsUpSolid, LiaDownloadSolid } from "react-icons/lia";
import { GoEye } from "react-icons/go";
import { LuPin, LuRepeat2 } from "react-icons/lu";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { BsThreeDotsVertical, BsThreeDots } from "react-icons/bs";
import AppButton from '../../../Common/Buttton/button';
import YoutubeLogo from '../../../Assets/Images/youtube_image.png'
import Instagram from "../../../Assets/Images/Instagram.png"
import X_logo from "../../../Assets/Images/X_logo.jpg";
import Facebook_logo from "../../../Assets/Images/Facebook_logo.png";
import rss from "../../../Assets/Images/rss.jpg";
import placeholder from "../../../Assets/Images/placeholder-square.png"
import TiktokLogo from "../../../Assets/Images/tiktok.png";

const ScrollCriteriaViewer = () => {
    const containerRef = useRef(null);
    const scrollDirectionRef = useRef(null);
    const dispatch = useDispatch();
    const token = Cookies.get('accessToken');
    const [selectedResource, setSelectedResource] = useState(null);
    const { currentPage, totalPages, searchResults } = useSelector((state) => state.search || {});
    const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || '');
    const keywords = useSelector((state) => state.criteriaKeywords?.keywords || '');
    const [loading, setLoading] = useState(false);

    const fetchPageData = async (page) => {
        if (!keywords || keywords.length === 0 || page < 1 || page > totalPages) return;

        setLoading(true);
        try {
            const paginatedQuery = { ...payload, page };

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

            dispatch(
                setSearchResults({
                    results: response.data.results || [],
                    total_pages: response.data.total_pages || 1,
                    total_results: response.data.total_results || 0,
                })
            );
            dispatch(setPage(page));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPageData(currentPage);
    }, []);

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container || loading) return;

        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 10 && currentPage < totalPages) {
            scrollDirectionRef.current = 'down';
            fetchPageData(currentPage + 1);
        }

        if (scrollTop <= 10 && currentPage > 1) {
            scrollDirectionRef.current = 'up';
            fetchPageData(currentPage - 1);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [currentPage, loading]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        if (scrollDirectionRef.current === 'up') {
            const newScrollTop = container.scrollHeight / 2 - container.clientHeight / 2;
            container.scrollTo({
                top: newScrollTop,
                behavior: 'smooth',
            });
        } else if (scrollDirectionRef.current === 'down') {
            const newScrollTop = container.scrollHeight / 2 - container.clientHeight / 2;
            container.scrollTo({
                top: newScrollTop,
                behavior: 'smooth',
            });
        }
    }, [currentPage]);
    const handleResourceClick = item => {
        console.log("Selected Resource:", item);
        setSelectedResource(item);
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
            <div className="top-header">
                <div style={{ color: '#d9d9d9', fontSize: '16px', fontWeight: '600' }}>
                    <h5>Resources Insights</h5>
                </div>
            </div>

            {/* Content Section */}
            <div className="contents">
                <div className="left-content">
                    <div className="overflow-wrapper">
                        <div className="left-sidebar" ref={containerRef}>
                            <div className="inner-content" style={{ paddingBottom: '60px' }}>
                                <div className="sidebar-header">
                                    <div style={{ marginBottom: '10px', color: '#000' }}>
                                        {/* You can put header content here */}
                                    </div>

                                    {loading && (
                                        <div style={{ textAlign: 'center', padding: '10px', color: 'white' }}>
                                            Loading...
                                        </div>
                                    )}
                                </div>

                                {searchResults && searchResults.length > 0 ? (
                                    searchResults.map((item) => (
                                        <div
                                            key={item.row_id}
                                            className={`resourceItem ${selectedResource?.row_id === item.row_id ? "active" : ""
                                                }`}
                                            onClick={() => handleResourceClick(item)}
                                        >
                                            <img
                                                                   src={
                                                                     item.unified_record_type === "rss feed"
                                                                       ? item.socialmedia_from_imageurl || item.socialmedia_media_url || rss.jpg
                                                                       : item.unified_record_type === "X"
                                                                         ? item.socialmedia_from_imageurl || item.socialmedia_media_url || X_logo
                                                                         : item.unified_record_type === "Facebook"
                                                                           ? item.socialmedia_from_imageurl || item.socialmedia_media_url || Facebook_logo
                                                                         : item.unified_record_type === "YouTube"
                                                                           ? item.socialmedia_from_imageurl || item.socialmedia_media_url || YoutubeLogo
                                                                    : item.unified_record_type === "Tiktok"
                                                                        ? item.socialmedia_from_imageurl || item.socialmedia_media_url || TiktokLogo
                                                                         : item.unified_record_type === "Instagram"
                                                                             ? item.socialmedia_from_imageurl || item.socialmedia_media_url || Instagram
                                                                               : item.socialmedia_from_imageurl || item.socialmedia_media_url || placeholder
                                                                   }
                                                                   onError={(e) => {
                                                                     e.target.onerror = null; // prevents infinite loop
                                                                    if (item.unified_record_type === "Facebook") {
                                                                                               e.target.src = Facebook_logo;
                                                                                             } else if (item.unified_record_type === "Instagram") {
                                                                                               e.target.src = Instagram;
                                                                                             } else if (item.unified_record_type === "YouTube") {
                                                                                               e.target.src = YoutubeLogo;
                                                                                             } else if (item.unified_record_type === "X") {
                                                                                               e.target.src = X_logo;
                                                                                             } else if (item.unified_record_type === "rss feed") {
                                                                                               e.target.src = rss.jpg;
                                                                                             } else if (item.unified_record_type === "Tiktok") {
                                                                        e.target.src = TiktokLogo;
                                                                                             } else {
                                                                                               e.target.src = placeholder;
                                                                                             }
                                                                   }}
                                                                   alt="pic_not_found"
                                                                   className="resourceImage"
                                                                 />
                                            <div className="resourceDetails">
                                                <p className="resourceType">{item.unified_record_type || item.unified_type}</p>
                                                <p className="resourceContent">{item.socialmedia_activity}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: "center", marginTop: "2rem", color: "gray" }}>
                                        No Data Load for this case,<br />
                                        "Try again after some time."
                                    </p>)}

                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-content">
                    {selectedResource ? (
                        <div className="resourceDetailsContainer">
                            {selectedResource.unified_record_type === "Instagram" && (
                                <div className="resourceDetailsView marginSides20">
                                    {/* Profile Section */}
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
                                            <p className="displayName">{selectedResource.socialmedia_from_displayname}</p>
                                            <p className="postDate">{selectedResource.unified_date_only}</p>
                                        </div>
                                    </div>

                                    {/* Media Grid */}
                                    {selectedResource.socialmedia_media_url && (() => {
                                        let urls = selectedResource.socialmedia_media_url;

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
                                                            <img
                                                                key={index}
                                                                src={url}
                                                                alt={`Post ${index}`}
                                                                className="postMedia"
                                                            />
                                                        );
                                                    } else {
                                                        return <p key={index}>Media not available</p>;
                                                    }
                                                })}
                                            </div>
                                        );
                                    })()}

                                    {/* Post Content */}
                                    <p className="activityContent">{selectedResource.unified_activity_content}</p>

                                    {/* Like, Comment, Share */}
                                    <div className="insta-icon" style={{ justifyContent: "initial" }}>
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
                            {[
                                "4chan.org", "gab.com", "icq.im", "t.me", "bitchute.com",
                                "bitcointalk.org", "crax.pro", "stopscamfraud.com"
                            ].includes(selectedResource.unified_record_type) && (
                                    <div className="resourceDetailsView">
                                        <div className="profile-section">
                                            <h3>{selectedResource.unified_activity_title}</h3>
                                        </div>
                                        <p className="activityContent">
                                            {selectedResource.unified_activity_content}
                                        </p>
                                        <img
                                            src={selectedResource.socialmedia_media_url}
                                            alt="Post"
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
                            {selectedResource?.unified_type && (
                                <div
                                    className="sentimentSection"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        gap: '5px'
                                    }}
                                >
                                    <AppButton
                                        style={{ cursor: 'default', marginBottom: '5px' }}
                                    >
                                        {selectedResource.sentiment
                                            ? selectedResource.sentiment.charAt(0).toUpperCase() + selectedResource.sentiment.slice(1)
                                            : 'No Data'}
                                    </AppButton>
                                </div>
                            )}

                        </div>

                    ) : (
                        <div className="noDataWrapper">
                            <p>No Data Available</p>
                        </div>
                    )}
                </div>

            </div>



        </div>
    );
}
export default ScrollCriteriaViewer;