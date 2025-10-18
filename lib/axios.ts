import axios from "axios";

export const api = axios.create({
  baseURL: "/", // same-origin API routes
  headers: { "Content-Type": "application/json" },
  withCredentials: false, // keep false for same-origin Next API routes
});
