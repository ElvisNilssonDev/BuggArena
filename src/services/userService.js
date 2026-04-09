import api from "./api";

export const userService = {
  async getProfile(userId) {
    const { data } = await api.get(`/users/${userId}/profile`);
    return data;
  },

  async getChallenges(userId) {
    const { data } = await api.get(`/users/${userId}/challenges`);
    return Array.isArray(data) ? data : data.items || [];
  },

  async getSolutions(userId) {
    const { data } = await api.get(`/users/${userId}/solutions`);
    return Array.isArray(data) ? data : data.items || [];
  },
};