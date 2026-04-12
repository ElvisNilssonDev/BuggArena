import api from "./api";

export const leaderboardService = {
  async getGlobal() {
    const { data } = await api.get("/leaderboard/global");
    return data;
  },

  async getWeekly() {
    const { data } = await api.get("/leaderboard/weekly");
    return data;
  },

  async getUserStats(userId) {
    const { data } = await api.get(`/leaderboard/user/${userId}`);
    return data;
  },
};