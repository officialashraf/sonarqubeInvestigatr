import { SET_REPORT_RESULTS } from '../Constants/reportConstant';

export const setReportResults = (data) => ({
  type: SET_REPORT_RESULTS,
  payload: data,
});
