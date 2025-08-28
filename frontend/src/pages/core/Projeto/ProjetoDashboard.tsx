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
import { TrashBinIcon, PencilIcon, CheckIcon, XMarkIcon, PaperPlaneIcon } from "../../../icons";

const apiProjeto = "/projetos";
const apiCategoria = "/projetos-categorias";
const apiCliente = "/clientes";

const formatarDataBR = (dataISO: string) => {
    if (!dataISO) return "";
    try {
        const data = new Date(dataISO);
        if (isNaN(data.getTime())) return dataISO;

        return data.toLocaleDateString('pt-BR');
    } catch {
        return dataISO;
    }
};

const converterDataBRparaISO = (dataBR: string): string | null => {
    if (!dataBR) return null;

    try {
        const partes = dataBR.split('/');
        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes;
        if (dia.length !== 2 || mes.length !== 2 || ano.length !== 4) return null;

        const diaNum = parseInt(dia, 10);
        const mesNum = parseInt(mes, 10);
        const anoNum = parseInt(ano, 10);

        if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) return null;
        if (mesNum < 1 || mesNum > 12) return null;
        if (diaNum < 1 || diaNum > 31) return null;

        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    } catch {
        return null;
    }
};

const formatarDataInput = (valor: string): string => {

    let valorFormatado = valor.replace(/\D/g, '');

    if (valorFormatado.length > 4) {
        valorFormatado = valorFormatado.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (valorFormatado.length > 2) {
        valorFormatado = valorFormatado.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }

    return valorFormatado;
};

function ProjetoForm({ onSuccess, categorias, clientes }: { onSuccess: () => void, categorias: any[], clientes: any[] }) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [status, setStatus] = useState("");
    const [data_assinatura, setDataAssinatura] = useState("");
    const [data_conclusao, setDataConclusao] = useState("");
    const [valor, setValor] = useState("");
    const [fk_categoria, setFkCategoria] = useState<number | null>(null);
    const [fk_cliente, setFkCliente] = useState<number | null>(null);
    const [anexo, setAnexo] = useState<File | null>(null);
    const [anexoError, setAnexoError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<string[]>([]);

    const statusOptions = [
        { label: "Negociação", value: "NEGOCIACAO" },
        { label: "Em Desenvolvimento", value: "DESENVOLVIMENTO" },
        { label: "Finalizado", value: "FINALIZADO" },
        { label: "Cancelado", value: "CANCELADO" },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setAnexoError("O arquivo deve ter no máximo 10MB.");
                setAnexo(null);
            } else {
                setAnexo(file);
                setAnexoError(null);
            }
        }
    };

    const handleDataChange = (campo: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const valorFormatado = formatarDataInput(valor);

        if (campo === 'data_assinatura') {
            setDataAssinatura(valorFormatado);
        } else if (campo === 'data_conclusao') {
            setDataConclusao(valorFormatado);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErros([]);

        if (!nome || !descricao || !status) {
            setErros(["Nome, descrição e status são campos obrigatórios"]);
            setLoading(false);
            return;
        }

        const projetoData: any = {
            nome,
            descricao,
            status,
        };

        if (data_assinatura) {
            const dataISO = converterDataBRparaISO(data_assinatura);
            if (dataISO) {
                projetoData.data_assinatura = dataISO;
            }
        }

        if (data_conclusao) {
            const dataISO = converterDataBRparaISO(data_conclusao);
            if (dataISO) {
                projetoData.data_conclusao = dataISO;
            }
        }

        if (valor) {
            projetoData.valor = Number(valor);
        }

        if (fk_categoria) {
            projetoData.fk_categoria = fk_categoria;
        }

        if (fk_cliente) {
            projetoData.fk_cliente = fk_cliente;
        }

        console.log("Dados do projeto:", projetoData);

        try {
            if (anexo) {
                const formData = new FormData();

                Object.keys(projetoData).forEach(key => {
                    formData.append(key, projetoData[key]);
                });

                formData.append("anexo", anexo);

                await api.post(apiProjeto, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post(apiProjeto, projetoData);
            }

            setNome("");
            setDescricao("");
            setStatus("");
            setDataAssinatura("");
            setDataConclusao("");
            setValor("");
            setFkCategoria(null);
            setFkCliente(null);
            setAnexo(null);
            setAnexoError(null);
            setErros([]);

            onSuccess();
        } catch (error: any) {
            console.error("Erro ao cadastrar projeto:", error);

            if (error.response?.data) {
                console.error("Resposta de erro da API:", error.response.data);

                if (error.response.data.issues) {
                    const validationErrors: string[] = [];
                    Object.keys(error.response.data.issues).forEach(field => {
                        if (field !== "_errors" && error.response.data.issues[field]._errors) {
                            error.response.data.issues[field]._errors.forEach((err: string) => {
                                validationErrors.push(`${field}: ${err}`);
                            });
                        }
                    });

                    if (validationErrors.length > 0) {
                        setErros(validationErrors);
                    } else {
                        alert("Erro de validação. Verifique os dados informados.");
                    }
                } else if (error.response.data.message) {
                    alert(`Erro ao cadastrar projeto: ${error.response.data.message}`);
                } else {
                    alert("Erro ao cadastrar projeto. Verifique os dados e tente novamente.");
                }
            } else {
                alert("Erro ao cadastrar projeto. Verifique os dados e tente novamente.");
            }
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Exibir erros de validação */}
            {erros.length > 0 && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Erros de validação:</strong>
                    <ul className="list-disc list-inside mt-2">
                        {erros.map((erro, index) => (
                            <li key={index}>{erro}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                <div>
                    <Label htmlFor="nome" required>Nome</Label>
                    <Input
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        placeholder="Digite o nome do projeto"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="descricao" required>Descrição</Label>
                    <Input
                        id="descricao"
                        name="descricao"
                        value={descricao}
                        onChange={e => setDescricao(e.target.value)}
                        placeholder="Descrição"
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="status" required>Status</Label>
                    <Select
                        options={statusOptions}
                        value={status}
                        onChange={setStatus}
                        placeholder="Selecione"
                        required
                        className="w-full"
                    />
                </div>
                <div>
                    <Label htmlFor="data_assinatura">Data Assinatura</Label>
                    <Input
                        id="data_assinatura"
                        name="data_assinatura"
                        value={data_assinatura}
                        onChange={handleDataChange('data_assinatura')}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                    />
                </div>
                <div>
                    <Label htmlFor="data_conclusao">Data Conclusão</Label>
                    <Input
                        id="data_conclusao"
                        name="data_conclusao"
                        value={data_conclusao}
                        onChange={handleDataChange('data_conclusao')}
                        placeholder="dd/mm/aaaa"
                        maxLength={10}
                    />
                </div>
                <div>
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                        id="valor"
                        name="valor"
                        type="number"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                        placeholder="Valor"
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
                        placeholder="Selecione a categoria"
                    />
                </div>
                <div>
                    <Label htmlFor="fk_cliente">Cliente</Label>
                    <Select
                        options={clientes.map(c => ({
                            label: c.nome,
                            value: c.id_cliente,
                        }))}
                        value={fk_cliente}
                        onChange={val => setFkCliente(Number(val))}
                        placeholder="Selecione o cliente"
                    />
                </div>
                <div>
                    <Label htmlFor="anexo">Anexo</Label>
                    <div className="flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-1">
                            <PaperPlaneIcon className="w-5 h-5 text-gray-500" />
                            <input
                                id="anexo"
                                name="anexo"
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                            />
                            <span className="text-sm text-gray-600">
                                {anexo ? anexo.name : "Selecionar arquivo"}
                            </span>
                        </label>
                    </div>
                    {anexoError && (
                        <span className="text-xs text-red-500">{anexoError}</span>
                    )}
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
export default function ProjetoDashboard() {
    const [projetos, setProjetos] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [clientes, setClientes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState<number | null>(null);
    const [editNome, setEditNome] = useState("");
    const [editDescricao, setEditDescricao] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editDataAssinatura, setEditDataAssinatura] = useState("");
    const [editDataConclusao, setEditDataConclusao] = useState("");
    const [editValor, setEditValor] = useState("");
    const [editFkCategoria, setEditFkCategoria] = useState<number | null>(null);
    const [editFkCliente, setEditFkCliente] = useState<number | null>(null);
    const [editLoading, setEditLoading] = useState(false);

    const statusOptions = [
        { label: "Negociação", value: "NEGOCIACAO" },
        { label: "Em Desenvolvimento", value: "DESENVOLVIMENTO" },
        { label: "Finalizado", value: "FINALIZADO" },
        { label: "Cancelado", value: "CANCELADO" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const [projRes, catRes, cliRes] = await Promise.all([
                api.get(apiProjeto),
                api.get(apiCategoria),
                api.get(apiCliente),
            ]);
            setProjetos(projRes.data);
            setCategorias(catRes.data);
            setClientes(cliRes.data);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            alert("Erro ao carregar dados");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover?")) return;
        try {
            await api.delete(`${apiProjeto}/${id}`);
            fetchData();
        } catch (error) {
            console.error("Erro ao excluir projeto:", error);
            alert("Erro ao excluir projeto");
        }
    };

    const handleEditDataChange = (campo: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor = e.target.value;
        const valorFormatado = formatarDataInput(valor);

        if (campo === 'data_assinatura') {
            setEditDataAssinatura(valorFormatado);
        } else if (campo === 'data_conclusao') {
            setEditDataConclusao(valorFormatado);
        }
    };

    const startEdit = (p: any) => {
        setEditId(p.id_projeto);
        setEditNome(p.nome);
        setEditDescricao(p.descricao);
        setEditStatus(p.status);
        setEditDataAssinatura(p.data_assinatura ? formatarDataBR(p.data_assinatura) : "");
        setEditDataConclusao(p.data_conclusao ? formatarDataBR(p.data_conclusao) : "");
        setEditValor(p.valor);
        setEditFkCategoria(p.fk_categoria);
        setEditFkCliente(p.fk_cliente);
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditNome("");
        setEditDescricao("");
        setEditStatus("");
        setEditDataAssinatura("");
        setEditDataConclusao("");
        setEditValor("");
        setEditFkCategoria(null);
        setEditFkCliente(null);
    };

    const handleEditSave = async (id: number) => {
        setEditLoading(true);
        try {
            const dados: any = {
                nome: editNome,
                descricao: editDescricao,
                status: editStatus,
            };

            if (editValor) {
                dados.valor = Number(editValor);
            }

            if (editFkCategoria) {
                dados.fk_categoria = editFkCategoria;
            }

            if (editFkCliente) {
                dados.fk_cliente = editFkCliente;
            }

            if (editDataAssinatura) {
                const dataISO = converterDataBRparaISO(editDataAssinatura);
                if (dataISO) {
                    dados.data_assinatura = dataISO;
                } else {
                    alert("Data de assinatura inválida.");
                    setEditLoading(false);
                    return;
                }
            }

            if (editDataConclusao) {
                const dataISO = converterDataBRparaISO(editDataConclusao);
                if (dataISO) {
                    dados.data_conclusao = dataISO;
                } else {
                    alert("Data de conclusão inválida.");
                    setEditLoading(false);
                    return;
                }
            }

            await api.put(`${apiProjeto}/${id}`, dados);
            setEditId(null);
            fetchData();
        } catch (error: any) {
            console.error("Erro ao editar projeto:", error);

            if (error.response?.data) {
                console.error("Resposta de erro da API:", error.response.data);

                if (error.response.data.issues) {
                    const validationErrors: string[] = [];

                    Object.keys(error.response.data.issues).forEach(field => {
                        if (field !== "_errors" && error.response.data.issues[field]._errors) {
                            error.response.data.issues[field]._errors.forEach((err: string) => {
                                validationErrors.push(`${field}: ${err}`);
                            });
                        }
                    });

                    if (validationErrors.length > 0) {
                        alert(`Erro de validação: ${validationErrors.join(', ')}`);
                    } else {
                        alert("Erro de validação. Verifique os dados informados.");
                    }
                } else if (error.response.data.message) {
                    alert(`Erro ao editar projeto: ${error.response.data.message}`);
                } else {
                    alert("Erro ao editar projeto. Verifique os dados e tente novamente.");
                }
            } else {
                alert("Erro ao editar projeto. Verifique os dados e tente novamente.");
            }
        }
        setEditLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Projeto">
                <ProjetoForm onSuccess={fetchData} categorias={categorias} clientes={clientes} />
            </ComponentCard>
            <ComponentCard title="Projetos Cadastrados">
                {loading ? (
                    <p>Carregando...</p>
                ) : projetos.length === 0 ? (
                    <p className="text-gray-500">Nenhum projeto cadastrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="w-20 text-center text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Nome</TableCell>
                                    <TableCell isHeader className="text-white">Descrição</TableCell>
                                    <TableCell isHeader className="text-white">Status</TableCell>
                                    <TableCell isHeader className="text-white">Data Assinatura</TableCell>
                                    <TableCell isHeader className="text-white">Data Conclusão</TableCell>
                                    <TableCell isHeader className="text-white">Valor</TableCell>
                                    <TableCell isHeader className="text-white">Categoria</TableCell>
                                    <TableCell isHeader className="text-white">Cliente</TableCell>
                                    <TableCell isHeader className="text-center text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projetos.map((p, idx) => (
                                    <TableRow
                                        key={p.id_projeto}
                                        className={`
                                          align-middle
                                          ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                          hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                        style={{ minHeight: 56 }}
                                    >
                                        <TableCell className="text-center font-semibold text-gray-800 dark:text-white">{p.id_projeto}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input value={editNome} onChange={e => setEditNome(e.target.value)} />
                                            ) : (
                                                p.nome
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input value={editDescricao} onChange={e => setEditDescricao(e.target.value)} />
                                            ) : (
                                                p.descricao
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <select
                                                    className="w-full border rounded px-3 py-2"
                                                    value={editStatus}
                                                    onChange={e => setEditStatus(e.target.value)}
                                                >
                                                    <option value="">Selecione</option>
                                                    {statusOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                statusOptions.find(opt => opt.value === p.status)?.label || p.status
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input
                                                    value={editDataAssinatura}
                                                    onChange={handleEditDataChange('data_assinatura')}
                                                    placeholder="dd/mm/aaaa"
                                                    maxLength={10}
                                                />
                                            ) : (
                                                formatarDataBR(p.data_assinatura)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input
                                                    value={editDataConclusao}
                                                    onChange={handleEditDataChange('data_conclusao')}
                                                    placeholder="dd/mm/aaaa"
                                                    maxLength={10}
                                                />
                                            ) : (
                                                formatarDataBR(p.data_conclusao)
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Input
                                                    type="number"
                                                    value={editValor}
                                                    onChange={e => setEditValor(e.target.value)}
                                                />
                                            ) : (
                                                Number(p.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Select
                                                    options={categorias.map(c => ({
                                                        label: c.categoria,
                                                        value: c.id_categoria,
                                                    }))}
                                                    value={editFkCategoria}
                                                    onChange={val => setEditFkCategoria(Number(val))}
                                                />
                                            ) : (
                                                categorias.find(c => c.id_categoria === p.fk_categoria)?.categoria || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">
                                            {editId === p.id_projeto ? (
                                                <Select
                                                    options={clientes.map(c => ({
                                                        label: c.nome,
                                                        value: c.id_cliente,
                                                    }))}
                                                    value={editFkCliente}
                                                    onChange={val => setEditFkCliente(Number(val))}
                                                />
                                            ) : (
                                                clientes.find(c => c.id_cliente === p.fk_cliente)?.nome || "—"
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center py-3">
                                            {editId === p.id_projeto ? (
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="success"
                                                        className="py-2 px-4 bg-success-600 hover:bg-success-700 text-white rounded shadow"
                                                        onClick={() => handleEditSave(p.id_projeto)}
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
                                                        onClick={() => startEdit(p)}
                                                        startIcon={<PencilIcon className="size-4" />}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                        onClick={() => handleDelete(p.id_projeto)}
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