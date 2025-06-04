// src/services/injectInterceptors.js
import Cookies from 'js-cookie';
import axios from 'axios';
// Axios ka custom instance banao
const axiosInstance = axios.create();
const injectGlobalInterceptors = () => {
  // Token lagana
  axiosInstance.interceptors.request.use((config) => {
    const token =  Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const url = config.url;

    // Dynamic baseURL set karna
    if (url.startsWith('/api/user-man')) {
      config.baseURL = window.runtimeConfig.REACT_APP_API_USER_MAN;
    } else if (url.startsWith('/api/case-man')) {
      config.baseURL = window.runtimeConfig.REACT_APP_API_CASE_MAN;
    } else if (url.startsWith('/api/osint-man')) {
      config.baseURL = window.runtimeConfig.REACT_APP_API_OSINT_MAN;
    } else if (url.startsWith('/api/das/search')) {
      config.baseURL = window.runtimeConfig.REACT_APP_API_DAS_SEARCH;
    } else if (url.startsWith('/api/notifications')) {
      config.baseURL = window.runtimeConfig.REACT_APP_API_NOTIFICATION;
    }
    return config;
  });

  // Token expire hone pe logout
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
      Cookies.remove('accessToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance, injectGlobalInterceptors };
// import Cookies from 'js-cookie';
// const injectGlobalInterceptors = (axios) => {
//   // Token lagana
//   axios.interceptors.request.use((config) => {
//     const token = Cookies.get('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     const url = config.url;

//     // Dynamic baseURL set karna
//     if (url.startsWith('/api/user-man')) {
//       config.baseURL = 'http://5.180.148.40:9000';
//     } else if (url.startsWith('/api/case-man')) {
//       config.baseURL = 'http://5.180.148.40:9001';
//     } else if (url.startsWith('/api/osint-man')) {
//       config.baseURL = 'http://5.180.148.40:9002';
//     } else if (url.startsWith('/api/das/criteria')) {
//       config.baseURL = 'http://5.180.148.40:9006';
//     } else if (url.startsWith('/api/das/search')) {
//       config.baseURL = 'http://5.180.148.40:9007';
//     }

//     return config;
//   });

//   // Token expire hone pe logout
//   axios.interceptors.response.use(
//     (response) => response,
//     (error) => {
//       if (error.response?.status === 401) {
//         Cookies.remove('accessToken');
//         window.location.href = '/login';
//       }
//       return Promise.reject(error);
//     }
//   );
// };

// export default injectGlobalInterceptors;

