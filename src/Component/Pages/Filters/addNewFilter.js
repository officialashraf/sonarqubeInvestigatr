// import { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import { useDispatch } from 'react-redux';
// import Cookies from 'js-cookie';
// import "./main.css";
// import { jwtDecode } from "jwt-decode";

// const conversionFactors = {
//   seconds: 1,
//   minutes: 60,
//   hours: 3600,
// };

// const AddNewFilter = ({ onNewFilterCreated, filterIde, onClose }) => {
//   const [platform, setPlatform] = useState([]);
//   const [filterName, setFilterName] = useState('');
//   const [description, setDescription] = useState('');
//   const [filterId, setFilterId] = useState([]);
//   const [filterDetails, setFilterDetails] = useState(null);
//   const [isEditable, setIsEditable] = useState(true);
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const [isInitialized, setIsInitialized] = useState(false);

//   const [sources, setSources] = useState([
//     {
//       id: '',
//       source: '',
//       platform: [],
//       keywords: [],
//       urls: [],
//       keywordInput: '',
//       urlInput: '',
//       intervalValue: 1,
//       intervalUnit: 'hours',
//     },
//   ]);

//   const containerRef = useRef(null);
//   const dispatch = useDispatch();
//   const token = Cookies.get('accessToken');

//   // Store filterId in localStorage
//   useEffect(() => {
//     if (filterId.length > 0) {
//       localStorage.setItem('filterId', JSON.stringify(filterId));
//     }
//   }, [filterId]);

//   // Get user ID from token
//   useEffect(() => {
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);
//         setLoggedInUserId(decodedToken.id);
//       } catch (error) {
//         console.error('Error decoding token:', error);
//       }
//     }
//   }, [token]);

//   // Fetch filter details if filterIde exists
//   useEffect(() => {
//     const fetchFilterDetails = async () => {
//       if (!filterIde) return;
//       try {
//         const response = await axios.get(`http://5.180.148.40:9002/api/osint-man/v1/filter/${filterIde}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setFilterDetails(response.data);
//       } catch (error) {
//         console.error('Filter fetch error:', error);
//         toast.error('Error fetching filter details: ' + (error.response?.data?.detail || error.message));
//       }
//     };

//     fetchFilterDetails();
//   }, [filterIde, token]);

//   // Set up form with filter details once data is loaded
//   useEffect(() => {
//     if (filterDetails && filterDetails.id && loggedInUserId && !isInitialized) {
//       setFilterName(filterDetails.name);
//       setDescription(filterDetails.description);

//       // Convert filter criteria to sources format
//       const convertedSources = filterDetails.filter_criteria.map(criteria => {
//         // Convert interval back to value + unit
//         let intervalValue = 1;
//         let intervalUnit = 'hours';
//         if (criteria.interval) {
//           if (criteria.interval % 3600 === 0) {
//             intervalValue = criteria.interval / 3600;
//             intervalUnit = 'hours';
//           } else if (criteria.interval % 60 === 0) {
//             intervalValue = criteria.interval / 60;
//             intervalUnit = 'minutes';
//           } else {
//             intervalValue = criteria.interval;
//             intervalUnit = 'seconds';
//           }
//         }

//         return {
//           id: criteria.id || '',
//           source: criteria.source || '',
//           platform: criteria.platform || [],
//           keywords: criteria.keywords || [],
//           urls: criteria.urls || [],
//           keywordInput: '',
//           urlInput: '',
//           intervalValue,
//           intervalUnit
//         };
//       });

//       setSources(convertedSources);

//       // Check edit permissions and show toast only once
//       const canEdit = (String(loggedInUserId) === String(filterDetails.created_by));
//       setIsEditable(canEdit);

//       if (canEdit) {
//         toast.info("You can edit this filter");
//       } else {
//         toast.error("You don't have permission to edit this filter");
//       }

//       setIsInitialized(true);
//     }
//   }, [filterDetails, loggedInUserId, isInitialized]);

//   // Fetch platforms
//   useEffect(() => {
//     const fetchPlatforms = async () => {
//       try {
//         const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setPlatform(response.data.data || []);
//       } catch (error) {
//         console.error('Platform fetch error:', error);
//         toast.error('Error fetching platforms: ' + (error.response?.data?.detail || error.message));
//       }
//     };

