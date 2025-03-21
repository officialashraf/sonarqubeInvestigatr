import { SET_SEARCH_RESULTS, SET_PAGE } from "../Constants/criteriaConstant";

export const setSearchResults = (payload) => ({
  type: SET_SEARCH_RESULTS,
  payload,
});

export const setPage = (payload) => ({
  type: SET_PAGE,
  payload,
});
