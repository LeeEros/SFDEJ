import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../components/ui/button/Button';
import { FormularioData, getFormularioPublico, Resposta, enviarRespostas } from '../../../services/api';


const PublicFeedbackForm = () => {
    const { token } = useParams<{ token: string }>();
    const [formData, setFormData] = useState<FormularioData | null>(null);
    const [respostas, setRespostas] = useState<Record<number, { nota: number; comentario: string }>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchFormData = async () => {
            if (!token) {
                setError("Token de avaliação inválido.");
                setIsLoading(false);
                return;
            }
            try {
                const response = await getFormularioPublico(token);
                setFormData(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || "Erro ao carregar o formulário. O link pode ser inválido ou ter expirado.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchFormData();
    }, [token]);

    const handleInputChange = (id_questao: number, nota: number, comentario: string) => {
        setRespostas(prev => ({
            ...prev,
            [id_questao]: { nota, comentario },
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!token) return;

        const respostasArray: Resposta[] = Object.entries(respostas).map(([id_questao, dados]) => ({
            fk_fb_questao: Number(id_questao),
            nota: dados.nota,
            comentario: dados.comentario,
        }));

        if (respostasArray.length !== formData?.questoes.length) {
            alert("Por favor, responda todas as perguntas.");
            return;
        }

        setIsSubmitting(true);
        try {
            await enviarRespostas(token, respostasArray);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao enviar o feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900"><p className="dark:text-white">Carregando formulário...</p></div>;
    }

    if (isSuccess) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                    <h1 className="text-2xl font-bold text-primary mb-4">Feedback Enviado!</h1>
                    <p className="text-gray-900 dark:text-white">Obrigado pela sua contribuição.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-4">
            <div className="mx-auto max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">{error}</div>}

                {formData && !error && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Formulário de Feedback</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                                Você está avaliando: <span className="font-semibold text-primary">{formData.nome_avaliado}</span>
                            </p>
                        </div>

                        {formData.questoes.map((questao, index) => (
                            <div key={questao.id_questao} className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {index + 1}. {questao.enunciado}
                                </label>

                                <div className="flex justify-center items-center gap-2 mb-4">
                                    {[...Array(10)].map((_, i) => {
                                        const nota = i + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={nota}
                                                onClick={() => handleInputChange(questao.id_questao, nota, respostas[questao.id_questao]?.comentario || '')}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${respostas[questao.id_questao]?.nota === nota
                                                    ? 'bg-primary text-white scale-110'
                                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-primary/80'
                                                    }`}
                                            >
                                                {nota}
                                            </button>
                                        )
                                    })}
                                </div>

                                <textarea
                                    placeholder="Adicione um comentário (opcional)"
                                    onChange={(e) => handleInputChange(questao.id_questao, respostas[questao.id_questao]?.nota || 0, e.target.value)}
                                    className="w-full mt-4 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        ))}

                        <Button type="submit" color="primary" className="w-full text-lg" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Feedback'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PublicFeedbackForm;