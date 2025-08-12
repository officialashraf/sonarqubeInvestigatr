import { useSelector } from 'react-redux';
import ReusableBarChart from '../../../Common/Charts/BarChart/CommonBarChart';

const CaseEventtypestring = () => {

 
  const caseID = useSelector((state) => state.caseData.caseData.id);
    const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
   const { agg_fields, ...filteredPayload } = caseFilter || {};
  

  return (
    <>
      <ReusableBarChart
        caseId={caseID}
        aggsFields={["eventtypestring"]}
        query={{}} // if extra filters needed
        chartHeight={280}
        transformData={(rawData) =>
          rawData.map(item => ({
            name: item.key.split('-').slice(0, 3).join(''),
            value: item.doc_count
          }))
        }
        queryPayload={filteredPayload}
      />
    </>
  );
};

export default CaseEventtypestring;