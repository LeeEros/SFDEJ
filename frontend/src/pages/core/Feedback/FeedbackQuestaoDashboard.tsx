import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { PencilIcon, TrashBinIcon, CheckIcon, XMarkIcon } from "../../../icons";

const apiQuestao = "/fb-questoes";
const apiCategoria = "/fb-categorias";

export default function FeedbackQuestaoDashboard() {
    const [questoes, setQuestoes] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [enunciado, setEnunciado] = useState("");
    const [comentario, setComentario] = useState("");
    const [fk_fb_categoria, setFkFbCategoria] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const [editId, setEditId] = useState<number | null>(null);
    const [editEnunciado, setEditEnunciado] = useState("");
    const [editFkFbCategoria, setEditFkFbCategoria] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        const [qRes, cRes] = await Promise.all([
            api.get(apiQuestao),
            api.get(apiCategoria),
        ]);
        setQuestoes(qRes.data);
        setCategorias(cRes.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!fk_fb_categoria) {
                alert("Selecione uma categoria.");
                setLoading(false);
                return;
            }
            await api.post(apiQuestao, {
                enunciado,
                comentario,
                fk_fb_categoria,
            });
            setEnunciado("");
            setComentario("");
            setFkFbCategoria(null);
            fetchData();
        } catch {
            alert("Erro ao cadastrar questão");
        }
        setLoading(false);
    };

    const startEdit = (questao: any) => {
        setEditId(questao.id_questao);
        setEditEnunciado(questao.enunciado);
        setEditFkFbCategoria(questao.fk_fb_categoria);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditEnunciado("");
        setEditFkFbCategoria(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiQuestao}/${id}`, {
                enunciado: editEnunciado,
                fk_fb_categoria: editFkFbCategoria,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar questão");
        }
        setEditLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover esta questão?")) return;
        try {
            await api.delete(`${apiQuestao}/${id}`);
            fetchData();
        } catch {
            alert("Erro ao excluir questão");
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Questão de Feedback">
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label className="dark:text-white">Enunciado</Label>
                            <Input value={enunciado} onChange={e => setEnunciado(e.target.value)} required />
                        </div>
                        <div>
                            <Label className="dark:text-white">Comentário</Label>
                            <Input value={comentario} onChange={e => setComentario(e.target.value)} />
                        </div>
                        <div>
                            <Label className="dark:text-white">Categoria</Label>
                            <Select
                                options={categorias.map(c => ({
                                    label: c.categoria,
                                    value: c.id_fb_categoria,
                                }))}
                                value={fk_fb_categoria}
                                onChange={val => setFkFbCategoria(Number(val))}
                                placeholder="Selecione"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Cadastrar"}</Button>
                    </div>
                </form>
            </ComponentCard>
            <ComponentCard title="Questões de Feedback Cadastradas">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-brand-500 dark:bg-gray-900">
                                <TableCell isHeader className="px-2 py-1 text-white">ID</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Enunciado</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Categoria</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white text-center">Ações</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questoes.map((q: any, idx: number) => (
                                <TableRow
                                    key={q.id_questao}
                                    className={`
                                        ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                        hover:bg-brand-50 dark:hover:bg-brand-500/10
                                    `}
                                >
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{q.id_questao}</TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">
                                        {editId === q.id_questao ? (
                                            <Input value={editEnunciado} onChange={e => setEditEnunciado(e.target.value)} />
                                        ) : (
                                            q.enunciado
                                        )}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">
                                        {editId === q.id_questao ? (
                                            <Select
                                                options={categorias.map(c => ({
                                                    label: c.categoria,
                                                    value: c.id_fb_categoria,
                                                }))}
                                                value={editFkFbCategoria}
                                                onChange={val => setEditFkFbCategoria(Number(val))}
                                            />
                                        ) : (
                                            categorias.find(c => c.id_fb_categoria === q.fk_fb_categoria)?.categoria || "—"
                                        )}
                                    </TableCell>
                                    <TableCell className="px-2 py-1 text-center">
                                        {editId === q.id_questao ? (
                                            <div className="flex justify-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="success"
                                                    className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                    onClick={() => handleEditSave(q.id_questao)}
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
                                                    onClick={() => startEdit(q)}
                                                    startIcon={<PencilIcon className="size-4" />}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                    onClick={() => handleDelete(q.id_questao)}
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