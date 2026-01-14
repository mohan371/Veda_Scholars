"use client";

import { useState, useEffect, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../../../lib/apollo-client";
import { Modal, ModalBody, ModalHeader, Label, Select, TextInput, Textarea } from "flowbite-react";
import DataTable from "../components/DataTable";
import { User, UsersResponse, UserRole, UserStatus, ApolloError, UserInterest, RegisterUserResponse, UpdateUserResponse, DeleteUserResponse } from "../../../types";

// GraphQL Operations
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      phone
      role
      status
      interest
      preferredCountry
      qualification
      notes
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!, $phone: String!, $interest: UserInterest, $preferredCountry: String, $qualification: String) {
    registerUser(name: $name, email: $email, password: $password, phone: $phone, interest: $interest, preferredCountry: $preferredCountry, qualification: $qualification) {
      user {
        id
        name
        email
        role
        status
        interest
        preferredCountry
        qualification
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation AdminUpdateUser($id: ID!, $name: String, $email: String, $role: UserRole, $status: UserStatus, $phone: String, $interest: UserInterest, $preferredCountry: String, $qualification: String, $notes: String) {
    adminUpdateUser(id: $id, name: $name, email: $email, role: $role, status: $status, phone: $phone, interest: $interest, preferredCountry: $preferredCountry, qualification: $qualification, notes: $notes) {
      id
      name
      email
      phone
      role
      status
      interest
      preferredCountry
      qualification
      notes
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    interest: UserInterest;
    preferredCountry: string;
    qualification: string;
    notes: string;
  }>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Student",
    status: "New",
    interest: "StudyAbroad",
    preferredCountry: "",
    qualification: "",
    notes: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.query<UsersResponse>({
        query: GET_USERS,
        fetchPolicy: "network-only",
      });
      setUsers(data?.users || []);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      const error = err as ApolloError;
      // Check if error is authentication related
      if (error.message?.includes("Authentication required") || error.message?.includes("Authentication")) {
        // Clear token and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/admin";
        return;
      }
      setError(error.message);
      // Set empty array on error so table still shows
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    console.log("Add User button clicked");
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      role: "Student",
      status: "New",
      interest: "StudyAbroad",
      preferredCountry: "",
      qualification: "",
      notes: "",
    });
    setIsModalOpen(true);
    console.log("Modal state set to true");
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Password not editable directly here for security, or optional
      phone: user.phone || "",
      role: user.role,
      status: user.status,
      interest: user.interest || "StudyAbroad",
      preferredCountry: user.preferredCountry || "",
      qualification: user.qualification || "",
      notes: user.notes || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await client.mutate<DeleteUserResponse>({
        mutation: DELETE_USER,
        variables: { id },
      });
      alert("User deleted successfully");
      fetchUsers();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error deleting user: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingUser) {
        // Update Mode
        await client.mutate<UpdateUserResponse>({
          mutation: UPDATE_USER,
          variables: {
            id: editingUser.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            status: formData.status,
            interest: formData.interest,
            preferredCountry: formData.preferredCountry,
            qualification: formData.qualification,
            notes: formData.notes,
            // Password update logic can be added if needed, usually separate
          },
        });
        alert("User updated successfully!");
      } else {
        // Create Mode - Step 1: Register User
        const { data } = await client.mutate<RegisterUserResponse>({
          mutation: REGISTER_USER,
          variables: {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            interest: formData.interest,
            preferredCountry: formData.preferredCountry,
            qualification: formData.qualification,
          },
        });

        const newUser = data?.registerUser?.user;

        // Step 2: If role, status, or notes are different from default/empty, update them
        // Note: registerUser does not accept notes, so we MUST update if notes are present
        if (newUser && (formData.role !== "Student" || formData.status !== "New" || formData.notes)) {
          await client.mutate<UpdateUserResponse>({
            mutation: UPDATE_USER,
            variables: {
              id: newUser.id,
              role: formData.role,
              status: formData.status,
              notes: formData.notes,
            },
          });
        }

        alert("User added successfully!");
      }

      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log("Render Users. isModalOpen:", isModalOpen);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg font-semibold hover:bg-[var(--gold-hover)] transition-colors cursor-pointer"
        >
          Add New User
        </button>
      </div>

      {/* Loading State */}
      {loading && users.length === 0 && (
        <div className="p-6 text-center text-gray-500">Loading users...</div>
      )}

      {/* Error Message Display - Only show if not authentication error */}
      {error && !error.includes("Authentication") && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">
          Error loading users: {error}
        </div>
      )}

      {/* DataTable - Always show, even if empty or error */}
      <DataTable
        data={users}
        columns={[
          {
            key: "name",
            label: "Name",
            render: (user: User) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--gold)] flex items-center justify-center text-white font-semibold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.phone || "No phone"}</div>
                </div>
              </div>
            ),
          },
          { key: "email", label: "Email" },
          { key: "role", label: "Role" },
          {
            key: "status",
            label: "Status",
            render: (user: User) => {
              const statusColors: Record<UserStatus, string> = {
                "New": "bg-blue-100 text-blue-800",
                "Contacted": "bg-yellow-100 text-yellow-800",
                "In Process": "bg-purple-100 text-purple-800",
                "Closed": "bg-gray-100 text-gray-800",
              };
              return (
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[user.status] || "bg-gray-100 text-gray-800"
                    }`}
                >
                  {user.status}
                </span>
              );
            },
          },
          {
            key: "actions",
            label: "Actions",
            render: (user: User) => (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="text-[var(--gold)] hover:text-[var(--gold-hover)] cursor-pointer font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:text-red-800 cursor-pointer font-medium"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search users..."
        searchKeys={["name", "email", "role", "phone"]}
        itemsPerPage={10}
      />

      {/* Add User Modal (Redesigned & Compacted) */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="3xl">
        <ModalHeader>{editingUser ? "Edit User" : "Add New User"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 2-Column Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Column 1: Personal & Contact Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-1">Personal Details</h3>

                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <TextInput id="name" name="name" type="text" placeholder="Enter full name" value={formData.name} onChange={handleInputChange} required className="mt-0.5" />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <TextInput id="email" name="email" type="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} required className="mt-0.5" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <TextInput id="phone" name="phone" type="tel" placeholder="Enter phone number" value={formData.phone} onChange={handleInputChange} required className="mt-0.5" />
                </div>

                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <TextInput id="password" name="password" type="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} required className="mt-0.5" />
                  </div>
                )}
              </div>

              {/* Column 2: Academic, Interest & Account Status */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-1">Profile & Status</h3>

                <div>
                  <Label htmlFor="interest">Interest</Label>
                  <Select id="interest" name="interest" value={formData.interest} onChange={handleInputChange} required className="mt-0.5">
                    <option value="StudyAbroad">Study Abroad</option>
                    <option value="Job">Job</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferredCountry">Preferred Country</Label>
                  <TextInput id="preferredCountry" name="preferredCountry" type="text" placeholder="e.g. USA, UK, Canada" value={formData.preferredCountry} onChange={handleInputChange} className="mt-0.5" />
                </div>

                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <TextInput id="qualification" name="qualification" type="text" placeholder="e.g. B.Tech, MBA" value={formData.qualification} onChange={handleInputChange} className="mt-0.5" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select id="role" name="role" value={formData.role} onChange={handleInputChange} required className="mt-0.5">
                      <option value="Student">Student</option>
                      <option value="Admin">Admin</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select id="status" name="status" value={formData.status} onChange={handleInputChange} required className="mt-0.5">
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="In Process">In Process</option>
                      <option value="Closed">Closed</option>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Width: Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" placeholder="Add any internal notes here..." value={formData.notes} onChange={handleInputChange} rows={2} className="mt-0.5" />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t mt-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
              <button type="submit" disabled={processing} className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg hover:bg-[var(--gold-hover)] transition-colors disabled:opacity-50">
                {processing ? "Saving..." : (editingUser ? "Update User" : "Add User")}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}