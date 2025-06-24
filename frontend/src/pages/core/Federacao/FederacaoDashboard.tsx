import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import Button from "../../../components/ui/button/Button";
import { Table, TableHeader, TableRow, TableCell, TableBody } from "../../../components/ui/table";
import { CheckIcon, XMarkIcon, PencilIcon, TrashBinIcon } from "../../../icons";
import api from "../../../services/api";

const niveis = [
    { label: "Regional", value: "REGIONAL" },
    { label: "Estadual", value: "ESTADUAL" },
    { label: "Nacional", value: "NACIONAL" },
    { label: "Internacional", value: "INTERNACIONAL" },
];

const apiFederacoes = "/federacoes";

function FederacaoForm({ onSuccess }: { onSuccess: () => void }) {
    const [nome, setNome] = useState("");
    const [nivel, setNivel] = useState(niveis[0].value);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiFederacoes, { nome, nivel });
            setNome("");
            setNivel(niveis[0].value);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar federação");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="nivel">Nível</Label>
                    <Select
                        options={niveis.map(n => ({ label: n.label, value: n.value }))}
                        onChange={setNivel}
                        defaultValue={nivel}
                    />
                </div>
                <div className="flex items-end">
                    <Button
                        type="submit"
                        size="md"
                        variant="primary"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? "Salvando..." : "Cadastrar"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default function FederacaoDashboard() {
    const [federacoes, setFederacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editNivel, setEditNivel] = useState(niveis[0].value);
    const [editLoading, setEditLoading] = useState(false);

    const fetchFederacoes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiFederacoes);
            setFederacoes(data);
        } catch {
            alert("Erro ao carregar federações");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchFederacoes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(apiFederacoes + `/${id}`);
        fetchFederacoes();
    };

    const startEdit = (f: any) => {
        setEditId(f.id_federacao);
        setEditNome(f.nome);
        setEditNivel(f.nivel);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNome("");
        setEditNivel(niveis[0].value);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(apiFederacoes + `/${id}`, { nome: editNome, nivel: editNivel });
            setEditId(null);
            fetchFederacoes();
        } catch {
            alert("Erro ao editar federação");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Federação">
                <FederacaoForm onSuccess={fetchFederacoes} />
            </ComponentCard>
            <ComponentCard title="Federações Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : federacoes.length === 0 ? (
                    <p className="text-gray-500">Nenhuma federação cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-center text-white">Nível</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {federacoes.map((f, idx) => (
                                    <TableRow
                                        key={f.id_federacao}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{f.id_federacao}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === f.id_federacao ? (
                                                <Input
                                                    value={editNome}
                                                    onChange={e => setEditNome(e.target.value)}
                                                />
                                            ) : (
                                                f.nome
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === f.id_federacao ? (
                                                <Select
                                                    options={niveis.map(n => ({ label: n.label, value: n.value }))}
                                                    onChange={setEditNivel}
                                                    defaultValue={editNivel}
                                                />
                                            ) : (
                                                <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                                    {niveis.find(n => n.value === f.nivel)?.label || f.nivel}
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === f.id_federacao ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(f.id_federacao)}
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
                                                        onClick={() => handleDelete(f.id_federacao)}
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