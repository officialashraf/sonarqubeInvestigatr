
import { configureStore } from '@reduxjs/toolkit'
import { CaseFilterPayloadReducer, caseReducer, tabReducer } from './Reducers/caseReducer'
import { filterReducer, summaryDataReducer, taskFilterReducer } from './Reducers/filterReducer';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Local Storage ke liye
import { combineReducers } from "redux";
import { searchReducer, popupReducer, criteriaReducer } from './Reducers/criteriaReducer';
import { thunk } from "redux-thunk";
import searchReducer1 from './Reducers/piiReducer';
import reportReducer, { ReportFilterPayloadReducer } from './Reducers/reportReducer';
import { userReducer } from './Reducers/userReducer';
//  Persist Config
const persistConfig = {
  key: "root",
  storage, // Local Storage
  blacklist: ['summaryData','report','user','pii'],
};

const rootReducer = combineReducers({
  user: userReducer,
  selectedTab: tabReducer,
  taskFilterId: taskFilterReducer,
  caseData: caseReducer,
  filterData: summaryDataReducer,
  summaryData: summaryDataReducer,
  filterCount: filterReducer,
  search: searchReducer,
  popup: popupReducer,
  pii: searchReducer1,
  criteriaKeywords: criteriaReducer,
  report: reportReducer,
  caseFilter:CaseFilterPayloadReducer,
   reportFilter:ReportFilterPayloadReducer,
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

