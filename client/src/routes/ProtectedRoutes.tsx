import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import DashboardLayout from "../components/DashBoardLayout";
import { PluginProvider } from "../plugin-system/PluginContext";



const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route
         path="/dashboard"
        element={
          <PrivateRoute>
            <PluginProvider>

          <DashboardLayout />      
            </PluginProvider>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default ProtectedRoutes;
