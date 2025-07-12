import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import "./mainGlobal.css"
import { jwtDecode } from "jwt-decode";
import { useAutoFocusWithManualAutofill } from '../../../utils/autoFocus';
import { InputField } from '../../Common/InpuField/inputField';
import TextareaField from '../../Common/TextField/textField';
import DropdownField from '../../Common/SelectDropDown/selectDropDown';
import { IntervalField } from '../../Common/IntervalField/intervalField';
import AppButton from '../../Common/Buttton/button';
import { Select } from '@mui/material';

const conversionFactors = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
};

const AddNewFilter = ({ onNewFilterCreated, filterIde, onClose }) => {
  const { inputRef, isReadOnly, handleFocus } = useAutoFocusWithManualAutofill();

  const [platform, setPlatform] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [description, setDescription] = useState('');
  // const [taskId, setTaskId] = useState([]);
  const [filterId, setFilterId] = useState([]);
  const [filterDetails, setFilterDetails] = useState(null)
  const [isEditable, setIsEditable] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sources, setSources] = useState([
    {
      source: '',
      platform: [],
      keywords: [], // Initialize as an array with a single empty string
      urls: [],// Initialize as an array with a single empty string
      interval: '',
      keywordInput: '',
      urlInput: '',
      intervalValue: 1,
      intervalUnit: 'hours',
    },
  ]);
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  // const caseData1 = useSelector((state) => state.caseData.caseData);
  const token = Cookies.get('accessToken');
  const toastShown = useRef(false);

  // Reset form to initial state
  const resetForm = () => {
    setFilterName('');
    setDescription('');
    setSources([{
      source: '',
      platform: [],
      keywords: [],
      urls: [],
      keywordInput: '',
      urlInput: '',
      intervalValue: 1,
      intervalUnit: 'hours',
    }]);
    setFilterDetails(null);
    setIsEditable(true);
    toastShown.current = false;
  };

  // Reset form when filterIde becomes null (for new filter)
  useEffect(() => {
    if (filterIde === null) {
      resetForm();
    }
  }, [filterIde]);

  useEffect(() => {
    // localStorage.setItem('taskId', taskId);
    localStorage.setItem('filterId', filterId);
    // dispatch(setTaskFilter(taskId, filterId));
  }, [filterId, dispatch]);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedInUserId(decodedToken.sub);
      console.log(decodedToken);
      console.log("User ID:", decodedToken.id);
    }
  }, [token]);

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
    setError(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors.sources?.[index]?.keywords) {
        newErrors.sources[index] = { ...newErrors.sources[index], keywords: "" };
      }
      return newErrors;
    });
  };

  const handleKeywordKeyDown = (index, event) => {
    if (event.key === "Enter" && sources[index].keywordInput.trim()) {
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
      console.log('useEffect triggered', filterDetails);
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
      const isEditable = (loggedInUserId === filterDetails.created_by);
      console.log(isEditable)
      setIsEditable(isEditable);
      if (!toastShown.current) {
        if (!isEditable) {
          toast.info("You don't have permission to edit this filter");
        }
        toastShown.current = true;
      }
    }
  }, [filterDetails, loggedInUserId]);

  const handleAddSource = () => {
    setSources([...sources, {
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
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/filter/${filterIde}`, {
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
      const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/platforms`, {
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
  if (filterDetails?.id && !isEditable) {
    toast.error("You don't have permission to edit this filter");
    return;
  }
  const validationErrors = validateForm();
  if (Object.keys(validationErrors).length > 0) {
    setError(validationErrors);
    return;
  }
  setIsSubmitting(true);
  const postData = {
    name: filterName,
    description: description,
    filter_criteria: sources.map((source) => ({
      source: source.source,
      platform: source.platform,
      keywords: source.keywords,
      urls: source.source === 'rss feed'
        ? source.urls.filter(url => url.trim() !== "")
        : undefined,
      interval: source.intervalValue * conversionFactors[source.intervalUnit],
    })),
  };
  console.log("postdata save filter", postData);
  try {
    const url = filterDetails?.id
      ? `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/filter/${filterDetails.id}`
      : `${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/filter`;

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
      if (filterDetails?.id) {
        toast.success(`Filter updated successfully: ${response.data.data.name}`);
      } else {
        toast.success(`Filter created successfully: ${response.data.data.name}`);
      }

      const newFilterId = Number(response.data.data.id);
      setFilterId((prevFilterIds) => [...prevFilterIds, newFilterId]);

      // REMOVED: Automatic selection of new filter
      // Only call onNewFilterCreated for new filters (not edits) - but don't auto-select
      if (!filterDetails?.id) {
        // Pass the new filter ID but don't auto-select it
        onNewFilterCreated(newFilterId, false); // Added second parameter to indicate not to auto-select
      }

      // Reset form after successful save/update
      resetForm();
    } else {
      toast.error('Unexpected response from server.');
    }
  } catch (error) {
    console.error('Error posting data:', error);
    toast.error('Error during filter creation: ' + (error.response?.data?.detail || error.message));
  } finally {
    setIsSubmitting(false);
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

  const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };
  return (
    <div className="p-1">
      <Form style={{ marginTop: '10px' }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveFilter()
        }}>
        <span onClick={onClose} style={{
          fontSize: '20px',
          cursor: 'pointer',
          color: 'white',
          display: 'flex',
          justifyContent: 'end',
        }}>&times;</span>
        <Form.Group className="mb-3">
          <InputField
            label="Filter Name *"
            type="text"

            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value.replace(/\b\w/g, (char) => char.toUpperCase()));
              setError(prev => ({ ...prev, name: '' }));
            }}
            placeholder="Enter your filtername"
            autoComplete="filter-name"
            name="filtername"
            onKeyDown={handleEnterKey}
            disabled={filterDetails?.id && !isEditable}
            readOnly={isReadOnly}
            onFocus={handleFocus}
            ref={inputRef}
            error={!!error.name}

          />

          {error.name && <p style={{ color: "red", margin: '0px' }} >{error.name}</p>}
        </Form.Group>
        <Form.Group className="mb-3">
          <InputField
            label="Description *"
            placeholder="Please enter a description here"
            error={!!error.description}
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1));
              setError(prev => ({ ...prev, description: '' }));
            }}
            onKeyDown={handleEnterKey}
            style={{ backgroundColor: "white", color: "black" }}
            disabled={filterDetails?.id && !isEditable}
          />
          {error.description && <p style={{ color: "red", margin: '0px' }} >{error.description}</p>}
        </Form.Group>
        <div>
          <div ref={containerRef} className='sourceDiv'>
            {sources.map((source, sourceIndex) => (

              <div key={sourceIndex} className="mb-3 border rounded">
                {sources.length > 1 && (
                  <span style={{
                    display: 'flex',
                    justifyContent: 'end',
                    fontSize: '15px',
                    right: ' 6px',
                    cursor: 'pointer',
                    color: 'white',
                    marginTop : '25px'
                  }} onClick={() => handleRemoveSource(sourceIndex)}
                    disabled={!isEditable}>&times;</span>

                )}
                <div className="row g-3">

                  <div className="col-md-6">
                    <DropdownField
                      label="Source *"
                      source={"Select Source"}
                      value={source.source}
                      onChange={(e) => handleSourceChange(sourceIndex, e)}
                      disabled={filterDetails?.id && !isEditable}
                      required={true}
                      error={!!error.sources?.[sourceIndex]?.source}
                      options={[
                        { label: 'Social Media', value: 'social media' },
                        { label: 'Social Media Profile', value: 'social media profile' },
                        { label: 'RSS Feed', value: 'rss feed' },
                      ]}
                    />
                    {error.sources?.[sourceIndex]?.source && (
                      <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].source}</p>
                    )}
                  </div>

                  {source.source && source.source !== 'rss feed' && (
                    <div className="col-md-6">
                      <DropdownField
                        label="Select Platform *"
                        source={"Select Platform"}
                        value={source.platform}
                        onChange={(e) => handlePlatformChange(sourceIndex, e)}
                        style={{ width: '96%' }}

                        disabled={filterDetails?.id && !isEditable}
                        required={true}
                        error={!!error.sources?.[sourceIndex]?.platform}
                        options={platform.map((plat) => ({
                          label: plat,
                          value: plat
                        }))}
                      />
                      {error.sources?.[sourceIndex]?.platform && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].platform}</p>
                      )}
                    </div>
                  )}
                  {source.source && (
                    <div className="col-md-6">
                      <IntervalField
                        label="Monitoring Interval"
                        value={source.intervalValue}
                        unit={source.intervalUnit}
                        onValueChange={(val) => handleIntervalValueChange(sourceIndex, val)}
                        onUnitChange={(unit) => handleIntervalUnitChange(sourceIndex, unit)}
                        disabled={filterDetails?.id && !isEditable}
                      />
                      {error.sources?.[sourceIndex]?.intervalValue && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].intervalValue}</p>
                      )}
                      {error.sources?.[sourceIndex]?.intervalUnit && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].intervalUnit}</p>
                      )}
                    </div>
                  )}
                  {source.source && (
                    <div className="col-md-6" style={{ marginRight: '5px', width: '45%' }}>
                      <InputField
                        label={source.source === "social media profile" ? "User ID *" : "Keyword *"}
                        type="text"
                        placeholder={source.source === "social media profile" ? "Please press Enter to add userID" : "Please press Enter to add keyword"}
                        value={source.keywordInput}
                        onChange={(e) => handleKeywordChange(sourceIndex, e.target.value)}
                        onKeyDown={(e) => handleKeywordKeyDown(sourceIndex, e)}
                        disabled={filterDetails?.id && !isEditable}
                        style={{ maxWidth: '96%' }}
                        error={!!error.sources?.[sourceIndex]?.keywords}
                      />
                      <div className="mt-2" style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {source.keywords.map((keyword, keyIndex) => (
                          <Badge
                            key={keyIndex}
                            pill
                            bg="rgba(0, 115, 207, 0.3)"
                            className="me-2 mb-1 d-inline-flex align-items-center custom-badge"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minWidth: "auto", /*  Removes hard minWidth */
                              maxWidth: "100%", /*  Ensures full width use */
                              whiteSpace: "normal", /*  Allows text wrapping */
                              wordBreak: "break-word", /*  Breaks long words */
                              overflowWrap: "break-word", /*  Ensures smooth wrapping */
                              // padding: "5px 10px" /*  Adds better spacing */
                              border: "1px solid rgb(0, 115, 207)",
                                  color: "rgb(0, 115, 207)",
                                                          }}
                          >
                            {keyword}
                            {(!filterDetails?.id || isEditable) && (
                              <Button
                                variant="link"
                                className="text-light p-0 ms-1"
                                onClick={() => handleDeleteKeyword(sourceIndex, keyIndex)}
                                style={{color:"rgb(0, 115, 207)"}}
                              >
                                ×
                              </Button>
                            )}
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
                       <InputField
                        label={"RSS URL"}
                        type="text"
                        placeholder={"Enter RSS URL and press Enter"}
                        value={source.urlInput}
                        onChange={(e) => {
                          const newSources = [...sources];
                          newSources[sourceIndex].urlInput = e.target.value;
                          setSources(newSources);

                        }}
                        onKeyDown={(e) => handleUrlKeyDown(sourceIndex, e)}
                        disabled={filterDetails?.id && !isEditable}
                        style={{ width: '96%' }}
                      />
                      {/* <Form.Label>RSS URL</Form.Label>
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
                        disabled={filterDetails?.id && !isEditable}
                        style={{ width: '96%' }}
                      /> */}
                      <div className="mt-2" style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                        {source.urls.filter((url) => url.trim() !== "").map((url, urlIndex) => (
                          <Badge
                            key={urlIndex}
                            pill
                            bg="rgba(0, 115, 207, 0.3)"
                            radius={30}
                            className="me-2 mb-2 d-inline-flex align-items-center custom-badge"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              minWidth: "auto", /*  Removes hard minWidth */
                              maxWidth: "100%", /*  Ensures full width use */
                              whiteSpace: "normal", /*  Allows text wrapping */
                              wordBreak: "break-word", /*  Breaks long words */
                              overflowWrap: "break-word", /*  Ensures smooth wrapping */
                              // padding: "5px 10px" /*  Adds better spacing */
                              border: "1px solid rgb(0, 115, 207)",
                                  color: "rgb(0, 115, 207)",
                                                          }}
                          >
                            {url}
                            {(!filterDetails?.id || isEditable) && (
                              <Button
                                variant="link"
                                className="text-light p-0 ms-2"
                                onClick={() => handleDeleteUrl(sourceIndex, urlIndex)}
                                style={{color:"rgb(0, 115, 207)"}}
                              >
                                ×
                              </Button>
                            )}
                          </Badge>
                        ))}
                      </div>
                      {error.sources?.[sourceIndex]?.keywords && (
                        <p style={{ color: 'red', margin: 0 }}>{error.sources[sourceIndex].keywords}</p>
                      )}
                    </div>
                  )}
                </div>

              </div>

            ))}
            {(!filterDetails?.id || isEditable) && (
              // <button type="button" className="add-new-filter-button" onClick={handleAddSource}>
              //   Add Sources
              // </button>
              <AppButton children={"+ Add Source"} onClick={handleAddSource} />
            )}
            <span style={{ marginLeft: '5px' }}>
              <AppButton onClick={handleSaveFilter}
                disabled={filterDetails?.id && !isEditable || isSubmitting}
                children={isSubmitting ? (filterDetails?.id ? 'Updating...' : 'Saving...') : (filterDetails?.id ? 'Update Filter' : 'Save Filter')} />
            </span>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddNewFilter;

