import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { RelatorioUsuario } from '../../../services/usuarioService';

interface DesempenhoIndividualChartProps {
    historico_feedbacks: RelatorioUsuario['historico_feedbacks'];
}

const DesempenhoIndividualChart = ({ historico_feedbacks }: DesempenhoIndividualChartProps) => {

    const feedbacksOrdenados = [...historico_feedbacks].sort((a, b) =>
        new Date(a.data_feedback).getTime() - new Date(b.data_feedback).getTime()
    );

    const series: ApexAxisChartSeries = [];
    const categories: string[] = [];

    const dadosPorEnunciado: { [enunciado: string]: { data: number[], datas: string[] } } = {};

    feedbacksOrdenados.forEach(historico => {
        historico.resultados.forEach(resultado => {
            if (!dadosPorEnunciado[resultado.enunciado]) {
                dadosPorEnunciado[resultado.enunciado] = { data: [], datas: [] };
            }
            dadosPorEnunciado[resultado.enunciado].data.push(resultado.media_notas);
            dadosPorEnunciado[resultado.enunciado].datas.push(new Date(historico.data_feedback).toLocaleDateString());
        });
    });

    for (const enunciado in dadosPorEnunciado) {
        series.push({
            name: enunciado,
            data: dadosPorEnunciado[enunciado].data,
        });
    }

    if (series.length > 0) {
        categories.push(...dadosPorEnunciado[series[0].name as string].datas);
    }

    const options: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: true,
            },
        },
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth',
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: '#8e8e8e',
                },
            },
        },
        yaxis: {
            min: 0,
            max: 10,
            tickAmount: 5,
            labels: {
                style: {
                    colors: '#8e8e8e',
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val) => `Média: ${val.toFixed(2)}`,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            floating: true,
            offsetY: -25,
            offsetX: -5
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Evolução do Desempenho
            </h3>
            {series.length > 0 ? (
                <ReactApexChart options={options} series={series} type="line" height={350} />
            ) : (
                <p className="text-gray-500 dark:text-gray-400">Não há dados suficientes para exibir o gráfico de evolução.</p>
            )}
        </div>
    );
};

export default DesempenhoIndividualChart;