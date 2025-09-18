import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { getUsuarioRadarChart, RadarData } from '../../../services/usuarioService';

interface UserRadarChartProps {
    userId: number;
}

const UserRadarChart: React.FC<UserRadarChartProps> = ({ userId }) => {
    const [chartData, setChartData] = useState<RadarData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            try {
                const response = await getUsuarioRadarChart(userId);
                setChartData(response.data);
            } catch (error) {
                console.error("Erro ao buscar dados para o gráfico:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const options: ApexOptions = {
        chart: {
            type: 'radar',
            toolbar: { show: true },
        },
        xaxis: {
            categories: chartData.map(item => item.categoria),
            labels: {
                style: {
                    colors: '#8e8e8e',
                    fontSize: '14px'
                }
            }
        },
        yaxis: {
            min: 0,
            max: 10,
            tickAmount: 5,
        },
        stroke: {
            width: 2,
        },
        fill: {
            opacity: 0.1,
        },
        markers: {
            size: 4,
        }
    };

    const series = [{
        name: 'Média de Notas',
        data: chartData.map(item => item.media),
    }];

    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Desempenho por Competência
            </h3>
            {isLoading ? (
                <p className="dark:text-white">Carregando gráfico...</p>
            ) : chartData.length > 0 ? (
                <ReactApexChart options={options} series={series} type="radar" height={400} />
            ) : (
                <p className="text-gray-500 dark:text-gray-400">Não há dados de feedback suficientes para gerar o gráfico de desempenho.</p>
            )}
        </div>
    );
};

export default UserRadarChart;