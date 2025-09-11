import {
    criarSessaoFeedback,
    getDadosParaFormulario,
    Usuario,
    Categoria,
    Projeto,
} from '../../../services/feedbackService';
import Select from '../../../components/form/Select';
import { useState, useEffect } from 'react';
import MultiSelect from '../../../components/form/MultiSelect';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import { useModal } from '../../../hooks/useModal';
import DatePicker from '../../../components/form/date-picker';

const FeedbackSessaoDashboard: React.FC = () => {
    const { isOpen: isCriacaoModalOpen, toggleModal: toggleCriacaoModal } = useModal();

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [projetos, setProjetos] = useState<Projeto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
    const [projetoSelecionado, setProjetoSelecionado] = useState<string>('');
    const [avaliadosSelecionados, setAvaliadosSelecionados] = useState<string[]>([]);
    const [dataFim, setDataFim] = useState<Date | null>(null);

    const [linksGerados, setLinksGerados] = useState<any[]>([]);
    const { isOpen: isLinksModalOpen, toggleModal: toggleLinksModal } = useModal();

    useEffect(() => {
        if (isCriacaoModalOpen) {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const { usuarios, categorias, projetos } = await getDadosParaFormulario();
                    setUsuarios(usuarios);
                    setCategorias(categorias);
                    setProjetos(projetos);
                } catch (err) {
                    setError("Falha ao carregar dados. Verifique se você está autenticado.");
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }
    }, [isCriacaoModalOpen]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (avaliadosSelecionados.length === 0) {
            alert("Por favor, selecione pelo menos um usuário para ser avaliado.");
            return;
        }

        try {
            const data = {
                fk_fb_categoria: categoriaSelecionada ? Number(categoriaSelecionada) : undefined,
                fk_projeto: projetoSelecionado ? Number(projetoSelecionado) : undefined,
                avaliados: avaliadosSelecionados.map(id => Number(id)),
                data_fim: dataFim ? dataFim.toISOString() : undefined,
            };

            const response = await criarSessaoFeedback(data);

            setLinksGerados(response.data.avaliados);
            toggleCriacaoModal();
            toggleLinksModal();

            setCategoriaSelecionada('');
            setProjetoSelecionado('');
            setAvaliadosSelecionados([]);
            setDataFim(null);

        } catch (error) {
            console.error("Erro ao criar sessão:", error);
            alert("Ocorreu um erro ao criar a sessão. Verifique o console para mais detalhes.");
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sessões de Feedback
                </h1>
                <div className="mt-4 sm:mt-0">
                    <Button color="primary" onClick={toggleCriacaoModal}>
                        Criar Nova Sessão
                    </Button>
                </div>
            </div>

            <Modal
                title="Criar Nova Sessão de Feedback"
                isOpen={isCriacaoModalOpen}
                onClose={toggleCriacaoModal}
            >
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {isLoading && <p className="text-center dark:text-white">Carregando...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}

                        {!isLoading && !error && (
                            <>
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Categoria (Opcional)
                                    </label>
                                    <Select
                                        options={categorias.map(c => ({ value: c.id_fb_categoria.toString(), label: c.categoria }))}
                                        value={categoriaSelecionada}
                                        onChange={value => setCategoriaSelecionada(value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Projeto (Opcional)
                                    </label>
                                    <Select
                                        options={projetos.map(p => ({ value: p.id_projeto.toString(), label: p.nome }))}
                                        value={projetoSelecionado}
                                        onChange={value => setProjetoSelecionado(value)}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Data de Fim (Opcional)
                                    </label>
                                    <DatePicker
                                        selected={dataFim}
                                        onChange={(date) => setDataFim(date)}
                                    />
                                </div>

                                <div className="mb-6">
                                    <MultiSelect
                                        label="Selecione os Usuários a Serem Avaliados"
                                        options={usuarios.map(u => ({ value: u.id_usuario.toString(), label: u.nome }))}
                                        selectedValues={avaliadosSelecionados}
                                        onChange={setAvaliadosSelecionados}
                                    />
                                </div>

                                <Button type="submit" color="primary" className="w-full">
                                    Criar Sessão e Gerar Links
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </Modal>

            <Modal
                title="Links Gerados com Sucesso!"
                isOpen={isLinksModalOpen}
                onClose={toggleLinksModal}
            >
                <div className="p-6">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                        Copie e distribua os links abaixo para os avaliadores:
                    </p>
                    <ul className="space-y-3">
                        {linksGerados.map(link => (
                            <li key={link.token} className="p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                                <p className="font-semibold text-gray-900 dark:text-white">{link.avaliado.nome}</p>
                                <input
                                    type="text"
                                    readOnly
                                    value={`${window.location.origin}/feedback/responder/${link.token}`}
                                    className="mt-1 w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200"
                                    onFocus={(e) => e.target.select()}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

export default FeedbackSessaoDashboard;