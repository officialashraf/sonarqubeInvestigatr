import {configureStore}  from '@reduxjs/toolkit'
import { caseReducer, summaryReducer, tabReducer } from './Reducers/caseReducer'
import { filterReducer, summaryDataReducer, taskFilterReducer } from './Reducers/filterReducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage ke liye
import { combineReducers } from "redux";
import {searchReducer , popupReducer, criteriaReducer} from './Reducers/criteriaReducer';
import {thunk }from "redux-thunk";
import searchReducer1 from './Reducers/piiReducer';
// ✅ Persist Config
const persistConfig = {
  key: "root",
  storage, // Local Storage
  // blacklist: ['search'],
};


const rootReducer = combineReducers({
    selectedTab: tabReducer,
    taskFilterId : taskFilterReducer,
    caseData : caseReducer ,
    filterData: summaryDataReducer,
    summaryData: summaryDataReducer,
    filterCount: filterReducer,
    search: searchReducer,
    popup: popupReducer,
    pii:searchReducer1,
    criteriaKeywords: criteriaReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

//  Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: process.env.NODE_ENV !== "production" ? false : true,
      serializableCheck: process.env.NODE_ENV !== "production" ? false : true,
    }).concat(thunk),
});
console.log(store.getState());
// Persistor Export 
export const persistor = persistStore(store);
// persistor.purge();
export default store;

