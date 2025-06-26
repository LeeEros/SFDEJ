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

const apiEJ = "/ejs";

function EJForm({ onSuccess, enderecos, federacoes, instituicoes }: { onSuccess: () => void, enderecos: any[], federacoes: any[], instituicoes: any[] }) {
    const [nome, setNome] = useState("");
    const [CNPJ, setCNPJ] = useState("");
    const [fk_endereco, setFkEndereco] = useState<number | null>(null);
    const [fk_federacao, setFkFederacao] = useState<number | null>(null);
    const [fk_instituicao, setFkInstituicao] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiEJ, {
                nome,
                CNPJ,
                fk_endereco,
                fk_federacao,
                fk_instituicao,
            });
            setNome("");
            setCNPJ("");
            setFkEndereco(null);
            setFkFederacao(null);
            setFkInstituicao(null);
            onSuccess();
        } catch {
            alert("Erro ao cadastrar EJ");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Digite o nome da EJ"
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
                        placeholder="Digite o CNPJ"
                        maxLength={14}
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
                        onChange={val => setFkEndereco(Number(val))}
                        value={fk_endereco}
                        placeholder="Selecione o endereço"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_federacao">Federação</Label>
                    <Select
                        options={federacoes.map(f => ({
                            label: f.nome,
                            value: f.id_federacao,
                        }))}
                        onChange={val => setFkFederacao(Number(val))}
                        value={fk_federacao}
                        placeholder="Selecione a federação"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="fk_instituicao">Instituição</Label>
                    <Select
                        options={instituicoes.map(i => ({
                            label: i.faculdade,
                            value: i.id_instituicao,
                        }))}
                        onChange={val => setFkInstituicao(Number(val))}
                        value={fk_instituicao}
                        placeholder="Selecione a instituição"
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

export default function EJDashboard() {
    const [ejs, setEjs] = useState<any[]>([]);
    const [enderecos, setEnderecos] = useState<any[]>([]);
    const [federacoes, setFederacoes] = useState<any[]>([]);
    const [instituicoes, setInstituicoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Estados para edição
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editCNPJ, setEditCNPJ] = useState("");
    const [editFkEndereco, setEditFkEndereco] = useState<number | null>(null);
    const [editFkFederacao, setEditFkFederacao] = useState<number | null>(null);
    const [editFkInstituicao, setEditFkInstituicao] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ejRes, endRes, fedRes, instRes] = await Promise.all([
                api.get(apiEJ),
                api.get("/enderecos"),
                api.get("/federacoes"),
                api.get("/instituicoes"),
            ]);
            setEjs(ejRes.data);
            setEnderecos(endRes.data);
            setFederacoes(fedRes.data);
            setInstituicoes(instRes.data);
        } catch {
            alert("Erro ao carregar dados");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Funções de edição
    const startEdit = (ej: any) => {
        setEditId(ej.id_ej);
        setEditNome(ej.nome);
        setEditCNPJ(ej.CNPJ);
        setEditFkEndereco(ej.fk_endereco);
        setEditFkFederacao(ej.fk_federacao);
        setEditFkInstituicao(ej.fk_instituicao);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNome("");
        setEditCNPJ("");
        setEditFkEndereco(null);
        setEditFkFederacao(null);
        setEditFkInstituicao(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            await api.put(`${apiEJ}/${id}`, {
                nome: editNome,
                CNPJ: editCNPJ,
                fk_endereco: editFkEndereco,
                fk_federacao: editFkFederacao,
                fk_instituicao: editFkInstituicao,
            });
            setEditId(null);
            fetchData();
        } catch {
            alert("Erro ao editar EJ");
        }
        setEditLoading(false);
    };

    // Função de exclusão
    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover esta EJ?")) return;
        try {
            await api.delete(`${apiEJ}/${id}`);
            fetchData();
        } catch {
            alert("Erro ao excluir EJ");
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar EJ">
                <EJForm
                    onSuccess={fetchData}
                    enderecos={enderecos}
                    federacoes={federacoes}
                    instituicoes={instituicoes}
                />
            </ComponentCard>
            <ComponentCard title="EJs Cadastradas">
                {loading ? (
                    <p>Carregando...</p>
                ) : ejs.length === 0 ? (
                    <p className="text-gray-500">Nenhuma EJ cadastrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-white">CNPJ</TableCell>
                                    <TableCell isHeader className="text-white">Endereço</TableCell>
                                    <TableCell isHeader className="text-white">Federação</TableCell>
                                    <TableCell isHeader className="text-white">Instituição</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ejs.map((ej, idx) => (
                                    <TableRow
                                      key={ej.id_ej}
                                      className={`
                                        align-middle
                                        ${idx % 2 === 0
                                          ? "bg-gray-100 dark:bg-gray-800"
                                          : "bg-white dark:bg-gray-700"}
                                        hover:bg-brand-50 dark:hover:bg-brand-500/10
                                      `}
                                      style={{ minHeight: 56 }}
                                    >
                                      <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{ej.id_ej}</TableCell>
                                      <TableCell className="text-gray-800 dark:text-white">
                                        {editId === ej.id_ej ? (
                                          <Input value={editNome} onChange={e => setEditNome(e.target.value)} />
                                        ) : (
                                          ej.nome
                                        )}
                                      </TableCell>
                                      <TableCell className="text-gray-800 dark:text-white">
                                        {editId === ej.id_ej ? (
                                          <Input value={editCNPJ} onChange={e => setEditCNPJ(e.target.value)} />
                                        ) : (
                                          ej.CNPJ
                                        )}
                                      </TableCell>
                                      <TableCell className="text-gray-800 dark:text-white">
                                        {editId === ej.id_ej ? (
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
                                            const end = enderecos.find(e => e.id_endereco === ej.fk_endereco);
                                            return end
                                              ? `${end.endereco}, ${end.numero} - ${end.cidade}/${end.estado}`
                                              : "—";
                                          })()
                                        )}
                                      </TableCell>
                                      <TableCell className="text-gray-800 dark:text-white">
                                        {editId === ej.id_ej ? (
                                          <Select
                                            options={federacoes.map(f => ({
                                              label: f.nome,
                                              value: f.id_federacao,
                                            }))}
                                            value={editFkFederacao}
                                            onChange={val => setEditFkFederacao(Number(val))}
                                          />
                                        ) : (
                                          (() => {
                                            const fed = federacoes.find(f => f.id_federacao === ej.fk_federacao);
                                            return fed ? fed.nome : "—";
                                          })()
                                        )}
                                      </TableCell>
                                      <TableCell className="text-gray-800 dark:text-white">
                                        {editId === ej.id_ej ? (
                                          <Select
                                            options={instituicoes.map(i => ({
                                              label: i.faculdade,
                                              value: i.id_instituicao,
                                            }))}
                                            value={editFkInstituicao}
                                            onChange={val => setEditFkInstituicao(Number(val))}
                                          />
                                        ) : (
                                          (() => {
                                            const inst = instituicoes.find(i => i.id_instituicao === ej.fk_instituicao);
                                            return inst ? inst.faculdade : "—";
                                          })()
                                        )}
                                      </TableCell>
                                      <TableCell className="text-center py-3">
                                        {editId === ej.id_ej ? (
                                          <div className="flex justify-center gap-2">
                                            <Button
                                              size="sm"
                                              variant="success"
                                              className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                              onClick={() => handleEditSave(ej.id_ej)}
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
                                              onClick={() => startEdit(ej)}
                                              startIcon={<PencilIcon className="size-4" />}
                                            >
                                              Editar
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="danger"
                                              className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                              onClick={() => handleDelete(ej.id_ej)}
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