
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { saveReportilterPayload, setReportResults } from '../../../Redux/Action/reportAction';
import { savereportFilterPayload } from '../../../Redux/Action/caseAction';
import { setPage } from '../../../Redux/Action/criteriaAction';
import CriteriaForm from '../../Common/FilterForm/CriteriaForm';
import { toast } from 'react-toastify';

const ReportFilter = ({ searchChips, isPopupVisible, setIsPopupVisible }) => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const reportFilter = useSelector(state => state.reportFilter?.reportFilters);
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    platform: [],
    targets: [],
    sentiments: [],
    caseIds: []
  });
  console.log("formdtaCaseIds",formData)
  const [selectedDates, setSelectedDates] = useState({});
  const [options, setOptions] = useState({ 
    platforms: [], 
    targets: [], 
    sentiments: [], 
    cases: [] 
  });
console.log("optionCaseIds",options.cases)
  // Fetch all available options (not case-specific for reports)
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Get cases
        const caseResponse = await axios.get(
          `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`,
          { headers: { Authorization: `Bearer ${Token}` } }
        );

        const caseOptions = caseResponse.data.data.map(caseItem => ({
          value: caseItem.id,
          label: `CASE${String(caseItem.id).padStart(4, '0')} - ${caseItem.title || 'Untitled'}`
        }));

        // Get distinct data for platforms, targets, sentiments
        const distinctResponse = await axios.post(
          `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
          { fields: ['targets', 'sentiment', 'unified_record_type'] },
          { headers: { Authorization: `Bearer ${Token}` } }
        );

        const targetIds = distinctResponse.data.targets?.buckets
          ?.map(b => parseInt(b.key, 10))
          ?.filter(id => !isNaN(id)) || [];

        // Get target names if we have target IDs
        let targetOptions = [];
        if (targetIds.length > 0) {
          const targetResponse = await axios.post(
            `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target-names`,
            { target_ids: targetIds },
            { headers: { Authorization: `Bearer ${Token}` } }
          );

          targetOptions = targetResponse.data.map(t => ({
            value: t.id,
            label: `TAR${String(t.id).padStart(4, '0')} - ${t.name || ' '}`,
            name: t.name,
          }));
        }

        setOptions({
          platforms: distinctResponse.data.unified_record_type?.buckets?.map(b => ({ 
            value: b.key, 
            label: b.key 
          })) || [],
          targets: targetOptions,
          sentiments: distinctResponse.data.sentiment?.buckets?.map(b => ({ 
            value: b.key, 
            label: b.key 
          })) || [],
          cases: caseOptions
        });
      } catch (err) {
        console.error('Error fetching filter data', err);
      }
    };

    if (Token) fetchOptions();
  }, [Token]);

  // Set defaults from existing filter
  useEffect(() => {
    if (options.platforms.length && reportFilter?.file_type) {
      setFormData(prev => ({ 
        ...prev, 
        platform: options.platforms.filter(opt => reportFilter.file_type.includes(opt.value)) 
      }));
    }
    
    if (options.targets.length && reportFilter?.target) {
      const reportFilterTargetValues = reportFilter.target.map(t => {
        if (typeof t === "object" && t !== null) {
          return String(t.value);
        }
        return String(t);
      });

      setFormData(prev => ({
        ...prev,
        targets: options.targets
          .filter(opt => reportFilterTargetValues.includes(String(opt.value)))
          .map(opt => ({
            value: opt.value,
            label: opt.label,
            name: opt.name
          }))
      }));
    }
    
    if (options.sentiments.length && reportFilter?.sentiment) {
      setFormData(prev => ({ 
        ...prev, 
        sentiments: options.sentiments.filter(opt => reportFilter.sentiment.includes(opt.value)) 
      }));
    }
if (options.cases.length && reportFilter?.case_id) {
  setFormData(prev => ({
    ...prev,
    caseIds: options.cases.filter(opt =>
      reportFilter.case_id.includes(String(opt.value))
    )
  }));
}




    
    if (reportFilter?.start_time && reportFilter?.end_time) {
      const startDate = new Date(reportFilter.start_time);
      const endDate = new Date(reportFilter.end_time);
      setSelectedDates({
        startDate,
        endDate,
        startTime: { hours: startDate.getHours(), minutes: startDate.getMinutes() },
        endTime: { hours: endDate.getHours(), minutes: endDate.getMinutes() }
      });
    }
  }, [options, reportFilter]);

  const performSearch = async () => {
    console.log("formData at search time:", formData);
console.log("caseIds going to query:", formData.caseIds);

    try {
      // Build query object
      const queryObject = {
        report_generation: true
      };

      if (searchChips?.length > 0) {
        queryObject.keyword = searchChips;
      }

      if (formData.platform?.length > 0) {
        queryObject.file_type = formData.platform.map(p => p.value);
      }

      if (formData.targets?.length > 0) {
        queryObject.targets = formData.targets.map(t => String(t.value));
      }

      if (formData.sentiments?.length > 0) {
        queryObject.sentiments = formData.sentiments.map(s => s.value);
      }

      if (formData.caseIds?.length > 0) {
        queryObject.case_id = formData.caseIds.map(c => String(c.value));
        console.log("pass",queryObject.case_id)
      }

      if (
        selectedDates.startDate &&
        selectedDates.startTime &&
        selectedDates.endDate &&
        selectedDates.endTime
      ) {
        queryObject.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
        queryObject.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
      }

      // Final payload structure for report
      const payload = {
        file_extension: "pdf",
        query: queryObject,
        page: 1
      };

      console.log("Report filter payload", payload);

      // Make API call
      const response = await axios.post(
        `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
        queryObject, // Send query object for now
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Token}`
          }
        }
      );

      // Update Redux with results
      dispatch(setReportResults({
        results: response.data.results,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      }));

      // Save filter state to Redux
    dispatch(saveReportilterPayload({
  keyword: queryObject.keyword || [],
  file_type: queryObject.file_type || [],
  target: formData.targets || [],
  sentiment: queryObject.sentiments || [],
    case_id: queryObject.case_id,   //  only IDs
  start_time: queryObject.start_time || null,
  end_time: queryObject.end_time || null
}));


      dispatch(setPage(1));
      setIsPopupVisible(false);

    } catch (error) {
      console.error('Error performing filtered search:', error);
      toast.error('Error performing search');
    }
  };

  if (!isPopupVisible) return null;

  return (
    <CriteriaForm
      title="Report Filter"
      caseFieldConfig={{ show: false }} // Don't show case field as it's in the form
      options={{
        platforms: options.platforms,
        targets: options.targets,
        sentiments: options.sentiments,
        cases: options.cases
      }}
      formData={{
        platform: formData.platform,
        targets: formData.targets,
        sentiments: formData.sentiments,
        caseIds: formData.caseIds
      }}
      setFormData={setFormData}
      selectedDates={selectedDates}
      setSelectedDates={setSelectedDates}
      toggleDatePicker={() => setShowDatePicker(p => !p)}
      showDatePicker={showDatePicker}
      onSearch={performSearch}
      onCancel={() => setIsPopupVisible(false)}
      showCreateButton={false}
      isSearchDisabled={
        (!formData.platform || formData.platform.length === 0) &&
        (!formData.targets || formData.targets.length === 0) &&
        (!formData.sentiments || formData.sentiments.length === 0) &&
        (!formData.caseIds || formData.caseIds.length === 0) &&
        (!selectedDates.startDate || !selectedDates.endDate) &&
        (!searchChips || searchChips.length === 0)
      }
    />
  );
};

export default ReportFilter;