import {
    SET_SELECTED_TAB,
    SET_CASE_DATA,
    SET_SUMMARY_DATA,
    SAVE_CASE_FILTER_PAYLOAD,
    CLEAR_CASE_FILTER_PAYLOAD,
} from '../Constants/caseCaontant';

const initialState = { selectedTab: 'default', };
export const tabReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_SELECTED_TAB:
            return {
                ...state,
                selectedTab: action.payload,
            };
        default: return state;
    }
};

export const caseReducer = (state = { caseData: {} }, action) => {
    switch (action.type) {
        case SET_CASE_DATA:
            return {
                ...state,
                caseData: action.payload,
            };
        default:
            return state;
    }
};

export const summaryReducer = (state = {
    social_media: {},
    count: 0,
    dates: {}
}, action) => {
    switch (action.type) {
        case SET_SUMMARY_DATA:
            return {
                ...state,
                social_media: action.payload.social_media,
                count: action.payload.count,
                dates: action.payload.dates
            };
        default:
            return state;
    }
};
export const CaseFilterPayloadReducer = (
  state = {
    caseFilters: {
      caseId: [],
      file_type: [],
      start_time: "",
      end_time: "",
      aggs_fields: [],
      keyword: []
    }
  },
  action
) => {
  switch (action.type) {
    case SAVE_CASE_FILTER_PAYLOAD:
      return {
        ...state,
        caseFilters: {
          aggs_fields: action.payload.aggs_fields || [],
          keyword: action.payload.keyword || [],
          caseId: action.payload.caseId || [],
          file_type: action.payload.file_type || [],
          start_time: action.payload.start_time || "",
          end_time: action.payload.end_time || ""
        }
      };

    case CLEAR_CASE_FILTER_PAYLOAD:
      return {
        ...state,
        caseFilters: {
          caseId: [],
          file_type: [],
          start_time: "",
          end_time: "",
          aggs_fields: [],
          keyword: []
        }
      };

    default:
      return state;
  }
};

