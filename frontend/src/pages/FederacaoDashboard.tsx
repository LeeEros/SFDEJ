import { useEffect, useState } from "react";
import api from "../services/api";
import FederacaoForm from "./FederacaoForm";

export default function FederacaoDashboard() {
    const [federacoes, setFederacoes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const url = "/federacoes";

    const fetchFederacoes = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(url);
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
        await api.delete(`url/${id}`);
        fetchFederacoes();
    };

    return (
        <div className="container mt-4">
            <h2>Federações</h2>
            <FederacaoForm onSuccess={fetchFederacoes} />
            <hr />
            {loading ? (
                <p>Carregando...</p>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Nível</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {federacoes.map((f) => (
                            <tr key={f.id_federacao}>
                                <td>{f.id_federacao}</td>
                                <td>{f.nome}</td>
                                <td>{f.nivel}</td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id_federacao)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}