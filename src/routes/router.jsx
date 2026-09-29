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
        ],
      },
    ],
  },
]);
