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
  const token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const containerRef = useRef(null);

  const [platform, setPlatform] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [description, setDescription] = useState('');
  const [filterId, setFilterId] = useState([]);
  const [filterDetails, setFilterDetails] = useState(null)
  const [isEditable, setIsEditable] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [formChanged, setFormChanged] = useState(false);

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

  const [error, setError] = useState({});

  const validateForm = () => {
    const errors = {};

    // Validate main filter fields
    if (!filterName.trim()) {
      errors.name = "Filter name is required";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    }

    const sourceErrors = [];

    sources.forEach((source, sourceIndex) => {
      const sourceError = {};

      if (!source.source || source.source.trim() === "") {
        sourceError.source = "Source type is required";
      }
      if (source.source && source.source !== 'rss feed' && (!source.platform || source.platform.length === 0)) {
        sourceError.platform = "At least one platform is required";
      }
      if (!source.intervalValue || source.intervalValue <= 0) {
        sourceError.intervalValue = "Interval value must be greater than 0";
      }
      if (!source.intervalUnit) {
        sourceError.intervalUnit = "Interval unit is required";
      }
      if (source.source === 'rss feed' && source.urls.length === 0) {
        sourceError.urls = "At least one RSS URL is required";
      }
      if (source.source !== 'rss feed' && source.keywords.length === 0) {
        sourceError.keywords = "At least one keyword is required";
      }
      if (source.source === 'rss feed' && source.urls.length === 0) {
        sourceError.urls = "RSS URLs cannot be empty";
      }

      if (Object.keys(sourceError).length > 0) {
        sourceErrors[sourceIndex] = sourceError;
      }
    });

    if (sourceErrors.length > 0) {
      errors.sources = sourceErrors;
    }


    return errors;
  };

  const markFormAsChanged = () => {
    if (!formChanged) setFormChanged(true);
  };

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
    markFormAsChanged();
    const selected = Array.from(event.target.selectedOptions, opt => opt.value);
    const newSources = [...sources];
    newSources[sourceIndex].platform = selected;
    setSources(newSources);
    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[sourceIndex]?.platform) {
        newErrors.sources[sourceIndex] = { ...newErrors.sources[sourceIndex], platform: "" };
      }
      return newErrors;
    });

  };

  const handleSourceChange = (index, event) => {
    markFormAsChanged();
    const value = event.target.value;
    const newSources = [...sources];
    newSources[index].source = value;
    newSources[index].platform = [];
    newSources[index].urls = [''];
    setSources(newSources);

    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[index]?.source) {
        newErrors.sources[index] = { ...newErrors.sources[index], source: "" };
      }
      return newErrors;
    });
  };

  const handleKeywordChange = (index, value) => {
    markFormAsChanged();
    const newSources = [...sources];
    newSources[index].keywordInput = value;
    setSources(newSources);
    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[index]?.keywords) {
        newErrors.sources[index] = { ...newErrors.sources[index], keywords: "" };
      }
      return newErrors;
    });
  };

  const handleKeywordKeyDown = (index, event) => {
    markFormAsChanged();
    if (event.key === 'Enter' && sources[index].keywordInput.trim()) {
      const newSources = [...sources];
      newSources[index].keywords.push(sources[index].keywordInput.trim());
      newSources[index].keywordInput = '';
      setSources(newSources);
      event.preventDefault();
    }
  };

  const handleUrlKeyDown = (index, event) => {
    markFormAsChanged();
    if (event.key === 'Enter' && sources[index].urlInput.trim()) {
      const newSources = [...sources];
      newSources[index].urls.push(sources[index].urlInput.trim());
      newSources[index].urlInput = '';
      setSources(newSources);
      event.preventDefault();
      // Clear URL error
      setError(prevErrors => {
        const newErrors = { ...prevErrors };
        if (newErrors.sources?.[index]?.urls) {
          newErrors.sources[index] = { ...newErrors.sources[index], urls: "" };
        }
        return newErrors;
      });
    }

  };

  const handleDeleteKeyword = (sourceIndex, keyIndex) => {
    markFormAsChanged();
    const newSources = [...sources];
    newSources[sourceIndex].keywords = newSources[sourceIndex].keywords.filter((_, i) => i !== keyIndex);
    setSources(newSources);
  };

  const handleDeleteUrl = (sourceIndex, urlIndex) => {
    markFormAsChanged();
    const newSources = [...sources];
    newSources[sourceIndex].urls = newSources[sourceIndex].urls.filter((_, i) => i !== urlIndex);
    setSources(newSources);
  };
  const handleIntervalValueChange = (sourceIndex, value) => {
    markFormAsChanged();
    const newSources = [...sources];
    const numericValue = Math.max(1, parseInt(value, 10) || 1);
    newSources[sourceIndex].intervalValue = numericValue;
    setSources(newSources);

    // Clear intervalValue error
    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[sourceIndex]?.intervalValue) {
        newErrors.sources[sourceIndex] = { ...newErrors.sources[sourceIndex], intervalValue: "" };
      }
      return newErrors;
    });
  };

  const handleIntervalUnitChange = (sourceIndex, unit) => {
    markFormAsChanged();
    const newSources = [...sources];
    newSources[sourceIndex].intervalUnit = unit;
    setSources(newSources);
    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[sourceIndex]?.intervalUnit) {
        newErrors.sources[sourceIndex] = { ...newErrors.sources[sourceIndex], intervalUnit: "" };
      }
      return newErrors;
    });
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
      // isEditable ? toast.info("You can edit this filter") : toast.error("You don't have permission to edit this filter");
    }
  }, [filterDetails, loggedInUserId]);

  const handleAddSource = () => {
    markFormAsChanged();
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

  function cleanObject(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v === 'string' && v.trim() === '') return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      })
    );
  }

  const handleSaveFilter = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }


    console.log("saources", sources)
    console.log("saourcesID", sources.id)


    // Clean each source object in sources
    const cleanedSources = sources.map(source => {
      // Prepare urls array properly if source is 'rss feed'
      const urls = source.source === 'rss feed' ? source.urls.filter(url => url.trim() !== '') : undefined;

      // Build cleaned source object
      const cleanedSource = {
        id: source.id,
        source: source.source,
        platform: source.platform,
        keywords: source.keywords,
        urls,
        interval: source.intervalValue * conversionFactors[source.intervalUnit],
      };

      return cleanObject(cleanedSource);
    });
    const postData = {
      name: filterName,
      description: description,
      filter_criteria: cleanedSources.filter(source => Object.keys(source).length > 0), // remove empty objects
    };

    // Clean postData top level (if needed)
    const payloadData = Object.fromEntries(
      Object.entries(postData).filter(([_, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "string" && value.trim() === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        return true;
      })
    );
    // const postData = {
    //   name: filterName,
    //   description: description,
    //   filter_criteria: sources.map((source) => ({
    //     id: source.id,
    //     source: source.source,
    //     platform: source.platform,
    //     keywords: source.keywords,
    //     urls: source.source === 'rss feed' ? [source.urls.join(',')] : undefined,
    //     interval: source.intervalValue * conversionFactors[source.intervalUnit],
    //   })),
    // };
    // const payloadData = Object.fromEntries(
    //   Object.entries(postData).filter(([_, value]) => {
    //     if (value === null || value === undefined) return false;
    //     if (typeof value === "string" && value.trim() === "") return false;
    //     if (Array.isArray(value) && value.length === 0) return false;
    //     return true;
    //   })
    // );
    console.log("postdata save filter", postData);
    try {
      const url = filterDetails?.id
        ? `http://5.180.148.40:9002/api/osint-man/v1/filter/${filterDetails.id}`
        : 'http://5.180.148.40:9002/api/osint-man/v1/filter';

      const method = filterDetails?.id ? 'put' : 'post';

      const response = await axios[method](url, payloadData, {
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
      toast.error((error.response?.data?.detail || error.message)|| 'Error during filter creation' );
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
  console.log("souerce",sources)
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
          <Form.Label>Filter Name *</Form.Label>
          <Form.Control
            type="text"
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()));
              setFormChanged(true);
              setError(prev => ({ ...prev, name: '' }));
            }}
            disabled={!isEditable}

          />
          {error.name && <p style={{ color: "black", margin: '0px' }} >{error.name}</p>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description *</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
              setFormChanged(true);
              setError(prev => ({ ...prev, description: '' }));
            }}
            disabled={!isEditable}
          />
          {error.description && <p style={{ color: "black", margin: '0px' }} >{error.description}</p>}
        </Form.Group>
        <div>
          <div ref={containerRef} className='sourceDiv'>
            {sources.map((source, sourceIndex) => (

              <div key={sourceIndex} className="mb-3 border rounded" >
                {sources.length > 1 && (
                  <span style={{
                    position: 'fixed',
                    fontSize: '15px',
                    right: ' 20px',
                    cursor: 'pointer'
                  }} onClick={() => handleRemoveSource(sourceIndex)}
                    disabled={!isEditable}>&times;</span>

                )}

                <div className="row g-3">

                  <div className="col-md-6">

                    <Form.Label>Source *</Form.Label>
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
                    {error.sources?.[sourceIndex]?.source && (
                      <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].source}</p>
                    )}
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
                      {error.sources?.[sourceIndex]?.platform && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].platform}</p>
                      )}
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
                          disabled={!isEditable}
                        >
                          <option value="" disabled selected>Units</option>
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </Form.Select>
                      </InputGroup>
                      {error.sources?.[sourceIndex]?.intervalValue && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].intervalValue}</p>
                      )}
                      {error.sources?.[sourceIndex]?.intervalUnit && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].intervalUnit}</p>
                      )}
                    </div>
                  )}
                  {source.source && (
                    <div className="col-md-6">
                    <Form.Label>{ source.source === "social media profile" ? "User ID" : "Keywords"}</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter keyword and press Enter"
                        value={source.keywordInput}
                        onChange={(e) => handleKeywordChange(sourceIndex, e.target.value)}
                        onKeyDown={(e) => handleKeywordKeyDown(sourceIndex, e)}
                        disabled={!isEditable}
                      />
                      <div className="mt-2" style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {source.keywords.map((keyword, keyIndex) => (
                          <Badge
                            key={keyIndex}
                            pill
                            bg="dark"
                            className="me-2 mb-1 d-inline-flex align-items-center"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minWidth: "auto", /*  Removes hard minWidth */
                              maxWidth: "100%", /*  Ensures full width use */
                              whiteSpace: "normal", /*  Allows text wrapping */
                              wordBreak: "break-word", /*  Breaks long words */
                              overflowWrap: "break-word", /*  Ensures smooth wrapping */
                              // padding: "5px 10px" /*  Adds better spacing */
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

                      {error.sources?.[sourceIndex]?.keywords && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].keywords}</p>
                      )}


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
                      <div className="mt-2"  style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {source.urls.filter((url) => url.trim() !== "").map((url, urlIndex) => (
                          <Badge
                            key={urlIndex}
                            pill
                            bg="dark"
                            className="me-2 mb-2 d-inline-flex align-items-center"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minWidth: "auto", /*  Removes hard minWidth */
                              maxWidth: "100%", /*  Ensures full width use */
                              whiteSpace: "normal", /*  Allows text wrapping */
                              wordBreak: "break-word", /*  Breaks long words */
                              overflowWrap: "break-word", /*  Ensures smooth wrapping */
                              // padding: "5px 10px" /*  Adds better spacing */
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
                      {error.sources?.[sourceIndex]?.urls && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].urls}</p>
                      )}
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
              // className="add-new-filter-button"
              className="add-new-filter-button"
              style={{ marginLeft: '5px' }}
              onClick={handleSaveFilter}
              // disabled={!isEditable}
              disabled={!formChanged || !isEditable}
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

