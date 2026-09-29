import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Loader2,
  PlusCircle,
  Upload,
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
  Users,
  FileText,
  Bookmark,
  CheckCircle2,
  CloudUpload,
  Database
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AddResearch = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      authors: "",
      journalName: "",
      publicationDate: "",
      paperUrl: "",
      abstract: "",
      imageFile: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // --- UPLOAD PROGRESS STATES (Eye-Catching Feedback) ---
  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: ImageBB, 2: Database, 3: Done
  const [uploadProgress, setUploadProgress] = useState(0);

  // Watched Values
  const selectedDate = watch("publicationDate");
  const selectedImageFile = watch("imageFile");

  // --- Datepicker States & Logic ---
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);

  // Close DatePicker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear previous notifications on mount
  useEffect(() => {
    toast.dismiss();
  }, []);

  // --- TanStack Query Mutation (CREATE / POST) ---
  const { mutateAsync: createResearch, isPending: isSaving } = useMutation({
    mutationFn: async (newResearch) => {
      const res = await axiosSecure.post("/research", newResearch);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Research paper published successfully! 📚✨");

      setTimeout(() => {
        reset();
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setUploadStep(0);
        setUploadProgress(0);
        navigate("/research/all");
      }, 1200);
    },
    onError: (err) => {
      console.error("Database Save Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.response?.data?.message || err.message || "Failed to save research details.");
    },
  });

  // Date Selection Handler
  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const selected = `${year}-${month}-${formattedDay}`;

    setValue("publicationDate", selected, { shouldValidate: true });
    setShowDatePicker(false);
  };

  // Calendar Helpers
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // File Handlers
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select or drop a valid image file!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null, { shouldValidate: true });
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  // Submit Handler
  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Step 1: Uploading to ImageBB
      setUploadStep(1);
      setUploadProgress(25);

      if (data.imageFile) {
        const imgData = new FormData();
        imgData.append("image", data.imageFile);

        setUploadProgress(50);
        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          {
            method: "POST",
            body: imgData,
          }
        );

        const imgBbResult = await imgBbRes.json();

        if (!imgBbResult.success) {
          throw new Error("Image upload failed. Check your ImageBB API key.");
        }

        imageUrl = imgBbResult.data.display_url;
      }

      // Step 2: Saving to Database
      setUploadStep(2);
      setUploadProgress(75);

      const newResearch = {
        title: data.title,
        authors: data.authors.split(",").map((a) => a.trim()),
        journalName: data.journalName,
        publicationDate: data.publicationDate,
        paperUrl: data.paperUrl,
        abstract: data.abstract,
        coverImage: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await createResearch(newResearch);

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
      
      {/* 🚀 EYE-CATCHING FULLSCREEN OVERLAY LOADING MODAL */}
      {isUploading && (
        <div className="fixed inset-0 z-[100] bg-[#163A2D]/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-emerald-100 text-center space-y-6 transform animate-in zoom-in-95 duration-300">
            
            {/* Animated Icon Header */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-ping opacity-75"></div>
              <div className="relative z-10 w-20 h-20 bg-[#163A2D] text-amber-300 rounded-full flex items-center justify-center shadow-lg">
                {uploadStep === 1 && <CloudUpload className="w-10 h-10 animate-bounce" />}
                {uploadStep === 2 && <Database className="w-10 h-10 animate-pulse" />}
                {uploadStep === 3 && <CheckCircle2 className="w-10 h-10 text-emerald-400 scale-110 transition-all" />}
              </div>
            </div>

            {/* Status Titles */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                {uploadStep === 1 && "Uploading Banner Image..."}
                {uploadStep === 2 && "Saving Research Paper..."}
                {uploadStep === 3 && "Published Successfully!"}
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                {uploadStep === 1 && "Optimizing & uploading image to ImageBB CDN"}
                {uploadStep === 2 && "Syncing details with backend server"}
                {uploadStep === 3 && "Redirecting to research library..."}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden p-0.5 border border-emerald-100">
                <div
                  className="bg-gradient-to-r from-[#163A2D] to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-emerald-800">
                <span>PROGRESS</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>

            {/* Live Step Tracker */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-2 gap-2 text-left">
              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                uploadStep >= 1 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-gray-50 border-gray-100 text-gray-400"
              }`}>
                {uploadStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                <span className="truncate">1. Cloud Image</span>
              </div>

              <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                uploadStep >= 2 ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-gray-50 border-gray-100 text-gray-400"
              }`}>
                {uploadStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : uploadStep === 2 ? <Loader2 className="w-4 h-4 animate-spin shrink-0" /> : <Database className="w-4 h-4 text-gray-300 shrink-0" />}
                <span className="truncate">2. Database Sync</span>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Add New Research Paper
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Publish publications, journals, conference papers, and academic works.
              </p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Research Title */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  Research Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Deep Learning Approaches in Medical Image Analysis"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.title ? "border-rose-500 focus:border-rose-500" : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("title", { required: "Research Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title.message}</p>
                )}
              </div>

              {/* Authors */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  Authors (Comma Separated) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe, Jane Smith, Alan Turing"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.authors ? "border-rose-500 focus:border-rose-500" : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("authors", { required: "Authors are required" })}
                />
                {errors.authors && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.authors.message}</p>
                )}
              </div>

              {/* Journal / Conference Name */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-700" />
                  Journal / Conference <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. IEEE Transactions on Medical Imaging"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.journalName ? "border-rose-500 focus:border-rose-500" : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("journalName", { required: "Journal/Conference name is required" })}
                />
                {errors.journalName && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.journalName.message}</p>
                )}
              </div>

              {/* PUBLICATION DATE */}
              <div className="relative" ref={datePickerRef}>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-emerald-700" />
                  Publication Date <span className="text-rose-500">*</span>
                </label>
                
                <Controller
                  name="publicationDate"
                  control={control}
                  rules={{ required: "Publication date is required" }}
                  render={({ field }) => (
                    <div>
                      <div
                        onClick={() => setShowDatePicker((prev) => !prev)}
                        className={`w-full px-4 py-2.5 bg-gray-50 border ${
                          errors.publicationDate ? "border-rose-500" : "border-gray-200"
                        } rounded-xl text-sm flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 hover:border-emerald-300 transition-all group`}
                      >
                        <span className={field.value ? "text-gray-800 font-semibold" : "text-gray-400"}>
                          {field.value
                            ? new Date(field.value).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Select publication date..."}
                        </span>
                        <CalendarIcon className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </div>
                      {errors.publicationDate && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">{errors.publicationDate.message}</p>
                      )}
                    </div>
                  )}
                />

                {/* POPUP DATEPICKER CARD */}
                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-80 bg-white border border-emerald-100 rounded-2xl shadow-2xl p-4 transition-all animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                      <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-[#163A2D] text-sm font-['Playfair_Display',serif]">
                        {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
                      </span>
                      <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-800 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 text-center text-[11px] font-bold text-emerald-800/70 mb-2">
                      <span>Su</span>
                      <span>Mo</span>
                      <span>Tu</span>
                      <span>We</span>
                      <span>Th</span>
                      <span>Fr</span>
                      <span>Sa</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}

                      {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateString = `${currentMonth.getFullYear()}-${String(
                          currentMonth.getMonth() + 1
                        ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        const isSelected = selectedDate === dateString;

                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDateSelect(day)}
                            className={`py-2 rounded-xl font-medium transition-all ${
                              isSelected
                                ? "bg-[#163A2D] text-amber-300 font-bold shadow-md scale-105"
                                : "hover:bg-emerald-50 text-gray-700 hover:text-emerald-800"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Paper Link / URL */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-emerald-700" />
                  Paper URL / DOI Link
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://doi.org/10.1000/xyz123"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.paperUrl ? "border-rose-500 focus:border-rose-500" : "border-gray-200 focus:border-emerald-600"
                  } rounded-xl text-sm focus:outline-none focus:bg-white transition-all`}
                  {...register("paperUrl", {
                    pattern: {
                      value: /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/.*)?$/,
                      message: "Please enter a valid URL",
                    },
                  })}
                />
                {errors.paperUrl && (
                  <p className="text-xs text-rose-500 mt-1 font-medium">{errors.paperUrl.message}</p>
                )}
              </div>

            </div>

            {/* DRAG AND DROP ZONE */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Paper Banner / Cover Image <span className="text-rose-500">*</span>
              </label>

              <Controller
                name="imageFile"
                control={control}
                rules={{ required: "Research cover/banner image is required" }}
                render={() => (
                  <>
                    {!imagePreview ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 ${
                          errors.imageFile ? "border-rose-400 bg-rose-50/20" : "border-emerald-300 bg-gray-50"
                        } border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                          isDragging ? "border-emerald-600 bg-emerald-50/70 scale-[1.01]" : "hover:bg-emerald-50/30"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-3 bg-emerald-100/70 text-emerald-800 rounded-full mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          <span className="text-emerald-700 font-bold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP, or GIF up to 10MB</p>
                      </div>
                    ) : (
                      <div className="relative p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={imagePreview}
                            alt="Research Cover Preview"
                            className="w-20 h-20 object-cover rounded-xl border border-emerald-300 shadow-sm"
                          />
                          <div>
                            <p className="text-sm font-bold text-[#163A2D] truncate max-w-[200px] sm:max-w-xs">
                              {selectedImageFile?.name}
                            </p>
                            <p className="text-xs text-emerald-700 font-medium mt-0.5">
                              {(selectedImageFile?.size / (1024 * 1024)).toFixed(2)} MB • Ready to Upload
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Remove Image"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              />
              {errors.imageFile && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.imageFile.message}</p>
              )}
            </div>

            {/* Abstract / Summary */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">
                Abstract / Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows="5"
                placeholder="Provide a comprehensive abstract or summary of the research paper..."
                className={`w-full px-4 py-2.5 bg-gray-50 border ${
                  errors.abstract ? "border-rose-500 focus:border-rose-500" : "border-gray-200 focus:border-emerald-600"
                } rounded-xl text-sm focus:outline-none focus:bg-white transition-all resize-none`}
                {...register("abstract", { required: "Abstract/Summary is required" })}
              ></textarea>
              {errors.abstract && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.abstract.message}</p>
              )}
            </div>

            {/* EYE-CATCHING SUBMIT BUTTON WITH GLOW AND SPINNER */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isUploading || isSaving}
                className={`relative group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer overflow-hidden ${
                  isUploading ? "ring-4 ring-emerald-300/50" : ""
                }`}
              >
                {/* Glowing Effect Background */}
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-transparent to-amber-300/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>

                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                    <span>Processing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5 text-amber-300 group-hover:rotate-90 transition-transform duration-300" />
                    <span>Publish Research</span>
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

export default AddResearch;