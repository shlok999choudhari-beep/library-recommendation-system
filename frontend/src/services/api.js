import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Auth endpoints
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

// Books endpoints
export const getBooks = async () => {
  const response = await API.get("/books/");
  return response.data;
};

export const addBook = async (bookData) => {
  const response = await API.post("/books/add", null, {
    params: bookData
  });
  return response.data;
};

// Activity endpoints
export const updateActivity = async (activityData) => {
  const response = await API.post("/activity/update", null, {
    params: activityData
  });
  return response.data;
};

// Recommendations
export const getRecommendations = async (userId) => {
  const response = await API.get(`/recommend/${userId}`);
  return response.data;
};