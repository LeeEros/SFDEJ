import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { TrashBinIcon, PencilIcon, CheckIcon, XMarkIcon } from "../../../icons";
import api from "../../../services/api";

const apiSessao = "/feedback";
const apiCategoria = "/fb-categorias";
const apiProjeto = "/projetos";
const apiUsuarios = "/usuarios";

const converterDataBRparaISO = (dataBR: string): string | null => {
    if (!dataBR) return null;

    try {
        const partes = dataBR.split('/');
        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes;
        if (dia.length !== 2 || mes.length !== 2 || ano.length !== 4) return null;

        const diaNum = parseInt(dia, 10);
        const mesNum = parseInt(mes, 10);
        const anoNum = parseInt(ano, 10);

        if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) return null;
        if (mesNum < 1 || mesNum > 12) return null;
        if (diaNum < 1 || diaNum > 31) return null;

        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } catch {
        return null;
    }
};

function FeedbackSessaoForm({ onSuccess, categorias, projetos, usuarios }: { onSuccess: () => void, categorias: any[], projetos: any[], usuarios: any[] }) {
    const [data_criacao, setDataCriacao] = useState("");
    const [data_fim, setDataFim] = useState("");
    const [status, setStatus] = useState(true);
    const [fk_categoria, setFkCategoria] = useState<number | null>(null);
    const [fk_projeto, setFkProjeto] = useState<number | null>(null);
    const [avaliados, setAvaliados] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const dataCriacaoISO = converterDataBRparaISO(data_criacao);
        const dataFimISO = converterDataBRparaISO(data_fim);

        if (!dataCriacaoISO) {
            alert("Data de criação inválida.");
            setLoading(false);
            return;
        }

        try {
            const { data: sessao } = await api.post(apiSessao, {
                data_criacao: dataCriacaoISO,
                data_fim: dataFimISO,
                status,
                fk_categoria,
                fk_projeto,
                avaliados,
            });
            alert(`Sessão criada com sucesso! Links gerados para ${avaliados.length} usuários.`);
            setDataCriacao("");
            setDataFim("");
            setStatus(true);
            setFkCategoria(null);
            setFkProjeto(null);
            setAvaliados([]);
            onSuccess();
        } catch (error: any) {
            console.error(error);
            if (error.response?.data?.issues) {
                const issues = error.response.data.issues;
                if (issues.data_criacao?._errors) {
                    alert(`Erro na data de criação: ${issues.data_criacao._errors.join(", ")}`);
                }
                if (issues.fk_projeto?._errors) {
                    alert(`Erro no projeto: ${issues.fk_projeto._errors.join(", ")}`);
                }
            } else {
                alert("Erro ao cadastrar sessão de feedback");
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <Label htmlFor="data_criacao">Data Criação</Label>
                    <Input
                        id="data_criacao"
                        name="data_criacao"
                        type="text"
                        value={data_criacao}
                        onChange={e => setDataCriacao(e.target.value)}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="data_fim">Data Fim</Label>
                    <Input
                        id="data_fim"
                        name="data_fim"
                        type="text"
                        value={data_fim}
                        onChange={e => setDataFim(e.target.value)}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                    />
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        options={[
                            { label: "Ativo", value: true },
                            { label: "Inativo", value: false },
                        ]}
                        value={status}
                        onChange={val => setStatus(val === "true")}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_categoria">Categoria</Label>
                    <Select
                        options={categorias.map(c => ({
                            label: c.categoria,
                            value: c.id_fb_categoria,
                        }))}
                        value={fk_categoria}
                        onChange={val => setFkCategoria(Number(val))}
                        placeholder="Selecione"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_projeto">Projeto</Label>
                    <Select
                        options={projetos.map(p => ({
                            label: p.nome,
                            value: p.id_projeto,
                        }))}
                        value={fk_projeto}
                        onChange={val => setFkProjeto(Number(val))}
                        placeholder="Selecione"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="avaliados">Usuários Avaliados</Label>
                    <Select
                        options={usuarios.map(u => ({
                            label: u.nome,
                            value: u.id_usuario,
                        }))}
                        value={avaliados}
                        onChange={val => setAvaliados(val)}
                        isMulti
                        placeholder="Selecione os usuários"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button
                    type="submit"
                    size="md"
                    variant="primary"
                    className="w-full md:w-auto"
                    disabled={loading}
                >
                    {loading ? "Salvando..." : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}

export default function FeedbackSessaoDashboard() {
    const [sessoes, setSessoes] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [projetos, setProjetos] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [editId, setEditId] = useState<number | null>(null);
    const [editDataCriacao, setEditDataCriacao] = useState("");
    const [editDataFim, setEditDataFim] = useState("");
    const [editStatus, setEditStatus] = useState(true);
    const [editFkCategoria, setEditFkCategoria] = useState<number | null>(null);
    const [editFkProjeto, setEditFkProjeto] = useState<number | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessaoRes, catRes, projRes, userRes] = await Promise.all([
                api.get(apiSessao),
                api.get(apiCategoria),
                api.get(apiProjeto),
                api.get(apiUsuarios),
            ]);
            setSessoes(sessaoRes.data);
            setCategorias(catRes.data);
            setProjetos(projRes.data);
            setUsuarios(userRes.data);
        } catch {
            alert("Erro ao carregar dados");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(`${apiSessao}/${id}`);
        fetchData();
    };

    const startEdit = (sessao: any) => {
        setEditId(sessao.id_sessao);
        setEditDataCriacao(sessao.data_criacao ? new Date(sessao.data_criacao).toLocaleDateString("pt-BR") : "");
        setEditDataFim(sessao.data_fim ? new Date(sessao.data_fim).toLocaleDateString("pt-BR") : "");
        setEditStatus(sessao.status);
        setEditFkCategoria(sessao.fk_categoria);
        setEditFkProjeto(sessao.fk_projeto);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditDataCriacao("");
        setEditDataFim("");
        setEditStatus(true);
        setEditFkCategoria(null);
        setEditFkProjeto(null);
    };

    const handleEditSave = async (id: number) => {
        try {
            const dataCriacaoISO = converterDataBRparaISO(editDataCriacao);
            const dataFimISO = editDataFim ? converterDataBRparaISO(editDataFim) : null;

            if (!dataCriacaoISO) {
                alert("Data de criação inválida.");
                return;
            }

            await api.put(`${apiSessao}/${id}`, {
                data_criacao: dataCriacaoISO,
                data_fim: dataFimISO,
                status: editStatus,
                fk_categoria: editFkCategoria || undefined,
                fk_projeto: editFkProjeto || undefined,
            });

            setEditId(null);
            fetchData();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar alterações.");
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Sessão de Feedback">
                <FeedbackSessaoForm
                    onSuccess={fetchData}
                    categorias={categorias}
                    projetos={projetos}
                    usuarios={usuarios}
                />
            </ComponentCard>
            <ComponentCard title="Sessões de Feedback Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : sessoes.length === 0 ? (
                    <p className="text-gray-500">Nenhuma sessão cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Data Criação</TableCell>
                                    <TableCell isHeader className="text-white">Data Fim</TableCell>
                                    <TableCell isHeader className="text-white">Status</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Projeto</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessoes.map((s: any, idx: number) => (
                                    <TableRow
                                        key={s.id_sessao}
                                        className={`
                                            align-middle
                                            ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                            hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">
                                            {s.id_sessao}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === s.id_sessao ? (
                                                <Input
                                                    value={editDataCriacao}
                                                    onChange={e => setEditDataCriacao(e.target.value)}
                                                    placeholder="dd/mm/aaaa"
                                                />
                                            ) : (
                                                new Date(s.data_criacao).toLocaleDateString()
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === s.id_sessao ? (
                                                <Input
                                                    value={editDataFim}
                                                    onChange={e => setEditDataFim(e.target.value)}
                                                    placeholder="dd/mm/aaaa"
                                                />
                                            ) : (
                                                s.data_fim ? new Date(s.data_fim).toLocaleDateString() : "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === s.id_sessao ? (
                                                <Select
                                                    options={[
                                                        { label: "Ativo", value: true },
                                                        { label: "Inativo", value: false },
                                                    ]}
                                                    value={editStatus}
                                                    onChange={val => setEditStatus(val === "true")}
                                                />
                                            ) : (
                                                s.status ? "Ativo" : "Inativo"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === s.id_sessao ? (
                                                <Select
                                                    options={categorias.map(c => ({
                                                        label: c.categoria,
                                                        value: c.id_fb_categoria,
                                                    }))}
                                                    value={editFkCategoria}
                                                    onChange={val => setEditFkCategoria(Number(val))}
                                                />
                                            ) : (
                                                s.categoria?.categoria || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === s.id_sessao ? (
                                                <Select
                                                    options={projetos.map(p => ({
                                                        label: p.nome,
                                                        value: p.id_projeto,
                                                    }))}
                                                    value={editFkProjeto}
                                                    onChange={val => setEditFkProjeto(Number(val))}
                                                />
                                            ) : (
                                                s.projeto?.nome || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {editId === s.id_sessao ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(s.id_sessao)}
                                                        startIcon={<CheckIcon />}
                                                    >
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="py-2 px-4 !bg-gray-600 hover:!bg-gray-700 text-white rounded shadow"
                                                        onClick={cancelEdit}
                                                        startIcon={<XMarkIcon />}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded shadow"
                                                        onClick={() => startEdit(s)}
                                                        startIcon={<PencilIcon />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(s.id_sessao)}
                                                        startIcon={<TrashBinIcon />}
                                                    >
                                                        Excluir
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </ComponentCard>
        </div>
    );
}