import ReusablePieChart from '../../../Common/Charts/PieChrat/pieChart';
import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import Cookies from "js-cookie";
// import Loader from '../../Layout/loader';
import { useEffect, useState } from 'react';
const  CaseSummary = () => {

    const caseID = useSelector((state) => state.caseData.caseData.id);
    const caseFilter = useSelector((state) => state.caseFilter?.caseFilters);
 const { agg_fields, ...filteredPayload } = caseFilter || {};
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (caseID) {
      setShouldFetch(true);  // 🟢 you can trigger it only when you're ready
    }
  }, [caseID]);

  // const aggsFields = useMemo(() => ['sentiment'], []);
  const aggsFields = ['unified_record_type'];
  return (
    <ReusablePieChart
      caseId={caseID}
      aggsFields={aggsFields}
      shouldFetch={shouldFetch}
      queryPayload={filteredPayload}

    />
  )
};
CaseSummary.displayName = 'CaseSummary';
export default  CaseSummary;


 