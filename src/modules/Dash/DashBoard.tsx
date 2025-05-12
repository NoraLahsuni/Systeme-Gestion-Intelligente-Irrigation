import { Thermometer , Waves ,Droplets  } from 'lucide-react';

const DashBoard = () => {
  return (
    <>
        <div className='flex flex-col justify-start items-start mt-1 px-1'>
            <h1 className='text-2xl font-bold'>Tableau de bord</h1>
            <p className='text-gray-500'>Bienvenue sur le tableau de bord</p>
        </div>

        <div className='flex justify-center items-center mt-2'>
            <p className='text-gray-600'>
                Dernière mise à jour : 12 mai 2025 à 12:00
            </p>
        </div>


        <div className='w-full mx-auto max-w-5xl 
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 p-1'
        >
            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                   <Thermometer size={20} className='mr-0.5' /> Température
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    25°C
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Température actuelle
                </p>
            </div>

            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                    <Waves size={20} className='mr-0.5' /> Humidité
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    50%
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Humidité actuelle
                </p>
            </div>

            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                    <Droplets size={20} className='mr-0.5' /> Pompe
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    <span className='text-green-500'>
                        OFF
                    </span>
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Pompe Etat
                </p>
            </div>

        </div>


        
    
    

    </>
  )
}

export default DashBoard