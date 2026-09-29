import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  Award,
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

const AddAcademic = () => {
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
      degree: "",
      institution: "",
      fieldOfStudy: "",
      startYear: "",
      endYear: "",
      isCurrentlyStudying: false,
      grade: "",
      description: "",
      imageFile: null,
    },
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [uploadStep, setUploadStep] = useState(0); // 0: Idle, 1: ImageBB, 2: DB Sync, 3: Done
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedImageFile = watch("imageFile");
  const isCurrentlyStudying = watch("isCurrentlyStudying");

  // TanStack Query Mutation
  const { mutateAsync: createAcademic, isPending: isSaving } = useMutation({
    mutationFn: async (newAcademic) => {
      const res = await axiosSecure.post("/academics", newAcademic);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academics"] });
      setUploadStep(3);
      setUploadProgress(100);
      toast.success("Record akadaamikiin milkaa'inaan dabalameera! 🚀");

      setTimeout(() => {
        reset();
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setUploadStep(0);
        setUploadProgress(0);
        navigate("/academics/all");
      }, 1200);
    },
    onError: (err) => {
      console.error("Save Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.response?.data?.message || err.message || "Gurgurtoon hin milkaa'ine.");
    },
  });

  const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setValue("imageFile", file, { shouldValidate: true });
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Maaloo fakkii waraqaa ragaa sirrii ta'e ol fe'aa!");
    }
  };

  const handleRemoveImage = () => {
    setValue("imageFile", null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = "";

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
        if (!imgBbResult.success) throw new Error("Fakkii ol fe'uun hin milkaa'ine.");
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
        createdAt: new Date().toISOString(),
      };

      await createAcademic(payload);

    } catch (err) {
      console.error("Submission Error:", err);
      setUploadStep(0);
      setUploadProgress(0);
      toast.error(err.message || "Dogoggorri uumameera!");
    }
  };

  const isUploading = uploadStep > 0;

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen font-sans p-4 sm:p-6 lg:pr-24 relative">
      
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
              <h3 className="text-xl font-bold text-[#163A2D]">
                {uploadStep === 1 && "Fakkii ol fe'amaa jira..."}
                {uploadStep === 2 && "Galmeen kuufamaa jira..."}
                {uploadStep === 3 && "Milkaa'inaan Kuufameera!"}
              </h3>
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
        <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
          <div className="p-3 bg-[#163A2D] text-amber-300 rounded-xl shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163A2D]">
              Add Academic Qualification
            </h1>
            <p className="text-sm text-gray-500 font-medium">Odeeffannoo barumsa fi digrii keessani galmeessaa.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-700" /> Degree / Certificate Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.degree ? "border-rose-500" : "border-gray-200"
                  } rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all`}
                  {...register("degree", { required: "Degree name is required" })}
                />
                {errors.degree && <p className="text-xs text-rose-500 mt-1">{errors.degree.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-700" /> Institution / University <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. University of Dhaka"
                  className={`w-full px-4 py-2.5 bg-gray-50 border ${
                    errors.institution ? "border-rose-500" : "border-gray-200"
                  } rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all`}
                  {...register("institution", { required: "Institution is required" })}
                />
                {errors.institution && <p className="text-xs text-rose-500 mt-1">{errors.institution.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" /> Major / Field of Study
                </label>
                <input
                  type="text"
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
                  {...register("fieldOfStudy")}
                />
              </div>

              {/* Duration / Years Options */}
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
                <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-700" /> Grade / CGPA
                </label>
                <input
                  type="text"
                  placeholder={isCurrentlyStudying ? "e.g. Current CGPA 3.80 (Optional)" : "e.g. CGPA 3.85 out of 4.00"}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all"
                  {...register("grade")}
                />
              </div>

            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Certificate Image / Scan</label>
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
                  <p className="text-sm font-semibold text-gray-700">Click or drag & drop certificate image</p>
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

            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" /> Description / Key Achievements
              </label>
              <textarea
                rows="4"
                placeholder="Details about majors, research papers, activities..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 transition-all resize-none"
                {...register("description")}
              ></textarea>
            </div>

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
                    <span>Save Academic Record</span>
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

export default AddAcademic;