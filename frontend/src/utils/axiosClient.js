import axios from "axios";
import Cookies from "js-cookie";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    request.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return request;
});

axiosClient.interceptors.response.use(
  async (response) => {
    if (response.status === 201 || response.status === 200) {
      return response;
    }

    const originalRequest = response.config;
    const statusCode = response.status;
    const error = response.error;

    if (statusCode === 401) {
      originalRequest._retry = true;
      try {
        const res = await axios
          .create({ withCredentials: true })
          .get(`${import.meta.env.VITE_BACKEND_URL}/auth/refresh`);

        if (res.data.status === "ok") {
          const newAccessToken = res.data.result.accessToken;
          Cookies.set("accessToken", newAccessToken);

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest);
        } else {
          Cookies.remove("accessToken");
          window.location.replace("/login", "_self");

          return Promise.reject(error);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
  (error) => {
    return Promise.reject(error);
  }
);
