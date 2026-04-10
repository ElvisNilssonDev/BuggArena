import api from "./api";

export const userService = {
  async getProfile(userId) {
    const { data } = await api.get(`/users/${userId}/profile`);
    return data;
  },

  async getChallenges(userId) {
    const { data } = await api.get(`/users/${userId}/challenges`);
    return data;
  },

  async getSolutions(userId) {
    const { data } = await api.get(`/users/${userId}/solutions`);
    return data;
  },
};