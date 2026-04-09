import api from "./api";

export const authService = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    return data;
  },

  async register(username, email, password) {
    const { data } = await api.post("/auth/register", { username, email, password });
    localStorage.setItem("token", data.token);
    return data;
  },

  async getMe() {
    const { data } = await api.get("/auth/me");
    return data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};