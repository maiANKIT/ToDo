import { Routes, Route } from "react-router-dom";

import Login          from "./pages/Login/Login";
import Signup         from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Dashboard      from "./pages/Dashboard/Dashboard";
import Home           from "./pages/Home/Home";
import Profile        from "./pages/Profile/Profile";
import Calendar       from "./pages/Calendar/Calendar";
import Collaboration  from "./pages/Collaboration/Collaboration";
import TodayTasks     from "./pages/TodayTasks/TodayTasks";
import StarredTasks   from "./pages/StarredTasks/StarredTasks";
import Features       from "./pages/Features/Features";
import NotFound       from "./pages/NotFound/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import OfflineScreen from "./components/OfflineScreen/OfflineScreen";
import useOnlineStatus from "./hooks/useOnlineStatus";

function App() {
  const isOnline = useOnlineStatus();

  return (
    <>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/calendar"      element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
        <Route path="/collaboration" element={<ProtectedRoute><Collaboration /></ProtectedRoute>} />
        <Route path="/today"         element={<ProtectedRoute><TodayTasks /></ProtectedRoute>} />
        <Route path="/starred"       element={<ProtectedRoute><StarredTasks /></ProtectedRoute>} />
        <Route path="/features"      element={<ProtectedRoute><Features /></ProtectedRoute>} />

        {/* Catch-all: any unmatched URL shows the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isOnline && <OfflineScreen onRetry={() => window.location.reload()} />}
    </>
  );
}

export default App;