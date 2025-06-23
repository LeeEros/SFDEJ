import { useEffect, useState } from "react";
import api from "../../services/api";
import ComponentCard from "../../components/common/ComponentCard";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../../components/ui/table";
import { TrashBinIcon, PencilIcon, CheckIcon, XMarkIcon } from "../../icons";

const apiEndereco = "/enderecos";

function EnderecoForm({ onSuccess }: { onSuccess: () => void }) {
    const [CEP, setCEP] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [endereco, setEndereco] = useState("");
    const [numero, setNumero] = useState<number | "">("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiEndereco, {
                CEP,
                cidade,
                estado,
                endereco,
                numero: Number(numero),
            });
            setCEP("");
            setCidade("");
            setEstado("");
            setEndereco("");
            setNumero("");
            onSuccess();
        } catch {
            alert("Erro ao cadastrar endereço");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                        id="cep"
                        name="cep"
                        value={CEP}
                        onChange={e => setCEP(e.target.value)}
                        placeholder="Digite o CEP"
                        required
                        maxLength={8}
                    />
                </div>
                <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                        id="cidade"
                        name="cidade"
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        placeholder="Digite a cidade"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                        id="estado"
                        name="estado"
                        value={estado}
                        onChange={e => setEstado(e.target.value)}
                        placeholder="Digite o estado"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                        id="endereco"
                        name="endereco"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        placeholder="Digite o endereço"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="numero">Número</Label>
                    <Input
                        id="numero"
                        name="numero"
                        type="number"
                        value={numero}
                        onChange={e => setNumero(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="Nº"
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

export default function EnderecoDashboard() {
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editCEP, setEditCEP] = useState("");
    const [editCidade, setEditCidade] = useState("");
    const [editEstado, setEditEstado] = useState("");
    const [editEndereco, setEditEndereco] = useState("");
    const [editNumero, setEditNumero] = useState<number | "">("");
    const [editLoading, setEditLoading] = useState(false);

    const fetchEnderecos = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiEndereco);
            setEnderecos(data);
        } catch {
            alert("Erro ao carregar endereços");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchEnderecos();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        await api.delete(apiEndereco + `/${id}`);
        fetchEnderecos();
    };

    const startEdit = (e: any) => {
        setEditId(e.id_endereco);
        setEditCEP(e.CEP);
        setEditCidade(e.cidade);
        setEditEstado(e.estado);
        setEditEndereco(e.endereco);
        setEditNumero(e.numero);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditCEP("");
        setEditCidade("");
        setEditEstado("");
        setEditEndereco("");
        setEditNumero("");
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(apiEndereco + `/${id}`, {
                CEP: editCEP,
                cidade: editCidade,
                estado: editEstado,
                endereco: editEndereco,
                numero: Number(editNumero),
            });
            setEditId(null);
            fetchEnderecos();
        } catch {
            alert("Erro ao editar endereço");
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Endereço">
                <EnderecoForm onSuccess={fetchEnderecos} />
            </ComponentCard>
            <ComponentCard title="Endereços Cadastrados">
                {loading ? (
                    <p>Carregando...</p>
                ) : enderecos.length === 0 ? (
                    <p className="text-gray-500">Nenhum endereço cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">CEP</TableCell>
                                    <TableCell isHeader className="text-white">Cidade</TableCell>
                                    <TableCell isHeader className="text-white">Estado</TableCell>
                                    <TableCell isHeader className="text-white">Endereço</TableCell>
                                    <TableCell isHeader className="text-center text-white">Número</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enderecos.map((e, idx) => (
                                    <TableRow
                                        key={e.id_endereco}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{e.id_endereco}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === e.id_endereco ? (
                                                <Input
                                                    value={editCEP}
                                                    onChange={ev => setEditCEP(ev.target.value)}
                                                />
                                            ) : (
                                                e.CEP
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === e.id_endereco ? (
                                                <Input
                                                    value={editCidade}
                                                    onChange={ev => setEditCidade(ev.target.value)}
                                                />
                                            ) : (
                                                e.cidade
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === e.id_endereco ? (
                                                <Input
                                                    value={editEstado}
                                                    onChange={ev => setEditEstado(ev.target.value)}
                                                />
                                            ) : (
                                                e.estado
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === e.id_endereco ? (
                                                <Input
                                                    value={editEndereco}
                                                    onChange={ev => setEditEndereco(ev.target.value)}
                                                />
                                            ) : (
                                                e.endereco
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center text-gray-800 dark:text-white">
                                            {editId === e.id_endereco ? (
                                                <Input
                                                    type="number"
                                                    value={editNumero}
                                                    onChange={ev => setEditNumero(ev.target.value === "" ? "" : Number(ev.target.value))}
                                                />
                                            ) : (
                                                e.numero
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === e.id_endereco ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700  text-white rounded shadow"
                                                        onClick={() => handleEditSave(e.id_endereco)}
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
                                                        onClick={() => startEdit(e)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(e.id_endereco)}
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