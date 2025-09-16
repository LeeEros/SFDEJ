import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { CheckIcon, DocsIcon, PencilIcon, TrashBinIcon, XMarkIcon } from "../../../icons";
import api from "../../../services/api";

const apiUsuario = "/usuarios";

interface Usuario {
    id_usuario: number;
    nome: string;
    email: string;
    telefone: string;
    permissao: string;
    ativo: boolean;
}

function UsuarioForm({ onSuccess }: { onSuccess: () => void }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiUsuario, { nome, email, telefone, senha, ativo: true, permissao: "USUARIO" });
            setNome("");
            setEmail("");
            setTelefone("");
            setSenha("");
            onSuccess();
        } catch {
            alert("Erro ao cadastrar usuário");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <Label htmlFor="nome" required>Nome</Label>
                    <Input id="nome" name="nome" value={nome} onChange={e => setNome(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="email" required>Email</Label>
                    <Input id="email" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="telefone" required>Telefone</Label>
                    <Input id="telefone" name="telefone" value={telefone} onChange={e => setTelefone(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="senha" required>Senha</Label>
                    <Input id="senha" name="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit" size="md" variant="primary" className="w-full md:w-auto" disabled={loading}>
                    {loading ? "Salvando..." : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}

export default function UsuarioDashboard() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState({ nome: "", email: "", telefone: "" });
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiUsuario);
            setUsuarios(data);
        } catch {
            alert("Erro ao carregar usuários");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover este usuário?")) return;
        try {
            await api.delete(`${apiUsuario}/${id}`);
            fetchData();
        } catch {
            alert("Erro ao excluir o usuário");
        }
    };

    const startEdit = (u: Usuario) => {
        setEditId(u.id_usuario);
        setEditData({ nome: u.nome, email: u.email, telefone: u.telefone });
    };

    const cancelEdit = () => {
        setEditId(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiUsuario}/${id}`, editData);
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar usuário");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Usuário">
                <UsuarioForm onSuccess={fetchData} />
            </ComponentCard>
            <ComponentCard title="Usuários Cadastrados">
                {loading ? (
                    <p className="dark:text-white">Carregando...</p>
                ) : usuarios.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400">Nenhum usuário cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-white">Email</TableCell>
                                    <TableCell isHeader className="text-white">Telefone</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usuarios.map((u, idx) => (
                                    <TableRow
                                        key={u.id_usuario}
                                        className={`${idx % 2 === 0 ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-700"} hover:bg-brand-50 dark:hover:bg-brand-500/10`}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{u.id_usuario}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === u.id_usuario ? (<Input value={editData.nome} onChange={e => setEditData({ ...editData, nome: e.target.value })} />) : (u.nome)}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === u.id_usuario ? (<Input value={editData.email} onChange={e => setEditData({ ...editData, email: e.target.value })} />) : (u.email)}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === u.id_usuario ? (<Input value={editData.telefone} onChange={e => setEditData({ ...editData, telefone: e.target.value })} />) : (u.telefone)}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            <div className="flex justify-center gap-2">
                                                {editId === u.id_usuario ? (
                                                    <>
                                                        <Button size="sm" variant="success" onClick={() => handleEditSave(u.id_usuario)} disabled={editLoading} startIcon={<CheckIcon className="size-4" />}>Salvar</Button>
                                                        <Button size="sm" variant="secondary" onClick={cancelEdit} startIcon={<XMarkIcon className="size-4" />}>Cancelar</Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button size="sm" variant="primary" onClick={() => startEdit(u)} startIcon={<PencilIcon className="size-4" />}>Editar</Button>
                                                        <Button size="sm" variant="danger" onClick={() => handleDelete(u.id_usuario)} startIcon={<TrashBinIcon className="size-4" />}>Excluir</Button>
                                                        <Link to={`/usuarios/relatorio/${u.id_usuario}`}>
                                                            <Button size="sm" variant="outline" startIcon={<DocsIcon className="size-4" />}>Feedbacks</Button>
                                                        </Link>
                                                    </>
                                                )}
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