//     fetchPlatforms();
//   }, [token]);

//   const handlePlatformChange = (sourceIndex, event) => {
//     const selected = Array.from(event.target.selectedOptions, opt => opt.value);
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[sourceIndex].platform = selected;
//       return newSources;
//     });
//   };

//   const handleSourceChange = (index, event) => {
//     const value = event.target.value;
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[index].source = value;
//       newSources[index].platform = [];
//       newSources[index].urls = [''];
//       return newSources;
//     });
//   };

//   const handleKeywordChange = (index, value) => {
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[index].keywordInput = value;
//       return newSources;
//     });
//   };

//   const handleKeywordKeyDown = (index, event) => {
//     if (event.key === 'Enter' && sources[index].keywordInput.trim()) {
//       setSources(prevSources => {
//         const newSources = [...prevSources];
//         newSources[index].keywords.push(newSources[index].keywordInput.trim());
//         newSources[index].keywordInput = '';
//         return newSources;
//       });
//       event.preventDefault();
//     }
//   };

//   const handleUrlKeyDown = (index, event) => {
//     if (event.key === 'Enter' && sources[index].urlInput?.trim()) {
//       setSources(prevSources => {
//         const newSources = [...prevSources];
//         newSources[index].urls.push(newSources[index].urlInput.trim());
//         newSources[index].urlInput = '';
//         return newSources;
//       });
//       event.preventDefault();
//     }
//   };

//   const handleDeleteKeyword = (sourceIndex, keyIndex) => {
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[sourceIndex].keywords = newSources[sourceIndex].keywords.filter((_, i) => i !== keyIndex);
//       return newSources;
//     });
//   };

//   const handleDeleteUrl = (sourceIndex, urlIndex) => {
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[sourceIndex].urls = newSources[sourceIndex].urls.filter((_, i) => i !== urlIndex);
//       return newSources;
//     });
//   };

//   const handleIntervalValueChange = (sourceIndex, value) => {
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       const numericValue = Math.max(1, parseInt(value, 10) || 1);
//       newSources[sourceIndex].intervalValue = numericValue;
//       return newSources;
//     });
//   };

//   const handleIntervalUnitChange = (sourceIndex, unit) => {
//     setSources(prevSources => {
//       const newSources = [...prevSources];
//       newSources[sourceIndex].intervalUnit = unit;
//       return newSources;
//     });
//   };

//   const handleAddSource = () => {
//     setSources(prevSources => [
//       ...prevSources, 
//       {
//         id: '',
//         source: '',
//         platform: [],
//         keywords: [],
//         urls: [],
//         keywordInput: '',
//         urlInput: '',
//         intervalValue: 1,
//         intervalUnit: 'hours',
//       }
//     ]);
//   };

//   const handleRemoveSource = (sourceIndex) => {
//     if (sources.length > 1) {
//       setSources(prevSources => prevSources.filter((_, index) => index !== sourceIndex));
//     } else {
//       toast.info("At least one source is required");
//     }
//   };

//   const handleSaveFilter = async () => {
//     if (!isEditable) {
//       toast.error("You don't have permission to edit this filter");
//       return;
//     }

//     if (!filterName.trim()) {
//       toast.error("Filter name is required");
//       return;
//     }

//     // Validate sources
//     for (const source of sources) {
//       if (!source.source) {
//         toast.error("Source selection is required for all entries");
//         return;
//       }

//       if (source.source !== 'rss feed' && (!source.platform || source.platform.length === 0)) {
//         toast.error("Platform selection is required for social media sources");
//         return;
//       }

//       if (source.source === 'rss feed' && (!source.urls || source.urls.length === 0 || (source.urls.length === 1 && source.urls[0] === ''))) {
//         toast.error("RSS URL is required for RSS feed sources");
//         return;
//       }
//     }

