import { SET_SEARCH_RESULTS, SET_PAGE, OPEN_POPUP, CLOSE_POPUP } from "../Constants/criteriaConstant";

export const setSearchResults = (payload) => ({
  type: SET_SEARCH_RESULTS,
  payload,
});

export const setPage = (payload) => ({
  type: SET_PAGE,
  payload,
});

export const openPopup = (popupName) => ({
  type: OPEN_POPUP,
  payload: popupName, // Open the selected popup
});

export const closePopup = () => ({
  type: CLOSE_POPUP, // Close the popup
});
