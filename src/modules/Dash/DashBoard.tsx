import { Thermometer , Waves ,Droplets , Earth   } from 'lucide-react';
import { useEffect, useState  } from 'react';
import axios from 'axios';
import {Alert} from '@mantine/core';
import DateCharts from './Components/DateCharts';
import TableOfData from './Components/TableOfData';

const DashBoard = () => {
    const [lastTemperature, setLastTemperature] = useState(0);
    const [lastHumiditeSol, setLastHumiditeSol] = useState(0);
    const [lastHumidite, setLastHumidite] = useState(0);
    const [lastPompe, setLastPompe] = useState<number>(0);
    const [lastTimestamp, setLastTimestamp] = useState('');
    const[error, setError] = useState('');

   const [mesures, setMesures] = useState([]);

    //get all data from the backend
    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await axios.get(`${import.meta.env.VITE_LIEN_OF_DATA}/api/mesures`);
                const data = response.data;
                setMesures(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
            }
        };
        fetchData();
    }, []);

    //get the last data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_LIEN_OF_DATA}/api/mesures/last`);
                if (response.data) {
                    const data = response.data;
                    setLastTemperature(data.temperature || 0);
                    setLastHumidite(data.humidite2 || 0); 
                    setLastHumiditeSol(data.humidite || 0); 
                    setLastPompe(Number(data.pompe));
                    setLastTimestamp(data.timestamp || '');
                } else {
                    console.error('No data received from API');
                    setError('Aucune donnée reçue de l\'API');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError('Erreur lors de la récupération des données');
                setLastTemperature(0);
                setLastHumidite(0);
                setLastPompe(0);
                setLastTimestamp('');
            }
        };
        fetchData();
        
        // Fetch new data every 5 seconds
        const interval = setInterval(fetchData, 5000);
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);
    

  return (
    <>
        <div className='flex flex-col justify-start items-start mt-1 px-1'>
            <h1 className='text-2xl font-bold'>Tableau de bord</h1>
            <p className='text-gray-500'>Bienvenue sur le tableau de bord</p>
        </div>


       <div className='w-full mx-auto max-w-2xl mt-2 mb-1'>
            {error && (
                <Alert color="red" variant="filled">
                    {error}
                </Alert>
            )}
       </div>

        <div className='flex justify-center items-center'>
            <p className='text-gray-600 text-sm text-center'>
                Dernière mise à jour : { new Date(lastTimestamp).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                })}
            </p>
        </div>

        <div className='w-full mx-auto max-w-7xl 
            grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-1 p-1'
        >
            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                   <Thermometer size={20} className='mr-0.5' /> Température
                </h2>
                <p className='text-4xl font-bold text-center mt-1'>
                    <span className={`${lastTemperature > 25 ? 'text-red-500' : 'text-blue-500'}`}>
                        {Number(lastTemperature).toFixed(2)} °C
                    </span>
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Température actuelle
                </p>
            </div>

            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                    <Waves size={20} className='mr-0.5' /> Humidité de Sol
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    <span className={`${lastHumidite > 50 ? 'text-red-500' : 'text-blue-500'}`}>
                        {lastHumiditeSol} %
                    </span>
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Humidité actuelle de Sol
                </p>
            </div>

            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                    <Droplets size={20} className='mr-0.5' /> Pompe
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    <span className={`text-${lastPompe === 1 ? 'green' : 'red'}-500`}>
                        {lastPompe === 1 ? 'ON' : 'OFF'}
                    </span>
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Pompe Etat
                </p>
            </div>
            <div className='flex flex-col border border-gray-300 rounded-lg p-1 bg-white'>
                <h2 className='text-xl font-[600] flex items-center'>
                    <Earth  size={20} className='mr-0.5' /> Humidité de air
                </h2>
                <p className='text-4xl font-bold text-center mt-1 text-blue-500'>
                    <span className={`${lastHumidite > 50 ? 'text-red-500' : 'text-blue-500'}`}>
                        {lastHumidite} %
                    </span>
                </p>
                <p className='text-gray-500 text-center text-sm'>
                    Humidité actuelle de air
                </p>
            </div>
        </div>

        <div className='p-1'>
            <div className='w-full mx-auto max-w-5xl my-4 py-3 px-1 bg-white rounded-lg'>
                <DateCharts />
            </div>
        </div>

        <div className='mb-3 p-1'>
            <div className='bg-white rounded-lg w-full mx-auto max-w-7xl'>
                <TableOfData/>
            </div>
        </div>
    </>
  )
}

export default DashBoard