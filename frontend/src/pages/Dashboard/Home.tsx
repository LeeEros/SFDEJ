import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="SFDEJ"
        description="Sistema de Feedback de Empresários Juniores - Dashboard Administrativo"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12">
          <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Bem-vindo ao SFDEJ
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Utilize o menu lateral para navegar pelas funcionalidades do sistema.
          </p>
        </div>

        <div className="col-span-12 xl:col-span-5">

        </div>

        <div className="col-span-12 xl:col-span-7">

        </div>
      </div>
    </>
  );
}
