import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/flashcard",
  withCredentials: true, // Ensures HTTP-only cookies are sent
});

export default API;
