// create an instance that we can use for the whole library
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api", //can be only used in development
    withCredentials: true
})