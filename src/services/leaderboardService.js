import api from "./api";

function mapGlobalUser(u) {
  return { ...u, id: u.userId || u.id };
}

function mapWeeklyUser(u) {
  return { ...u, id: u.userId || u.id, weeklyPoints: u.totalPoints };
}

export const leaderboardService = {
  async getGlobal() {
    const { data } = await api.get("/leaderboard/global");
    return data.map(mapGlobalUser);
  },

  async getWeekly() {
    const { data } = await api.get("/leaderboard/weekly");
    return data.map(mapWeeklyUser);
  },

  async getUserStats(userId) {
    const { data } = await api.get(`/leaderboard/user/${userId}`);
    return data;
  },
};