import { useEffect, useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { TrashBinIcon } from "../../../icons";
import api from "../../../services/api";

const apiAvaliacao = "/feedback-avaliacao";

export default function FeedbackAvaliacaoDashboard() {
    const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAvaliacoes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(apiAvaliacao);
            setAvaliacoes(data);
        } catch {
            alert("Erro ao carregar avaliações de feedback");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAvaliacoes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Deseja remover esta avaliação?")) return;
        try {
            await api.delete(`${apiAvaliacao}/${id}`);
            fetchAvaliacoes();
        } catch {
            alert("Erro ao excluir a avaliação");
        }
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Avaliações de Feedback">
                {loading ? (
                    <p>Carregando...</p>
                ) : avaliacoes.length === 0 ? (
                    <p className="text-gray-500">Nenhuma avaliação encontrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="text-white">ID</TableCell>
                                    <TableCell isHeader className="text-white">Sessão</TableCell>
                                    <TableCell isHeader className="text-white">Usuário</TableCell>
                                    <TableCell isHeader className="text-white">Ações</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {avaliacoes.map((a, idx) => (
                                    <TableRow
                                        key={a.id_avaliacao}
                                        className={`
                                            ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                            hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                    >
                                        <TableCell className="text-gray-800 dark:text-white">{a.id_avaliacao}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">{a.sessao?.id_sessao || "—"}</TableCell>
                                        <TableCell className="text-gray-800 dark:text-white">{a.usuario?.nome || "—"}</TableCell>
                                        <TableCell className="text-center">
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                className="py-2 px-4 bg-error-600 hover:bg-error-700 text-white rounded shadow"
                                                onClick={() => handleDelete(a.id_avaliacao)}
                                                startIcon={<TrashBinIcon className="size-4" />}
                                            >
                                                Excluir
                                            </Button>
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