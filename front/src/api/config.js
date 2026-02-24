import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    if (error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login?reason=forbidden";
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
