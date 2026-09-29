import React, { useState } from "react";
import { Sparkles, User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import useAxios from "../../hook/useAxios"; 

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const password = watch("password");

  // TanStack Query Mutation (Database-এ user save করার জন্য)
  const saveUserMutation = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosSecure.post("/users", userData);
      return res.data;
    },
    onSuccess: () => {
      // Database-এ successfully save হওয়ার পর /login এ redirect হবে
      navigate("/login");
    },
    onError: (error) => {
      setServerError(error?.response?.data?.message || error?.message || "Failed to save user data.");
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      // ১. Firebase / Auth System-এ User Register করা
      const result = await registerUser(data.email, data.password, data.fullName);

      // ২. Database-এ পাঠানোর জন্য User Object তৈরি করা
      const newUser = {
        name: data.fullName,
        email: data.email,
        uid: result?.user?.uid, 
        role: "user", // Default Role
        createdAt: new Date().toISOString(),
      };

      // ৩. TanStack Query Mutation ট্রিগার করে /users-এ POST করা
      saveUserMutation.mutate(newUser);

    } catch (error) {
      setServerError(error?.message || "Registration failed. Please try again.");
    }
  };

  // Auth processing অথবা Database post-এর সময় loading state
  const isPending = saveUserMutation.isPending;

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-lg bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Scholar Registration</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Fill in your details to set up your academic profile.
          </p>
        </div>

        {/* Global Server Error Message */}
        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 text-center font-medium">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. Sarah Ahmed"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  errors.fullName
                    ? "border-red-400 focus:ring-red-500/10 focus:border-red-400"
                    : "border-slate-200 focus:border-amber-400 focus:ring-amber-500/10"
                }`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="s.ahmed@student.diit.info"
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  errors.email
                    ? "border-red-400 focus:ring-red-500/10 focus:border-red-400"
                    : "border-slate-200 focus:border-amber-400 focus:ring-amber-500/10"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  errors.password
                    ? "border-red-400 focus:ring-red-500/10 focus:border-red-400"
                    : "border-slate-200 focus:border-amber-400 focus:ring-amber-500/10"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 transition-all ${
                  errors.confirmPassword
                    ? "border-red-400 focus:ring-red-500/10 focus:border-red-400"
                    : "border-slate-200 focus:border-amber-400 focus:ring-amber-500/10"
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-6 rounded-xl bg-[#0F172A] hover:bg-slate-800 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-all duration-300 flex items-center justify-center gap-2 group mt-3 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Scholar Account</span>
                <UserPlus className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-amber-800 hover:text-amber-900 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;