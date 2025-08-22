import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Fungsi login: kirim username & password, simpan token JWT jika berhasil
export async function login(username, password) {
  const res = await axios.post(
    `${import.meta.env.VITE_REACT_APP_API_URL}/users/login`,
    { username, password }
  );
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  }
  throw new Error(res.data.error || "Login gagal");
}

// Fungsi untuk mengambil header Authorization JWT
export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fungsi logout: hapus token dari localStorage
export function logout() {
  localStorage.removeItem("token");
}

// Fungsi untuk mengambil username dari JWT
export const getUsername = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.username;
  } catch {
    return null;
  }
};
