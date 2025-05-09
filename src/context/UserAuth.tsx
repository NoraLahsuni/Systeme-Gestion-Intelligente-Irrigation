import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

interface UserContextType {
    user: any;
    setUser: (user: any) => void;
    loading: boolean;
    fetchUserData: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {},
    loading: true,
    fetchUserData: async () => {}
});

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const fetchUserData = async () => {
        const token = Cookies.get('token');
        if (token) {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACK_END}/api/validate-token`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUser(response.data.userData);
            } catch (error) {
                setUser(null); 
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);


    return (
        <UserContext.Provider value={{ user, setUser, loading, fetchUserData}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);