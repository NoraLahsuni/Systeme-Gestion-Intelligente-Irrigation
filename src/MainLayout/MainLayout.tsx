import React from 'react'
import logo from '../assests/SmartIrrigation.png'
import { Button } from '@mantine/core'
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const MainLayout = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate()
  return (
    <>
        <div className='flex flex-col min-h-[100dvh] bg-gray-50'>
            <header>
                <div className='flex justify-between items-center p-1 border-b border-gray-300'>
                    <img src={logo} alt="logo" width={30} height={30} className='scale-350 mt-0.5'/>
                    <Button
                        variant='outline'
                        color='red'
                        leftSection={<LogOut size={16} />}
                        onClick={()=>{
                            Cookies.remove('token')
                            navigate('/')
                        }}
                    >
                        Déconnexion
                    </Button>
                </div>
            </header>
            <main>
                {children}
            </main>
        </div>
    </>
  )
}

export default MainLayout