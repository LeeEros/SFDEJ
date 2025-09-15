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

const apiInst = "/instituicoes";

function InstituicaoForm({ onSuccess, enderecos }: { onSuccess: () => void, enderecos: any[] }) {
    const [faculdade, setFaculdade] = useState("");
    const [unidade, setUnidade] = useState("");
    const [CNPJ, setCNPJ] = useState("");
    const [fk_endereco, setFkEndereco] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiInst, {
                faculdade,
                unidade,
                CNPJ,
                fk_endereco,
            });
            setFaculdade("");
            setUnidade("");
            setCNPJ("");
            setFkEndereco(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar instituição");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                    <Label htmlFor="faculdade" required>Faculdade</Label>
                    <Input
                        id="faculdade"
                        name="faculdade"
                        value={faculdade}
                        onChange={e => setFaculdade(e.target.value)}
                        placeholder="Digite o nome da faculdade"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input
                        id="unidade"
                        name="unidade"
                        value={unidade}
                        onChange={e => setUnidade(e.target.value)}
                        placeholder="Digite a unidade"
                    />
                </div>
                <div>
                    <Label htmlFor="CNPJ" required>CNPJ</Label>
                    <Input
                        id="CNPJ"
                        name="CNPJ"
                        value={CNPJ}
                        onChange={e => setCNPJ(e.target.value)}
                        placeholder="Digite o CNPJ"
                        maxLength={14}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_endereco" required>Endereço</Label>
                    <Select
                        options={enderecos.map(e => ({
                            label: `${e.endereco}, ${e.numero} - ${e.cidade}/${e.estado}`,
                            value: e.id_endereco,
                        }))}
                        onChange={val => setFkEndereco(Number(val))}
                        value={fk_endereco}
                        placeholder="Selecione o endereço"
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

export default function InstituicaoDashboard() {
    const [instituicoes, setInstituicoes] = useState<any[]>([]);
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editFaculdade, setEditFaculdade] = useState("");
    const [editUnidade, setEditUnidade] = useState("");
    const [editCNPJ, setEditCNPJ] = useState("");
    const [editFkEndereco, setEditFkEndereco] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [instRes, endRes] = await Promise.all([
                api.get(apiInst),
                api.get("/enderecos"),
            ]);
            setInstituicoes(instRes.data);
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
        await api.delete(apiInst + `/${id}`);
        fetchData();
    };

    const startEdit = (i: any) => {
        setEditId(i.id_instituicao);
        setEditFaculdade(i.faculdade);
        setEditUnidade(i.unidade || "");
        setEditCNPJ(i.CNPJ);
        setEditFkEndereco(i.fk_endereco);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditFaculdade("");
        setEditUnidade("");
        setEditCNPJ("");
        setEditFkEndereco(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(apiInst + `/${id}`, {
                faculdade: editFaculdade,
                unidade: editUnidade,
                CNPJ: editCNPJ,
                fk_endereco: editFkEndereco,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar instituição");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Instituição">
                <InstituicaoForm onSuccess={fetchData} enderecos={enderecos} />
            </ComponentCard>
            <ComponentCard title="Instituições Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : instituicoes.length === 0 ? (
                    <p className="text-gray-500">Nenhuma instituição cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-center text-white">Faculdade</TableCell>
                                    <TableCell isHeader className="text-center text-white">Unidade</TableCell>
                                    <TableCell isHeader className="text-center text-white">CNPJ</TableCell>
                                    <TableCell isHeader className="text-center text-white">Endereço</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {instituicoes.map((i, idx) => (
                                    <TableRow
                                        key={i.id_instituicao}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{i.id_instituicao}</TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === i.id_instituicao ? (
                                                <Input
                                                    value={editFaculdade}
                                                    onChange={e => setEditFaculdade(e.target.value)}
                                                />
                                            ) : (
                                                i.faculdade
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === i.id_instituicao ? (
                                                <Input
                                                    value={editUnidade}
                                                    onChange={e => setEditUnidade(e.target.value)}
                                                />
                                            ) : (
                                                i.unidade
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === i.id_instituicao ? (
                                                <Input
                                                    value={editCNPJ}
                                                    onChange={e => setEditCNPJ(e.target.value)}
                                                />
                                            ) : (
                                                i.CNPJ
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === i.id_instituicao ? (
                                                <Select
                                                    options={enderecos.map(e => ({
                                                        label: `${e.endereco}, ${e.numero} - ${e.cidade}/${e.estado}`,
                                                        value: e.id_endereco,
                                                    }))}
                                                    onChange={val => setEditFkEndereco(Number(val))}
                                                    value={editFkEndereco}
                                                />
                                            ) : (
                                                (() => {
                                                    const end = enderecos.find(e => e.id_endereco === i.fk_endereco);
                                                    return end
                                                        ? `${end.endereco}, ${end.numero} - ${end.cidade}/${end.estado}`
                                                        : "—";
                                                })()
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === i.id_instituicao ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(i.id_instituicao)}
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
                                                        onClick={() => startEdit(i)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(i.id_instituicao)}
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