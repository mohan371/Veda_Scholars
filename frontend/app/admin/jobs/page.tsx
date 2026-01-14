"use client";

import { useState, useEffect, useCallback } from "react";
import { gql } from "@apollo/client";
import { client } from "../../../lib/apollo-client";
import { Modal, ModalBody, ModalHeader, Label, Select, TextInput, Textarea } from "flowbite-react";
import DataTable from "../components/DataTable";
import Button from "../../components/Button";
import { useRouter } from "next/navigation";
import { Job, JobsResponse, CreateJobVariables, JobStatus, ApolloError } from "../../../types";

// --- GRAPHQL OPERATIONS ---
const GET_JOBS = gql`
  query GetJobs {
    jobs {
      id
      title
      location
      status
      experienceRequired
      salary
      description
      applications {
        name
      }
    }
  }
`;

const CREATE_JOB = gql`
  mutation CreateJob(
    $title: String!, 
    $location: String!, 
    $description: String!, 
    $experienceRequired: String!, 
    $salary: String, 
    $status: JobStatus
  ) {
    createJob(
      title: $title, 
      location: $location, 
      description: $description, 
      experienceRequired: $experienceRequired, 
      salary: $salary, 
      status: $status
    ) {
      id
      title
      status
    }
  }
`;

const UPDATE_JOB = gql`
  mutation UpdateJob(
    $id: ID!,
    $title: String,
    $location: String,
    $description: String,
    $experienceRequired: String,
    $salary: String,
    $status: JobStatus
  ) {
    updateJob(
      id: $id,
      title: $title,
      location: $location,
      description: $description,
      experienceRequired: $experienceRequired,
      salary: $salary,
      status: $status
    ) {
      id
      title
      status
    }
  }
`;

const DELETE_JOB = gql`
  mutation DeleteJob($id: ID!) {
    deleteJob(id: $id)
  }
`;

export default function Jobs() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    location: string;
    description: string;
    experienceRequired: string;
    salary: string;
    status: JobStatus;
  }>({
    title: "",
    location: "",
    description: "",
    experienceRequired: "",
    salary: "",
    status: "Open",
  });

  // --- DATA FETCHING ---
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.query<JobsResponse>({
        query: GET_JOBS,
        fetchPolicy: "network-only",
      });
      setJobs(data?.jobs || []);
    } catch (err) {
      const error = err as ApolloError;
      console.error("Fetch Error:", error.message);
      if (error.message?.includes("Authentication required") || error.message?.includes("Authentication")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/admin";
        return;
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      location: "",
      description: "",
      experienceRequired: "",
      salary: "",
      status: "Open",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      location: job.location,
      description: job.description || "",
      experienceRequired: job.experienceRequired,
      salary: job.salary || "",
      status: job.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;

    try {
      await client.mutate({
        mutation: DELETE_JOB,
        variables: { id },
      });
      alert("Job deleted successfully");
      fetchJobs();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error deleting job: ${error.message}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (editingJob) {
        // Update Mode
        await client.mutate({
          mutation: UPDATE_JOB,
          variables: {
            id: editingJob.id,
            ...formData
          },
        });
        alert("Job updated successfully!");
      } else {
        // Create Mode
        await client.mutate<unknown, CreateJobVariables>({
          mutation: CREATE_JOB,
          variables: { ...formData },
        });
        alert("Job posted successfully!");
      }

      setIsModalOpen(false);
      fetchJobs();
    } catch (err) {
      const error = err as ApolloError;
      alert(`Error: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };


  // --- UI RENDERING ---
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Job Postings</h1>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg font-semibold hover:bg-[var(--gold-hover)] transition-colors cursor-pointer"
        >
          Post New Job
        </button>
      </div>

      {/* Loading State */}
      {loading && jobs.length === 0 && (
        <div className="p-6 text-center text-gray-500">Loading jobs...</div>
      )}

      {/* DataTable - Always show, even if empty or error */}
      <DataTable
        data={jobs}
        columns={[
          { key: "title", label: "Title" },
          { key: "location", label: "Location" },
          { key: "experienceRequired", label: "Experience" },
          { key: "salary", label: "Salary" },
          {
            key: "applications",
            label: "Applicants",
            render: (job: Job) => (
              <span className="font-medium text-gray-700">
                {job.applications?.length || 0}
              </span>
            )
          },
          {
            key: "status",
            label: "Status",
            render: (job: Job) => (
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${job.status === "Open" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
              >
                {job.status}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (job: Job) => (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleOpenEdit(job)}
                  className="text-[var(--gold)] hover:text-[var(--gold-hover)] cursor-pointer font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 hover:text-red-800 cursor-pointer font-medium"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]}
        searchable={true}
        searchPlaceholder="Search jobs by title or location..."
        searchKeys={["title", "location"]}
        itemsPerPage={10}
      />

      {/* Add/Edit Job Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
        <ModalHeader>{editingJob ? "Edit Job" : "Post a New Job"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <TextInput id="title" name="title" placeholder="e.g., Software Engineer" value={formData.title} onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <TextInput id="location" name="location" placeholder="e.g., Bangalore, Remote" value={formData.location} onChange={handleInputChange} required className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="experienceRequired">Experience Required</Label>
                <TextInput id="experienceRequired" name="experienceRequired" placeholder="e.g., 2+ Years" value={formData.experienceRequired} onChange={handleInputChange} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="salary">Salary (Optional)</Label>
                <TextInput id="salary" name="salary" placeholder="e.g., 10 LPA" value={formData.salary} onChange={handleInputChange} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select id="status" name="status" value={formData.status} onChange={handleInputChange} required className="mt-1">
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea id="description" name="description" placeholder="Provide a brief description of the role..." value={formData.description} onChange={handleInputChange} required className="mt-1" rows={4} />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
              <button type="submit" disabled={processing} className="px-4 py-2 bg-[var(--gold)] text-gray-900 rounded-lg hover:bg-[var(--gold-hover)]">
                {processing ? "Saving..." : (editingJob ? "Update Job" : "Post Job")}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}