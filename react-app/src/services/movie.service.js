import axios from "axios";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

// Ambil semua data movie/episode dari backend
export const getAllMovies = async () => {
  const res = await axios.get(`${API_URL}/api/episodes`);
  return res.data;
};
