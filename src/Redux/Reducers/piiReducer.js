import {
  SEARCH_REQUEST,
  SEARCH_SUCCESS,
  SEARCH_FAILURE,
  CLEAR_SEARCH,
} from "../Constants/piiConstant";

const initialState = {
  loading: false,
  data: null,
  error: null,
};
const searchReducer1 = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_REQUEST:
      return { ...state, loading: true, error: null };
    case SEARCH_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case SEARCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
       case CLEAR_SEARCH: 
      return { ...initialState }
    default:
      return state;
  }
};

export default searchReducer1;
