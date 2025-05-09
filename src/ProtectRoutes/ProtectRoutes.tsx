import { Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserAuth';
import { Loader } from '@mantine/core';


const ProtectRoute = ({ children }: { children: React.ReactNode }) => {
    const { user , loading } = useUserContext();
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <Loader />
            </div>
        );
    }
    return user ? children : <Navigate to="/" />;
};

export default ProtectRoute;
