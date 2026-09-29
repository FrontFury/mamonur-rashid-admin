import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import {
  BookOpen,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Calendar as CalendarIcon,
  Users,
  Bookmark,
  FileText,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  CloudUpload,
  Database
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AllResearch = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingResearch, setEditingResearch] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // --- 1. READ (GET All Research) ---
  const { data: researchList = [], isLoading, isError, error } = useQuery({
    queryKey: ["research"],
    queryFn: async () => {
      const res = await axiosSecure.get("/research");
      return res.data;
    },
  });

  // --- 2. DELETE MUTATION ---
  const { mutateAsync: deleteResearch, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/research/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      toast.success("Research paper deleted successfully! 🗑️");
      setDeletingId(null);
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Failed to delete research paper.");
    },
  });

  // Filter Research based on Search
  const filteredResearch = researchList.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const journalMatch = item.journalName?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = Array.isArray(item.authors)
      ? item.authors.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()))
      : item.authors?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || journalMatch || authorMatch;
  });

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                All Research Papers
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Manage, update, and review all published academic works.
              </p>
            </div>
          </div>

          {/* SEARCH BAR */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author, journal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* CONTENT AREA */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#163A2D]" />
            <p className="text-sm font-semibold text-gray-500">Loading research publications...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700">
            <p className="font-bold">Failed to load research papers!</p>
            <p className="text-xs text-rose-500 mt-1">{error?.message}</p>
          </div>
        ) : filteredResearch.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 space-y-2">
            <BookOpen className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-lg font-bold text-gray-700">No Research Papers Found</p>
            <p className="text-sm">Try adjusting your search criteria or publish a new paper.</p>
          </div>
        ) : (
          /* RESEARCH CARDS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResearch.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-emerald-100/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* COVER IMAGE */}
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={item.coverImage || "https://images.unsplash.com/photo-1532094349884-543bc11b234d"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-[#163A2D]/80 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                      {item.publicationDate ? new Date(item.publicationDate).getFullYear() : "N/A"}
                    </div>
                  </div>

                  {/* CARD BODY */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-[#163A2D] line-clamp-2 leading-snug hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h3>

                    {/* Authors */}
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1 font-medium">
                        {Array.isArray(item.authors) ? item.authors.join(", ") : item.authors}
                      </span>
                    </div>

                    {/* Journal */}
                    <div className="flex items-start gap-2 text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-lg font-semibold">
                      <Bookmark className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item.journalName}</span>
                    </div>

                    {/* Abstract Preview */}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                      {item.abstract}
                    </p>
                  </div>
                </div>

                {/* CARD FOOTER (ACTIONS) */}
                <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between gap-2">
                  {item.paperUrl ? (
                    <a
                      href={item.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                    >
                      <span>Read Paper</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">No Link</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingResearch(item)}
                      className="p-2 text-emerald-700 hover:bg-emerald-100/70 rounded-xl transition-all"
                      title="Edit Research"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item._id)}
                      className="p-2 text-rose-600 hover:bg-rose-100/70 rounded-xl transition-all"
                      title="Delete Research"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* --- EDIT RESEARCH MODAL --- */}
      {editingResearch && (
        <EditResearchModal
          research={editingResearch}
          onClose={() => setEditingResearch(null)}
        />
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#163A2D]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800">Delete Research Paper?</h3>
              <p className="text-xs text-gray-500 font-medium">
                This action cannot be undone. Are you sure you want to permanently remove this publication?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => deleteResearch(deletingId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ==================================================================== */
/*                      EDIT RESEARCH MODAL COMPONENT                   */
/* ==================================================================== */
const EditResearchModal = ({ research, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState(research.coverImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: ImageBB, 2: DB Sync, 3: Done
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: research.title || "",
      authors: Array.isArray(research.authors) ? research.authors.join(", ") : research.authors || "",
      journalName: research.journalName || "",
      publicationDate: research.publicationDate || "",
      paperUrl: research.paperUrl || "",
      abstract: research.abstract || "",
      imageFile: null,
    },
  });

  const selectedDate = watch("publicationDate");
  const selectedImageFile = watch("imageFile");

  // Datepicker State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    research.publicationDate ? new Date(research.publicationDate) : new Date()
  );
  const datePickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. UPDATE MUTATION (PATCH) ---
  const { mutateAsync: updateResearch } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/research/${research._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Research paper updated successfully! 📝");

      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (err) => {
      console.error("Update Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.response?.data?.message || "Failed to update research details.");
    },
  });

  // Calendar Helpers
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handleDateSelect = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    setValue("publicationDate", `${year}-${month}-${formattedDay}`, { shouldValidate: true });
    setShowDatePicker(false);
  };

  // Image Handlers
  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      if (imagePreview && imagePreview !== research.coverImage) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please select a valid image file!");
    }
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null);
    setImagePreview(null);
  };

  // Submit Edit Form
  const onSubmit = async (data) => {
    try {
      let imageUrl = research.coverImage;

      // 1. New Image upload to ImageBB if changed
      if (data.imageFile) {
        setUploadStep(1);
        setUploadProgress(30);

        const imgData = new FormData();
        imgData.append("image", data.imageFile);

        setUploadProgress(50);
        const imgBbRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
          { method: "POST", body: imgData }
        );

        const imgBbResult = await imgBbRes.json();
        if (!imgBbResult.success) {
          throw new Error("Image upload failed.");
        }
        imageUrl = imgBbResult.data.display_url;
      }

      // 2. Prepare PATCH payload
      setUploadStep(2);
      setUploadProgress(75);

      const updatedPayload = {
        title: data.title,
        authors: data.authors.split(",").map((a) => a.trim()),
        journalName: data.journalName,
        publicationDate: data.publicationDate,
        paperUrl: data.paperUrl,
        abstract: data.abstract,
        coverImage: imageUrl,
      };

      await updateResearch(updatedPayload);

    } catch (err) {
      console.error(err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.message || "Something went wrong!");
    }
  };

  const isUpdating = uploadStep > 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#163A2D]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      
      {/* 🚀 EYE-CATCHING OVERLAY LOADER IN EDIT MODAL */}
      {isUpdating && (
        <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-[#163A2D] text-amber-300 rounded-full flex items-center justify-center shadow-lg">
            {uploadStep === 1 && <CloudUpload className="w-8 h-8 animate-bounce" />}
            {uploadStep === 2 && <Database className="w-8 h-8 animate-pulse" />}
            {uploadStep === 3 && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#163A2D]">
              {uploadStep === 1 && "Uploading New Banner..."}
              {uploadStep === 2 && "Applying PATCH Update..."}
              {uploadStep === 3 && "Updated Successfully!"}
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Please wait while changes are synchronized.</p>
          </div>
          <div className="w-64 bg-gray-100 rounded-full h-2.5 overflow-hidden border border-emerald-100">
            <div
              className="bg-gradient-to-r from-[#163A2D] to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* MODAL CARD */}
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-emerald-100 overflow-hidden relative my-8">
        
        {/* MODAL HEADER */}
        <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#163A2D] text-amber-300 rounded-xl shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Edit Research Paper
              </h2>
              <p className="text-xs text-gray-500 font-medium">Update publication details or cover banner.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-700" /> Research Title *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            {/* Authors */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-700" /> Authors (Comma Separated) *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                {...register("authors", { required: "Authors are required" })}
              />
              {errors.authors && <p className="text-xs text-rose-500 mt-1">{errors.authors.message}</p>}
            </div>

            {/* Journal */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5 text-emerald-700" /> Journal / Conference *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                {...register("journalName", { required: "Journal is required" })}
              />
              {errors.journalName && <p className="text-xs text-rose-500 mt-1">{errors.journalName.message}</p>}
            </div>

            {/* Publication Date */}
            <div className="relative" ref={datePickerRef}>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5 flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" /> Publication Date *
              </label>
              <Controller
                name="publicationDate"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <div
                    onClick={() => setShowDatePicker((prev) => !prev)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm flex items-center justify-between cursor-pointer hover:bg-emerald-50/40 transition-all"
                  >
                    <span className={field.value ? "text-gray-800 font-semibold" : "text-gray-400"}>
                      {field.value
                        ? new Date(field.value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                        : "Select date..."}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              />

              {/* POPUP DATEPICKER */}
              {showDatePicker && (
                <div className="absolute top-full left-0 mt-2 z-50 w-72 bg-white border border-emerald-100 rounded-2xl shadow-xl p-3">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                      className="p-1 hover:bg-emerald-50 text-emerald-800 rounded-lg"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-xs text-[#163A2D]">
                      {currentMonth.toLocaleString("default", { month: "short" })} {currentMonth.getFullYear()}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                      className="p-1 hover:bg-emerald-50 text-emerald-800 rounded-lg"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected ? "bg-[#163A2D] text-amber-300 font-bold" : "hover:bg-emerald-50 text-gray-700"
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

            {/* Paper URL */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Paper URL / DOI Link</label>
              <input
                type="url"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                {...register("paperUrl")}
              />
            </div>

          </div>

          {/* Banner Image Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Cover Image Banner</label>
            {!imagePreview ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                }}
                className={`relative border-2 border-dashed border-emerald-300 bg-gray-50 rounded-2xl p-4 text-center cursor-pointer ${
                  isDragging ? "bg-emerald-50" : ""
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-semibold">Click or drag image to update</p>
              </div>
            ) : (
              <div className="relative p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-emerald-300" />
                  <div>
                    <p className="text-xs font-bold text-[#163A2D] truncate max-w-[200px]">
                      {selectedImageFile ? selectedImageFile.name : "Current Cover Image"}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">Ready to save</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Abstract */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1.5">Abstract / Summary *</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all resize-none"
              {...register("abstract", { required: "Abstract is required" })}
            ></textarea>
            {errors.abstract && <p className="text-xs text-rose-500 mt-1">{errors.abstract.message}</p>}
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AllResearch;