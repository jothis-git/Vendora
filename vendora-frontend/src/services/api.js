import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true
});

export const login = (data) => {
  return api.post("/api/auth/login", data);
};

export const createPaymentOrder = (data) => api.post("/api/payment/create", data);
export const verifyPayment = (data) => api.post("/api/payment/verify", data);

export default api;