//     const postData = {
//       name: filterName,
//       description: description,
//       filter_criteria: sources.map((source) => ({
//         id: source.id,
//         source: source.source,
//         platform: source.platform,
//         keywords: source.keywords,
//         urls: source.source === 'rss feed' ? source.urls.filter(url => url.trim() !== '') : undefined,
//         interval: source.intervalValue * conversionFactors[source.intervalUnit],
//       })),
//     };

//     try {
//       const url = filterDetails?.id
//         ? `http://5.180.148.40:9002/api/osint-man/v1/filter/${filterDetails.id}`
//         : 'http://5.180.148.40:9002/api/osint-man/v1/filter';

//       const method = filterDetails?.id ? 'put' : 'post';

//       const response = await axios[method](url, postData, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       window.dispatchEvent(new Event('databaseUpdated'));

//       if (response.status === 200) {
//         toast.success(`Filter ${filterDetails?.id ? 'updated' : 'created'} successfully: ${response.data.data.name}`);
//         const newFilterId = Number(response.data.data.id);
//         setFilterId(prevIds => [...prevIds, newFilterId]);

//         if (onNewFilterCreated) {
//           onNewFilterCreated(newFilterId);
//         }

//         // Close popup after successful save
//         if (onClose) {
//           onClose();
//         }
//       } else {
//         toast.error('Unexpected response from server.');
//       }
//     } catch (error) {
//       console.error('Error posting data:', error);
//       toast.error('Error during filter operation: ' + (error.response?.data?.detail || error.message));
//     }
//   };

//   return (
//     <div className="p-1">
//       <Form>
//         <Form.Group className="mb-3">
//           <Form.Label>Filter Name</Form.Label>
//           <Form.Control
//             type="text"
//             value={filterName}
//             onChange={(e) => setFilterName(e.target.value)}
//             disabled={!isEditable}
//           />
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label>Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             disabled={!isEditable}
//           />
//         </Form.Group>

//         <div>
//           <div ref={containerRef} className='sourceDiv'>
//             {sources.map((source, sourceIndex) => (
//               <div key={sourceIndex} className="mb-3 border rounded p-3 position-relative">
//                 {sources.length > 1 && (
//                   <Button 
//                     variant="danger" 
//                     size="sm"
//                     className="position-absolute top-0 end-0 m-2"
//                     onClick={() => handleRemoveSource(sourceIndex)}
//                     disabled={!isEditable}
//                   >
//                     &times;
//                   </Button>
//                 )}

//                 <div className="row g-3">
//                   <div className="col-md-6">
//                     <Form.Label>Source</Form.Label>
//                     <Form.Select
//                       value={source.source}
//                       onChange={(e) => handleSourceChange(sourceIndex, e)}
//                       disabled={!isEditable}
//                     >
//                       <option value="" disabled>Select Source</option>
//                       <option value="social media">Social Media</option>
//                       <option value="social media profile">Social Media Profile</option>
//                       <option value="rss feed">RSS Feed</option>
//                     </Form.Select>
//                   </div>

//                   {source.source && source.source !== 'rss feed' && (
//                     <div className="col-md-6">
//                       <Form.Label>Platform</Form.Label>
//                       <Form.Select
//                         multiple
//                         value={source.platform}
//                         onChange={(e) => handlePlatformChange(sourceIndex, e)}
//                         disabled={!isEditable}
//                       >
//                         {platform.map((plat) => (
//                           <option key={plat} value={plat}>{plat}</option>
//                         ))}
//                       </Form.Select>
//                     </div>
//                   )}

//                   {source.source && (
//                     <div className="col-md-6">
//                       <Form.Label>Monitoring Interval</Form.Label>
//                       <InputGroup>
//                         <Form.Control
//                           type="number"
//                           min="1"
//                           value={source.intervalValue}
//                           onChange={(e) => handleIntervalValueChange(sourceIndex, e.target.value)}
//                           style={{ maxWidth: '100px' }}
//                           disabled={!isEditable}
//                         />
//                         <Form.Select
//                           value={source.intervalUnit}
//                           onChange={(e) => handleIntervalUnitChange(sourceIndex, e.target.value)}
//                           style={{ maxWidth: '150px' }}
//                           disabled={!isEditable}
//                         >
//                           <option value="seconds">Seconds</option>
//                           <option value="minutes">Minutes</option>
//                           <option value="hours">Hours</option>
//                         </Form.Select>
//                       </InputGroup>
//                     </div>
//                   )}

