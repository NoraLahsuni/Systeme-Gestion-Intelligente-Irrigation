import { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Alert } from '@mantine/core';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
interface Mesure {
  id: number;
  temperature: number;
  humidite: number;
  potentiometre: number;
  pompe: boolean;
  timestamp: string;
}
interface ApiResponse {
  status: string;
  donnees: Mesure[];
}

function TemperatureChart() {
    const [mesures, setMesures] = useState<Mesure[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => { 
        try {
            const response = await axios.get(`${import.meta.env.VITE_LIEN_OF_DATA}/api/mesures`);
            setMesures(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
            setError('Erreur lors de la récupération des données');
        }
        };
        fetchData();
        // Fetch new data every 5 minutes
        const interval = setInterval(fetchData, 300000);
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: mesures.map(m => new Date(m.timestamp).toLocaleTimeString('fr-FR')),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: mesures.map(m => m.temperature),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1,
                yAxisID: 'y'
            },
            {
                label: 'Humidity (%)',
                data: mesures.map(m => m.humidite),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.1,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        interaction: {
        mode: 'index' as const,
        intersect: false,
        },
        plugins: {
        tooltip: {
            callbacks: {
            label: (context: any) => {
                const label = context.dataset.label || '';
                const value = context.parsed.y;
                const date = new Date(mesures[context.dataIndex].timestamp).toLocaleString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                return [`${date}`, `${label}: ${value}`];
            }
            }
        },
        title: 
            {
                display: true,
                text: `Temperature & Humidity Monitoring - ${new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`,
            },
        },
        scales: {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                display: true,
                text: 'Temperature (°C)',
            },
        },
        y1: {
            type: 'linear' as const,
            display: true,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
            title: {
                display: true,
                text: 'Humidity (%)',
            },
        },
        },
    };

    return (
        <div className='h-full max-h-[500px]'>
            {error && (
                <Alert color="red" variant="filled" className='text-center'>
                    {error}
                </Alert>
            )}
            <Line options={options} data={chartData} />
        </div>
    );
}

export default TemperatureChart;