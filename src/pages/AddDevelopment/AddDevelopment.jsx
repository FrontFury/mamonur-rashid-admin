import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  Building2,
  User,
  Layers,
  Calendar as CalendarIcon,
  PlusCircle,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  CloudUpload,
  Database,
  FileText
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AddDevelopment = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      organization: "",
      participantName: "",
      category: "",
      date: "", // Collapse করা একক Date & Time ফিল্ড
      description: "",
      imageFile: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Upload Progress States
  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: ImageBB, 2: DB Sync, 3: Done
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedImageFile = watch("imageFile");

  // TanStack Query Mutation
  const { mutateAsync: createDevelopment, isPending: isSaving } = useMutation({
    mutationFn: async (newDevelopment) => {
      const res = await axiosSecure.post("/developments", newDevelopment);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developments"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Training certificate record added successfully! 🚀");

      setTimeout(() => {
        reset();
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setUploadStep(0);
        setUploadProgress(0);
        navigate("/development/all");
      }, 1200);
    },
    onError: (err) => {
      console.error("Save Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.response?.data?.message || err.message || "Failed to save record.");
    },
  });

  // Image File Processors
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid certificate image!");
    }
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Step 1: Uploading Certificate to ImageBB
      setUploadStep(1);
      setUploadProgress(25);

      if (data.imageFile) {
        const imgData = new FormData();
        imgData.append("image", data.imageFile);

        setUploadProgress(50);
        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          { method: "POST", body: imgData }
        );

        const imgBbResult = await imgBbRes.json();
        if (!imgBbResult.success) throw new Error("Certificate image upload failed.");
        imageUrl = imgBbResult.data.display_url;
      }

      // Step 2: Save to DB
      setUploadStep(2);
      setUploadProgress(75);

      const payload = {
        title: data.title, // e.g. "How to Become a Dynamic Leader"
        organization: data.organization, // e.g. "DCCI Business Institute"
        participantName: data.participantName, // e.g. "Md. Mamunur Rashid"
        category: data.category, // e.g. "Workshop"
        date: data.date, // e.g. "September 22 - 23, 2017 (10:00 a.m. to 05:30 p.m.)"
        description: data.description,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await createDevelopment(payload);

    } catch (err) {
      console.error("Submission Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.message || "Something went wrong!");
    }
  };

  const isUploading = uploadStep > 0;

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24 relative">
      
      {/* Overlay Loader */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-[#163A2D]/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-75"></div>
              <div className="relative z-10 w-20 h-20 bg-[#163A2D] text-amber-300 rounded-full flex items-center justify-center shadow-lg">
                {uploadStep === 1 && <CloudUpload className="w-10 h-10 animate-bounce" />}
                {uploadStep === 2 && <Database className="w-10 h-10 animate-pulse" />}
                {uploadStep === 3 && <CheckCircle2 className="w-10 h-10 text-emerald-400" />}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                {uploadStep === 1 && "Uploading Certificate..."}
                {uploadStep === 2 && "Saving Certificate Record..."}
                {uploadStep === 3 && "Record Saved Successfully!"}
              </h3>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {uploadStep === 1 && "Uploading document to CDN..."}
                {uploadStep === 2 && "Syncing with database..."}
                {uploadStep === 3 && "Redirecting to list..."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-100">
                <div
                  className="bg-gradient-to-r from-[#163A2D] to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-emerald-800">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
              Add Training / Workshop Certificate
            </h1>
            <p className="text-sm text-gray-500 font-medium">Record executive certificates, institute details, and training dates.</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Course / Training Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" /> Course / Workshop Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. How to Become a Dynamic Leader"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.title ? "border-rose-500" : "border-gray-200"
                  } rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all`}
                  {...register("title", { required: "Course Title is required" })}
                />
                {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
              </div>

              {/* Organization / Institute */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" /> Institute / Organization <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. DCCI Business Institute"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.organization ? "border-rose-500" : "border-gray-200"
                  } rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all`}
                  {...register("organization", { required: "Institute Name is required" })}
                />
                {errors.organization && <p className="text-xs text-rose-500 mt-1">{errors.organization.message}</p>}
              </div>

              {/* Participant Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-700" /> Participant Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Md. Mamunur Rashid"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
                  {...register("participantName")}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-700" /> Category <span className="text-rose-500">*</span>
                </label>
                <select
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.category ? "border-rose-500" : "border-gray-200"
                  } rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all`}
                  {...register("category", { required: "Category is required" })}
                >
                  <option value="">Select Training Type...</option>
                  <option value="Executive Training">Executive Training</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Professional Certification">Professional Certification</option>
                  <option value="Leadership Program">Leadership Program</option>
                  <option value="Technical Seminar">Technical Seminar</option>
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category.message}</p>}
              </div>

              {/* Collapsed Date & Time Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-700" /> Date & Time
                </label>
                <input
                  type="text"
                  placeholder="e.g. September 22 - 23, 2017 (10:00 a.m. to 05:30 p.m.)"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
                  {...register("date")}
                />
              </div>

            </div>

            {/* Certificate Dropzone */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Certificate Image / Document</label>
              {!imagePreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                  }}
                  className={`relative border-2 border-dashed border-emerald-300 bg-gray-50 rounded-2xl p-6 text-center cursor-pointer transition-all ${
                    isDragging ? "bg-emerald-50 scale-[1.01]" : "hover:bg-emerald-50/30"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Click or drag & drop certificate scan/photo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
              ) : (
                <div className="relative p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={imagePreview} alt="Preview" className="w-20 h-14 object-cover rounded-xl bg-white border border-emerald-200" />
                    <div>
                      <p className="text-sm font-bold text-[#163A2D] truncate max-w-xs">{selectedImageFile?.name}</p>
                      <p className="text-xs text-emerald-700 font-medium mt-0.5">Ready to upload</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveImage} className="p-2 text-gray-400 hover:text-rose-600 rounded-xl">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Description / Summary */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" /> Certificate / Course Details
              </label>
              <textarea
                rows="4"
                placeholder="Key takeaways, modules covered, or additional details..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all resize-none"
                {...register("description")}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUploading || isSaving}
                className="px-8 py-3.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Save Certificate Record</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDevelopment;