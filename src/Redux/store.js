import {configureStore}  from '@reduxjs/toolkit'
import { caseReducer, summaryReducer, tabReducer,

  } from './Reducers/caseReducer'
import { filterReducer, summaryDataReducer, taskFilterReducer } from './Reducers/filterReducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage ke liye
import { combineReducers } from "redux";
import searchReducer from './Reducers/criteriaReducer';

// ✅ Persist Config
const persistConfig = {
  key: "root",
  storage, // Local Storage
};


const rootReducer = combineReducers({
    selectedTab: tabReducer,
    taskFilterId : taskFilterReducer,
    caseData : caseReducer ,
    filterData: summaryDataReducer,
    summaryData: summaryReducer,
    filterCount: filterReducer,
    search: searchReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Configure Store
const store = configureStore({
  reducer: persistedReducer,
});
console.log(store.getState());
// Persistor Export 
export const persistor = persistStore(store);
export default store;

