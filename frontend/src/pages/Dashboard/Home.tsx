import PageMeta from "../../components/common/PageMeta";
import MediaPorCategoriaChart from "../Charts/MediaPorCategoria";

export default function Home() {
  return (
    <>
      <PageMeta
        title="SFDEJ"
        description="Sistema de Feedback de Empresários Juniores - Dashboard Administrativo"
      />

      <MediaPorCategoriaChart />

    </>
  );
}
