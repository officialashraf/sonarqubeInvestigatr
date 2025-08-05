import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { setPage, setSearchResults } from '../../../../Redux/Action/criteriaAction';
import YoutubeLogo from '../../../Assets/Images/youtube_image.png'
import Instagram from "../../../Assets/Images/Instagram.png"
import X_logo from "../../../Assets/Images/X_logo.jpg";
import Facebook_logo from "../../../Assets/Images/Facebook_logo.png";
import rss from "../../../Assets/Images/rss.jpg";
import placeholder from "../../../Assets/Images/placeholder-square.png"
import TiktokLogo from "../../../Assets/Images/tiktok.png";
import ResourceDetails from '../../Analyze/ResourceDetails';
import useInfiniteScroll from '../../../Hooks/useInfiniteScroll'; // ✅ ensure correct path


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
        setLoading(true);
        try {
            const isValid = (v) =>
                Array.isArray(v) ? v.length > 0 :
                    typeof v === 'string' ? v.trim() !== '' :
                        v !== null && v !== undefined;

            const filteredPayload = {};
            Object.entries(payload).forEach(([key, value]) => {
                if (isValid(value)) filteredPayload[key] = value;
            });

            const response = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
                { ...filteredPayload, page },
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
        fetchPageData(currentPage);
    }, []);

    const handleResourceClick = (item) => {
        console.log("Selected Resource:", item);
        setSelectedResource(item);
    };

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

                                {/* No More Data Message */}
                                {currentPage >= totalPages && searchResults && searchResults.length > 0 && (
                                    <p style={{ textAlign: "center", marginTop: "2rem" }}>
                                        No more data available.
                                    </p>
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
                              
                            />
                          
                        </div>
                    ) : (
                        <div className="noDataWrapper">
                            <p>Select resource for better visibility</p>
                        </div>
                    )}
                </div>
            </div>



        </div>
    );
}
export default ScrollCriteriaViewer;