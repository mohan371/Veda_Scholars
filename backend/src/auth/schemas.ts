import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    userType: z.enum(["student", "university", "job_applicant"]),
    interest: z.string().optional(), // Optional for now, can be strict if needed
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const googleAuthSchema = z.object({
    token: z.string().min(1, "Google token is required"),
    userType: z.enum(["student", "university", "job_applicant"]).optional(), // Optional because login doesn't need it, but signup does
});

export const verifyOtpSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});