//                   {source.source && (
//                     <div className="col-md-6">
//                       <Form.Label>Keywords</Form.Label>
//                       <Form.Control
//                         type="text"
//                         placeholder="Enter keyword and press Enter"
//                         value={source.keywordInput || ''}
//                         onChange={(e) => handleKeywordChange(sourceIndex, e.target.value)}
//                         onKeyDown={(e) => handleKeywordKeyDown(sourceIndex, e)}
//                         disabled={!isEditable}
//                       />
//                       <div className="mt-2">
//                         {source.keywords.map((keyword, keyIndex) => (
//                           <Badge
//                             key={keyIndex}
//                             pill
//                             bg="dark"
//                             className="me-2 mb-1 d-inline-flex align-items-center"
//                             style={{
//                               minWidth: `${keyword.length * 10}px`,
//                               maxWidth: '100%',
//                               whiteSpace: 'nowrap',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                             }}
//                           >
//                             {keyword}
//                             {isEditable && (
//                               <Button
//                                 variant="link"
//                                 className="text-light p-0 ms-1"
//                                 onClick={() => handleDeleteKeyword(sourceIndex, keyIndex)}
//                               >
//                                 ×
//                               </Button>
//                             )}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   {source.source === 'rss feed' && (
//                     <div className="col-md-6">
//                       <Form.Label>RSS URL</Form.Label>
//                       <Form.Control
//                         type="url"
//                         placeholder="Enter RSS URL and press Enter"
//                         value={source.urlInput || ''}
//                         onChange={(e) => {
//                           setSources(prevSources => {
//                             const newSources = [...prevSources];
//                             newSources[sourceIndex].urlInput = e.target.value;
//                             return newSources;
//                           });
//                         }}
//                         onKeyDown={(e) => handleUrlKeyDown(sourceIndex, e)}
//                         disabled={!isEditable}
//                       />
//                       <div className="mt-2">
//                         {source.urls.filter((url) => url.trim() !== "").map((url, urlIndex) => (
//                           <Badge
//                             key={urlIndex}
//                             pill
//                             bg="dark"
//                             className="me-2 mb-2 d-inline-flex align-items-center"
//                             style={{
//                               minWidth: `${url.length * 10}px`,
//                               maxWidth: '100%',
//                               whiteSpace: 'nowrap',
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                             }}
//                           >
//                             {url}
//                             {isEditable && (
//                               <Button
//                                 variant="link"
//                                 className="text-light p-0 ms-2"
//                                 onClick={() => handleDeleteUrl(sourceIndex, urlIndex)}
//                               >
//                                 ×
//                               </Button>
//                             )}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))}

//             <div className="d-flex gap-2 mt-3">
//               <Button 
//                 variant="primary" 
//                 onClick={handleAddSource}
//                 disabled={!isEditable}
//                 className="add-new-filter-button"
//               >
//                 Add Source
//               </Button>

//               <Button
//                 variant="success"
//                 onClick={handleSaveFilter}
//                 disabled={!isEditable}
//                 className="add-new-filter-button"
//               >
//                 {filterDetails?.id ? 'Update Filter' : 'Save Filter'}
//               </Button>

//               {onClose && (
//                 <Button
//                   variant="secondary"
//                   onClick={onClose}
//                   className="add-new-filter-button"
//                 >
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default AddNewFilter;
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import "./main.css"
import { jwtDecode } from "jwt-decode";



const conversionFactors = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
};

