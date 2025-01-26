import axios from "axios";
import Cookies from "js-cookie";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (request) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return request;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
let isRefreshing = false;
let refreshTokenPromise = null;

axiosClient.interceptors.response.use(
  async (response) => {
    console.log("Response:", response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and the request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          console.log("Attempting token refresh...");
          const refreshResponse = await axios
            .create({ withCredentials: true })
            .get(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`);

          console.log("Refresh response:", refreshResponse.data);

          if (refreshResponse.status === 201) {
            const newAccessToken = refreshResponse.data.accessToken;

            Cookies.set("accessToken", newAccessToken);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            isRefreshing = false;
            return axiosClient(originalRequest);
          } else {
            console.warn("Refresh failed. Redirecting to login.");
            Cookies.remove("accessToken");
            window.location.replace("/login", "_self");
            return Promise.reject("Unauthorized");
          }
        } catch (refreshError) {
          console.error("Error refreshing token:", refreshError);
          Cookies.remove("accessToken");
          window.location.replace("/login", "_self");
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      } else {
        // If a refresh is already in progress, wait for its completion
        if (!refreshTokenPromise) {
          refreshTokenPromise = new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              if (!isRefreshing) {
                clearInterval(interval);
                resolve();
              }
            }, 50);
          });
        }

        await refreshTokenPromise;

        const newAccessToken = Cookies.get("accessToken");
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      }
    }

    console.error("Interceptor error:", error);
    return Promise.reject(error);
  }
);
