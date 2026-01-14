import { User, IUser } from "../models/User";
import { generateToken } from "../utils/jwt";
import { getAuthContext, requireAdmin, requireAuth } from "../utils/auth";
import { UserRole, UserStatus } from "../constants/enums";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";

export const userResolvers = {
  // Field Resolvers: Convert MongoDB specific fields to GraphQL format
  User: {
    id: (parent: IUser) => (parent._id as any).toString(),
    createdAt: (parent: IUser) => parent.createdAt.toISOString(),
    updatedAt: (parent: IUser) => parent.updatedAt.toISOString(),
    email: (parent: IUser) => parent.email || "No Email",
    phone: (parent: IUser) => parent.phone || "Not Provided",
  },

  Query: {
    // Get current user profile
    me: async (_: any, __: any, context: any) => {
      const user = requireAuth(getAuthContext(context.req));
      const foundUser = await User.findById(user.id);
      if (!foundUser) throw new Error("User not found");
      return foundUser;
    },

    // Admin Only: Fetch all users/leads for the Admin Panel DataTable
    users: async (_: any, __: any, context: any) => {
      requireAdmin(getAuthContext(context.req));
      // Sort by newest first
      return await User.find().sort({ createdAt: -1 });
    },

    // Admin Only: Fetch a single user details
    user: async (_: any, { id }: { id: string }, context: any) => {
      requireAdmin(getAuthContext(context.req));
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return user;
    },
  },

  Mutation: {
    // Public: Student Registration
    registerUser: async (_: any, args: any) => {
      // Check if email already exists
      const exists = await User.findOne({ email: args.email.toLowerCase() });
      if (exists) throw new Error("Email already exists");

      const user = new User({
        ...args,
        email: args.email.toLowerCase(),
        role: UserRole.STUDENT, // Default role
        status: UserStatus.NEW,    // Default status is New
        authProvider: 'email'
      });

      await user.save();

      // Generate token so they are logged in immediately
      const token = generateToken({ id: (user._id as any).toString(), email: user.email, role: user.role });
      return { token, user };
    },

    // Public: Student Login
    loginUser: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email: email.toLowerCase() });

      // Check user existence and password
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // If user exists but has no password (e.g. Google only), they should use Google login
      if (!user.password) {
        throw new Error("Please login with Google");
      }

      if (!(await user.comparePassword(password))) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken({ id: (user._id as any).toString(), email: user.email, role: user.role });
      return { token, user };
    },

    // Public: Google Login/Signup
    googleLogin: async (_: any, { token: accessToken, userType }: any) => {
      try {
        // Verify Access Token via Google UserInfo API
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { email, name, picture } = response.data;

        if (!email) {
          throw new Error("Invalid Google token");
        }

        let user = await User.findOne({ email });

        if (!user) {
          // Create new user
          user = new User({
            name,
            email,
            phone: "Not Provided", // Placeholder
            userType: userType || "student",
            interest: "StudyAbroad", // Default
            role: UserRole.STUDENT,
            status: UserStatus.NEW,
            authProvider: "google",
          });
          await user.save();
        }
        // If user exists, we just log them in (Account Merging)

        const token = generateToken({ id: (user._id as any).toString(), email: user.email, role: user.role });
        return { token, user };
      } catch (error) {
        console.error("Google Auth Error:", error);
        throw new Error("Invalid Google token");
      }
    },

    // User: Update own profile
    updateProfile: async (_: any, updates: any, context: any) => {
      const user = requireAuth(getAuthContext(context.req));

      // Prevent updating sensitive fields via this mutation
      delete updates.id;
      delete updates.email;
      delete updates.role;
      delete updates.status;

      const updatedUser = await User.findByIdAndUpdate(
        user.id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    },

    // Admin Only: Update Lead Status, Notes, etc.
    adminUpdateUser: async (_: any, { id, ...updates }: any, context: any) => {
      requireAdmin(getAuthContext(context.req));

      const user = await User.findByIdAndUpdate(id, updates, { new: true });
      if (!user) throw new Error("User not found");

      return user;
    },

    // Admin Only: Delete a user
    deleteUser: async (_: any, { id }: any, context: any) => {
      requireAdmin(getAuthContext(context.req));

      const result = await User.findByIdAndDelete(id);
      if (!result) throw new Error("User not found");

      return true;
    },
  },
};