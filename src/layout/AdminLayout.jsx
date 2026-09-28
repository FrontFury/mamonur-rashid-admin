import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, TreePine, Sparkles, Microscope, Menu, X } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Navbar from "../pages/Shared/Navbar";

const floatingNatureIcons = [
  { Icon: Leaf, top: "15%", left: "3%", size: 32, color: "#10B981", delay: 0 },
  { Icon: TreePine, top: "45%", left: "2%", size: 36, color: "#059669", delay: 1 },
  { Icon: Microscope, top: "75%", left: "3%", size: 34, color: "#047857", delay: 2 },

  { Icon: Sparkles, top: "18%", right: "4%", size: 30, color: "#D97706", delay: 1.5 },
  { Icon: Leaf, top: "50%", right: "3%", size: 34, color: "#10B981", delay: 0.8 },
  { Icon: TreePine, top: "80%", right: "4%", size: 32, color: "#047857", delay: 1.8 },
];

export const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Logout Handler
  const handleLogout = () => {
    // TODO: Clear Auth Token / State Here
    console.log("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-zinc-800 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-['Playfair_Display',serif] overflow-x-hidden">
      
      {/* Toast Notification Container with highest z-index & top margin */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        containerStyle={{
          top: 20,
          zIndex: 99999,
        }}
      />

      {/* 1. Light Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* 2. Soft Mint/Emerald Glows */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-teal-100/50 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[160px]" />
      </div>

      {/* 3. Floating Nature Icons (-z-10 যোগ করে কন্টেন্ট ও ন্যাভবারের নিচে পাঠানো হয়েছে) */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {floatingNatureIcons.map((item, idx) => {
          const NatureIcon = item.Icon;
          return (
            <motion.div
              key={idx}
              initial={{ y: 0, opacity: 0.3 }}
              animate={{
                y: [-12, 12, -12],
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              style={{
                position: "absolute",
                top: item.top,
                left: item.left,
                right: item.right,
              }}
              className="hidden lg:flex p-3.5 rounded-2xl bg-white/80 border border-emerald-100 shadow-xl items-center justify-center backdrop-blur-md"
            >
              <NatureIcon
                size={item.size}
                color={item.color}
                style={{ filter: `drop-shadow(0 2px 8px ${item.color}33)` }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* BRAND HEADER */}
      <header className="relative z-20 w-full bg-[#163A2D] lg:bg-white/40 lg:backdrop-blur-md border-b border-emerald-900/40 lg:border-emerald-100/60 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <NavLink
            to="/"
            className="text-2xl sm:text-3xl font-extrabold tracking-wide text-white lg:text-[#163A2D] hover:text-emerald-200 lg:hover:text-emerald-700 transition-colors"
          >
            Ramen Kumar Das
          </NavLink>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 bg-[#0C2219] text-white rounded-xl shadow-lg border border-emerald-700/50 active:scale-95 transition-transform lg:hidden cursor-pointer flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-emerald-400" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Side Navigation Bar */}
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} handleLogout={handleLogout} />

      {/* Main Outlet Container */}
      <main className="relative z-10 flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:pl-12 lg:pr-32 py-8 transition-all duration-300">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;