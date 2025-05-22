export function NaoEncontrado() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-gray-800">404 - Página não encontrada</h1>
            <p className="mt-4 text-lg text-gray-600">Desculpe, a página que você está procurando não existe.</p>
            <a href="/" className="mt-6 text-indigo-400 hover:underline">
                Voltar para a página inicial
            </a>
        </div>
    );
}