import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";

// Define a type for route objects
interface AppRoute {
  path: string;
  element: React.ReactElement; 
}

// Central route definitions
const appRoutes: AppRoute[] = [
  { path: "/", element: <Login/>},
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
