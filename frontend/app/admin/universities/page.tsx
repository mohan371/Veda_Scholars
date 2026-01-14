"use client";

import { useState, useEffect, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../../../lib/apollo-client";
import { Modal, ModalBody, ModalHeader, Label, TextInput, Textarea } from "flowbite-react";
import Button from "../../components/Button";
import { University, UniversitiesResponse, CreateUniversityVariables, ApolloError } from "../../../types";

// --- GRAPHQL OPERATIONS ---
const GET_UNIVERSITIES = gql`
  query GetUniversities {
    universities {
      id
      name
      location
      country
      status
      description
      courses {
        name
      }
    }
  }
`;

const CREATE_UNIVERSITY = gql`
  mutation CreateUniversity($name: String!, $country: String!, $location: String!, $description: String!) {
    createUniversity(
      name: $name, 
      country: $country, 
      location: $location, 
      description: $description,
      logoUrl: "https://via.placeholder.com/150",
      courses: [] 
    ) {
      id
      name
    }
  }
`;

const UPDATE_UNIVERSITY = gql`
  mutation UpdateUniversity($id: ID!, $name: String, $country: String, $description: String) {
    updateUniversity(
      id: $id, 
      name: $name, 
      country: $country, 
      description: $description
    ) {
      id
      name
      country
      description
    }
  }
`;

const DELETE_UNIVERSITY = gql`
  mutation DeleteUniversity($id: ID!) {
    deleteUniversity(id: $id)
  }
`;

export default function Universities() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingUni, setEditingUni] = useState<University | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    country: string;
    location: string;
    description: string;
  }>({
    name: "",
    country: "",
    location: "",
    description: "",
  });

  // --- DATA FETCHING ---
  const fetchUniversities = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.query<UniversitiesResponse>({
        query: GET_UNIVERSITIES,
        fetchPolicy: "network-only",
      });
      setUniversities(data?.universities || []);
    } catch (err) {
      console.error("Failed to fetch universities", err);
      const error = err as ApolloError;
      if (error.message?.includes("Authentication required") || error.message?.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/admin";
        return;
      }
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingUni(null);
    setFormData({ name: "", country: "", location: "", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (uni: University) => {
    setEditingUni(uni);
    setFormData({
      name: uni.name,
      country: uni.country,
      location: uni.location || "", // Ensure location is handled if present in type
      description: uni.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;

    try {
      await client.mutate({
        mutation: DELETE_UNIVERSITY,
        variables: { id },
      });
      alert("University deleted successfully");
      fetchUniversities();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error deleting university: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingUni) {
        // Update Mode
        await client.mutate({
          mutation: UPDATE_UNIVERSITY,
          variables: {
            id: editingUni.id,
            name: formData.name,
            country: formData.country,
            description: formData.description,
            // Note: Location update might need to be added to backend schema if not present in updateUniversity
          },
        });
        alert("University updated successfully!");
      } else {
        // Create Mode
        await client.mutate<unknown, CreateUniversityVariables>({
          mutation: CREATE_UNIVERSITY,
          variables: { ...formData },
        });
        alert("University added successfully!");
      }

      setIsModalOpen(false);
      fetchUniversities();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Universities</h1>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg font-semibold hover:bg-[var(--gold-hover)] transition-colors cursor-pointer"

        >
          Add University
        </button>
      </div>

      {/* Loading State */}
      {loading && universities.length === 0 && (
        <div className="p-8 text-center text-gray-500">Loading universities...</div>
      )}

      {/* Cards Grid */}
      {universities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((uni) => (
            <div key={uni.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  {/* Placeholder Icon */}
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${uni.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {uni.status}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{uni.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{uni.location}, {uni.country}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Programs</p>
                  <p className="text-sm font-medium text-gray-900">{uni.courses?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(uni)}
                    className="px-3 py-1 text-sm text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(uni.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            No data
          </div>
        )
      )}

      {/* Add/Edit Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <ModalHeader>{editingUni ? "Edit University" : "Add New University"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">University Name</Label>
              <TextInput id="name" name="name" placeholder="e.g. Oxford University" value={formData.name} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">Country</Label>
                <TextInput id="country" name="country" placeholder="e.g. UK" value={formData.country} onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location">Location (City)</Label>
                <TextInput id="location" name="location" placeholder="e.g. London" value={formData.location} onChange={handleInputChange} required className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Short description..." value={formData.description} onChange={handleInputChange} required className="mt-1" rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" disabled={processing} className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg hover:bg-[var(--gold-hover)]">
                {processing ? "Saving..." : (editingUni ? "Update University" : "Add University")}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}