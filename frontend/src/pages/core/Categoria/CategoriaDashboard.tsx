import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../../../components/ui/table";
import { TrashBinIcon, PencilIcon, CheckIcon, XMarkIcon } from "../../../icons";

const apiCategoria = "/projetos-categorias";

function CategoriaForm({ onSuccess }: { onSuccess: () => void }) {
    const [categoria, setCategoria] = useState("");
    const [complexidade, setComplexidade] = useState("");
    const [comentario, setComentario] = useState("");
    const [loading, setLoading] = useState(false);

    const niveis = [
        { label: "N1", value: "N1" },
        { label: "N2", value: "N2" },
        { label: "N3", value: "N3" },
        { label: "N4", value: "N4" },
        { label: "N5", value: "N5" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiCategoria, {
                categoria,
                complexidade,
                comentario_complexidade: comentario,
            });
            setCategoria("");
            setComplexidade("");
            setComentario("");
            onSuccess();
        } catch {
            alert("Erro ao cadastrar categoria");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                        id="categoria"
                        name="categoria"
                        value={categoria}
                        onChange={e => setCategoria(e.target.value)}
                        placeholder="Digite a categoria"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="complexidade">Complexidade</Label>
                    <select
                        id="complexidade"
                        name="complexidade"
                        className="w-full border rounded px-3 py-2"
                        value={complexidade}
                        onChange={e => setComplexidade(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        {niveis.map(n => (
                            <option key={n.value} value={n.value}>{n.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <Label htmlFor="comentario">Comentário</Label>
                    <Input
                        id="comentario"
                        name="comentario"
                        value={comentario}
                        onChange={e => setComentario(e.target.value)}
                        placeholder="Comentário (opcional)"
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

export default function CategoriaDashboard() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editCategoria, setEditCategoria] = useState("");
    const [editComplexidade, setEditComplexidade] = useState("");
    const [editComentario, setEditComentario] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiCategoria);
            setCategorias(data);
        } catch {
            alert("Erro ao carregar categorias");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(`${apiCategoria}/${id}`);
        fetchData();
    };

    const startEdit = (c: any) => {
        setEditId(c.id_categoria);
        setEditCategoria(c.categoria);
        setEditComplexidade(c.complexidade);
        setEditComentario(c.comentario_complexidade || "");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditCategoria("");
        setEditComplexidade("");
        setEditComentario("");
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiCategoria}/${id}`, {
                categoria: editCategoria,
                complexidade: editComplexidade,
                comentario_complexidade: editComentario,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar categoria");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Categoria">
                <CategoriaForm onSuccess={fetchData} />
            </ComponentCard>
            <ComponentCard title="Categorias Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : categorias.length === 0 ? (
                    <p className="text-gray-500">Nenhuma categoria cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Complexidade</TableCell>
                                    <TableCell isHeader className="text-white">Comentário</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categorias.map((c, idx) => (
                                    <TableRow
                                        key={c.id_categoria}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{c.id_categoria}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_categoria ? (
                                                <Input value={editCategoria} onChange={e => setEditCategoria(e.target.value)} />
                                            ) : (
                                                c.categoria
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_categoria ? (
                                                <select
                                                    className="w-full border rounded px-3 py-2"
                                                    value={editComplexidade}
                                                    onChange={e => setEditComplexidade(e.target.value)}
                                                >
                                                    <option value="">Selecione</option>
                                                    {["N1", "N2", "N3", "N4", "N5"].map(n => (
                                                        <option key={n} value={n}>{n}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                c.complexidade
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === c.id_categoria ? (
                                                <Input value={editComentario} onChange={e => setEditComentario(e.target.value)} />
                                            ) : (
                                                c.comentario_complexidade
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === c.id_categoria ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(c.id_categoria)}
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
                                                        onClick={() => handleDelete(c.id_categoria)}
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