import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import { UserRole, UserStatus, UserInterest } from "../constants/enums";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone: string;
  interest: UserInterest;
  preferredCountry?: string;
  qualification?: string;
  resumeUrl?: string;
  notes?: string;
  role: UserRole;
  status: UserStatus;
  userType: 'student' | 'university' | 'job_applicant';
  authProvider: string;

  // OTP Verification
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;

  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, required: true, trim: true },
    interest: { type: String, required: false, trim: true },
    preferredCountry: { type: String, trim: true },
    qualification: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    notes: { type: String, trim: true },

    role: { type: String, enum: Object.values(UserRole), default: UserRole.STUDENT },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.NEW },

    // New Auth Fields
    userType: {
      type: String,
      enum: ['student', 'university', 'job_applicant'],
      required: true,
      default: 'student'
    },
    authProvider: {
      type: String,
      default: 'email' // 'email' or 'google'
    },

    // OTP Verification
    isVerified: { type: Boolean, default: false },
    otp: { type: String }, // Hashed OTP
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Password Hashing
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) { next(error); }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>("User", UserSchema);