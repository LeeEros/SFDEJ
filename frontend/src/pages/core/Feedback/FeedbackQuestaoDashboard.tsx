import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";

const apiQuestao = "/fb-questoes";
const apiCategoria = "/fb-categorias";

export default function FeedbackQuestaoDashboard() {
    const [questoes, setQuestoes] = useState<any[]>([]);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [enunciado, setEnunciado] = useState("");
    const [comentario, setComentario] = useState("");
    const [pontuacao, setPontuacao] = useState("");
    const [fk_fb_categoria, setFkFbCategoria] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        const [qRes, cRes] = await Promise.all([
            api.get(apiQuestao),
            api.get(apiCategoria),
        ]);
        setQuestoes(qRes.data);
        setCategorias(cRes.data);
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!fk_fb_categoria) {
                alert("Selecione uma categoria.");
                setLoading(false);
                return;
            }
            await api.post(apiQuestao, {
                enunciado,
                comentario,
                pontuacao: Number(pontuacao),
                fk_fb_categoria,
            });
            setEnunciado("");
            setComentario("");
            setPontuacao("");
            setFkFbCategoria(null);
            fetchData();
        } catch {
            alert("Erro ao cadastrar questão");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <ComponentCard title="Cadastrar Questão de Feedback">
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label className="dark:text-white">Enunciado</Label>
                            <Input value={enunciado} onChange={e => setEnunciado(e.target.value)} required />
                        </div>
                        <div>
                            <Label className="dark:text-white">Comentário</Label>
                            <Input value={comentario} onChange={e => setComentario(e.target.value)} />
                        </div>
                        <div>
                            <Label className="dark:text-white">Pontuação</Label>
                            <Input type="number" value={pontuacao} onChange={e => setPontuacao(e.target.value)} required />
                        </div>
                        <div>
                            <Label className="dark:text-white">Categoria</Label>
                            <Select
                                options={categorias.map(c => ({
                                    label: c.categoria,
                                    value: c.id_fb_categoria,
                                }))}
                                value={fk_fb_categoria}
                                onChange={val => setFkFbCategoria(Number(val))}
                                placeholder="Selecione"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Cadastrar"}</Button>
                    </div>
                </form>
            </ComponentCard>
            <ComponentCard title="Questões de Feedback Cadastradas">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-brand-500 text-white">
                                <th className="px-2 py-1 dark:text-white">ID</th>
                                <th className="px-2 py-1 dark:text-white">Enunciado</th>
                                <th className="px-2 py-1 dark:text-white">Comentário</th>
                                <th className="px-2 py-1 dark:text-white">Pontuação</th>
                                <th className="px-2 py-1 dark:text-white">Categoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questoes.map((q: any) => (
                                <tr key={q.id_questao} className="border-b">
                                    <td className="px-2 py-1 dark:text-white">{q.id_questao}</td>
                                    <td className="px-2 py-1 dark:text-white">{q.enunciado}</td>
                                    <td className="px-2 py-1 dark:text-white">{q.comentario}</td>
                                    <td className="px-2 py-1 dark:text-white">{q.pontuacao}</td>
                                    <td className="px-2 py-1 dark:text-white">
                                        {categorias.find(c => c.id_fb_categoria === q.fk_fb_categoria)?.categoria || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ComponentCard>
        </div>
    );
}