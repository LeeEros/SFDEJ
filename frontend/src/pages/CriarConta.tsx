import type React from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useState } from "react"
import clsx from "clsx"

export function CriarConta() {

    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [telefone, setTelefone] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setconfirmarSenha] = useState("")
    const [carregando, setCarregando] = useState(false)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log(nome, email, telefone, senha, confirmarSenha);
    }

    return (<form onSubmit={onSubmit} className="w-full flex flex-col gap-6">

        <Input
            required
            legenda="Nome"
            type="text"
            placeholder="Nome"
            onChange={(e) => setNome(e.target.value)}
        />

        <Input
            required
            legenda="Email"
            type="email"
            placeholder="email@email.com"
            onChange={(e) => setEmail(e.target.value)}
        />

        <Input
            required
            legenda="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            onChange={(e) => setTelefone(e.target.value)}
        />

        <Input
            required
            legenda="Senha"
            type="password"
            placeholder="senha"
            onChange={(e) => setSenha(e.target.value)}
        />

        <Input
            required
            legenda="Confirmar senha"
            type="password"
            placeholder="senha"
            onChange={(e) => setconfirmarSenha(e.target.value)}
        />

        <Button type="submit" carregando={carregando}>Cadastrar</Button>

        <a href="/"
            className={
                clsx(
                    "text-sm font-semibold text-gray-100 mt-10 mb-4",
                    "text-center hover:text-indigo-300 transition ease-linear"
                )
            }
        >
            Já tenho conta
        </a>
    </form>)
}