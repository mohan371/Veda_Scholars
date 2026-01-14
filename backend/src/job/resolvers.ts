import { Job, IJob } from "../models/Job";
import { getAuthContext, requireAdmin } from "../utils/auth";

export const jobResolvers = {
  Job: {
    // Field Resolvers (for GraphQL formatting)
    id: (parent: IJob) => (parent._id as any).toString(),
    createdAt: (parent: IJob) => parent.createdAt.toISOString(),
    updatedAt: (parent: IJob) => parent.updatedAt.toISOString(),
    // Ensures applications array is always returned
    applications: (parent: IJob) => parent.applications || [],
  },

  Query: {
    // Public: Fetch all jobs (for the main Job Board)
    jobs: async () => {
      return await Job.find().sort({ createdAt: -1 });
    },
    // Public: Fetch single job details
    job: async (_: any, { id }: { id: string }) => {
      const job = await Job.findById(id);
      if (!job) throw new Error("Job not found");
      return job;
    },
  },

  Mutation: {
    // Admin Only: Create Job
    createJob: async (_: any, args: any, context: any) => {
      // Security Check
      requireAdmin(getAuthContext(context.req));
      const job = new Job(args);
      return await job.save();
    },

    // Admin Only: Update Job
    updateJob: async (_: any, { id, ...updates }: any, context: any) => {
      // Security Check
      requireAdmin(getAuthContext(context.req));
      const job = await Job.findByIdAndUpdate(id, updates, { new: true });
      if (!job) throw new Error("Job not found");
      return job;
    },

    // Admin Only: Delete Job
    deleteJob: async (_: any, { id }: { id: string }, context: any) => {
      // Security Check
      requireAdmin(getAuthContext(context.req));
      const result = await Job.findByIdAndDelete(id);
      return !!result;
    },

    // Public: Apply for Job (No login required)
    applyForJob: async (_: any, { jobId, ...args }: any) => {
      const job = await Job.findById(jobId);
      if (!job) throw new Error("Job not found");
      if (job.status !== 'Open') throw new Error("Job is closed");

      // Push the new application data into the embedded array
      job.applications.push({
        ...args,
        appliedAt: new Date()
      });

      await job.save();
      return true;
    }
  },
};