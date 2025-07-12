import React from "react";
import { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePickera from '../FilterCriteria/datepicker';
import { Search, CalendarToday } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setPage } from '../../../Redux/Action/criteriaAction';
import { setReportResults } from '../../../Redux/Action/reportAction';
import { fetchSummaryData } from '../../../Redux/Action/filterAction';
import '../FilterCriteria/createCriteria.css';
import styles from '../../Common/Table/table.module.css';
import Loader from '../Layout/loader';
import AddButton from '../../Common/Buttton/button';
import axios from 'axios';
import GridView from './gridView';
import SearchBarDateSelect from '../../Common/SearchBar/SearchBarDateSelect';
import customSelectStyles from "../../Common/CustomStyleSelect/customSelectStyles";

const ReportPage = () => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();

  // Search form state
  const [formData, setFormData] = useState({
    searchQuery: [],
    caseIds: [],
  });

  const [showPopupD, setShowPopupD] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });

  // Case options state
  const [caseOptions, setCaseOptions] = useState([]);

  // Fetch case options on mount
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await axios.get(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });

        // Format the response data for react-select
        const caseOptionsFormatted = response.data.data.map(caseItem => ({
          value: caseItem.id,
          label: `${`CASE${String(caseItem.id).padStart(4, "0")}`} - ${caseItem.title || 'Untitled'}`
        }));

        setCaseOptions(caseOptionsFormatted);
      } catch (error) {
        console.error('Error fetching case data:', error);
      }
    };
    fetchCaseData();
  }, [Token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If updating `searchQuery`, split input into an array of keywords
    if (name === "searchQuery") {
      setFormData(prev => ({
        ...prev,
        [name]: value.split(",").map(keyword => keyword) // Split by commas and trim extra spaces
      }));
    } else {
      // For other inputs, handle normally
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle case select change
  const handleCaseChange = (selected) => {
    setFormData(prev => ({ ...prev, caseIds: selected }));
  };

  // Toggle date picker popup
  const togglePopupD = () => {
    setShowPopupD(!showPopupD);
  };

  // Handle date selection from DatePickera
  const handleDateSelection = (dateData) => {
    setSelectedDates(dateData);
    togglePopupD();
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'No date selected';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle search submit
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        keyword: Array.isArray(formData.searchQuery) ? formData.searchQuery : [],
        report_generation: true,

        case_id: formData.caseIds?.length > 0
          ? formData.caseIds.map(caseId => caseId.value.toString())
          : [], // Ensuring it's an empty array, not "[]"
        page: 1 // Start at page 1
      };

      if (selectedDates.startDate && selectedDates.startTime) {
        payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
      }

      if (selectedDates.endDate && selectedDates.endTime) {
        payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
      }

      console.log("search payload", payload);

      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );
      await dispatch(setReportResults({
        results: response.data.results,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      }));

      console.log("dispatchresponse", response.data.results);
      // Dispatch initial page number
      dispatch(setPage(1));

      // Reset form data
      setFormData({
        searchQuery: '',
        datatype: [],
        caseIds: [],
      });

    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  const isSearchDisabled = (
    (Array.isArray(formData.searchQuery) && formData.searchQuery.length === 0) &&
    (Array.isArray(formData.caseIds) && formData.caseIds.length === 0) &&
    (!selectedDates.startDate && !selectedDates.endDate)
  );

  return (
    <div style={{ backgroundColor: '#080E17', color: 'white', padding: '20px' }}>
      <h5 style={{ marginBottom: '20px' }}>Search Report</h5>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px'}}>
        <div className={styles.searchBarContainer}>
          <input
            className={styles.searchBar}
            name="searchQuery"
            placeholder="Search..."
            value={formData.searchQuery}
            onChange={handleInputChange}
          />
          <Search style={{ color: '#0073CF', cursor: 'pointer' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: '10px' , minWidth: '200ox'}}>
          <Select
          className="react-select-container"
            isMulti
            options={caseOptions}
            value={formData.caseIds}
            onChange={handleCaseChange}
            placeholder="Select Cases"
            styles={customSelectStyles}
            menuPortalTarget={document.body}
            menuShouldBlockScroll={true}
          />
        </div>
        <TextField
          placeholder="Date Select"
          value={
            selectedDates.startDate && selectedDates.endDate
              ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
              : formatDate(selectedDates.startDate || selectedDates.endDate)
          }
          onClick={togglePopupD}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CalendarToday style={{ cursor: 'pointer', color: '#0073CF' }} />
              </InputAdornment>
            ),
            readOnly: true,
            style: { height: '38px', color: 'white', backgroundColor: '#101d2b', borderRadius: '15px' }
          }}
        />
        {/* <SearchBarDateSelect
          searchValue={formData.searchQuery}
          onSearchChange={handleInputChange}
          onSearchIconClick={() => console.log('Search icon clicked')}
          selectValue={formData.caseIds}
          selectOptions={caseOptions}
          onSelectChange={handleCaseChange}
          dateValue={
            selectedDates.startDate && selectedDates.endDate
              ? `${formatDate(selectedDates.startDate)} to ${formatDate(selectedDates.endDate)}`
              : formatDate(selectedDates.startDate || selectedDates.endDate)
          }
          onDateClick={togglePopupD}
        /> */}
        <AddButton
          type="submit"
          disabled={isSearchDisabled}
        >
          Search
        </AddButton>
      </form>

      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={togglePopupD}
        />
      )}

      <GridView />
    </div>
  );
};

export default ReportPage;
