import { SET_SEARCH_RESULTS, SET_PAGE } from "../Constants/criteriaConstant";

const initialState = {
  searchResults: [],
  totalPages: 1,
  currentPage: 1,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.records,
        totalPages: action.payload.total_pages || 1,
      };

    case SET_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    default:
      return state;
  }
};

export default searchReducer;
