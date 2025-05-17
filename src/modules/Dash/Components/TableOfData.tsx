import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, ScrollArea } from '@mantine/core';

interface Mesure {
  id: number;
  temperature: number;
  humidite: number;
  humidite2: number;
  pompe: boolean;
  timestamp: string;
}


function TableOfData() {
    const [mesures, setMesures] = useState<Mesure[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => { 
            try {
                const response = await axios.get(`${import.meta.env.VITE_LIEN_OF_DATA}/api/mesures`);
                setMesures(response?.data);
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

    const rows = mesures.map((mesure) => (
        <Table.Tr key={mesure.id}>
            <Table.Td className='text-nowrap py-1 text-center'>{new Date(mesure.timestamp).toLocaleString('fr-FR' , {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })}
            </Table.Td>
            <Table.Td className='text-center'>{mesure.temperature}°C</Table.Td>
            <Table.Td className='text-center'>{mesure.humidite}%</Table.Td>
            <Table.Td className='text-center'>{mesure.pompe ? 'Active' : 'Inactive'}</Table.Td>
            <Table.Td className='text-center'>{mesure.humidite2}%</Table.Td>
        </Table.Tr>
    ));

    return (
        <div className='h-full'>
            {error && (
                <Alert color="red" variant="filled" className='text-center mb-4'>
                    {error}
                </Alert>
            )}
            <ScrollArea>
                <Table striped highlightOnHover withColumnBorders>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className='p-1 text-center'>Date et Heure</Table.Th>
                            <Table.Th className='p-1 text-center'>Température</Table.Th>
                            <Table.Th className='p-1 text-center'>Humidité de Sol</Table.Th>
                            <Table.Th className='p-1 text-center'>État Pompe</Table.Th>
                            <Table.Th className='p-1 text-center'>Humidité</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </ScrollArea>
        </div>
    );
}

export default TableOfData;