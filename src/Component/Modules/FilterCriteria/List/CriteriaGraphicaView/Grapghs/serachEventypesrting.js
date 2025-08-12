import ReusableBarChart from '../../../../../Common/Charts/BarChart/CommonBarChart';
import { useSelector } from 'react-redux';

const SearchEventypestring = () => {
    const queryPayload = useSelector((state) => state.criteriaKeywords.queryPayload);

    return (
        <>
            <ReusableBarChart
                caseId={queryPayload?.case_id || []}
                aggsFields={["event_type_string"]}
                queryPayload={queryPayload}
                transformData={(rawData) =>
                    rawData.map(item => ({
                        name: item.key,
                        value: item.doc_count
                    }))
                }
            />
        </>
    );
};

export default SearchEventypestring;