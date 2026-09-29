import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Award,
  Search,
  Edit3,
  Trash2,
  X,
  Upload,
  Loader2,
  CloudUpload,
  Database,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import useAxiosSecure from "../../hook/useAxiosSecure";

const AllAcademic = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // GET All Academics
  const { data: academics = [], isLoading, isError, error } = useQuery({
    queryKey: ["academics"],
    queryFn: async () => {
      const res = await axiosSecure.get("/academics");
      return res.data;
    },
  });

  // DELETE Academic Mutation
  const { mutateAsync: deleteAcademic, isPending: isDeleting } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/academics/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      toast.success("Recordicha balleessuun milkaa'era! 🗑️");
      setDeletingId(null);
    },
    onError: (err) => {
      console.error("Delete Error:", err);
      toast.error(err.response?.data?.message || "Haqqinsi hin milkaa'ine.");
    },
  });

  const filteredRecords = academics.filter((item) => {
    const degreeMatch = item.degree?.toLowerCase().includes(searchTerm.toLowerCase());
    const instMatch = item.institution?.toLowerCase().includes(searchTerm.toLowerCase());
    const fieldMatch = item.fieldOfStudy?.toLowerCase().includes(searchTerm.toLowerCase());
    const yearMatch = item.passingYear?.toLowerCase().includes(searchTerm.toLowerCase());
    return degreeMatch || instMatch || fieldMatch || yearMatch;
  });

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D]">
                Academic Qualifications
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Galmee barumsa keessanii ilaalaa, gulaalaa yookiin haqaa.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search degree, university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#163A2D]" />
            <p className="text-sm font-semibold text-gray-500">Odeeffannoon fe'amaa jira...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center text-rose-700">
            <p className="font-bold">Odeeffannoo fe'uun hin milkaa'ine!</p>
            <p className="text-xs text-rose-500 mt-1">{error?.message}</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 space-y-2">
            <GraduationCap className="w-12 h-12 mx-auto text-gray-300" />
            <p className="text-lg font-bold text-gray-700">Waraqaan Ragaa Hin Argamne</p>
            <p className="text-sm">Barbaacha keessan fooyyessaa yookiin haaraa galmeessaa.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div className="h-48 w-full bg-emerald-50 relative overflow-hidden border-b border-emerald-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.degree}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-emerald-800/40">
                        <GraduationCap className="w-12 h-12" />
                      </div>
                    )}
                    
                    {(item.passingYear || item.startYear) && (
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm ${
                        item.isCurrentlyStudying || item.endYear === "Present"
                          ? "bg-emerald-700 text-white animate-pulse"
                          : "bg-[#163A2D]/90 text-amber-300"
                      }`}>
                        {item.passingYear || `${item.startYear || ""} - ${item.endYear || ""}`}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-[#163A2D] line-clamp-1">
                      {item.degree}
                    </h3>

                    <div className="space-y-1 text-xs">
                      {item.institution && (
                        <p className="text-gray-700 font-semibold flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="truncate">{item.institution}</span>
                        </p>
                      )}
                      {item.fieldOfStudy && (
                        <p className="text-gray-500 font-medium flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.fieldOfStudy}</span>
                        </p>
                      )}
                      {item.grade && (
                        <p className="text-emerald-800 font-medium flex items-center gap-1.5 pt-1">
                          <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.grade}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-50/30 border-t border-emerald-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400 font-medium">
                    ID: {item._id?.substring(item._id.length - 6)}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingRecord(item)}
                      className="p-2 text-emerald-700 hover:bg-emerald-100/70 rounded-xl transition-all"
                      title="Gulaali"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(item._id)}
                      className="p-2 text-rose-600 hover:bg-rose-100/70 rounded-xl transition-all"
                      title="Haqi"
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

      {editingRecord && (
        <EditAcademicModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}

      {deletingId && (
        <div className="fixed inset-0 z-50 bg-[#163A2D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 border border-rose-100">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-800">Galmee koo haqaa?</h3>
              <p className="text-xs text-gray-500 font-medium">
                Galmeen kun dhumaarratti kuusaa deetaa keessaa ni haqama.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all"
              >
                Dhiisi
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => deleteAcademic(deletingId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-70"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eeyyee, Haqi"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
/* EDIT MODAL */
const EditAcademicModal = ({ record, onClose }) => {
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
      degree: record.degree || "",
      institution: record.institution || "",
      fieldOfStudy: record.fieldOfStudy || "",
      startYear: record.startYear || "",
      endYear: record.endYear === "Present" ? "" : record.endYear || "",
      isCurrentlyStudying: record.isCurrentlyStudying || record.endYear === "Present" || false,
      grade: record.grade || "",
      description: record.description || "",
      imageFile: null,
    },
  });

  const selectedImageFile = watch("imageFile");
  const isCurrentlyStudying = watch("isCurrentlyStudying");

  const { mutateAsync: updateAcademic } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/academics/${record._id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Academic record updated successfully! 📝");

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
      toast.error("Please upload a valid image file!");
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

      const passingYearDisplay = data.isCurrentlyStudying
        ? `${data.startYear || ""} - Present`
        : data.startYear && data.endYear
        ? `${data.startYear} - ${data.endYear}`
        : data.endYear || data.startYear || "";

      const payload = {
        degree: data.degree,
        institution: data.institution,
        fieldOfStudy: data.fieldOfStudy,
        startYear: data.startYear,
        endYear: data.isCurrentlyStudying ? "Present" : data.endYear,
        isCurrentlyStudying: data.isCurrentlyStudying,
        passingYear: passingYearDisplay,
        grade: data.grade,
        description: data.description,
        image: imageUrl,
      };

      await updateAcademic(payload);

    } catch (err) {
      console.error(err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.message || "An error occurred!");
    }
  };

  const isUpdating = uploadStep > 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#163A2D]/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      
      {isUpdating && (
        <div className="absolute inset-0 z-[60] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-[#163A2D] text-amber-300 rounded-full flex items-center justify-center shadow-lg">
            {uploadStep === 1 && <CloudUpload className="w-8 h-8 animate-bounce" />}
            {uploadStep === 2 && <Database className="w-8 h-8 animate-pulse" />}
            {uploadStep === 3 && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          </div>
          <div>
            <h4 className="text-lg font-bold text-[#163A2D]">
              {uploadStep === 1 && "Uploading image..."}
              {uploadStep === 2 && "Saving updates..."}
              {uploadStep === 3 && "Updated Successfully!"}
            </h4>
          </div>
          <div className="w-64 bg-gray-100 rounded-full h-2.5 overflow-hidden border border-emerald-100">
            <div
              className="bg-gradient-to-r from-[#163A2D] to-emerald-500 h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden relative my-8">
        <div className="p-6 bg-emerald-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#163A2D] text-amber-300 rounded-xl shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#163A2D]">
                Edit Academic Record
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-rose-600 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Degree Name *</label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Science in Computer Science"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("degree", { required: "Degree name is required" })}
              />
              {errors.degree && <p className="text-xs text-rose-500 mt-1">{errors.degree.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Institution *</label>
              <input
                type="text"
                placeholder="e.g. University of Dhaka"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("institution", { required: "Institution is required" })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("fieldOfStudy")}
              />
            </div>

            {/* Duration Section */}
            <div className="md:col-span-2 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-gray-700 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-700" /> Duration / Session
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#163A2D]">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-emerald-700 rounded border-gray-300 focus:ring-emerald-500 accent-[#163A2D]"
                    {...register("isCurrentlyStudying")}
                  />
                  <span>Currently Studying Here (Running)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">Start Year / From</label>
                  <input
                    type="text"
                    placeholder="e.g. 2020"
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
                    {...register("startYear")}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">End Year / Till</label>
                  <input
                    type="text"
                    placeholder={isCurrentlyStudying ? "Present" : "e.g. 2024"}
                    disabled={isCurrentlyStudying}
                    className={`w-full px-4 py-2 border rounded-xl text-sm transition-all ${
                      isCurrentlyStudying
                        ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-200 focus:outline-none focus:border-emerald-600"
                    }`}
                    {...register("endYear")}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Grade / CGPA</label>
              <input
                type="text"
                placeholder={isCurrentlyStudying ? "e.g. Current CGPA 3.80" : "e.g. CGPA 3.85 out of 4.00"}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                {...register("grade")}
              />
            </div>

          </div>

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

          <div>
            <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Details about majors, research papers, activities..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 resize-none"
              {...register("description")}
            ></textarea>
          </div>

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

export default AllAcademic;