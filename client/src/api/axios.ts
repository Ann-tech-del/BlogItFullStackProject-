import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://blogitfullstackproject-backened-side.onrender.com",
  withCredentials: true
});

export default axiosInstance;
