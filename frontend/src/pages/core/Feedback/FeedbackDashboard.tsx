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

const apiFeedback = "/feedback";
const apiCategoria = "/projetos-categorias";
const apiProjeto = "/projetos";
const apiUsuario = "/usuarios";

function FeedbackForm({ onSuccess, categorias, projetos, usuarios }: { onSuccess: () => void, categorias: any[], projetos: any[], usuarios: any[] }) {
    const [resultado_media, setResultadoMedia] = useState("");
    const [data_realizacao, setDataRealizacao] = useState("");
    const [comentario, setComentario] = useState("");
    const [media, setMedia] = useState("");
    const [tipo_avaliador, setTipoAvaliador] = useState("");
    const [fk_categoria, setFkCategoria] = useState<number | null>(null);
    const [fk_projeto, setFkProjeto] = useState<number | null>(null);
    const [fk_usuario_avaliado, setFkUsuarioAvaliado] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const tipoAvaliadorOptions = [
        { label: "Interno", value: "INTERNO" },
        { label: "Externo", value: "EXTERNO" },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiFeedback, {
                resultado_media: Number(resultado_media),
                data_realizacao,
                comentario,
                media: Number(media),
                tipo_avaliador,
                fk_categoria,
                fk_projeto,
                fk_usuario_avaliado,
            });
            setResultadoMedia("");
            setDataRealizacao("");
            setComentario("");
            setMedia("");
            setTipoAvaliador("");
            setFkCategoria(null);
            setFkProjeto(null);
            setFkUsuarioAvaliado(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar feedback");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <Label htmlFor="resultado_media">Resultado Média</Label>
                    <Input
                        id="resultado_media"
                        name="resultado_media"
                        type="number"
                        value={resultado_media}
                        onChange={e => setResultadoMedia(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="media">Média</Label>
                    <Input
                        id="media"
                        name="media"
                        type="number"
                        value={media}
                        onChange={e => setMedia(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="data_realizacao">Data</Label>
                    <Input
                        id="data_realizacao"
                        name="data_realizacao"
                        type="date"
                        value={data_realizacao}
                        onChange={e => setDataRealizacao(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="tipo_avaliador">Tipo Avaliador</Label>
                    <Select
                        options={tipoAvaliadorOptions}
                        value={tipo_avaliador}
                        onChange={setTipoAvaliador}
                        placeholder="Selecione"
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
                <div>
                    <Label htmlFor="fk_usuario_avaliado">Usuário Avaliado</Label>
                    <Select
                        options={usuarios.map(u => ({
                            label: u.nome,
                            value: u.id_usuario,
                        }))}
                        value={fk_usuario_avaliado}
                        onChange={val => setFkUsuarioAvaliado(Number(val))}
                        placeholder="Selecione"
                    />
                </div>
                <div className="md:col-span-2">
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

export default function FeedbackDashboard() {
    const [feedbacks, setFeedbacks] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [projetos, setProjetos] = useState<any[]>([]);
    const [usuarios, setUsuarios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editResultadoMedia, setEditResultadoMedia] = useState("");
    const [editMedia, setEditMedia] = useState("");
    const [editDataRealizacao, setEditDataRealizacao] = useState("");
    const [editComentario, setEditComentario] = useState("");
    const [editTipoAvaliador, setEditTipoAvaliador] = useState("");
    const [editFkCategoria, setEditFkCategoria] = useState<number | null>(null);
    const [editFkProjeto, setEditFkProjeto] = useState<number | null>(null);
    const [editFkUsuarioAvaliado, setEditFkUsuarioAvaliado] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const tipoAvaliadorOptions = [
        { label: "Interno", value: "INTERNO" },
        { label: "Externo", value: "EXTERNO" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [fbRes, catRes, projRes, usuRes] = await Promise.all([
                api.get(apiFeedback),
                api.get(apiCategoria),
                api.get(apiProjeto),
                api.get(apiUsuario),
            ]);
            setFeedbacks(fbRes.data);
            setCategorias(catRes.data);
            setProjetos(projRes.data);
            setUsuarios(usuRes.data);
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
        await api.delete(`${apiFeedback}/${id}`);
        fetchData();
    };

    const startEdit = (f: any) => {
        setEditId(f.id_feedback);
        setEditResultadoMedia(f.resultado_media);
        setEditMedia(f.media);
        setEditDataRealizacao(f.data_realizacao ? f.data_realizacao.slice(0, 10) : "");
        setEditComentario(f.comentario || "");
        setEditTipoAvaliador(f.tipo_avaliador);
        setEditFkCategoria(f.fk_categoria);
        setEditFkProjeto(f.fk_projeto);
        setEditFkUsuarioAvaliado(f.fk_usuario_avaliado);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditResultadoMedia("");
        setEditMedia("");
        setEditDataRealizacao("");
        setEditComentario("");
        setEditTipoAvaliador("");
        setEditFkCategoria(null);
        setEditFkProjeto(null);
        setEditFkUsuarioAvaliado(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiFeedback}/${id}`, {
                resultado_media: Number(editResultadoMedia),
                media: Number(editMedia),
                data_realizacao: editDataRealizacao,
                comentario: editComentario,
                tipo_avaliador: editTipoAvaliador,
                fk_categoria: editFkCategoria,
                fk_projeto: editFkProjeto,
                fk_usuario_avaliado: editFkUsuarioAvaliado,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar feedback");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Feedback">
                <FeedbackForm
                    onSuccess={fetchData}
                    categorias={categorias}
                    projetos={projetos}
                    usuarios={usuarios}
                />
            </ComponentCard>
            <ComponentCard title="Feedbacks Cadastrados">
                {loading ? (
                    <p>Carregando...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-gray-500">Nenhum feedback cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Resultado Média</TableCell>
                                    <TableCell isHeader className="text-white">Média</TableCell>
                                    <TableCell isHeader className="text-white">Data</TableCell>
                                    <TableCell isHeader className="text-white">Tipo Avaliador</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Projeto</TableCell>
                                    <TableCell isHeader className="text-white">Usuário Avaliado</TableCell>
                                    <TableCell isHeader className="text-white">Comentário</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedbacks.map((f, idx) => (
                                    <TableRow
                                        key={f.id_feedback}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{f.id_feedback}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Input type="number" value={editResultadoMedia} onChange={e => setEditResultadoMedia(e.target.value)} />
                                            ) : (
                                                f.resultado_media
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Input type="number" value={editMedia} onChange={e => setEditMedia(e.target.value)} />
                                            ) : (
                                                f.media
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Input type="date" value={editDataRealizacao} onChange={e => setEditDataRealizacao(e.target.value)} />
                                            ) : (
                                                f.data_realizacao ? new Date(f.data_realizacao).toLocaleDateString() : ""
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Select
                                                    options={tipoAvaliadorOptions}
                                                    value={editTipoAvaliador}
                                                    onChange={setEditTipoAvaliador}
                                                />
                                            ) : (
                                                tipoAvaliadorOptions.find(opt => opt.value === f.tipo_avaliador)?.label || f.tipo_avaliador
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Select
                                                    options={categorias.map(c => ({
                                                        label: c.categoria,
                                                        value: c.id_categoria,
                                                    }))}
                                                    value={editFkCategoria}
                                                    onChange={val => setEditFkCategoria(Number(val))}
                                                />
                                            ) : (
                                                categorias.find(c => c.id_categoria === f.fk_categoria)?.categoria || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Select
                                                    options={projetos.map(p => ({
                                                        label: p.nome,
                                                        value: p.id_projeto,
                                                    }))}
                                                    value={editFkProjeto}
                                                    onChange={val => setEditFkProjeto(Number(val))}
                                                />
                                            ) : (
                                                projetos.find(p => p.id_projeto === f.fk_projeto)?.nome || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Select
                                                    options={usuarios.map(u => ({
                                                        label: u.nome,
                                                        value: u.id_usuario,
                                                    }))}
                                                    value={editFkUsuarioAvaliado}
                                                    onChange={val => setEditFkUsuarioAvaliado(Number(val))}
                                                />
                                            ) : (
                                                usuarios.find(u => u.id_usuario === f.fk_usuario_avaliado)?.nome || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_feedback ? (
                                                <Input value={editComentario} onChange={e => setEditComentario(e.target.value)} />
                                            ) : (
                                                f.comentario
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === f.id_feedback ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(f.id_feedback)}
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
                                                        onClick={() => startEdit(f)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(f.id_feedback)}
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