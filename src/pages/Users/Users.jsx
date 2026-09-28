import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
  Shield,
  User,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

const Users = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const users = [
    {
      id: 1,
      name: "Ramen Kumar Das",
      email: "ramen@example.com",
      role: "Admin",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=12",
      joined: "Sep 20, 2026",
    },
    {
      id: 2,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=11",
      joined: "Sep 18, 2026",
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "User",
      status: "Inactive",
      image: "https://i.pravatar.cc/150?img=45",
      joined: "Sep 15, 2026",
    },
    {
      id: 4,
      name: "Michael Smith",
      email: "michael@example.com",
      role: "Moderator",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=13",
      joined: "Sep 12, 2026",
    },
    {
      id: 5,
      name: "Emily Johnson",
      email: "emily@example.com",
      role: "User",
      status: "Active",
      image: "https://i.pravatar.cc/150?img=47",
      joined: "Sep 10, 2026",
    },
  ];

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  // Actions
  const handleView = (user) => {
    console.log("View user:", user);
  };

  const handleEdit = (user) => {
    console.log("Edit user:", user);
  };

  const handleDelete = (user) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (confirmDelete) {
      console.log("Delete user:", user);
    }
  };

  const handleAddUser = () => {
    console.log("Add new user");
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold">
              Users
            </h1>

            <p className="text-base-content/60 mt-1">
              Manage registered users and their roles
            </p>
          </div>

          <button
            onClick={handleAddUser}
            className="btn btn-primary"
          >
            <UserPlus size={20} />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          {/* Total */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">
                    Total Users
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {users.length}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <User size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Admin */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">
                    Admins
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {users.filter(
                      (user) => user.role === "Admin"
                    ).length}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">
                    Active
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {users.filter(
                      (user) => user.status === "Active"
                    ).length}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-success/10 text-success flex items-center justify-center">
                  <Shield size={22} />
                </div>
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">
                    Inactive
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {users.filter(
                      (user) => user.status === "Inactive"
                    ).length}
                  </h2>
                </div>

                <div className="w-11 h-11 rounded-xl bg-error/10 text-error flex items-center justify-center">
                  <User size={22} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="card bg-base-100 shadow-sm border border-base-300">

          {/* Filters */}
          <div className="p-4 border-b border-base-300">

            <div className="flex flex-col md:flex-row gap-3">

              {/* Search */}
              <label className="input input-bordered flex items-center gap-3 flex-1">
                <Search
                  size={19}
                  className="text-base-content/50"
                />

                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="grow"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </label>

              {/* Role */}
              <select
                className="select select-bordered w-full md:w-48"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="All">All Roles</option>
                <option value="Admin">Admin</option>
                <option value="Moderator">Moderator</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">

            <table className="table">

              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>

                      {/* User */}
                      <td>
                        <div className="flex items-center gap-3">

                          <div className="avatar">
                            <div className="w-11 h-11 rounded-full">
                              <img
                                src={user.image}
                                alt={user.name}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="font-semibold">
                              {user.name}
                            </div>

                            <div className="text-sm text-base-content/60">
                              {user.email}
                            </div>
                          </div>

                        </div>
                      </td>

                      {/* Role */}
                      <td>
                        <span
                          className={`badge ${
                            user.role === "Admin"
                              ? "badge-primary"
                              : user.role === "Moderator"
                              ? "badge-secondary"
                              : "badge-ghost"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge badge-sm ${
                            user.status === "Active"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Joined */}
                      <td>
                        <span className="text-sm">
                          {user.joined}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex justify-end gap-1">

                          <button
                            onClick={() => handleView(user)}
                            className="btn btn-ghost btn-sm btn-square"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => handleEdit(user)}
                            className="btn btn-ghost btn-sm btn-square"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(user)}
                            className="btn btn-ghost btn-sm btn-square text-error"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <User
                          size={40}
                          className="text-base-content/30"
                        />

                        <p className="font-medium">
                          No users found
                        </p>

                        <p className="text-sm text-base-content/50">
                          Try changing your search or filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border-b border-base-300 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img
                            src={user.image}
                            alt={user.name}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {user.name}
                        </h3>

                        <p className="text-sm text-base-content/60">
                          {user.email}
                        </p>

                        <div className="flex gap-2 mt-2">
                          <span
                            className={`badge badge-sm ${
                              user.role === "Admin"
                                ? "badge-primary"
                                : user.role === "Moderator"
                                ? "badge-secondary"
                                : "badge-ghost"
                            }`}
                          >
                            {user.role}
                          </span>

                          <span
                            className={`badge badge-sm ${
                              user.status === "Active"
                                ? "badge-success"
                                : "badge-error"
                            }`}
                          >
                            {user.status}
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="dropdown dropdown-end">

                      <button
                        tabIndex={0}
                        className="btn btn-ghost btn-sm btn-square"
                      >
                        <MoreVertical size={19} />
                      </button>

                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-base-100 rounded-box z-10 w-36 p-2 shadow-lg border border-base-300"
                      >
                        <li>
                          <button onClick={() => handleView(user)}>
                            <Eye size={16} />
                            View
                          </button>
                        </li>

                        <li>
                          <button onClick={() => handleEdit(user)}>
                            <Pencil size={16} />
                            Edit
                          </button>
                        </li>

                        <li>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-error"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </li>
                      </ul>

                    </div>

                  </div>

                  <div className="mt-3 text-xs text-base-content/50">
                    Joined {user.joined}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <User
                  size={40}
                  className="mx-auto text-base-content/30"
                />

                <p className="font-medium mt-2">
                  No users found
                </p>
              </div>
            )}

          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-base-300">

            <p className="text-sm text-base-content/60">
              Showing{" "}
              <span className="font-medium text-base-content">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-base-content">
                {users.length}
              </span>{" "}
              users
            </p>

            <div className="join">

              <button
                className="join-item btn btn-sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
              >
                <ChevronLeft size={17} />
              </button>

              <button className="join-item btn btn-sm btn-active">
                {currentPage}
              </button>

              <button
                className="join-item btn btn-sm"
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                <ChevronRight size={17} />
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Users;

