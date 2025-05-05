import React from "react";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">MinhaHome</h1>
        <nav className="space-x-4">
          <a href="#features" className="text-gray-700 hover:text-blue-600">Recursos</a>
          <a href="#about" className="text-gray-700 hover:text-blue-600">Sobre</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Contato</a>
        </nav>
      </header>

      <section className="flex-1 flex items-center justify-center bg-blue-50 p-8">
        <div className="max-w-xl text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Bem-vindo à MinhaHome</h2>
          <p className="text-gray-600 mb-6">Home pAGE.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">Comece Agora</button>
        </div>
      </section>


      <section id="features" className="p-8 bg-white">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Principais Recursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Design Responsivo</h4>
            <p className="text-gray-600 mt-2">Compatível com todos os dispositivos.</p>
          </div>
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Código Limpo</h4>
            <p className="text-gray-600 mt-2">Fácil de entender e manter.</p>
          </div>
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Altamente Customizável</h4>
            <p className="text-gray-600 mt-2">Adapte facilmente ao seu projeto.</p>
          </div>
        </div>
      </section>


      <footer className="bg-blue-600 text-white text-center p-4">
        <p>&copy; 2025 MinhaHome. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;