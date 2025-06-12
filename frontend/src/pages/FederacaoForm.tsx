import { useState } from "react";
import api from "../services/api";

export default function FederacaoForm({ onSuccess }: { onSuccess?: () => void }) {
    const [nome, setNome] = useState("");
    const [nivel, setNivel] = useState("REGIONAL");
    const [loading, setLoading] = useState(false);

    const url = "/federacoes";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(url, { nome, nivel });
            setNome("");
            setNivel("REGIONAL");
            if (onSuccess) onSuccess();
            alert("Federação cadastrada!");
        } catch (err) {
            alert("Erro ao cadastrar federação");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="card card-body">
            <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="mb-3">
                <label className="form-label">Nível</label>
                <select className="form-select" value={nivel} onChange={e => setNivel(e.target.value)}>
                    <option value="REGIONAL">Regional</option>
                    <option value="ESTADUAL">Estadual</option>
                    <option value="NACIONAL">Nacional</option>
                    <option value="INTERNACIONAL">Internacional</option>
                </select>
            </div>
            <button className="btn btn-primary" disabled={loading}>
                {loading ? "Salvando..." : "Cadastrar"}
            </button>
        </form>
    );
}