import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/ui/button/Button';
import { getRelatorioUsuario, RelatorioUsuario } from '../../../services/usuarioService';
import { ChevronLeftIcon } from '../../../icons';

const UserFeedbackReportPage = () => {
    const { id_usuario } = useParams<{ id_usuario: string }>();
    const navigate = useNavigate();

    const [relatorio, setRelatorio] = useState<RelatorioUsuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatorio = async () => {
            if (!id_usuario) return;
            setIsLoading(true);
            try {
                const response = await getRelatorioUsuario(Number(id_usuario));
                setRelatorio(response.data);
            } catch (err) {
                setError("Não foi possível carregar o relatório do usuário.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRelatorio();
    }, [id_usuario]);

    if (isLoading) {
        return <div className="text-center p-10 dark:text-white">Carregando relatório...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (!relatorio) {
        return <div className="text-center p-10 dark:text-white">Nenhum dado encontrado.</div>;
    }

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
                <Button variant="secondary" onClick={() => navigate(-1)} startIcon={<ChevronLeftIcon className="size-4" />}>
                    Voltar
                </Button>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Histórico de Feedback de <span className="text-primary">{relatorio.nome_usuario}</span>
                </h1>
            </div>

            {relatorio.historico_feedbacks.length > 0 ? (
                <div className="space-y-8">
                    {relatorio.historico_feedbacks.map((historico, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <div className="p-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{historico.contexto}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Recebido em: {new Date(historico.data_feedback).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="p-5 space-y-6">
                                {historico.resultados.map(resultado => (
                                    <div key={resultado.enunciado}>
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
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <p className="text-gray-500 dark:text-gray-400">Este usuário ainda não recebeu nenhum feedback.</p>
                </div>
            )}
        </div>
    );
};

export default UserFeedbackReportPage;