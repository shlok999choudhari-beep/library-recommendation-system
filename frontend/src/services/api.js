import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
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

export const getWeeklyTopBooks = async () => {
  const response = await API.get("/books/weekly-top");
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

// User ratings
export const getUserRatings = async (userId) => {
  const response = await API.get(`/user/${userId}/ratings`);
  return response.data;
};

// Update user name
export const updateUserName = async (userId, name) => {
  const response = await API.put(`/user/${userId}/name`, { name });
  return response.data;
};

// Get user statistics
export const getUserStats = async (userId) => {
  const response = await API.get(`/user/${userId}/stats`);
  return response.data;
};

export const getWishlistBooks = async (userId) => {
  const response = await API.get(`/user/${userId}/wishlist`);
  return response.data;
};

export const getUserPreferences = async (userId) => {
  const response = await API.get(`/user/${userId}/preferences`);
  return response.data;
};

export const updateUserPreferences = async (userId, preferences) => {
  const response = await API.post(`/user/${userId}/preferences`, { preferred_genres: preferences });
  return response.data;
};

// Chatbot endpoints
export const sendChatMessage = async (userId, message) => {
  const response = await API.post("/chat/", { user_id: userId, message });
  return response.data;
};

export const getChatHistory = async (userId) => {
  const response = await API.get(`/chat/${userId}/history`);
  return response.data;
};

export const clearChatHistory = async (userId) => {
  const response = await API.delete(`/chat/${userId}/history`);
  return response.data;
};



// Library management endpoints
export const issueBook = async (userId, bookId) => {
  const response = await API.post("/library/issue", { user_id: userId, book_id: bookId });
  return response.data;
};

export const returnBook = async (issueId) => {
  const response = await API.post(`/library/return/${issueId}`);
  return response.data;
};

export const getIssuedBooks = async (userId) => {
  const response = await API.get(`/library/${userId}/issued`);
  return response.data;
};

export const getNotifications = async (userId) => {
  const response = await API.get(`/library/${userId}/notifications`);
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await API.put(`/library/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllNotificationsRead = async (userId) => {
  const response = await API.put(`/library/${userId}/notifications/mark-all-read`);
  return response.data;
};

export const getPendingRequests = async () => {
  const response = await API.get("/library/pending-requests");
  return response.data;
};

export const approveBookIssue = async (issueId) => {
  const response = await API.post(`/library/approve/${issueId}`);
  return response.data;
};

export const requestNewBook = async (userId, bookTitle, author) => {
  const response = await API.post("/library/request-book", { user_id: userId, book_title: bookTitle, author });
  return response.data;
};

export const getBookRequests = async () => {
  const response = await API.get("/library/book-requests");
  return response.data;
};

export const fulfillBookRequest = async (requestId) => {
  const response = await API.post(`/library/book-requests/${requestId}/fulfill`);
  return response.data;
};

export const rejectBookRequest = async (requestId) => {
  const response = await API.post(`/library/book-requests/${requestId}/reject`);
  return response.data;
};

export const deleteBook = async (bookId) => {
  const response = await API.delete(`/books/${bookId}`);
  return response.data;
};