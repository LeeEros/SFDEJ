import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { MediaPorCategoria, getMediaGeralPorCategoria } from '../../services/feedbackService';

const MediaPorCategoriaChart = () => {
    const [chartData, setChartData] = useState<MediaPorCategoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getMediaGeralPorCategoria();
                const sortedData = response.data.sort((a, b) => b.media - a.media);
                setChartData(sortedData);
            } catch (error) {
                console.error("Erro ao buscar dados para o gráfico:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                borderRadius: 2,
                barHeight: '60%',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val.toFixed(1)}`,
            offsetX: 25,
            style: {
                fontSize: '12px',
                colors: ["#fff"]
            }
        },
        xaxis: {
            categories: chartData.map(item => item.categoria),
            min: 0,
            max: 10,
            labels: {
                style: {
                    colors: '#8e8e8e',
                },
            },
            // --- CORREÇÃO APLICADA AQUI ---
            // Força a régua a ter 5 intervalos (0, 2, 4, 6, 8, 10), evitando duplicatas.
            tickAmount: 5,
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#8e8e8e',
                    fontSize: '13px'
                },
            },
        },
        grid: {
            borderColor: '#e7e7e7',
            strokeDashArray: 4,
        },
        tooltip: {
            y: {
                formatter: (val) => `Média: ${val.toFixed(2)}`,
            },
        },
        colors: ['#3C50E0'] // Define uma cor primária para as barras
    };

    const series = [{
        name: 'Média de Notas',
        data: chartData.map(item => item.media),
    }];

    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Média Geral por Categoria de Feedback
            </h3>
            {isLoading ? (
                <p className="dark:text-white">Carregando gráfico...</p>
            ) : chartData.length > 0 ? (
                <ReactApexChart options={options} series={series} type="bar" height={350} />
            ) : (
                <p className="text-gray-500 dark:text-gray-400">Não há dados suficientes para exibir o gráfico.</p>
            )}
        </div>
    );
};

export default MediaPorCategoriaChart;