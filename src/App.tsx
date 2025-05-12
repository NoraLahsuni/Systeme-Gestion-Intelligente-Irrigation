import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectRoute from "./ProtectRoutes/ProtectRoutes";
import DashBoard from "./modules/Dash/DashBoard";
import { AdminProvider, useUserContext } from './context/UserAuth';
import { Loader } from '@mantine/core';
import Home from './modules/LoadingPage/Home';
import MainLayout from './MainLayout/MainLayout';


const AppContent = () => {
  const { loading } = useUserContext();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<ProtectRoute><MainLayout><DashBoard /></MainLayout></ProtectRoute>} />
      </Routes>
    </BrowserRouter>
  );
};


const App = () => {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
};

export default App;