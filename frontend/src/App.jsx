import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Calendar from "./pages/Calendar/Calendar";
import Collaboration from "./pages/Collaboration/Collaboration";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/calendar"      element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;