import Navbar from "../components/navbar";


function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

        <header>
            <Navbar />
        </header>


      <section className="flex-1 flex items-center justify-center bg-blue-50 p-8">
        <div className="max-w-xl text-center">
          <h2 className="text-4xl font-bold text-blue-700 mb-4">Bem-vindo à página</h2>
          <p className="text-gray-600 mb-6">Home page.</p>

        </div>
      </section>


      <section id="features" className="p-8 bg-white">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">Lorem ipsum dolor.</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Lorem ipsum dolor.</h4>
            <p className="text-gray-600 mt-2">Lorem ipsum dolor.</p>
          </div>
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Lorem ipsum dolor.</h4>
            <p className="text-gray-600 mt-2">Lorem ipsum dolor.</p>
          </div>
          <div className="p-4 shadow rounded-lg hover:shadow-lg transition">
            <h4 className="font-bold text-blue-600">Lorem ipsum dolor.</h4>
            <p className="text-gray-600 mt-2">Lorem ipsum dolor.</p>
          </div>
        </div>
      </section>


      <footer className="bg-blue-600 text-white text-center p-4">
        <p>&copy; 2025 SFDEJ. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default HomePage;