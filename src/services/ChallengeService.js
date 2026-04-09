import api from "./api";

export const challengeService = {
  async getAll({ language, difficulty, search, page = 1 }) {
    const params = { page };

    if (language && language !== "All") {
      params.language = language;
    }
    if (difficulty && difficulty !== "All") {
      params.difficulty = difficulty;
    }
    if (search && search.trim() !== "") {
      params.search = search;
    }

    const { data } = await api.get("/challenges", { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/challenges/${id}`);
    return data;
  },

  async create(challenge) {
    const { data } = await api.post("/challenges", challenge);
    return data;
  },

  async update(id, challenge) {
    const { data } = await api.put(`/challenges/${id}`, challenge);
    return data;
  },

  async remove(id) {
    await api.delete(`/challenges/${id}`);
  },

  async vote(id, isUpvote) {
    const { data } = await api.post(`/challenges/${id}/vote`, { isUpvote });
    return data;
  },
};