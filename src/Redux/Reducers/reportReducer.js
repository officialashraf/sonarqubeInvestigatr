
import { SET_REPORT_RESULTS,SAVE_REPORT_FILTER_PAYLOAD,CLEAR_REPORT_FILTER_PAYLOAD} from '../Constants/reportConstant';

const initialState = {
  results: [],
  total_pages: 1,
  total_results: 0,
};
const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REPORT_RESULTS:
      return {
        ...state,
        results: action.payload.results,
        total_pages: action.payload.total_pages || 1,
        total_results: action.payload.total_results || 0,
      };
    default:
      return state;
  }
};

export default reportReducer;

export const ReportFilterPayloadReducer = (
  state = {
    reportFilters: {
      caseId: [],
      file_type: [],
      start_time: "",
      end_time: "",
      aggs_fields: [],
      keyword: [],
      sentiment: [],
      target: [],
    }
  },
  action
) => {
  switch (action.type) {
    case SAVE_REPORT_FILTER_PAYLOAD:
 
      return {
        ...state,
       reportFilters: {
          aggs_fields: action.payload.aggs_fields || [],
          keyword: action.payload.keyword || [],
          caseId: action.payload.caseId || [],
          target: action.payload.target || [],
          sentiment: action.payload.sentiment || [],
          file_type: action.payload.file_type || [],
          start_time: action.payload.start_time || "",
          end_time: action.payload.end_time || ""
        }
      };

   case CLEAR_REPORT_FILTER_PAYLOAD:
  return {
    ...state,
    reportFilters: {
      ...state.caseFilters,
      caseId: state.caseFilters.caseId, // Preserve current caseId
      file_type: [],
      start_time: "",
      end_time: "",
      aggs_fields: [],
      keyword: [],
      target: [],
      sentiment: []
    }
  };

    default:
      return state;
  }
};

