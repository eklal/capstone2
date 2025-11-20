import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import Sample from "@/pages/Sample";
import RegisterTrainer from "@/pages/RegisterTrainer";

// Define a type for route objects
interface AppRoute {
  path: string;
  element: React.ReactElement; 
}

// Central route definitions
const appRoutes: AppRoute[] = [
  { path: "/", element: <Dashboard/>},
  { path:'/login', element:<Login/>},
  { path:'/register/trainer', element:<RegisterTrainer/>},
  {path:"/find-trainers" ,element:<Sample />},
  {path:"/how-it-works" ,element:<Sample />},
  {path:"/become-trainer" ,element:<Sample />},
  {path:"/trainer/:id" ,element:<Sample />}
];

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
