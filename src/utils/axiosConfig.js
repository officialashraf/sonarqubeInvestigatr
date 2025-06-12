// axiosInterceptor.js
import axios from "axios";
import Cookies from "js-cookie";

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const errorMessage = error?.response?.data?.detail || "";

      if (errorMessage === ("Signature expired." || "Your license has been expired.")) {
        Cookies.remove("accessToken"); // या localStorage.removeItem()
        window.location.href = "/login"; // या history.push("/login") if router
      }

      return Promise.reject(error);
    }
  );
};