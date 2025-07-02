import React from "react";
import { useState } from 'react';
import Select from 'react-select';
import DatePickera from '../FilterCriteria/datepicker';
import { Search, CalendarToday } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { Table, Pagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setPage } from '../../../Redux/Action/criteriaAction';
import { setReportResults } from '../../../Redux/Action/reportAction';
import { fetchSummaryData } from '../../../Redux/Action/filterAction';
import '../FilterCriteria/createCriteria.css';
import styles from '../../Common/Table/table.module.css';
import Loader from '../Layout/loader';

const ReportPage = () => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();

  // Search form state
  const [formData, setFormData] = useState({
    searchQuery: '',
    caseIds: [],
  });

  const [showPopupD, setShowPopupD] = useState(false);
  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
    startTime: { hours: 16, minutes: 30 },
    endTime: { hours: 16, minutes: 30 }
  });

  const results = useSelector((state) => state.report?.results || []);
  const page = useSelector((state) => state.report?.page || 1);
  const total_pages = useSelector((state) => state.report?.total_pages || 0);
  const total_results = useSelector((state) => state.report?.total_results || 0);
  const error = useSelector((state) => state.report?.error || null);
  const reportLoading = useSelector((state) => state.report?.loading || false);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);

  // Case options state
  const [caseOptions, setCaseOptions] = useState([]);

  // Fetch case options on mount
  React.useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const response = await fetch(`${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          },
        });
        const data = await response.json();
        const caseOptionsFormatted = data.data.map(caseItem => ({
          value: caseItem.id,
          label: `CASE${String(caseItem.id).padStart(4, "0")} - ${caseItem.title || 'Untitled'}`
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
    if (name === 'searchQuery') {
      setFormData(prev => ({ ...prev, [name]: value }));
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
        keyword: formData.searchQuery ? [formData.searchQuery] : [],
        report_generation: true,
        case_id: formData.caseIds.length > 0 ? formData.caseIds.map(c => c.value.toString()) : [],
        page: 1,
      };
      if (selectedDates.startDate && selectedDates.startTime) {
        payload.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
      }
      if (selectedDates.endDate && selectedDates.endTime) {
        payload.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
      }

      const response = await fetch(`${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      dispatch(setReportResults({
        results: data.results,
        total_pages: data.total_pages,
        total_results: data.total_results,
      }));
      dispatch(setPage(1));
      setCurrentPage(1);
      setFormData({ searchQuery: '', caseIds: [] });
    } catch (error) {
      console.error('Error performing search:', error);
    }
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    dispatch(fetchSummaryData({
      queryPayload: {},
      page: page,
      itemsPerPage: 50
    }));
  };

  // Fetch report data for print
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response2 = await fetch(`${window.runtimeConfig.REACT_APP_API_OSINT_MAN}/api/osint-man/v1/report`, {
        method: 'POST',
        headers: {
          Accept: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          Authorization: `Bearer ${Token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rows: results }),
      });
      const blob = await response2.blob();
      const url = window.URL.createObjectURL(blob);
      if ('showSaveFilePicker' in window && window.isSecureContext) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: 'social_media_report.docx',
          types: [{
            description: 'Word Document',
            accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }
          }]
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = 'social_media_report.docx';
        a.click();
        a.remove();
      }
    } catch (error) {
      console.error("Error downloading or saving .docx file:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination pages calculation
  const pages = [];
  for (let i = 1; i <= total_pages; i++) {
    if (i === 1 || i === total_pages || Math.abs(currentPage - i) <= 1) {
      pages.push(i);
    } else if (
      (i === 2 && currentPage > 4) ||
      (i === total_pages - 1 && currentPage < total_pages - 3)
    ) {
      pages.push("...");
    }
  }

  return (
    <div style={{ backgroundColor: '#080E17', color: 'white', padding: '20px', minHeight: '100vh' }}>
      <h5 style={{ marginBottom: '20px' }}>Search Report</h5>
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <TextField
          name="searchQuery"
          placeholder="Search..."
          value={formData.searchQuery}
          onChange={handleInputChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search style={{ color: 'white' }} />
              </InputAdornment>
            ),
            style: { height: '38px', color: 'white', backgroundColor: '#1a1f3a', borderRadius: '5px' }
          }}
          sx={{ minWidth: '200px', flexGrow: 1 }}
        />
        <div style={{ minWidth: '200px', flexGrow: 1 }}>
          <Select
            isMulti
            options={caseOptions}
            value={formData.caseIds}
            onChange={handleCaseChange}
            placeholder="Select Cases"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: '#1a1f3a',
                border: 'none',
                color: 'white',
                minHeight: '38px',
                borderRadius: '5px',
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: 'white',
              }),
              placeholder: (base) => ({
                ...base,
                color: 'white',
              }),
              singleValue: (base) => ({
                ...base,
                color: 'white',
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: '#1a1f3a',
                color: 'white',
              }),
            }}
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
                <CalendarToday style={{ cursor: 'pointer', color: 'white' }} />
              </InputAdornment>
            ),
            readOnly: true,
            style: { height: '38px', color: 'white', backgroundColor: '#1a1f3a', borderRadius: '5px' }
          }}
          sx={{ minWidth: '200px', flexGrow: 1 }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            minWidth: '100px',
            height: '38px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {showPopupD && (
        <DatePickera
          onSubmit={handleDateSelection}
          initialDates={selectedDates}
          onClose={togglePopupD}
        />
      )}

      <div style={{ backgroundColor: '#0b1229', borderRadius: '10px', padding: '10px' }}>
        {reportLoading && <Loader />}
        {!reportLoading && results.length === 0 && (
          <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
            No data available
          </div>
        )}
        {!reportLoading && results.length > 0 && (
          <>
            <Table hover responsive size="sm" className={styles.table} style={{ color: 'white' }}>
              <thead>
                <tr>
                  {Object.keys(results[0]).map((key, index) => (
                    <th key={index} className="fixed-th" style={{ backgroundColor: '#007bff' }}>
                      {key
                        .split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((item, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(item).map((key, colIndex) => (
                      <td key={colIndex} className="fixed-td" style={{ fontSize: '12px' }} title={typeof item[key] === 'object' ? JSON.stringify(item[key]) : item[key]}>
                        {typeof item[key] === 'object' && item[key] !== null ? JSON.stringify(item[key]) : item[key] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              padding: '10px 20px',
              marginBottom: '30px',
              boxShadow: '0 -2px 5px rgba(0,0,0,0.05)',
              borderRadius: '0 0 10px 10px',
              backgroundColor: '#0b1229'
            }}>
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {pages.map((number, index) => {
                  if (
                    number === 1 ||
                    number === total_pages ||
                    number === currentPage ||
                    number === currentPage - 1 ||
                    number === currentPage + 1
                  ) {
                    return (
                      <Pagination.Item
                        key={index}
                        active={number === currentPage}
                        onClick={() => number !== "..." && handlePageChange(number)}
                      >
                        {number}
                      </Pagination.Item>
                    );
                  } else if (number === "...") {
                    return <Pagination.Item key={index} disabled>{number}</Pagination.Item>;
                  }
                  return null;
                })}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === total_pages} />
                <Pagination.Last onClick={() => handlePageChange(total_pages)} disabled={currentPage === total_pages} />
              </Pagination>

              <div style={{ fontSize: '12px', marginRight: '10px', color: 'white' }}>
                Page {currentPage} - 50 / {total_results}
              </div>

              <button
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  borderRadius: '5px',
                  border: 'none',
                  padding: '5px 15px',
                  cursor: 'pointer'
                }}
                onClick={fetchReportData}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Print'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
