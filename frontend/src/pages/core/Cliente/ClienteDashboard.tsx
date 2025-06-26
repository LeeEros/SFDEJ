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

const apiCliente = "/clientes";

function ClienteForm({ onSuccess, enderecos }: { onSuccess: () => void, enderecos: any[] }) {
    const [nome, setNome] = useState("");
    const [CNPJ, setCNPJ] = useState("");
    const [CPF, setCPF] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [fk_endereco, setFkEndereco] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiCliente, {
                nome,
                CNPJ: CNPJ || undefined,
                CPF: CPF || undefined,
                email,
                telefone,
                fk_endereco,
            });
            setNome("");
            setCNPJ("");
            setCPF("");
            setEmail("");
            setTelefone("");
            setFkEndereco(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar cliente");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Digite o nome"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="CNPJ">CNPJ</Label>
                    <Input
                        id="CNPJ"
                        name="CNPJ"
                        value={CNPJ}
                        onChange={e => setCNPJ(e.target.value)}
                        placeholder="CNPJ (opcional)"
                        maxLength={14}
                    />
                </div>
                <div>
                    <Label htmlFor="CPF">CPF</Label>
                    <Input
                        id="CPF"
                        name="CPF"
                        value={CPF}
                        onChange={e => setCPF(e.target.value)}
                        placeholder="CPF (opcional)"
                        maxLength={14}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Digite o email"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                        id="telefone"
                        name="telefone"
                        value={telefone}
                        onChange={e => setTelefone(e.target.value)}
                        placeholder="Digite o telefone"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_endereco">Endereço</Label>
                    <Select
                        options={enderecos.map(e => ({
                            label: `${e.endereco}, ${e.numero} - ${e.cidade}/${e.estado}`,
                            value: e.id_endereco,
                        }))}
                        value={fk_endereco}
                        onChange={val => setFkEndereco(Number(val))}
                        placeholder="Selecione o endereço"
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

export default function ClienteDashboard() {
    const [clientes, setClientes] = useState<any[]>([]);
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editCNPJ, setEditCNPJ] = useState("");
    const [editCPF, setEditCPF] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editTelefone, setEditTelefone] = useState("");
    const [editFkEndereco, setEditFkEndereco] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [cliRes, endRes] = await Promise.all([
                api.get(apiCliente),
                api.get("/enderecos"),
            ]);
            setClientes(cliRes.data);
            setEnderecos(endRes.data);
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
        await api.delete(`${apiCliente}/${id}`);
        fetchData();
    };

    const startEdit = (c: any) => {
        setEditId(c.id_cliente);
        setEditNome(c.nome);
        setEditCNPJ(c.CNPJ || "");
        setEditCPF(c.CPF || "");
        setEditEmail(c.email);
        setEditTelefone(c.telefone);
        setEditFkEndereco(c.fk_endereco);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNome("");
        setEditCNPJ("");
        setEditCPF("");
        setEditEmail("");
        setEditTelefone("");
        setEditFkEndereco(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiCliente}/${id}`, {
                nome: editNome,
                CNPJ: editCNPJ || undefined,
                CPF: editCPF || undefined,
                email: editEmail,
                telefone: editTelefone,
                fk_endereco: editFkEndereco,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar cliente");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Cliente">
                <ClienteForm onSuccess={fetchData} enderecos={enderecos} />
            </ComponentCard>
            <ComponentCard title="Clientes Cadastrados">
                {loading ? (
                    <p>Carregando...</p>
                ) : clientes.length === 0 ? (
                    <p className="text-gray-500">Nenhum cliente cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-white">CNPJ</TableCell>
                                    <TableCell isHeader className="text-white">CPF</TableCell>
                                    <TableCell isHeader className="text-white">Email</TableCell>
                                    <TableCell isHeader className="text-white">Telefone</TableCell>
                                    <TableCell isHeader className="text-white">Endereço</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clientes.map((c, idx) => (
                                    <TableRow
                                        key={c.id_cliente}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{c.id_cliente}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Input value={editNome} onChange={e => setEditNome(e.target.value)} />
                                            ) : (
                                                c.nome
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Input value={editCNPJ} onChange={e => setEditCNPJ(e.target.value)} />
                                            ) : (
                                                c.CNPJ
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Input value={editCPF} onChange={e => setEditCPF(e.target.value)} />
                                            ) : (
                                                c.CPF
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
                                            ) : (
                                                c.email
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Input value={editTelefone} onChange={e => setEditTelefone(e.target.value)} />
                                            ) : (
                                                c.telefone
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_cliente ? (
                                                <Select
                                                    options={enderecos.map(e => ({
                                                        label: `${e.endereco}, ${e.numero} - ${e.cidade}/${e.estado}`,
                                                        value: e.id_endereco,
                                                    }))}
                                                    value={editFkEndereco}
                                                    onChange={val => setEditFkEndereco(Number(val))}
                                                />
                                            ) : (
                                                (() => {
                                                    const end = enderecos.find(e => e.id_endereco === c.fk_endereco);
                                                    return end
                                                        ? `${end.endereco}, ${end.numero} - ${end.cidade}/${end.estado}`
                                                        : "—";
                                                })()
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === c.id_cliente ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(c.id_cliente)}
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
                                                        onClick={() => startEdit(c)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(c.id_cliente)}
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