import { Input } from "../components/Input";

export function Empresario() {
    return <form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[32rem]">
        <header>
            <h1>Cadastro da Federação</h1>
            <p>Dados da federação:</p>
        </header>

        <Input required legenda="" />

    </form>
}