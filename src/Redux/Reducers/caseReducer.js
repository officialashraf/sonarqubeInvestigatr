import { SET_SELECTED_TAB,
    SET_CASE_DATA,
    SET_SUMMARY_DATA,
    } from '../Constants/caseCaontant';


const initialState = { selectedTab: 'default',  };

export const tabReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_SELECTED_TAB:
             return {
            ...state,
             selectedTab: action.payload,
        };
        default: return state;
    }
};
 
export const caseReducer = (state ={ caseData: {}},  action) => {
    switch (action.type) {
        case SET_CASE_DATA:
            return {
                ...state,
                caseData: action.payload,
            };
        default:
            return state;
    }
};

export const summaryReducer = (state = {
    social_media: {},
    count: 0,
    dates: {}
}, action) => {
    switch (action.type) {
      case SET_SUMMARY_DATA:
        return {
          ...state,
          social_media: action.payload.social_media,
          count: action.payload.count,
          dates: action.payload.dates
        };
      default:
        return state;
    }
  };