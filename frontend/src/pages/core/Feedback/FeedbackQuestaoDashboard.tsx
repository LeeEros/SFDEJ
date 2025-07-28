import { useEffect, useState } from "react";
import api from "../../../services/api";
import ComponentCard from "../../../components/common/ComponentCard";
import Button from "../../../components/ui/button/Button";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";

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
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-brand-500 dark:bg-gray-900">
                                <TableCell isHeader className="px-2 py-1 text-white">ID</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Enunciado</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Comentário</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Pontuação</TableCell>
                                <TableCell isHeader className="px-2 py-1 text-white">Categoria</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questoes.map((q: any, idx: number) => (
                                <TableRow
                                    key={q.id_questao}
                                    className={`
                                        ${idx % 2 === 0
                                            ? "bg-gray-100 dark:bg-gray-800"
                                            : "bg-white dark:bg-gray-700"}
                                        hover:bg-brand-50 dark:hover:bg-brand-500/10
                                    `}
                                >
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{q.id_questao}</TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{q.enunciado}</TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{q.comentario}</TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">{q.pontuacao}</TableCell>
                                    <TableCell className="px-2 py-1 text-gray-800 dark:text-white">
                                        {categorias.find(c => c.id_fb_categoria === q.fk_fb_categoria)?.categoria || "—"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </ComponentCard>
        </div>
    );
}