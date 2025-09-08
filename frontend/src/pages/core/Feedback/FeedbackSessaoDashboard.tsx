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
import { TrashBinIcon } from "../../../icons";
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
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {new Date(s.data_criacao).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {s.status ? "Ativo" : "Inativo"}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {s.categoria?.categoria || "—"}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {s.projeto?.nome || "—"}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-2">
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