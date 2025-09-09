import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "../../../components/ui/table";

export default function FeedbackRespostasDashboard() {
    const [respostas, setRespostas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/fb-respostas");
            setRespostas(data);
        } catch {
            alert("Erro ao carregar respostas");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <ComponentCard title="Respostas de Feedback">
                {loading ? (
                    <p>Carregando...</p>
                ) : respostas.length === 0 ? (
                    <p className="text-gray-500">Nenhuma resposta encontrada.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="px-2 py-1 text-white">ID</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Nota</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Comentário</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Data Resposta</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Questão</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {respostas.map((r: any, idx: number) => (
                                    <TableRow
                                        key={r.id_resposta}
                                        className={`
                                            ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                            hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                    >
                                        <TableCell className="px-2 py-1 text-center text-gray-800 dark:text-white">
                                            {r.id_resposta}
                                        </TableCell>
                                        <TableCell className="px-2 py-1 text-center text-gray-800 dark:text-white">
                                            {r.nota}
                                        </TableCell>
                                        <TableCell className="px-2 py-1 text-center text-gray-800 dark:text-white">
                                            {r.comentario || "—"}
                                        </TableCell>
                                        <TableCell className="px-2 py-1 text-center text-gray-800 dark:text-white">
                                            {r.data_resposta ? new Date(r.data_resposta).toLocaleDateString() : "—"}
                                        </TableCell>
                                        <TableCell className="px-2 py-1 text-center text-gray-800 dark:text-white">
                                            {r.fk_fb_questao}
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