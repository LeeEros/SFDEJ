import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";

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
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-brand-500 text-white">
                                    <th className="px-2 py-1">ID</th>
                                    <th className="px-2 py-1">Média Geral</th>
                                    <th className="px-2 py-1">Média Categorias</th>
                                    <th className="px-2 py-1">Data Atualização</th>
                                    <th className="px-2 py-1">Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicos.map((h: any) => (
                                    <tr key={h.id_fb_historico} className="border-b">
                                        <td className="px-2 py-1">{h.id_fb_historico}</td>
                                        <td className="px-2 py-1">{h.media_geral?.toFixed(2)}</td>
                                        <td className="px-2 py-1">{h.media_categorias?.toFixed(2)}</td>
                                        <td className="px-2 py-1">{h.data_atualizacao ? new Date(h.data_atualizacao).toLocaleDateString() : "—"}</td>
                                        <td className="px-2 py-1">{h.fk_feedback}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </ComponentCard>
        </div>
    );
}