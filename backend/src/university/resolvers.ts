import { University, IUniversity } from "../models/University";
import { getAuthContext, requireAdmin } from "../utils/auth";

export const universityResolvers = {
  University: {
    // Convert MongoDB _id object to string 'id' for GraphQL
    id: (parent: IUniversity) => (parent._id as any).toString(),
    createdAt: (parent: IUniversity) => parent.createdAt.toISOString(),
    updatedAt: (parent: IUniversity) => parent.updatedAt.toISOString(),
  },

  Query: {
    // Public: Fetch all universities sorted by name
    universities: async () => {
      return await University.find().sort({ name: 1 });
    },
    // Public: Fetch single university details
    university: async (_: any, { id }: { id: string }) => {
      const uni = await University.findById(id);
      if (!uni) throw new Error("University not found");
      return uni;
    },
  },

  Mutation: {
    // Admin Only: Create new university
    createUniversity: async (_: any, args: any, context: any) => {
      requireAdmin(getAuthContext(context.req));
      const uni = new University(args);
      return await uni.save();
    },

    // Admin Only: Update existing university
    updateUniversity: async (_: any, { id, ...updates }: any, context: any) => {
      requireAdmin(getAuthContext(context.req));
      const uni = await University.findByIdAndUpdate(id, updates, { new: true });
      if (!uni) throw new Error("University not found");
      return uni;
    },

    // Admin Only: Delete university
    deleteUniversity: async (_: any, { id }: any, context: any) => {
      requireAdmin(getAuthContext(context.req));
      await University.findByIdAndDelete(id);
      return true;
    },
  },
};