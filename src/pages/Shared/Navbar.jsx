import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Award,
  Trophy,
  Briefcase,
  History,
  Wrench,
  Boxes,
  BookOpen,
  Library,
  GraduationCap,
  School,
  Presentation,
  MonitorPlay,
  Image,
  FolderKanban,
  UserCheck,
  Contact,
  LogOut,
  UserGroup,
  UserRoundKey,
  FolderPlus,
  FolderGit2
} from "lucide-react";
import useAuth from "../../hook/useAuth";

const Navbar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const navItems = [
    { id: "users", label: "Users", icon: Users, path: "/admin/all-users" },
    { id: "add-membership", label: "Add Research", icon: UserGroup, path: "/research/add" },
    { id: "all-membership", label: "Manage Research", icon: UserRoundKey, path: "/research/all" },
        { id: "add-experience", label: "Add Experience", icon: Briefcase, path: "/experience/add" },
    { id: "all-experience", label: "All Experience", icon: History, path: "/experience/all" },
    { id: "add-award", label: "Add Development", icon: Award, path: "/development/add" },
    { id: "all-award", label: "All Development", icon: Trophy, path: "/development/all" },
    { id: "add-project-supervision", label: "Add Academic", icon: FolderPlus, path: "/academics/add" },
    { id: "all-project-supervision", label: "All Academic", icon: FolderGit2, path: "/academics/all" },
    { id: "add-tools", label: "Add Skills", icon: Wrench, path: "/skills/add" },
    { id: "all-tools", label: "All Skills", icon: Boxes, path: "/skills/all" },
    { id: "add-courses", label: "Add Courses", icon: GraduationCap, path: "/courses/add" },
    { id: "all-courses", label: "All Courses", icon: School, path: "/courses/all" },
    { id: "add-academic", label: "Add Academic", icon: GraduationCap, path: "/academic/add" },
    { id: "all-academics", label: "All Academics", icon: School, path: "/academic/all" },
    { id: "add-workshops", label: "Add Workshops", icon: Presentation, path: "/workshops/add" },
    { id: "all-workshops", label: "All Workshops", icon: MonitorPlay, path: "/workshops/all" },
    { id: "add-gallery", label: "Add Gallery", icon: Image, path: "/gallery/add" },
    { id: "all-gallery", label: "All Gallery", icon: FolderKanban, path: "/gallery/all" },
    { id: "add-referees", label: "Add Referees", icon: UserCheck, path: "/referees/add" },
    { id: "all-referees", label: "All Referees", icon: Contact, path: "/referees/all" },
  ];

  const onLogoutClick = async () => {
    setIsOpen(false);
    try {
      queryClient.clear();
      if (logout) {
        await logout();
      }
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* SIDE NAVIGATION */}
      <aside
        className={`
          fixed z-50 transition-all duration-300 ease-in-out
          top-20 right-4 left-4 flex flex-col p-3
          bg-white/90 backdrop-blur-2xl border border-emerald-100/90 rounded-3xl shadow-2xl shadow-emerald-950/10 gap-1.5 
          max-h-[75vh] overflow-y-auto

          /* LARGE SCREEN ADJUSTMENTS */
          lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:right-4 lg:w-auto lg:items-end lg:gap-1.5 lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:backdrop-blur-none 
          lg:max-h-[calc(100vh-2rem)] lg:pr-1 lg:py-2
          
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden

          ${
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none lg:opacity-100 lg:scale-100 lg:pointer-events-auto"
          }
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center transition-all duration-200 ease-in-out w-full lg:w-auto

                ${
                  isActive
                    ? `bg-gradient-to-r from-emerald-800 to-[#163A2D] text-amber-300 font-semibold px-3.5 py-2 lg:py-2 lg:px-3.5 rounded-2xl border border-emerald-700/50 shadow-lg shadow-emerald-900/20 justify-start lg:justify-center`
                    : `text-slate-700 hover:text-emerald-900 hover:bg-emerald-50/80 p-2.5 lg:p-2 lg:px-3 rounded-2xl lg:bg-white/80 lg:border lg:border-slate-200/80 lg:backdrop-blur-xl lg:shadow-sm justify-start lg:justify-center`
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] shrink-0 transition-colors duration-200 ${
                      isActive ? "text-amber-400 stroke-[2.5]" : "text-slate-600 group-hover:text-emerald-700 stroke-2"
                    }`}
                  />

                  {/* Responsive Label */}
                  <span
                    className={`ml-3 text-sm whitespace-nowrap tracking-wide font-medium ${
                      isActive ? "inline-block text-amber-300 font-bold" : "inline-block lg:hidden text-slate-800"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Desktop Hover Tooltip */}
                  {!isActive && (
                    <span className="hidden lg:block absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-[#163A2D] text-amber-300 text-xs py-1.5 px-3 rounded-xl border border-emerald-700/50 whitespace-nowrap shadow-xl font-medium">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* LOGOUT BUTTON */}
        <button
          onClick={onLogoutClick}
          className="group relative flex items-center transition-all duration-200 ease-in-out w-full lg:w-auto p-2.5 lg:p-2 lg:px-3 rounded-2xl text-rose-600 hover:text-rose-700 hover:bg-rose-50/80 lg:bg-white/80 lg:border lg:border-slate-200/80 lg:backdrop-blur-xl lg:shadow-sm justify-start lg:justify-center cursor-pointer mt-1"
        >
          <LogOut className="w-4 h-4 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] shrink-0 text-rose-500 stroke-2 group-hover:text-rose-600 transition-colors" />

          <span className="ml-3 text-sm whitespace-nowrap tracking-wide font-bold text-rose-600 inline-block lg:hidden">
            Logout
          </span>

          <span className="hidden lg:block absolute right-12 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-rose-950 text-rose-200 text-xs py-1.5 px-3 rounded-xl border border-rose-800/50 whitespace-nowrap shadow-xl font-semibold">
            Logout
          </span>
        </button>
      </aside>
    </>
  );
};

export default Navbar;