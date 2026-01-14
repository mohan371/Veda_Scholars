import { extractTokenFromHeader, verifyToken, JWTPayload } from "./jwt";
import { AdminRole, UserRole, UniversityRole } from "../constants/enums";

export interface AuthContext {
  user?: JWTPayload;
}

export const getAuthContext = (req: any): AuthContext => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    return {};
  }

  const token = extractTokenFromHeader(authHeader as string);
  if (!token) {
    return {};
  }

  try {
    const user = verifyToken(token);
    return { user };
  } catch (error: any) {
    return {};
  }
};

export const requireAuth = (context: AuthContext): JWTPayload => {
  if (!context.user) {
    throw new Error("Authentication required");
  }
  return context.user;
};

export const requireAdmin = (context: AuthContext): JWTPayload => {
  const user = requireAuth(context);
  
  if (user.role !== AdminRole.ADMIN && user.role !== AdminRole.SUPER_ADMIN) {
    throw new Error("Admin access required");
  }
  return user;
};

export const requireUser = (context: AuthContext): JWTPayload => {
  const user = requireAuth(context);
  // FIX: Changed UserRole.USER to UserRole.STUDENT to match enums.ts
  if (user.role !== UserRole.STUDENT) {
    throw new Error("Student access required");
  }
  return user;
};

export const requireUniversity = (context: AuthContext): JWTPayload => {
  const user = requireAuth(context);
  if (user.role !== UniversityRole.UNIVERSITY) {
    throw new Error("University access required");
  }
  return user;
};