const AddNewFilter = ({ onClose, filterIde }) => {
  const [platform, setPlatform] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [description, setDescription] = useState('');
  const [filterId, setFilterId] = useState([]);
  const [filterDetails, setFilterDetails] = useState(null)
  const [isEditable, setIsEditable] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);


  const [sources, setSources] = useState([
    {
      id: '',
      source: '',
      platform: [],
      keywords: [], // Initialize as an array with a single empty string
      urls: [],// Initialize as an array with a single empty string
      interval: '',
    },
  ]);
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const token = Cookies.get('accessToken');
  // const toastShown = useRef(false);
  useEffect(() => {
    localStorage.setItem('filterId', filterId);
  }, [filterId, dispatch]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.id);
      console.log(decodedToken); // Pura payload dekho
      console.log("User ID:", decodedToken.id); // Yahan se user ID mil jaayegi
    }
  }, [token]);

  const handlePlatformChange = (sourceIndex, event) => {
    const selected = Array.from(event.target.selectedOptions, opt => opt.value);
    const newSources = [...sources];
    newSources[sourceIndex].platform = selected;
    setSources(newSources);
  };
  const handleSourceChange = (index, event) => {
    const value = event.target.value;
    const newSources = [...sources];
    newSources[index].source = value;
    newSources[index].platform = [];
    newSources[index].urls = [''];
    setSources(newSources);
  };

  const handleKeywordChange = (index, value) => {
    const newSources = [...sources];
    newSources[index].keywordInput = value;
    setSources(newSources);
  };

  const handleKeywordKeyDown = (index, event) => {
    if (event.key === 'Enter' && sources[index].keywordInput.trim()) {
      const newSources = [...sources];
      newSources[index].keywords.push(sources[index].keywordInput.trim());
      newSources[index].keywordInput = '';
      setSources(newSources);
      event.preventDefault();
    }
  };

  const handleUrlKeyDown = (index, event) => {
    if (event.key === 'Enter' && sources[index].urlInput.trim()) {
      const newSources = [...sources];
      newSources[index].urls.push(sources[index].urlInput.trim());
      newSources[index].urlInput = '';
      setSources(newSources);
      event.preventDefault();
    }
  };

  const handleDeleteKeyword = (sourceIndex, keyIndex) => {
    const newSources = [...sources];
    newSources[sourceIndex].keywords = newSources[sourceIndex].keywords.filter((_, i) => i !== keyIndex);
    setSources(newSources);
  };

  const handleDeleteUrl = (sourceIndex, urlIndex) => {
    const newSources = [...sources];
    newSources[sourceIndex].urls = newSources[sourceIndex].urls.filter((_, i) => i !== urlIndex);
    setSources(newSources);
  };
  const handleIntervalValueChange = (sourceIndex, value) => {
    const newSources = [...sources];
    const numericValue = Math.max(1, parseInt(value, 10) || 1);
    newSources[sourceIndex].intervalValue = numericValue;
    setSources(newSources);
  };

  const handleIntervalUnitChange = (sourceIndex, unit) => {
    const newSources = [...sources];
    newSources[sourceIndex].intervalUnit = unit;
    setSources(newSources);
  };
  useEffect(() => {
    if (filterDetails && filterDetails.id) {
      console.log('useEffect triggered');
      setFilterName(filterDetails.name);
      setDescription(filterDetails.description);

      // Convert filter criteria to sources format
      const convertedSources = filterDetails.filter_criteria.map(criteria => {
        // Convert interval back to value + unit
        let intervalValue = 1;
        let intervalUnit = 'hours';
        if (criteria.interval) {
          if (criteria.interval % 3600 === 0) {
            intervalValue = criteria.interval / 3600;
            intervalUnit = 'hours';
          } else if (criteria.interval % 60 === 0) {
            intervalValue = criteria.interval / 60;
            intervalUnit = 'minutes';
          } else {
            intervalValue = criteria.interval;
            intervalUnit = 'seconds';
          }
        }

        return {
          source: criteria.source,
          id: criteria.id,
          platform: criteria.platform || [],
          keywords: criteria.keywords || [],
          urls: criteria.urls || [],
          keywordInput: '',
          urlInput: '',
          intervalValue,
          intervalUnit
        };
      });

      setSources(convertedSources);
      // Check edit permissions
      const isEditable = (String(loggedInUserId) === String(filterDetails.created_by));
      console.log(isEditable)
      setIsEditable(isEditable);
      isEditable ? toast.info("You can edit this filter") : toast.error("You don't have permission to edit this filter");
    }
  }, [filterDetails, loggedInUserId]);

  const handleAddSource = () => {
    setSources([...sources, {
      id: '',
      source: '',
      platform: [],
      keywords: [],
      urls: [],
      keywordInput: '',
      urlInput: '',
      intervalValue: 1,
      intervalUnit: 'hours',
    }]);
  };


  useEffect(() => {
    const fetchFilterDetails = async () => {
      if (!filterIde) return; // Prevent the API call if filterIde is undefined
      try {
        const response = await axios.get(`http://5.180.148.40:9002/api/osint-man/v1/filter/${filterIde}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFilterDetails(response.data);
        console.log("fetchFilterDetails", response);
      } catch (error) {
        console.error('Platform fetch error:', error);
        toast.error('Error fetching platforms: ' + (error.response?.data?.detail || error.message));
      }
    };

    fetchFilterDetails();
  }, [filterIde, token]);



  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axios.get('http://5.180.148.40:9002/api/osint-man/v1/platforms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlatform(response.data.data || []);
      } catch (error) {
        console.error('Platform fetch error:', error);
        toast.error('Error fetching platforms: ' + (error.response?.data?.detail || error.message));
      }
    };
    fetchPlatforms();
  }, [token]);



  const handleSaveFilter = async () => {
    if (!isEditable) {
      toast.error("You don't have permission to edit this filter");
      return;
    }
    console.log("saources", sources)
    console.log("saourcesID", sources.id)
    const postData = {
      name: filterName,
      description: description,
      filter_criteria: sources.map((source) => ({
        id: source.id,
        source: source.source,
        platform: source.platform,
        keywords: source.keywords,
        urls: source.source === 'rss feed' ? [source.urls.join(',')] : undefined,
        interval: source.intervalValue * conversionFactors[source.intervalUnit],
      })),
    };
    console.log("postdata save filter", postData);
    try {
      const url = filterDetails?.id
        ? `http://5.180.148.40:9002/api/osint-man/v1/filter/${filterDetails.id}`
        : 'http://5.180.148.40:9002/api/osint-man/v1/filter';

      const method = filterDetails?.id ? 'put' : 'post';

      const response = await axios[method](url, postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      window.dispatchEvent(new Event('databaseUpdated'));
      console.log("responseFilter", response)
      if (response.status === 200) {
        toast.success(`Filter created successfully: ${response.data.data.name}`);
        const newFilterId = Number(response.data.data.id);
        setFilterId((prevFilterIds) => [...prevFilterIds, newFilterId]);
        // onNewFilterCreated(newFilterId);
        setFilterName('');
        setDescription('');
        setSources([{ source: '', platform: [], keywords: [], urls: [], interval: '' }]);
      } else {
        toast.error('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Error posting data:', error);
      toast.error('Error during filter creation: ' + (error.response?.data?.detail || error.message));
    }
  };
  console.log("filetraddnew", filterId)
  const handleRemoveSource = (sourceIndex) => {
    if (sources.length > 1) {
      setSources(prevSources => prevSources.filter((_, index) => index !== sourceIndex));
    } else {
      toast.info("At least one source is required");
    }
  };
  return (
    <div className="p-1">
      {/* {filterDetails?.id && <p>Filter ID: {filterDetails.id}</p>} */}
      <Form>
        {/* <span  onClick={onClose}style={{
          position: 'fixed',
          fontSize: '15px',
          right: ' 20px',
          cursor:'pointer'
        }}>&times;</span> */}
        <Form.Group className="mb-3">
          <Form.Label>Filter Name </Form.Label>
          <Form.Control
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            disabled={!isEditable}

          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={!isEditable}
          />
        </Form.Group>
        <div>
          <div ref={containerRef} className='sourceDiv'>
            {sources.map((source, sourceIndex) => (

              <div key={sourceIndex} className="mb-3 border rounded" >
                {sources.length >1 && (
                  <span style={{
                    position: 'fixed',
                    fontSize: '15px',
                    right: ' 20px',
                   cursor:'pointer'
                  }} onClick={() => handleRemoveSource(sourceIndex)}
                    disabled={!isEditable}>&times;</span>

                )}

                <div className="row g-3">

                  <div className="col-md-6">

                    <Form.Label>Source</Form.Label>
                    <Form.Select
                      value={source.source}
                      onChange={(e) => handleSourceChange(sourceIndex, e)}
                      disabled={!isEditable}
                    >
                      <option value="" disabled selected>Select Source</option>
                      <option value="social media">Social Media</option>
                      <option value="social media profile">Social Media Profile</option>
                      <option value="rss feed">RSS Feed</option>
                    </Form.Select>
                  </div>

                  {source.source && source.source !== 'rss feed' && (
                    <div className="col-md-6">
                      <Form.Label>Platform</Form.Label>
                      <Form.Select
                        // multiple
                        value={source.platform}
                        onChange={(e) => handlePlatformChange(sourceIndex, e)}
                        disabled={!isEditable}
                      >
                        <option value="" disabled selected>Select Platform</option>
                        {platform.map((plat) => (

                          <option key={plat} value={plat}>{plat}</option>
                        ))}
                      </Form.Select>
                    </div>
                  )}
                  {source.source && (
                    <div className="col-md-6">
                      <Form.Label>Monitoring Interval</Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="1"
                          value={source.intervalValue}
                          onChange={(e) => handleIntervalValueChange(sourceIndex, e.target.value)}
                          style={{ maxWidth: '100px' }}
                          disabled={!isEditable}
                        />
                        <Form.Select
                          value={source.intervalUnit}
                          onChange={(e) => handleIntervalUnitChange(sourceIndex, e.target.value)}
                          style={{ maxWidth: '150px' }}
                        >
                          <option value="" disabled selected>Units</option>
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </Form.Select>
                      </InputGroup>
                    </div>
                  )}
                  {source.source && (
                    <div className="col-md-6">
                      <Form.Label>Keywords</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter keyword and press Enter"
                        value={source.keywordInput}
                        onChange={(e) => handleKeywordChange(sourceIndex, e.target.value)}
                        onKeyDown={(e) => handleKeywordKeyDown(sourceIndex, e)}
                        disabled={!isEditable}
                      />
                      <div className="mt-2">
                        {source.keywords.map((keyword, keyIndex) => (
                          <Badge
                            key={keyIndex}
                            pill
                            bg="dark"
                            className="me-2 mb-1 d-inline-flex align-items-center"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              minWidth: `${keyword.length * 10}px`,
                              maxWidth: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {keyword}
                            <Button
                              variant="link"
                              className="text-light p-0 ms-1"
                              onClick={() => handleDeleteKeyword(sourceIndex, keyIndex)}
                            >
                              ×
                            </Button>
                          </Badge>

                        ))}

                      </div>


                    </div>

                  )}

                  {source.source === 'rss feed' && (
                    <div className="col-md-6">
                      <Form.Label>RSS URL</Form.Label>
                      <Form.Control
                        type="url"
                        placeholder="Enter RSS URL and press Enter"
                        value={source.urlInput}
                        onChange={(e) => {
                          const newSources = [...sources];
                          newSources[sourceIndex].urlInput = e.target.value;
                          setSources(newSources);

                        }}
                        onKeyDown={(e) => handleUrlKeyDown(sourceIndex, e)}
                        disabled={!isEditable}
                      />
                      <div className="mt-2">
                        {source.urls.filter((url) => url.trim() !== "").map((url, urlIndex) => (
                          <Badge
                            key={urlIndex}
                            pill
                            bg="dark"
                            className="me-2 mb-2 d-inline-flex align-items-center"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              minWidth: `${url.length * 10}px`,
                              maxWidth: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {url}
                            <Button
                              variant="link"
                              className="text-light p-0 ms-2"
                              onClick={() => handleDeleteUrl(sourceIndex, urlIndex)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>

                  )}

                </div>

              </div>



            ))}
            <button type="button" className="add-new-filter-button" onClick={handleAddSource}>
              Add Sources
            </button>
              {/* <button type="button" className="add-new-filter-button" onClick={onClose}>
              Close          
                </button> */}
            <button
              type="button"
              className="add-new-filter-button"
              style={{ marginLeft: '5px' }}
              onClick={handleSaveFilter}
            // disabled={!isEditable}
            >
              {filterDetails?.id ? 'Update Filter' : 'Save Filter'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddNewFilter;

