import { Input } from "../components/Input";
import { Select } from "../components/Select";

export function Empresario() {
    return <form className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[32rem]">
        <header>
            <h1 className="text-xl font-bold text-gray-100">Cadastro da Federação</h1>
            <p className="text-sm text-gray-200 mt-2 mb-4">Dados da federação:</p>
        </header>

        <Input required legenda="Federação: " />

        <Select required legenda="Estado: " />

    </form>
}