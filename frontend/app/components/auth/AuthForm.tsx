"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMutation, gql } from "@apollo/client";
import { useGoogleLogin } from "@react-oauth/google";
import Captcha from "../Captcha";

// Define schemas
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = loginSchema.extend({
    name: z.string().min(2, "Name is required"),
    phone: z.string().min(10, "Phone is required"),
});

type AuthFormData = z.infer<typeof signupSchema>; // Use the superset for type inference

interface AuthFormProps {
    role?: string;
    initialMode?: 'login' | 'signup';
}

// GraphQL Mutations
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const REGISTER_USER = gql`
  mutation RegisterUser(
    $name: String!
    $email: String!
    $password: String!
    $phone: String!
    $userType: String!
  ) {
    registerUser(
      name: $name
      email: $email
      password: $password
      phone: $phone
      userType: $userType
    ) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!, $userType: String) {
    googleLogin(token: $token, userType: $userType) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const AuthForm: React.FC<AuthFormProps> = ({ role, initialMode = 'signup' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const router = useRouter();

    const handleToggle = () => {
        if (isLogin) {
            // Switching from Login to Signup
            if (role) {
                setIsLogin(false);
            } else {
                router.push('/auth/role-selection');
            }
        } else {
            // Switching from Signup to Login
            setIsLogin(true);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                {isLogin ? "Welcome Back" : (role ? `Join as ${role === 'job_applicant' ? 'Job Applicant' : role.charAt(0).toUpperCase() + role.slice(1)}` : "Create Account")}
            </h2>

            {/* Force re-mount when mode changes to ensure correct schema is used */}
            <AuthFormContent
                key={isLogin ? "login" : "signup"}
                role={role || ""}
                isLogin={isLogin}
            />

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <GoogleAuthButton role={role || "student"} />

            <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                    onClick={handleToggle}
                    className="text-[var(--gold)] hover:underline font-medium"
                >
                    {isLogin ? "Sign up" : "Login"}
                </button>
            </p>
        </div>
    );
};

// Sub-component for the actual form logic
const AuthFormContent: React.FC<{ role: string; isLogin: boolean }> = ({ role, isLogin }) => {
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const router = useRouter();
    const isMountedRef = useRef(true);

    const currentSchema = isLogin ? loginSchema : signupSchema;

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(currentSchema) as any,
    });

    const [loginUser, { loading: loginLoading }] = useMutation(LOGIN_USER);
    const [registerUser, { loading: registerLoading }] = useMutation(REGISTER_USER);

    const loading = loginLoading || registerLoading;

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const onSubmit = async (data: AuthFormData) => {
        setError(null);
        console.log("Submitting form data:", data, "Role:", role, "Mode:", isLogin ? "Login" : "Signup");

        // CAPTCHA validation
        if (!captchaToken) {
            setError("Please complete the CAPTCHA verification");
            return;
        }

        try {
            let result;
            if (isLogin) {
                result = await loginUser({
                    variables: {
                        email: data.email,
                        password: data.password,
                    },
                });
            } else {
                result = await registerUser({
                    variables: {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        phone: data.phone,
                        userType: role,
                    },
                });
            }

            // Only update state if component is still mounted
            if (!isMountedRef.current) return;

            if (result.data) {
                const token = isLogin ? result.data.loginUser.token : result.data.registerUser.token;
                localStorage.setItem("token", token);
                // Dispatch a custom event so Navbar can update immediately
                window.dispatchEvent(new Event("storage"));
                router.push("/");
            }
        } catch (err: any) {
            // Only update state if component is still mounted
            if (!isMountedRef.current) return;
            
            console.error("Auth Error:", err);
            const message = err.networkError?.result?.errors?.[0]?.message || err.message || "Something went wrong";
            setError(message);
        }
    };

    return (
        <>
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center backdrop-blur-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {!isLogin && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold)]/10 hover:border-[var(--gold)]/50 outline-none transition-all duration-300 shadow-sm"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                {...register("phone")}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold)]/10 hover:border-[var(--gold)]/50 outline-none transition-all duration-300 shadow-sm"
                                placeholder="+1 234 567 890"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        {...register("email")}
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold)]/10 hover:border-[var(--gold)]/50 outline-none transition-all duration-300 shadow-sm"
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-[var(--gold)] focus:ring-4 focus:ring-[var(--gold)]/10 hover:border-[var(--gold)]/50 outline-none transition-all duration-300 shadow-sm"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <Captcha 
                    onChange={(token) => setCaptchaToken(token)}
                    onExpired={() => setCaptchaToken(null)}
                    onError={() => {
                        setCaptchaToken(null);
                        setError("CAPTCHA verification failed. Please try again.");
                    }}
                />

                <button
                    type="submit"
                    disabled={loading || !captchaToken}
                    className="w-full bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Login" : "Sign Up")}
                </button>
            </form>
        </>
    );
};

// Separated Google Button Component
const GoogleAuthButton: React.FC<{ role: string }> = ({ role }) => {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [googleLogin] = useMutation(GOOGLE_LOGIN);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const result = await googleLogin({
                variables: {
                    token: credentialResponse.access_token,
                    userType: role,
                },
            });
            if (result.data) {
                const token = result.data.googleLogin.token;
                localStorage.setItem("token", token);
                window.dispatchEvent(new Event("storage"));
                router.push("/");
            }
        } catch (err: any) {
            setError(err.message || "Google Login Failed");
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setError("Google Sign-In failed. Please try again."),
    });

    return (
        <div className="flex flex-col items-center gap-2">
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
                onClick={() => loginWithGoogle()}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white hover:border-[var(--gold)] hover:bg-gray-50 transition-all duration-300 group shadow-sm"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span className="text-gray-700 font-medium group-hover:text-[var(--gold)] transition-colors">
                    Continue with Google
                </span>
            </button>
        </div>
    );
};
