import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

const apiCategoria = "/fb-categorias";

export default function FeedbackCategoriaDashboard() {
    const [categorias, setCategorias] = useState<any[]>([]);
    const [categoria, setCategoria] = useState("");
    const [descricao, setDescricao] = useState("");
    const [perfil, setPerfil] = useState("hard_skills");
    const [mediaCategoria, setMediaCategoria] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCategorias = async () => {
        const { data } = await api.get(apiCategoria);
        setCategorias(data);
    };

    useEffect(() => { fetchCategorias(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post(apiCategoria, {
                categoria,
                descricao_categoria: descricao,
                perfil,
                media_categoria: mediaCategoria ? Number(mediaCategoria) : null,
            });
            setCategoria("");
            setDescricao("");
            setPerfil("hard_skills");
            setMediaCategoria("");
            fetchCategorias();
        } catch {
            alert("Erro ao cadastrar categoria de feedback");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Categoria de Feedback">
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label required>Categoria</Label>
                            <Input value={categoria} onChange={e => setCategoria(e.target.value)} required />
                        </div>
                        <div>
                            <Label required>Descrição</Label>
                            <Input value={descricao} onChange={e => setDescricao(e.target.value)} required />
                        </div>
                        <div>
                            <Label required>Perfil</Label>
                            <Select
                                options={[
                                    { label: "Hard Skills", value: "hard_skills" },
                                    { label: "Soft Skills", value: "soft_skills" },
                                ]}
                                value={perfil}
                                onChange={setPerfil}
                                required
                            />
                        </div>
                        <div>
                            <Label>Média</Label>
                            <Input type="number" value={mediaCategoria} onChange={e => setMediaCategoria(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Cadastrar"}</Button>
                    </div>
                </form>
            </ComponentCard>
            <ComponentCard title="Categorias de Feedback Cadastradas">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-brand-500 text-white">
                                <th className="px-2 py-1">ID</th>
                                <th className="px-2 py-1">Categoria</th>
                                <th className="px-2 py-1">Descrição</th>
                                <th className="px-2 py-1">Perfil</th>
                                <th className="px-2 py-1">Média</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.map((c: any) => (
                                <tr key={c.id_fb_categoria} className="border-b">
                                    <td className="px-2 py-1">{c.id_fb_categoria}</td>
                                    <td className="px-2 py-1">{c.categoria}</td>
                                    <td className="px-2 py-1">{c.descricao_categoria}</td>
                                    <td className="px-2 py-1">{c.perfil}</td>
                                    <td className="px-2 py-1">{c.media_categoria ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>
        </div>
    );
}