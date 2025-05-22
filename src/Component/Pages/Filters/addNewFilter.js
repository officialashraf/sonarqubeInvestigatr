
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

const AddNewFilter = ({ onNewFilterCreated, filterIde }) => {
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
  const toastShown = useRef(false);
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
      if (!toastShown.current) {
        toast.info(isEditable ? "You can edit this filter" : "You don't have permission to edit this filter");
        toastShown.current = true;
      }
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


  const fetchFilterDetails = async () => {
    try {
      const response = await axios.get(`http://5.180.148.40:9002/api/osint-man/v1/filter/${filterIde}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilterDetails(response.data)
      console.log("fetchflterdetails", response)
    } catch (error) {
      console.error('Platform fetch error:', error);
      toast.error('Error fetching platforms: ' + (error.response?.data?.detail || error.message));
    }
  };

  useEffect(() => {
    if (filterIde) {
      fetchFilterDetails();
    }
  }, [filterIde]);
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

  useEffect(() => {
    fetchPlatforms();
  }, []);

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
        const action = filterDetails?.id ? 'updated' : 'created';
        toast.success(`Filter ${action} successfully: ${response.data.data.name}`);
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
  return (
    <div className="p-1">
      {filterDetails?.id && <p>Filter ID: {filterDetails.id}</p>}
      <Form>

        <Form.Group className="mb-3">
          <Form.Label>Filter Name <span style={{ color: 'black' }}>*</span> </Form.Label>
          <Form.Control
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()))}
            disabled={!isEditable}
            placeholder = "Enter here..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}  // Just update raw text
            onBlur={() => {
              // Format to sentence case on blur
              setDescription((prev) =>
                prev.charAt(0).toUpperCase() + prev.slice(1).toLowerCase()
              );
            }}
            disabled={!isEditable}
            placeholder="Enter Description"
          />
        </Form.Group>
        <div>
          <div ref={containerRef} className='sourceDiv'>
            {sources.map((source, sourceIndex) => (

              <div key={sourceIndex} className="mb-3 border rounded" >
                <div className="row g-3">
                  <div className="col-md-6">
                    <Form.Label>Source <span style={{ color: 'black' }}>*</span></Form.Label>
                    <Form.Select
                      value={source.source}
                      onChange={(e) => handleSourceChange(sourceIndex, e)}
                      disabled={!isEditable}
                      required
                    >
                      <option value="" disabled selected>Select Source <span style={{ color: 'black' }}>*</span></option>
                      <option value="social media">Social Media</option>
                      <option value="social media profile">Social Media Profile</option>
                      <option value="rss feed">RSS Feed</option>
                    </Form.Select>
                  </div>

                  {source.source && source.source !== 'rss feed' && (
                    <div className="col-md-6">
                      <Form.Label>Platforms  <span style={{ color: 'black' }}>*</span></Form.Label>
                      <Form.Select
                        // multiple
                        value={source.platform}
                        onChange={(e) => handlePlatformChange(sourceIndex, e)}
                        disabled={!isEditable}
                        required
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
                      <Form.Label>Monitoring Interval <span style={{ color: 'black' }}>*</span></Form.Label>
                      <InputGroup>
                        <Form.Control
                          type="number"
                          min="1"
                          value={source.intervalValue}
                          onChange={(e) => handleIntervalValueChange(sourceIndex, e.target.value)}
                          style={{ maxWidth: '100px' }}
                          disabled={!isEditable}
                          required
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
                      <Form.Label>Keywords <span style={{ color: 'black' }}>*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Keyword and Press Enter"
                        value={source.keywordInput}
                        onChange={(e) => handleKeywordChange(sourceIndex, e.target.value)}
                        onKeyDown={(e) => handleKeywordKeyDown(sourceIndex, e)}
                        disabled={!isEditable}
                        required
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
                        placeholder="Enter RSS URL and press enter"
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
                        {source.urls.map((url, urlIndex) => (
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

