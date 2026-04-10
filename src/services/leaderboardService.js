import api from "./api";

function mapUser(u) {
  return { ...u, id: u.userId || u.id };
}

export const leaderboardService = {
  async getGlobal() {
    const { data } = await api.get("/leaderboard/global");
    return data.map(mapUser);
  },

  async getWeekly() {
    const { data } = await api.get("/leaderboard/weekly");
    return data.map(mapUser);
  },

  async getUserStats(userId) {
    const { data } = await api.get(`/leaderboard/user/${userId}`);
    return data;
  },
};