import { SET_SEARCH_RESULTS, SET_PAGE, CLOSE_POPUP,OPEN_POPUP } from "../Constants/criteriaConstant";

const initialState = {
  searchResults: [],
  totalPages: 1,
  currentPage: 1,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        searchResults: action.payload.results,
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




 export const popupReducer = (state = { activePopup: null}, action) => {
  console.log("Reducer Called:", action);
  switch (action.type) {
    case OPEN_POPUP:
      return {
        ...state,
       activePopup: action.payload, // Set active popup
      };

    case CLOSE_POPUP:
      return {
        ...state,
        activePopup: null, // Close the popup
      };

    default:
      return state; // Return current state for unhandled actions
  }
};


