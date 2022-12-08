import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const Login = lazy(() => import("../Pages/Login"));
const Home = lazy(() => import("../Pages/Home"));
const Signup = lazy(() => import("../Pages/Signup"));
const FavSong = lazy(() => import("../Pages/FavSong"));
const SongsCrud = lazy(() => import("../Pages/SongsCrud"));
const PrivateRoute = lazy(() => import("../Components/PrivateRoute.jsx"));
const Email = lazy(() => import("../Pages/Email.jsx"));
const Reset = lazy(() => import("../Pages/Reset.jsx"));
const AdminRoute = lazy(() => import("../Components/AdminRoute"));
const Songs = lazy(() => import("../Pages/Songs"));
const NotFound = lazy(()=>import("../Components/Not_Found"));

function AllRoutes() {
  return (
    <Suspense fallback={<h1>...Loading</h1>}>
      <Routes>
        <Route path="/login" element={<Login />}></Route>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        ></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/*" element={<NotFound/>}></Route>
        <Route
          path="/favSong"
          element={
            <PrivateRoute>
              <FavSong />
            </PrivateRoute>
          }
        ></Route>
        <Route
          path="/songsCrud"
          element={
            <AdminRoute>
              <SongsCrud />
            </AdminRoute>
          }
        ></Route>
        <Route path="/email" element={<Email />}></Route>
        <Route path="/reset" element={<Reset />}></Route>
        <Route
          path="/songs/:id"
          element={
            <PrivateRoute>
              <Songs />
            </PrivateRoute>
          }
        ></Route>
      </Routes>
    </Suspense>
  );
}

export default AllRoutes;
