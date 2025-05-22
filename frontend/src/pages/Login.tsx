import { Button } from "../components/Button"
import { Input } from "../components/Input"

export function Login() {
    return <form className="w-full flex flex-col gap-6">
        <Input
            required
            legenda="Email"
            type="email"
            placeholder="email@email.com"
        />

        <Input
            required
            legenda="Senha"
            type="password"
            placeholder="password"
        />

        <Button >Entrar</Button>
    </form>
}