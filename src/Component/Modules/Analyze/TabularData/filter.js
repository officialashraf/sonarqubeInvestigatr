import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummaryData } from '../../../../Redux/Action/filterAction';
import { saveCaseFilterPayload } from '../../../../Redux/Action/caseAction';
import CriteriaForm from '../../../Common/FilterForm/CriteriaForm';

const AddFilter = ({ searchChips, isPopupVisible, setIsPopupVisible }) => {
  const Token = Cookies.get('accessToken');
  const dispatch = useDispatch();
  const caseId = useSelector(state => state.caseData.caseData.id);
  const caseFilter = useSelector(state => state.caseFilter?.caseFilters);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    platform: [],
    targets: [],
    sentiments: []
  });
  const [selectedDates, setSelectedDates] = useState({});
  const [options, setOptions] = useState({ platforms: [], targets: [], sentiments: [] });

  // Fetch dropdown options for current case
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // 1️⃣ First API - get distinct data including target IDs
        const res = await axios.post(
          `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
          { fields: ['targets', 'sentiment', 'unified_record_type'], case_id: [String(caseId)] },
          { headers: { Authorization: `Bearer ${Token}` } }
        );

        const targetIds = res.data.targets.buckets.map(b => parseInt(b.key, 10)).filter(id => !isNaN(id));

        // 2️⃣ Second API - get target names using target IDs
        let targetOptions = [];
        if (targetIds.length > 0) {
          const targetRes = await axios.post(
            `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/target-names`,
            { target_ids: targetIds },
            { headers: { Authorization: `Bearer ${Token}` } }
          );

          // API expected to return something like [{id:1,name:"X"}]
          targetOptions = targetRes.data.map(t => ({
            value: t.id,
            label: `TAR${String(t.id).padStart(4, '0')} - ${t.name || ' '}`,
            name: t.name,
          }));
        }
        console.log("targetnmas", targetOptions)
        // 3️⃣ Set all options
        setOptions({
          platforms: res.data.unified_record_type.buckets.map(b => ({ value: b.key, label: b.key })),
          targets: targetOptions,
          sentiments: res.data.sentiment.buckets.map(b => ({ value: b.key, label: b.key }))
        });
        console.log("setoptions", options)
      } catch (err) {
        console.error('Error fetching filter data', err);
      }
    };

    if (Token && caseId) fetchOptions();
  }, [Token, caseId]);

  // Set defaults from existing case filter
  useEffect(() => {
    if (options.platforms.length && caseFilter?.file_type) {
      setFormData(prev => ({ ...prev, platform: options.platforms.filter(opt => caseFilter.file_type.includes(opt.value)) }));
    }
  if (options.targets.length && caseFilter?.target) {
  // Saare targets ko string bana ke compare karne ke liye normalize karo
  const caseFilterTargetValues = caseFilter.target.map(t => {
    if (typeof t === "object" && t !== null) {
      return String(t.value); // object type
    }
    return String(t); // integer ya string type
  });

  setFormData(prev => ({
    ...prev,
    targets: options.targets
      .filter(opt => caseFilterTargetValues.includes(String(opt.value)))
      .map(opt => ({
        value: opt.value,
        label: opt.label,
        name: opt.name
      }))
  }));
}
    if (options.sentiments.length && caseFilter?.sentiment) {
      setFormData(prev => ({ ...prev, sentiments: options.sentiments.filter(opt => caseFilter.sentiment.includes(opt.value)) }));
    }
    if (caseFilter?.start_time && caseFilter?.end_time) {
      const startDate = new Date(caseFilter.start_time);
      const endDate = new Date(caseFilter.end_time);
      setSelectedDates({
        startDate,
        endDate,
        startTime: { hours: startDate.getHours(), minutes: startDate.getMinutes() },
        endTime: { hours: endDate.getHours(), minutes: endDate.getMinutes() }
      });
    }
  }, [options, caseFilter]);

  const performSearch = () => {
    // const combinedKeywords = Array.from(new Set(searchChips));
    const payload = { case_id: String(caseId) };

    if (formData.platform?.length > 0) {
      payload.file_type = formData.platform.map(p => p.value);
    }

    if (formData.targets?.length > 0) {
      payload.targets = formData.targets.map(t => t.value);
    }

    if (formData.sentiments?.length > 0) {
      payload.sentiments = formData.sentiments.map(s => s.value);
    }

    if (
      selectedDates.startDate &&
      selectedDates.startTime &&
      selectedDates.endDate &&
      selectedDates.endTime
    ) {
      payload.starttime = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
      payload.endtime = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
    }

    if (searchChips?.length > 0) {
      payload.keyword = searchChips;
    }
 
    if (formData.targets?.length > 0) {
      payload.targets = formData.targets.map(t => String(t.value));
    }


    // If there's only case_id, skip dispatch
    if (Object.keys(payload).length === 1) {
      console.warn('No filter criteria selected');
      return;
    }

    dispatch(fetchSummaryData(payload));
    console.log("fetchSummaryData....", payload)
    dispatch(saveCaseFilterPayload({
      keyword: payload.keyword || [],
      aggs_fields: caseFilter?.aggs_fields || [],
      caseId,
      file_type: payload.file_type || [],
      target: formData.targets || [],
      sentiment: payload.sentiments || [],
      start_time: payload.starttime || null,
      end_time: payload.endtime || null
    }));

    setIsPopupVisible(false);
  };

  if (!isPopupVisible) return null;

  return (
    <CriteriaForm
      title="Add Filter"
      caseFieldConfig={{ show: true, readOnly: true, value: caseId }}
      options={options}
      formData={formData}
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
        (!selectedDates.startDate || !selectedDates.endDate)
      }
    />
  );
};

export default AddFilter;
