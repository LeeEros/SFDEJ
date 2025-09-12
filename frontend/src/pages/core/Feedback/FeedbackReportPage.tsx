import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRelatorioSessao, RelatorioSessao } from '../../../services/feedbackService';
import Button from '../../../components/ui/button/Button';
import { InfoIcon } from '../../../icons';


const FeedbackReportPage = () => {
    const { id_sessao } = useParams<{ id_sessao: string }>();
    const navigate = useNavigate();

    const [relatorio, setRelatorio] = useState<RelatorioSessao | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatorio = async () => {
            if (!id_sessao) return;
            setIsLoading(true);
            try {
                const response = await getRelatorioSessao(Number(id_sessao));
                setRelatorio(response.data);
            } catch (err) {
                setError("Não foi possível carregar o relatório.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRelatorio();
    }, [id_sessao]);

    if (isLoading) {
        return <div className="text-center p-10 dark:text-white">Carregando relatório...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (!relatorio) {
        return <div className="text-center p-10 dark:text-white">Nenhum dado encontrado para este relatório.</div>;
    }

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Button variant="secondary" onClick={() => navigate(-1)} startIcon={<InfoIcon className="size-4" />}>
                    Voltar
                </Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Relatório da Sessão #{relatorio.id_sessao}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                    <span><strong>Criada em:</strong> {new Date(relatorio.data_criacao).toLocaleString()}</span>
                    <span><strong>Categoria:</strong> {relatorio.categoria}</span>
                    <span><strong>Projeto:</strong> {relatorio.projeto}</span>
                </div>
            </div>

            <div className="space-y-8">
                {relatorio.participantes.map(participante => (
                    <div key={participante.nome_avaliado} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{participante.nome_avaliado}</h2>
                        </div>

                        {participante.status === 'Pendente' ? (
                            <p className="p-5 text-gray-500 dark:text-gray-400">Feedback pendente.</p>
                        ) : (
                            <div className="p-5 space-y-6">
                                {participante.resultados.map(resultado => (
                                    <div key={resultado.id_questao}>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">{resultado.enunciado}</h4>
                                        <p className="text-sm text-primary font-bold my-2 dark:text-brand-300">
                                            Média das Notas: {resultado.media_notas.toFixed(2)} / 10
                                        </p>

                                        {resultado.comentarios.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Comentários:</h5>
                                                <ul className="list-disc list-inside space-y-2 pl-4">
                                                    {resultado.comentarios.map((comentario, i) => (
                                                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 italic">"{comentario}"</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackReportPage;