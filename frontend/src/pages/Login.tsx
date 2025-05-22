import type React from "react"
import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { useState } from "react"
import clsx from "clsx"

export function Login() {

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [carregando, setCarregando] = useState(false)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        console.log(email, senha);
    }

    return (<form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
        <Input
            required
            legenda="Email"
            type="email"
            placeholder="email@email.com"
            onChange={(e) => setEmail(e.target.value)}
        />

        <Input
            required
            legenda="Senha"
            type="password"
            placeholder="password"
            onChange={(e) => setSenha(e.target.value)}
        />

        <Button type="submit" carregando={carregando}>Entrar</Button>

        <a href="/criar-conta"
            className={
                clsx(
                    "text-sm font-semibold text-gray-100 mt-10 mb-4",
                    "text-center hover:text-indigo-300 transition ease-linear"
                )
            }
        >
            Criar conta
        </a>
    </form>)
}