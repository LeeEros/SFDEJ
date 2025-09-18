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
          <MediaPorCategoriaChart />
        </div>

        <div className="col-span-12 xl:col-span-5">

        </div>

        <div className="col-span-12 xl:col-span-7">

        </div>
      </div>
    </>
  );
}
