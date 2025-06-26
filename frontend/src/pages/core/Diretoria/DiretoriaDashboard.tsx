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

const apiDiretoria = "/diretorias";

function DiretoriaForm({ onSuccess }: { onSuccess: () => void }) {
    const [diretoria, setDiretoria] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiDiretoria, { diretoria });
            setDiretoria("");
            onSuccess();
        } catch {
            alert("Erro ao cadastrar diretoria");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                    <Label htmlFor="diretoria" required>Nome da Diretoria</Label>
                    <Input
                        id="diretoria"
                        name="diretoria"
                        value={diretoria}
                        onChange={e => setDiretoria(e.target.value)}
                        placeholder="Digite o nome da diretoria"
                        required
                    />
                </div>
                <div>
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
            </div>
        </form>
    );
}

export default function DiretoriaDashboard() {
    const [diretorias, setDiretorias] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editDiretoria, setEditDiretoria] = useState("");
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiDiretoria);
            setDiretorias(data);
        } catch {
            alert("Erro ao carregar diretorias");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(`${apiDiretoria}/${id}`);
        fetchData();
    };

    const startEdit = (d: any) => {
        setEditId(d.id_diretoria);
        setEditDiretoria(d.diretoria);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditDiretoria("");
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiDiretoria}/${id}`, { diretoria: editDiretoria });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar diretoria");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Diretoria">
                <DiretoriaForm onSuccess={fetchData} />
            </ComponentCard>
            <ComponentCard title="Diretorias Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : diretorias.length === 0 ? (
                    <p className="text-gray-500">Nenhuma diretoria cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Diretoria</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {diretorias.map((d, idx) => (
                                    <TableRow
                                        key={d.id_diretoria}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{d.id_diretoria}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === d.id_diretoria ? (
                                                <Input
                                                    value={editDiretoria}
                                                    onChange={e => setEditDiretoria(e.target.value)}
                                                />
                                            ) : (
                                                d.diretoria
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === d.id_diretoria ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(d.id_diretoria)}
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
                                                        onClick={() => startEdit(d)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(d.id_diretoria)}
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