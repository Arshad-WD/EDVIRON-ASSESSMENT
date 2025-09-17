import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// Add auth header interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------- Transactions -----------------
export const fetchTransactions = async ({ page = 1, limit = 10, sort = "payment_time", order = "desc", status = "" }) => {
  return API.get(`/transactions`, { params: { page, limit, sort, order, status } });
};

export const fetchTransactionsBySchool = (schoolId) => API.get(`/transactions/school/${schoolId}`);

export const checkTransactionsStatus = (customOrderId) => API.get(`/transaction-status/${customOrderId}`);

// Corrected: use API instance
export const fetchTransactionById = (id) => API.get(`/transactions/${id}`);
export const updateTransactionById = (id, data) => API.put(`/transactions/${id}`, data);


// ----------------- Auth -----------------
export const registerUser = async (data) => (await API.post("/auth/register", data)).data;

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  if (response.data?.token) localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logoutUser = async () => {
  await API.post("/auth/logout", {}, { withCredentials: true });
  localStorage.removeItem("token");
};

// ----------------- Payments -----------------
export const createPayment = async (data) => (await API.post("/payment/create-payment", data)).data;


//--------------------Analytics ---------------
export const analyticsPayment = async () => {
  
}