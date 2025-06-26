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

export default function FbHistoricoDashboard() {
    const [historicos, setHistoricos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get("/fb-historico");
            setHistoricos(data);
        } catch {
            alert("Erro ao carregar históricos");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="space-y-6">
            <ComponentCard title="Histórico de Feedbacks">
                {loading ? (
                    <p>Carregando...</p>
                ) : historicos.length === 0 ? (
                    <p className="text-gray-500">Nenhum histórico encontrado.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-brand-500 dark:bg-gray-900">
                                    <TableCell isHeader className="px-2 py-1 text-white">ID</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Média Geral</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Média Categorias</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Data Atualização</TableCell>
                                    <TableCell isHeader className="px-2 py-1 text-white">Feedback</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {historicos.map((h: any, idx: number) => (
                                    <TableRow
                                        key={h.id_fb_historico}
                                        className={`
                                            ${idx % 2 === 0
                                                ? "bg-gray-100 dark:bg-gray-800"
                                                : "bg-white dark:bg-gray-700"}
                                            hover:bg-brand-50 dark:hover:bg-brand-500/10
                                        `}
                                    >
                                        <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{h.id_fb_historico}</TableCell>
                                        <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{h.media_geral?.toFixed(2)}</TableCell>
                                        <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{h.media_categorias?.toFixed(2)}</TableCell>
                                        <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{h.data_atualizacao ? new Date(h.data_atualizacao).toLocaleDateString() : "—"}</TableCell>
                                        <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{h.fk_feedback}</TableCell>
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