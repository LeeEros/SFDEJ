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
import { CheckIcon, PencilIcon, TrashBinIcon, XMarkIcon } from "../../../icons";
import api from "../../../services/api";

const apiSessao = "/feedback-sessao";
const apiCategoria = "/fb-categorias";
const apiProjeto = "/projetos";

function FeedbackSessaoForm({ onSuccess, categorias, projetos }: { onSuccess: () => void, categorias: any[], projetos: any[] }) {
    const [data_criacao, setDataCriacao] = useState("");
    const [status, setStatus] = useState(true);
    const [link_forms, setLinkForms] = useState("");
    const [fk_categoria, setFkCategoria] = useState<number | null>(null);
    const [fk_projeto, setFkProjeto] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiSessao, {
                data_criacao,
                status,
                link_forms,
                fk_categoria,
                fk_projeto,
            });
            setDataCriacao("");
            setStatus(true);
            setLinkForms("");
            setFkCategoria(null);
            setFkProjeto(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar sessão de feedback");
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
                        type="date"
                        value={data_criacao}
                        onChange={e => setDataCriacao(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                        options={[
                            { label: "Ativo", value: "true" },
                            { label: "Inativo", value: "false" },
                        ]}
                        value={status}
                        onChange={val => setStatus(val === "true")}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="link_forms">Link Forms</Label>
                    <Input
                        id="link_forms"
                        name="link_forms"
                        value={link_forms}
                        onChange={e => setLinkForms(e.target.value)}
                        placeholder="Link para o formulário"
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
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [sessaoRes, catRes, projRes] = await Promise.all([
                api.get(apiSessao),
                api.get(apiCategoria),
                api.get(apiProjeto),
            ]);
            setSessoes(sessaoRes.data);
            setCategorias(catRes.data);
            setProjetos(projRes.data);
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
                                    <TableCell isHeader className="text-white">Link Forms</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Projeto</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sessoes.map((s, idx) => (
                                    <TableRow
                                        key={s.id_sessao}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{s.id_sessao}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {new Date(s.data_criacao).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {s.status ? "Ativo" : "Inativo"}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {s.link_forms || "—"}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {categorias.find(c => c.id_fb_categoria === s.fk_fb_categoria)?.categoria || "—"}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {projetos.find(p => p.id_projeto === s.fk_projeto)?.nome || "—"}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                onClick={() => handleDelete(s.id_sessao)}
                                                startIcon={<TrashBinIcon className="size-4" />}
                                            >
                                                Excluir
                                            </Button>
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