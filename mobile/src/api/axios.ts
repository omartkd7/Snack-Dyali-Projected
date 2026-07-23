import axios from "axios";

// ⚠️ IP locale de la machine qui fait tourner le backend (pas "localhost")
// pour pouvoir tester depuis un téléphone physique sur le même réseau Wi-Fi.
const BASE_URL = "http://192.168.1.13:3000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      (error.request && !error.response
        ? "Impossible de contacter le serveur."
        : error.message) ??
      "Une erreur inattendue est survenue.";

    return Promise.reject(new Error(message));
  }
);

export default api;
