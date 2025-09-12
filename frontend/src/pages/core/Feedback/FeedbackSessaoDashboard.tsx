import {
    criarSessaoFeedback,
    deleteSessao,
    getDadosParaFormulario,
    getLinksDaSessao,
    getSessoes,
    updateSessao,
    Categoria,
    Projeto,
    Sessao,
    Usuario,
} from '../../../services/feedbackService';
import Select from '../../../components/form/Select';
import { useState, useEffect } from 'react';
import MultiSelect from '../../../components/form/MultiSelect';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import { useModal } from '../../../hooks/useModal';
import DatePicker from '../../../components/form/date-picker';
import { Link } from 'react-router-dom';
import { PencilIcon, TrashBinIcon } from '../../../icons';

const FeedbackSessaoDashboard: React.FC = () => {
    const [sessoes, setSessoes] = useState<Sessao[]>([]);
    const [isLoadingSessoes, setIsLoadingSessoes] = useState(true);

    const { isOpen: isFormModalOpen, toggleModal: toggleFormModal } = useModal();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoadingFormData, setIsLoadingFormData] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [projetos, setProjetos] = useState<Projeto[]>([]);

    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('');
    const [projetoSelecionado, setProjetoSelecionado] = useState<string>('');
    const [avaliadosSelecionados, setAvaliadosSelecionados] = useState<string[]>([]);
    const [dataFim, setDataFim] = useState<Date | null>(null);

    const [linksVisiveis, setLinksVisiveis] = useState<any[]>([]);
    const { isOpen: isLinksModalOpen, toggleModal: toggleLinksModal } = useModal();

    const carregarSessoes = async () => {
        setIsLoadingSessoes(true);
        try {
            const response = await getSessoes();
            setSessoes(response.data);
        } catch (error) { console.error("Erro ao carregar sessões:", error); }
        finally { setIsLoadingSessoes(false); }
    };

    useEffect(() => {
        carregarSessoes();
    }, []);

    const fetchDropdownData = async () => {
        if (usuarios.length > 0) return;
        setIsLoadingFormData(true);
        setError(null);
        try {
            const { usuarios, categorias, projetos } = await getDadosParaFormulario();
            setUsuarios(usuarios);
            setCategorias(categorias);
            setProjetos(projetos);
        } catch (err) {
            setError("Falha ao carregar dados. Verifique sua autenticação.");
        } finally {
            setIsLoadingFormData(false);
        }
    };

    const resetFormState = () => {
        setEditingId(null);
        setCategoriaSelecionada('');
        setProjetoSelecionado('');
        setAvaliadosSelecionados([]);
        setDataFim(null);
        setError(null);
    };

    const handleOpenCreateModal = () => {
        resetFormState();
        fetchDropdownData();
        toggleFormModal();
    };

    const handleOpenEditModal = async (sessao: Sessao) => {
        resetFormState();
        setEditingId(sessao.id_sessao);
        await fetchDropdownData();

        setCategoriaSelecionada(sessao.fk_fb_categoria?.toString() || '');
        setProjetoSelecionado(sessao.fk_projeto?.toString() || '');
        setDataFim(sessao.data_fim ? new Date(sessao.data_fim) : null);

        try {
            const response = await getLinksDaSessao(sessao.id_sessao);
            const avaliadosIds = response.data
                .map((a: any) => a.avaliado?.id_usuario?.toString())
                .filter(Boolean);
            setAvaliadosSelecionados(avaliadosIds);
        } catch (error) {
            console.error("Erro ao buscar participantes para edição:", error);
            setError("Não foi possível carregar os participantes da sessão.");
        }

        toggleFormModal();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const dataPayload = {
            fk_fb_categoria: categoriaSelecionada ? Number(categoriaSelecionada) : undefined,
            fk_projeto: projetoSelecionado ? Number(projetoSelecionado) : undefined,
            data_fim: dataFim ? dataFim.toISOString() : undefined,
        };

        try {
            if (editingId) {
                await updateSessao(editingId, dataPayload);
            } else {
                if (avaliadosSelecionados.length === 0) {
                    alert("Por favor, selecione pelo menos um usuário para ser avaliado.");
                    return;
                }
                const createData = { ...dataPayload, avaliados: avaliadosSelecionados.map(id => Number(id)) };
                await criarSessaoFeedback(createData);
            }
            toggleFormModal();
            await carregarSessoes();
        } catch (error) {
            alert("Ocorreu um erro ao salvar a sessão.");
        }
    };

    const handleDelete = async (id_sessao: number) => {
        if (!window.confirm("Tem certeza que deseja excluir esta sessão? A ação é irreversível.")) return;
        try {
            await deleteSessao(id_sessao);
            await carregarSessoes();
        } catch (error) {
            alert("Não foi possível excluir a sessão.");
        }
    };

    const handleVerLinks = async (id_sessao: number) => {
        try {
            const response = await getLinksDaSessao(id_sessao);
            setLinksVisiveis(response.data);
            toggleLinksModal();
        } catch (error) {
            alert("Não foi possível carregar os links.");
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sessões de Feedback</h1>
                <div className="mt-4 sm:mt-0">
                    <Button color="primary" onClick={handleOpenCreateModal}>Criar Nova Sessão</Button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contexto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Criada em</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expira em</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avaliados</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoadingSessoes ? (
                            <tr><td colSpan={5} className="text-center p-4 dark:text-white">Carregando...</td></tr>
                        ) : sessoes.length === 0 ? (
                            <tr><td colSpan={5} className="text-center p-4 text-gray-500 dark:text-gray-400">Nenhuma sessão encontrada.</td></tr>
                        ) : (
                            sessoes.map((sessao) => (
                                <tr key={sessao.id_sessao}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sessao.projeto?.nome || sessao.feedback_categoria?.categoria || 'Geral'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(sessao.data_criacao).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sessao.data_fim ? new Date(sessao.data_fim).toLocaleDateString() : 'Não expira'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sessao._count?.avaliados ?? 0}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <Button size="sm" onClick={() => handleVerLinks(sessao.id_sessao)}>Ver Links</Button>
                                            <Link to={`/feedback/relatorio/${sessao.id_sessao}`}><Button size="sm" variant="secondary">Relatório</Button></Link>
                                            <Button size="sm" variant="outline" onClick={() => handleOpenEditModal(sessao)}><PencilIcon className="size-4" /></Button>
                                            <Button size="sm" variant="danger" onClick={() => handleDelete(sessao.id_sessao)}><TrashBinIcon className="size-4" /></Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal title={editingId ? `Editando Sessão #${editingId}` : "Criar Nova Sessão"} isOpen={isFormModalOpen} onClose={toggleFormModal}>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        {isLoadingFormData && <p className="text-center dark:text-white">Carregando...</p>}
                        {error && <p className="text-center text-red-500">{error}</p>}
                        {!isLoadingFormData && !error && (
                            <>
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Categoria (Opcional)</label>
                                    <Select options={categorias.map(c => ({ value: c.id_fb_categoria.toString(), label: c.categoria }))} value={categoriaSelecionada} onChange={value => setCategoriaSelecionada(value)} />
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Projeto (Opcional)</label>
                                    <Select options={projetos.map(p => ({ value: p.id_projeto.toString(), label: p.nome }))} value={projetoSelecionado} onChange={value => setProjetoSelecionado(value)} />
                                </div>
                                <div className="mb-4">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Data de Fim (Opcional)</label>
                                    <DatePicker selected={dataFim} onChange={(date) => setDataFim(date)} />
                                </div>
                                <div className="mb-6">
                                    <MultiSelect label="Usuários Avaliados" options={usuarios.map(u => ({ value: u.id_usuario.toString(), label: u.nome }))} selectedValues={avaliadosSelecionados} onChange={setAvaliadosSelecionados} disabled={!!editingId} />
                                    {editingId && <p className="text-xs text-gray-500 mt-2">A lista de participantes não pode ser alterada na edição.</p>}
                                </div>
                                <Button type="submit" color="primary" className="w-full">{editingId ? 'Salvar Alterações' : 'Criar Sessão'}</Button>
                            </>
                        )}
                    </div>
                </form>
            </Modal>

            <Modal title="Links de Avaliação" isOpen={isLinksModalOpen} onClose={toggleLinksModal}>
                <div className="p-6">
                    <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Copie e distribua os links:</p>
                    <ul className="space-y-3">
                        {linksVisiveis.map(link => (
                            <li key={link.token} className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                                <p className="font-semibold text-gray-900 dark:text-white">{link.avaliado.nome}</p>
                                <input type="text" readOnly value={`${window.location.origin}/feedback/responder/${link.token}`} className="mt-1 w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-sm" onFocus={(e) => e.target.select()} />
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal>
        </div>
    );
};

export default FeedbackSessaoDashboard;