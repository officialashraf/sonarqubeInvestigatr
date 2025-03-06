import {configureStore}  from '@reduxjs/toolkit'
import { caseReducer, summaryReducer, tabReducer,

  } from './Reducers/caseReducer'
import { filterReducer, summaryDataReducer, taskFilterReducer } from './Reducers/filterReducer';

const store = configureStore({
  reducer: {
    selectedTab: tabReducer,
    taskFilterId : taskFilterReducer,
    caseData : caseReducer ,
    filterData: summaryDataReducer,
    summaryData: summaryReducer,
    filterCount: filterReducer,
 },
});

export default store;

