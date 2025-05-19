
import { SET_REPORT_RESULTS } from '../Constants/reportConstant';

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
