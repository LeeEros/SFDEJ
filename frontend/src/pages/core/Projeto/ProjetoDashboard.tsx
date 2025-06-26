import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../../../components/ui/table";
import { TrashBinIcon, PencilIcon, CheckIcon, XMarkIcon } from "../../../icons";

const apiProjeto = "/projetos";
const apiCategoria = "/projetos-categorias";
const apiCliente = "/clientes";

function ProjetoForm({ onSuccess, categorias, clientes }: { onSuccess: () => void, categorias: any[], clientes: any[] }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [status, setStatus] = useState("");
    const [data_assinatura, setDataAssinatura] = useState("");
    const [valor, setValor] = useState("");
    const [fk_categoria, setFkCategoria] = useState<number | null>(null);
    const [fk_cliente, setFkCliente] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const statusOptions = [
        { label: "Negociação", value: "NEGOCIACAO" },
        { label: "Em andamento", value: "EM_ANDAMENTO" },
        { label: "Finalizado", value: "FINALIZADO" },
        { label: "Cancelado", value: "CANCELADO" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiProjeto, {
                nome,
                descricao,
                status,
                data_assinatura,
                valor: Number(valor),
                fk_categoria,
                fk_cliente,
            });
            setNome("");
            setDescricao("");
            setStatus("");
            setDataAssinatura("");
            setValor("");
            setFkCategoria(null);
            setFkCliente(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar projeto");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div>
                    <Label htmlFor="nome" required>Nome</Label>
                    <Input
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Digite o nome do projeto"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="descricao" required>Descrição</Label>
                    <Input
                        id="descricao"
                        name="descricao"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        placeholder="Descrição"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="status" required>Status</Label>
                    <Select
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        placeholder="Selecione"
                        required
                        className="w-full"
                    />
                </div>
                <div>
                    <Label htmlFor="data_assinatura">Data Assinatura</Label>
                    <Input
                        id="data_assinatura"
                        name="data_assinatura"
                        type="date"
                        value={data_assinatura}
                        onChange={e => setDataAssinatura(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                        id="valor"
                        name="valor"
                        type="number"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        placeholder="Valor"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_categoria">Categoria</Label>
                    <Select
                        options={categorias.map(c => ({
                            label: c.categoria,
                            value: c.id_categoria,
                        }))}
                        value={fk_categoria}
                        onChange={val => setFkCategoria(Number(val))}
                        placeholder="Selecione a categoria"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_cliente">Cliente</Label>
                    <Select
                        options={clientes.map(c => ({
                            label: c.nome,
                            value: c.id_cliente,
                        }))}
                        value={fk_cliente}
                        onChange={val => setFkCliente(Number(val))}
                        placeholder="Selecione o cliente"
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

export default function ProjetoDashboard() {
    const [projetos, setProjetos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editDescricao, setEditDescricao] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editDataAssinatura, setEditDataAssinatura] = useState("");
    const [editValor, setEditValor] = useState("");
    const [editFkCategoria, setEditFkCategoria] = useState<number | null>(null);
    const [editFkCliente, setEditFkCliente] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const statusOptions = [
        { label: "Negociação", value: "NEGOCIACAO" },
        { label: "Em andamento", value: "EM_ANDAMENTO" },
        { label: "Finalizado", value: "FINALIZADO" },
        { label: "Cancelado", value: "CANCELADO" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projRes, catRes, cliRes] = await Promise.all([
                api.get(apiProjeto),
                api.get(apiCategoria),
                api.get(apiCliente),
            ]);
            setProjetos(projRes.data);
            setCategorias(catRes.data);
            setClientes(cliRes.data);
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
        await api.delete(`${apiProjeto}/${id}`);
        fetchData();
    };

    const startEdit = (p: any) => {
        setEditId(p.id_projeto);
        setEditNome(p.nome);
        setEditDescricao(p.descricao);
        setEditStatus(p.status);
        setEditDataAssinatura(p.data_assinatura ? p.data_assinatura.slice(0, 10) : "");
        setEditValor(p.valor);
        setEditFkCategoria(p.fk_categoria);
        setEditFkCliente(p.fk_cliente);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNome("");
        setEditDescricao("");
        setEditStatus("");
        setEditDataAssinatura("");
        setEditValor("");
        setEditFkCategoria(null);
        setEditFkCliente(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiProjeto}/${id}`, {
                nome: editNome,
                descricao: editDescricao,
                status: editStatus,
                data_assinatura: editDataAssinatura,
                valor: Number(editValor),
                fk_categoria: editFkCategoria,
                fk_cliente: editFkCliente,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar projeto");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Projeto">
                <ProjetoForm onSuccess={fetchData} categorias={categorias} clientes={clientes} />
            </ComponentCard>
            <ComponentCard title="Projetos Cadastrados">
                {loading ? (
                    <p>Carregando...</p>
                ) : projetos.length === 0 ? (
                    <p className="text-gray-500">Nenhum projeto cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-white">Descrição</TableCell>
                                    <TableCell isHeader className="text-white">Status</TableCell>
                                    <TableCell isHeader className="text-white">Data Assinatura</TableCell>
                                    <TableCell isHeader className="text-white">Valor</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Cliente</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projetos.map((p, idx) => (
                                    <TableRow
                                        key={p.id_projeto}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{p.id_projeto}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input value={editNome} onChange={e => setEditNome(e.target.value)} />
                                            ) : (
                                                p.nome
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
                                            ) : (
                                                p.descricao
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <select
                                                    className="w-full border rounded px-3 py-2"
                                                    value={editStatus}
                                                    onChange={e => setEditStatus(e.target.value)}
                                                >
                                                    <option value="">Selecione</option>
                                                    {statusOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                statusOptions.find(opt => opt.value === p.status)?.label || p.status
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input
                                                    type="date"
                                                    value={editDataAssinatura}
                                                    onChange={e => setEditDataAssinatura(e.target.value)}
                                                />
                                            ) : (
                                                p.data_assinatura ? new Date(p.data_assinatura).toLocaleDateString() : ""
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input
                                                    type="number"
                                                    value={editValor}
                                                    onChange={e => setEditValor(e.target.value)}
                                                />
                                            ) : (
                                                Number(p.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Select
                                                    options={categorias.map(c => ({
                                                        label: c.categoria,
                                                        value: c.id_categoria,
                                                    }))}
                                                    value={editFkCategoria}
                                                    onChange={val => setEditFkCategoria(Number(val))}
                                                />
                                            ) : (
                                                categorias.find(c => c.id_categoria === p.fk_categoria)?.categoria || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Select
                                                    options={clientes.map(c => ({
                                                        label: c.nome,
                                                        value: c.id_cliente,
                                                    }))}
                                                    value={editFkCliente}
                                                    onChange={val => setEditFkCliente(Number(val))}
                                                />
                                            ) : (
                                                clientes.find(c => c.id_cliente === p.fk_cliente)?.nome || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === p.id_projeto ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(p.id_projeto)}
                                                        disabled={editLoading}
                                                        startIcon={<CheckIcon className="size-4" />}
                                                    >
                                                        Salvar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="py-2 px-4 !bg-gray-600 hover:!bg-gray-700 text-white rounded shadow"
                                                        onClick={cancelEdit}
                                                        startIcon={<XMarkIcon className="size-4" />}
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
                                                        onClick={() => startEdit(p)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(p.id_projeto)}
                                                        startIcon={<TrashBinIcon className="size-4" />}
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