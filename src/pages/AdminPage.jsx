import { useState, useEffect, useCallback } from "react";
import { useNav } from "../hooks/useNav";
import { useAuth } from "../hooks/useAuth";
import { adminService } from "../services/adminService";
import { ROUTES } from "../constants";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Icon from "../components/ui/Icon";

export default function AdminPage() {
  const { navigate } = useNav();
  const { user, isAuthenticated } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  // Guard — only admins
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    adminService
      .getUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = useCallback(async (targetUser) => {
    const newRole = targetUser.role === "Admin" ? "User" : "Admin";
    setActionLoading(targetUser.id + "_role");
    try {
      await adminService.updateRole(targetUser.id, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
    } catch {
      alert("Failed to update role.");
    } finally {
      setActionLoading(null);
    }
  }, []);

  const handleDelete = useCallback(
    async (targetUser) => {
      if (targetUser.id === user?.id) {
        alert("You cannot delete your own account.");
        return;
      }
      if (
        !window.confirm(
          `Delete "${targetUser.username}"? This cannot be undone.`
        )
      )
        return;

      setActionLoading(targetUser.id + "_delete");
      try {
        await adminService.deleteUser(targetUser.id);
        setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      } catch {
        alert("Failed to delete user.");
      } finally {
        setActionLoading(null);
      }
    },
    [user]
  );

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== "Admin") return null;

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">
            <Icon name="bug" size={26} className="text-accent" /> Admin Panel
          </h1>
          <p className="page-subtitle">
            Manage users and platform access.
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            background: "var(--danger-bg)",
            border: "1px solid rgba(255,68,102,0.2)",
            borderRadius: "var(--radius)",
            fontSize: 13,
            color: "var(--danger)",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
          }}
        >
          ADMIN MODE
        </div>
      </header>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 28 }}>
        <div
          className="stat-block"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div className="stat-block__value" style={{ color: "var(--accent)" }}>
            {users.length}
          </div>
          <div className="stat-block__label">Total Users</div>
        </div>
        <div
          className="stat-block"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            className="stat-block__value"
            style={{ color: "var(--danger)" }}
          >
            {users.filter((u) => u.role === "Admin").length}
          </div>
          <div className="stat-block__label">Admins</div>
        </div>
        <div
          className="stat-block"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            className="stat-block__value"
            style={{ color: "var(--info)" }}
          >
            {users.filter((u) => u.role === "User").length}
          </div>
          <div className="stat-block__label">Regular Users</div>
        </div>
        <div
          className="stat-block"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <div
            className="stat-block__value"
            style={{ color: "var(--accent-alt)" }}
          >
            {users.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString()}
          </div>
          <div className="stat-block__label">Total Points</div>
        </div>
      </div>

      {/* Search */}
      <div className="filters" style={{ marginBottom: 20 }}>
        <div className="filters__search" style={{ maxWidth: 400 }}>
          <Icon name="search" size={16} className="filters__search-icon" />
          <input
            type="search"
            className="input input--search"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="empty-state">Loading users...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No users found.</div>
      ) : (
        <div
          className="card"
          style={{ padding: 0, overflow: "hidden" }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                {["User", "Email", "Role", "Points", "Joined", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 20px",
                        textAlign: "left",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const isSelf = u.id === user?.id;
                const isRoleLoading = actionLoading === u.id + "_role";
                const isDeleteLoading = actionLoading === u.id + "_delete";

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid var(--border)"
                          : "none",
                      background: isSelf
                        ? "rgba(0,255,136,0.03)"
                        : "transparent",
                      transition: "background var(--transition)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelf)
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelf
                        ? "rgba(0,255,136,0.03)"
                        : "transparent";
                    }}
                  >
                    {/* User */}
                    <td style={{ padding: "14px 20px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar username={u.username} size="sm" />
                        <div>
                          <button
                            className="link-btn"
                            onClick={() =>
                              navigate(ROUTES.PROFILE, u.id)
                            }
                            style={{ fontSize: 14, fontWeight: 700 }}
                          >
                            {u.username}
                          </button>
                          {isSelf && (
                            <span
                              style={{
                                marginLeft: 6,
                                fontSize: 10,
                                color: "var(--accent)",
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              YOU
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text-dim)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {u.email}
                      </span>
                    </td>

                    {/* Role */}
                    <td style={{ padding: "14px 20px" }}>
                      <Badge
                        text={u.role}
                        variant={u.role === "Admin" ? "danger" : "default"}
                      />
                    </td>

                    {/* Points */}
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          fontFamily: "var(--font-mono)",
                          color: "var(--accent)",
                        }}
                      >
                        {u.totalPoints.toLocaleString()}
                      </span>
                    </td>

                    {/* Joined */}
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--text-muted)",
                        }}
                      >
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => handleRoleToggle(u)}
                          disabled={isSelf || isRoleLoading}
                          title={
                            isSelf
                              ? "Cannot change your own role"
                              : u.role === "Admin"
                              ? "Revoke Admin"
                              : "Make Admin"
                          }
                          style={{
                            opacity: isSelf ? 0.4 : 1,
                            fontSize: 12,
                            padding: "5px 10px",
                            color:
                              u.role === "Admin"
                                ? "var(--warning)"
                                : "var(--accent)",
                            borderColor:
                              u.role === "Admin"
                                ? "rgba(255,170,34,0.3)"
                                : "rgba(0,255,136,0.3)",
                          }}
                        >
                          {isRoleLoading
                            ? "..."
                            : u.role === "Admin"
                            ? "Revoke Admin"
                            : "Make Admin"}
                        </button>
                        <button
                          className="btn btn--ghost btn--sm"
                          onClick={() => handleDelete(u)}
                          disabled={isSelf || isDeleteLoading}
                          title={
                            isSelf
                              ? "Cannot delete your own account"
                              : "Delete user"
                          }
                          style={{
                            opacity: isSelf ? 0.4 : 1,
                            fontSize: 12,
                            padding: "5px 10px",
                            color: "var(--danger)",
                            borderColor: "rgba(255,68,102,0.3)",
                          }}
                        >
                          {isDeleteLoading ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}