import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Award,
  Building2,
  User,
  Calendar as CalendarIcon,
  Search,
  Edit3,
  Trash2,
  X,
  Upload,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  CloudUpload,
  Database
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AllDevelopment = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // READ (GET All Certificates)
  const { data: developments = [], isLoading, isError, error } = useQuery({
    queryKey: ["developments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/developments");
      return res.data;
    },
  });

  // DELETE MUTATION
  const { mutateAsync: deleteDevelopment, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/developments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developments"] });
      toast.success("Certificate record deleted! 🗑️");
      setDeletingId(null);
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Failed to delete record.");
    },
  });

  // Filter Search Logic
  const filteredRecords = developments.filter((item) => {
    const titleMatch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const orgMatch = item.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = item.participantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = item.date?.toLowerCase().includes(searchTerm.toLowerCase());
    return titleMatch || orgMatch || nameMatch || dateMatch;
  });

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                All Training Certificates
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Manage, edit, or remove executive certificates & institute training records.
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, institute, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#163A2D]" />
            <p className="text-sm font-semibold text-gray-500">Loading certificate records...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700">
            <p className="font-bold">Failed to load certificates!</p>
            <p className="text-xs text-rose-500 mt-1">{error?.message}</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 space-y-2">
            <Award className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-lg font-bold text-gray-700">No Certificates Found</p>
            <p className="text-sm">Try adjusting your search query or add a new record.</p>
          </div>
        ) : (
          /* CERTIFICATES GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Preview */}
                  <div className="h-48 w-full bg-emerald-50 relative overflow-hidden border-b border-emerald-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800/40">
                        <Award className="w-12 h-12" />
                      </div>
                    )}
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-[#163A2D]/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-[#163A2D] font-['Playfair_Display',serif] line-clamp-1">
                      {item.title}
                    </h3>

                    {/* Organization & Participant */}
                    <div className="space-y-1 text-xs">
                      {item.organization && (
                        <p className="text-gray-700 font-semibold flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{item.organization}</span>
                        </p>
                      )}
                      {item.participantName && (
                        <p className="text-gray-500 font-medium flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.participantName}</span>
                        </p>
                      )}
                    </div>

                    {/* Single Collapsed Date Display */}
                    {item.date && (
                      <div className="pt-2 border-t border-gray-100 text-[11px] text-emerald-800 font-medium">
                        <p className="flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="line-clamp-2">{item.date}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-emerald-50/30 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    ID: {item._id?.substring(item._id.length - 6)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingRecord(item)}
                      className="p-2 text-emerald-700 hover:bg-emerald-100/70 rounded-xl transition-all"
                      title="Edit Record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item._id)}
                      className="p-2 text-rose-600 hover:bg-rose-100/70 rounded-xl transition-all"
                      title="Delete Record"
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

      {/* EDIT MODAL */}
      {editingRecord && (
        <EditDevelopmentModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#163A2D]/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800">Delete Certificate Record?</h3>
              <p className="text-xs text-gray-500 font-medium">
                This record will be permanently deleted from the database.
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
                onClick={() => deleteDevelopment(deletingId)}
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
/*                      EDIT DEVELOPMENT MODAL                         */
/* ==================================================================== */
const EditDevelopmentModal = ({ record, onClose }) => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState(record.image || null);
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: record.title || "",
      organization: record.organization || "",
      participantName: record.participantName || "",
      category: record.category || "",
      date: record.date || "", // Single Date Field
      description: record.description || "",
      imageFile: null,
    },
  });

  const selectedImageFile = watch("imageFile");

  // UPDATE MUTATION (PATCH)
  const { mutateAsync: updateDevelopment } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/developments/${record._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["developments"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Certificate updated successfully! 📝");

      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (err) => {
      console.error("Update Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.response?.data?.message || "Failed to update record.");
    },
  });

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      if (imagePreview && imagePreview !== record.image) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Please upload a valid image!");
    }
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = record.image;

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
        if (!imgBbResult.success) throw new Error("Image upload failed.");
        imageUrl = imgBbResult.data.display_url;
      }

      setUploadStep(2);
      setUploadProgress(75);

      const payload = {
        title: data.title,
        organization: data.organization,
        participantName: data.participantName,
        category: data.category,
        date: data.date,
        description: data.description,
        image: imageUrl,
      };

      await updateDevelopment(payload);

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
      
      {/* Overlay Loader */}
      {isUpdating && (
        <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-[#163A2D] text-amber-300 rounded-full flex items-center justify-center shadow-lg">
            {uploadStep === 1 && <CloudUpload className="w-8 h-8 animate-bounce" />}
            {uploadStep === 2 && <Database className="w-8 h-8 animate-pulse" />}
            {uploadStep === 3 && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#163A2D]">
              {uploadStep === 1 && "Uploading Document..."}
              {uploadStep === 2 && "Updating Record..."}
              {uploadStep === 3 && "Updated Successfully!"}
            </h4>
            <p className="text-xs text-gray-500 font-medium mt-0.5">Please wait while changes sync.</p>
          </div>
          <div className="w-64 bg-gray-100 rounded-full h-2.5 overflow-hidden border border-emerald-100">
            <div
              className="bg-gradient-to-r from-[#163A2D] to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Modal Box */}
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden relative my-8">
        
        {/* Header */}
        <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#163A2D] text-amber-300 rounded-xl shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#163A2D] font-['Playfair_Display',serif]">
                Edit Training Certificate
              </h2>
              <p className="text-xs text-gray-500 font-medium">Update title, organization, date, or uploaded scan.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-rose-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Course Title *</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Organization / Institute *</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("organization", { required: "Organization is required" })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Participant Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("participantName")}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Category *</label>
              <select
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("category", { required: "Category is required" })}
              >
                <option value="">Select Category...</option>
                <option value="Executive Training">Executive Training</option>
                <option value="Workshop">Workshop</option>
                <option value="Professional Certification">Professional Certification</option>
                <option value="Leadership Program">Leadership Program</option>
                <option value="Technical Seminar">Technical Seminar</option>
              </select>
            </div>

            {/* Collapsed Single Date Input */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Date & Time</label>
              <input
                type="text"
                placeholder="e.g. September 22 - 23, 2017 (10:00 a.m. to 05:30 p.m.)"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("date")}
              />
            </div>

          </div>

          {/* Certificate Scan Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Certificate Image</label>
            {!imagePreview ? (
              <div className="relative border-2 border-dashed border-emerald-300 bg-gray-50 rounded-2xl p-4 text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && processFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-emerald-700 mx-auto mb-1" />
                <p className="text-xs text-gray-600 font-semibold">Click to upload new image</p>
              </div>
            ) : (
              <div className="relative p-3 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={imagePreview} alt="Thumbnail" className="w-16 h-12 object-cover rounded-xl border border-emerald-200" />
                  <div>
                    <p className="text-xs font-bold text-[#163A2D] truncate max-w-[200px]">
                      {selectedImageFile ? selectedImageFile.name : "Current Certificate"}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">Ready to update</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setValue("imageFile", null); setImagePreview(null); }}
                  className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description / Details</label>
            <textarea
              rows="3"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
              {...register("description")}
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2.5 bg-[#163A2D] hover:bg-[#0C2219] text-amber-300 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AllDevelopment;