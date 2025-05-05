import {SET_TASK_FILTER_ID, SET_DATA, SET_HEADERS, LOG_FILTER_COUNT, SET_LOADING, SET_PAGINATION, SET_ERROR} from '../Constants/filterConstant'
import Cookies from "js-cookie"
import axios from 'axios';

export const setTaskFilter = (taskId, filterId) => ({
    type: SET_TASK_FILTER_ID,
    payload: { taskId, filterId },
  });




// export const setSummaryDataAction = (data) => ({
//   type: SET_DATA,
//   payload: data,
// });

// export const setSumaryHeadersAction = (headers) => ({
//   type: SET_HEADERS,
//   payload: headers,
// });
export const logFilterCount = (user) => {
  console.log("filterCount", user);
  return {
    type: LOG_FILTER_COUNT,
    payload: user,
  };
};
 
 export const fetchSummaryData =
  ({ queryPayload, page = 1, itemsPerPage = 50 }) =>
  async (dispatch) => {
    try {
      dispatch({ type: SET_LOADING });

      const token = Cookies.get("accessToken");

      const response = await axios.post(
        "http://5.180.148.40:9006/api/das/search",
        {
          query: queryPayload,
          page,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;console.log("responseData",responseData)
      const results = responseData.results;console.log("results",results)
      const totalResults = responseData.total_results;console.log("totalresults",totalResults)

      // Headers
      const headersSet = new Set();
      results.forEach((item) =>
        Object.keys(item).forEach((key) => headersSet.add(key))
      );
      const headers = Array.from(headersSet);

      // Format data (stringify nested objects)
      const formattedData = results.map((item) =>
        Object.keys(item).reduce((acc, key) => {
          acc[key] =
            typeof item[key] === "object"
              ? JSON.stringify(item[key])
              : item[key];
          return acc;
        }, {})
      );

      dispatch({ type: SET_DATA, payload: formattedData });
      dispatch({ type: SET_HEADERS, payload: headers });
      dispatch({
        type: SET_PAGINATION,
        payload: {
          page,
          totalPages: Math.ceil(totalResults / itemsPerPage),
          totalResults,
        },
      });
    } catch (error) {
      dispatch({ type: SET_ERROR, payload: error.message });
    }
  };