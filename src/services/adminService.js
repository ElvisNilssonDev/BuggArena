import api from "./api";

export const adminService = {
  async getUsers() {
    const { data } = await api.get("/admin/users");
    return data;
  },

  async updateRole(userId, role) {
    await api.patch(`/admin/users/${userId}/role`, { role });
  },

  async deleteUser(userId) {
    await api.delete(`/admin/users/${userId}`);
  },
};