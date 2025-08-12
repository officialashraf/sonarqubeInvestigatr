import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setKeywords, setPage, setSearchResults } from '../../../Redux/Action/criteriaAction';
import CriteriaForm from '../../Common/FilterForm/CriteriaForm';
import Confirm from './confirmCriteria';
const AddNewCriteria = ({ handleCreateCase, searchChips, isPopupVisible, setIsPopupVisible }) => {
    const Token = Cookies.get('accessToken');
    const dispatch = useDispatch();
    const payload = useSelector((state) => state.criteriaKeywords?.queryPayload || {});
    const [showSavePopup, setShowSavePopup] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [formData, setFormData] = useState({
        caseIds: [],
        platform: [],
        targets: [],
        sentiments: [],
    });
    const [selectedDates, setSelectedDates] = useState({});
    const [options, setOptions] = useState({ cases: [], platforms: [], targets: [], sentiments: [] });

    // Fetch dropdown data
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const caseRes = await axios.get(
                    `${window.runtimeConfig.REACT_APP_API_CASE_MAN}/api/case-man/v1/case`,
                    { headers: { Authorization: `Bearer ${Token}` } }
                );
                const caseOpts = caseRes.data.data.map(c => ({
                    value: c.id,
                    label: `CASE${String(c.id).padStart(4, '0')} - ${c.title || 'Untitled'}`
                }));

                const distinctRes = await axios.post(
                    `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/distinct`,
                    { fields: ['targets', 'sentiment', 'unified_record_type'] },
                    { headers: { Authorization: `Bearer ${Token}` } }
                );
                const tOpts = distinctRes.data.targets.buckets.map(b => ({ value: b.key, label: b.key }));
                const sOpts = distinctRes.data.sentiment.buckets.map(b => ({ value: b.key, label: b.key }));
                const fOpts = distinctRes.data.unified_record_type.buckets.map(b => ({ value: b.key, label: b.key }));

                setOptions({ cases: caseOpts, platforms: fOpts, targets: tOpts, sentiments: sOpts });
            } catch (err) {
                console.error('Error fetching options', err);
            }
        };
        if (Token) fetchOptions();
    }, [Token]);

    // Populate formData from payload
    useEffect(() => {
        if (options.cases.length > 0 || options.platforms.length > 0 || options.targets.length > 0 || options.sentiments.length > 0) {
            setFormData(prev => ({
                ...prev,
                caseIds: payload.case_id && payload.case_id.length > 0
                    ? (Array.isArray(payload.case_id) ? payload.case_id : JSON.parse(payload.case_id || '[]'))
                        .map(id => options.cases.find(opt => String(opt.value) === String(id)) || { value: id, label: id })
                    : [],
                platform: payload.file_type && payload.file_type.length > 0 && options.platforms.length > 0
                    ? options.platforms.filter(opt => payload.file_type.includes(opt.value))
                    : [],
                targets: payload.targets && payload.targets.length > 0 && options.targets.length > 0
                    ? options.targets.filter(opt => payload.targets.includes(opt.value))
                    : [],
                sentiments: payload.sentiments && payload.sentiments.length > 0 && options.sentiments.length > 0
                    ? options.sentiments.filter(opt => payload.sentiments.includes(opt.value))
                    : []
            }));

            // Populate selected dates
            if (payload.start_time && payload.end_time) {
                const startDate = new Date(payload.start_time);
                const endDate = new Date(payload.end_time);
                setSelectedDates({
                    startDate,
                    endDate,
                    startTime: { hours: startDate.getHours(), minutes: startDate.getMinutes() },
                    endTime: { hours: endDate.getHours(), minutes: endDate.getMinutes() }
                });
            } else {
                setSelectedDates({});
            }
        }
    }, [payload, options]);

    const performSearch = async () => {
        try {
            const payloadS = {};
            
            // Only add non-empty fields

            if (searchChips?.length > 0) {
                payloadS.keyword = searchChips;
            }      
            if (formData.caseIds && formData.caseIds.length > 0) {
                payloadS.case_id = formData.caseIds.map(c => String(c.value));
            }
            
            if (formData.platform && formData.platform.length > 0) {
                payloadS.file_type = formData.platform.map(p => p.value);
            }
            
            if (formData.targets && formData.targets.length > 0) {
                payloadS.targets = formData.targets.map(t => t.value);
            }
            
            if (formData.sentiments && formData.sentiments.length > 0) {
                payloadS.sentiments = formData.sentiments.map(s => s.value);
            }
            
            if (selectedDates.startDate && selectedDates.startTime) {
                payloadS.start_time = `${selectedDates.startDate.toISOString().split('T')[0]}T${String(selectedDates.startTime.hours).padStart(2, '0')}:${String(selectedDates.startTime.minutes).padStart(2, '0')}:00`;
            }
            
            if (selectedDates.endDate && selectedDates.endTime) {
                payloadS.end_time = `${selectedDates.endDate.toISOString().split('T')[0]}T${String(selectedDates.endTime.hours).padStart(2, '0')}:${String(selectedDates.endTime.minutes).padStart(2, '0')}:00`;
            }

            const res = await axios.post(
                `${window.runtimeConfig.REACT_APP_API_DAS_SEARCH}/api/das/search`,
                payloadS,
                { headers: { Authorization: `Bearer ${Token}` } }
            );
            dispatch(setSearchResults({
                results: res.data.results,
                total_pages: res.data.total_pages || 1,
                total_results: res.data.total_results || 0
            }));
            dispatch(setKeywords({ keyword: searchChips, queryPayload: res.data.input }));
            dispatch(setPage(1));
            if (handleCreateCase) handleCreateCase(res.data);
            setIsPopupVisible(false);
        } catch (err) {
            console.error('Error in search', err);
        }
    };

    if (!isPopupVisible) return null;

    return (
        <>
        <CriteriaForm
            title="Filter Criteria"
            caseFieldConfig={{ show: false, readOnly: false }}
            options={options}
            formData={formData}
            setFormData={setFormData}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            toggleDatePicker={() => setShowDatePicker(p => !p)}
            showDatePicker={showDatePicker}
            onSearch={performSearch}
            onCreate={() => setShowSavePopup(true)}
            onCancel={() => setIsPopupVisible(false)}
            showCreateButton={true}
            isSearchDisabled={
                !formData.caseIds.length &&
                !formData.platform.length &&
                !formData.targets.length &&
                !formData.sentiments.length &&
                !(selectedDates.startDate && selectedDates.endDate)
            }
        />
         {
        showSavePopup && (
            <Confirm
                formData={formData}
                selectedDates={selectedDates}
                searchChips={searchChips}
            />
        )
    }
        </>
    );
};

export default AddNewCriteria;


