import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor to handle unauthorized token
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      toast.error("Session expired. Logging out...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/"; // Redirect to login page
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
