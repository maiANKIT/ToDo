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
import InvitePage     from "./pages/InvitePage/InvitePage";
import NotFound       from "./pages/NotFound/NotFound";

import ProtectedRoute from "./routes/ProtectedRoute";
import OfflineScreen from "./components/OfflineScreen/OfflineScreen";
import useOnlineStatus from "./hooks/useOnlineStatus";
import { WorkspaceProvider } from "./context/WorkspaceContext";
import AppLayout from "./components/Layout/AppLayout";

function App() {
  const isOnline = useOnlineStatus();

  return (
    <WorkspaceProvider>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/calendar"
          element={<ProtectedRoute><AppLayout><Calendar /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/collaboration"
          element={<ProtectedRoute><AppLayout><Collaboration /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/today"
          element={<ProtectedRoute><AppLayout><TodayTasks /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/starred"
          element={<ProtectedRoute><AppLayout><StarredTasks /></AppLayout></ProtectedRoute>}
        />
        <Route
          path="/features"
          element={<ProtectedRoute><AppLayout><Features /></AppLayout></ProtectedRoute>}
        />

        <Route path="/invite/:token" element={<InvitePage />} />

        {/* Catch-all: any unmatched URL shows the 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isOnline && <OfflineScreen onRetry={() => window.location.reload()} />}
    </WorkspaceProvider>
  );
}

export default App;