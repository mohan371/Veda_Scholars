import { Request, Response } from "express";
import { User } from "../models/User";
import { generateToken } from "../utils/jwt";
import { signupSchema, loginSchema, googleAuthSchema, verifyOtpSchema } from "./schemas";
import { OAuth2Client } from "google-auth-library";
import { UserRole, UserStatus } from "../constants/enums";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/emailService";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const signup = async (req: Request, res: Response) => {
    try {
        const validation = signupSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const { email, password, name, phone, userType, interest } = validation.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Set Expiry (10 minutes)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = new User({
            name,
            email,
            password,
            phone,
            userType,
            interest: interest || "StudyAbroad",
            role: UserRole.STUDENT,
            status: UserStatus.NEW,
            authProvider: "email",
            isVerified: false,
            otp: hashedOtp,
            otpExpires
        });

        await newUser.save();

        // Send OTP via Email
        await sendOTP(email, otp);

        res.status(201).json({
            message: "Signup successful. Please verify your email with the OTP sent.",
            email: newUser.email
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const validation = verifyOtpSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const { email, otp } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified" });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ error: "No OTP found. Please request a new one." });
        }

        if (user.otpExpires < new Date()) {
            return res.status(400).json({ error: "OTP expired" });
        }

        const isMatch = await bcrypt.compare(otp, user.otp);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Verify User
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken({
            id: user._id as string,
            email: user.email,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "Email verified successfully", token, user });
    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const { email, password } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        if (!user.password) {
            return res.status(400).json({ error: "Please login with Google" });
        }

        // Check verification status
        if (!user.isVerified) {
            return res.status(400).json({ error: "Please verify your email first" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = generateToken({
            id: user._id as string,
            email: user.email,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const validation = googleAuthSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.issues });
        }

        const { token: idToken, userType } = validation.data;

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ error: "Invalid Google token" });
        }

        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (user) {
            // Account Merging Logic:
            // Ensure verified if logging in via Google
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new user
            user = new User({
                name,
                email,
                phone: "Not Provided",
                userType: userType || "student",
                interest: "StudyAbroad",
                role: UserRole.STUDENT,
                status: UserStatus.NEW,
                authProvider: "google",
                isVerified: true, // Google emails are verified
            });
            await user.save();
        }

        const token = generateToken({
            id: user._id as string,
            email: user.email,
            role: user.role,
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({ token, user });
    } catch (error) {
        console.error("Google Auth error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
