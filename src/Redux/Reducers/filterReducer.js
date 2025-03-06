  import { SET_TASK_FILTER_ID , SET_HEADERS, SET_DATA, LOG_FILTER_COUNT} from "../Constants/filterConstant";

const initialState = {
    taskId: null,
    filterId: null,
  };

export const taskFilterReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_TASK_FILTER_ID:
        return {
          ...state,
          taskId: action.payload.taskId,
          filterId: action.payload.filterId,
        };
      default:
        return state;
    }
  };

 export const summaryDataReducer = (state = {  data: [],headers: []}, action) => {
    switch (action.type) {
      case SET_DATA:
        return { ...state, data: action.payload };
      case SET_HEADERS:
        return { ...state, headers: action.payload };
      default:
        return state;
    }}
   export const filterReducer = (state = {filterCount:{}}, action) => {
      switch (action.type) {
        case LOG_FILTER_COUNT:
          return {
            ...state,
            filterCount: action.payload,
          };
        default:
          return state;
      }
    };