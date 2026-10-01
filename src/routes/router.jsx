import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Users from "../pages/Users/Users";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoute";
import AddResearch from "../pages/AddResearch/AddResearch";
import AllResearch from "../pages/AllResearch/AllResearch";
import AllExperience from "../pages/AllExperience/AllExperience";
import AddExperience from "../pages/AddExperience/AddExperience";
import AddDevelopment from "../pages/AddDevelopment/AddDevelopment";
import AllDevelopment from "../pages/AllDevelopment/AllDevelopment";
import AddAcademic from "../pages/AddAcademic/AddAcademic";
import AllAcademic from "../pages/AllAcademic/AllAcademic";
import AddSkills from "../pages/AddSkills/AddSkills";
import AllSkills from "../pages/AllSkills/AllSkills";
import AddHonorsNAwards from "../pages/AddHonorsNAwards/AddHonorsNAwards";
import AllHonorsNAwards from "../pages/AllHonorsNAwards/AllHonorsNAwards";
import AddVoluntaryWork from "../pages/AddVoluntaryWork/AddVoluntaryWork";
import AllVoluntaryWork from "../pages/AllVoluntaryWork/AllVoluntaryWork";
import AddGallery from "../pages/AddGallery/AddGallery";
import AllGallery from "../pages/AllGallery/AllGallery";
import AddReferences from "../pages/AddReferences/AddReferences";
import AllReferences from "../pages/AllReferences/AllReferences";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/admin/all-users" replace />,
          },
          {
            path: "admin/all-users",
            element: <Users />,
          },
          {
            path: "research/add", 
            element: <AddResearch/>
          },
          {
            path: "research/all", 
            element: <AllResearch/>
          },
          {
            path: "/experience/add", 
            element: <AddExperience/>
          },
          {
            path: "/experience/all", 
            element: <AllExperience/>
          },
          {
            path: "/development/add", 
            element: <AddDevelopment/>
          },
          {
            path: "/development/all", 
            element: <AllDevelopment/>
          },
          {
            path: "/academics/add", 
            element: <AddAcademic/>
          },
          {
            path: "/academics/all", 
            element: <AllAcademic/>
          },
          {
            path: "/skills/add", 
            element: <AddSkills/>
          },
          {
            path: "/skills/all", 
            element: <AllSkills/>
          },
          {
            path: "/awards/add", 
            element: <AddHonorsNAwards/>
          },
          {
            path: "/awards/all", 
            element: <AllHonorsNAwards/>
          },
          {
            path: "/voluntary-work/add", 
            element: <AddVoluntaryWork/>
          },
          {
            path: "/voluntary-work/all", 
            element: <AllVoluntaryWork/>
          },
          {
            path: "/gallery/add", 
            element: <AddGallery/>
          },
          {
            path: "/gallery/all", 
            element: <AllGallery/>
          },
          {
            path: "/referees/add", 
            element: <AddReferences/>
          },
          {
            path: "/referees/all", 
            element: <AllReferences/>
          },
        ],
      },
    ],
  },
]);
