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

const apiCategoria = "/fb-categorias";

export default function FeedbackCategoriaDashboard() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [perfil, setPerfil] = useState("hard_skills");
    const [loading, setLoading] = useState(false);

    // Estados para edição
    const [editId, setEditId] = useState<number | null>(null);
    const [editCategoria, setEditCategoria] = useState("");
    const [editDescricao, setEditDescricao] = useState("");
    const [editPerfil, setEditPerfil] = useState("hard_skills");
    const [editLoading, setEditLoading] = useState(false);

    const fetchCategorias = async () => {
        const { data } = await api.get(apiCategoria);
        setCategorias(data);
    };

    useEffect(() => { fetchCategorias(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiCategoria, {
                categoria,
                descricao_categoria: descricao,
                perfil,
            });
            setCategoria("");
            setDescricao("");
            setPerfil("hard_skills");
            fetchCategorias();
        } catch {
            alert("Erro ao cadastrar categoria de feedback");
        }
        setLoading(false);
    };

    const startEdit = (c: any) => {
        setEditId(c.id_fb_categoria);
        setEditCategoria(c.categoria);
        setEditDescricao(c.descricao_categoria);
        setEditPerfil(c.perfil);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditCategoria("");
        setEditDescricao("");
        setEditPerfil("hard_skills");
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiCategoria}/${id}`, {
                categoria: editCategoria,
                descricao_categoria: editDescricao,
                perfil: editPerfil,
            });
            setEditId(null);
            fetchCategorias();
        } catch {
            alert("Erro ao editar categoria de feedback");
        }
        setEditLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(`${apiCategoria}/${id}`);
        fetchCategorias();
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Categoria de Feedback">
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label required>Categoria</Label>
                            <Input value={categoria} onChange={e => setCategoria(e.target.value)} required />
                        </div>
                        <div>
                            <Label required>Descrição</Label>
                            <Input value={descricao} onChange={e => setDescricao(e.target.value)} required />
                        </div>
                        <div>
                            <Label required>Perfil</Label>
                            <Select
                                options={[
                                    { label: "Hard Skills", value: "hard_skills" },
                                    { label: "Soft Skills", value: "soft_skills" },
                                ]}
                                value={perfil}
                                onChange={setPerfil}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Cadastrar"}</Button>
                    </div>
                </form>
            </ComponentCard>
            <ComponentCard title="Categorias de Feedback Cadastradas">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-brand-500 dark:bg-gray-900">
                                <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                <TableCell isHeader className="text-white">Categoria</TableCell>
                                <TableCell isHeader className="text-white">Descrição</TableCell>
                                <TableCell isHeader className="text-white">Perfil</TableCell>
                                <TableCell isHeader className="text-center text-white">Ações</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categorias.map((c: any, idx: number) => (
                                <TableRow
                                    key={c.id_fb_categoria}
                                    className={`
                                        align-middle
                                        ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                        hover:bg-brand-50 dark:hover:bg-brand-500/10
                                    `}
                                    style={{ minHeight: 56 }}
                                >
                                    <TableCell className="text-center font-semibold text-gray-800 dark:text-white">
                                        {c.id_fb_categoria}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-800 dark:text-white">
                                        {editId === c.id_fb_categoria ? (
                                            <Input value={editCategoria} onChange={e => setEditCategoria(e.target.value)} />
                                        ) : (
                                            c.categoria
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-800 dark:text-white">
                                        {editId === c.id_fb_categoria ? (
                                            <Input value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
                                        ) : (
                                            c.descricao_categoria
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center text-gray-800 dark:text-white">
                                        {editId === c.id_fb_categoria ? (
                                            <Select
                                                options={[
                                                    { label: "Hard Skills", value: "hard_skills" },
                                                    { label: "Soft Skills", value: "soft_skills" },
                                                ]}
                                                value={editPerfil}
                                                onChange={setEditPerfil}
                                            />
                                        ) : (
                                            c.perfil === "hard_skills" ? "Hard Skills" : "Soft Skills"
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center py-3">
                                        {editId === c.id_fb_categoria ? (
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                    onClick={() => handleEditSave(c.id_fb_categoria)}
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
                                                    onClick={() => handleDelete(c.id_fb_categoria)}
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
            </ComponentCard>
        </div>
    );
}