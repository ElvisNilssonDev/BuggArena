import api from "./api";

export const solutionService = {
  async submit(challengeId, { fixedCode, explanation, timeToSolveSeconds }) {
    const { data } = await api.post(
      `/challenges/${challengeId}/solutions`,
      { fixedCode, explanation, timeToSolveSeconds: 1 }
    );
    return data;
  },

  async getForChallenge(challengeId) {
    const { data } = await api.get(`/challenges/${challengeId}/solutions`);
    return data;
  },

  async review(solutionId, status) {
    const { data } = await api.put(`/solutions/${solutionId}/review`, { status });
    return data;
  },
};