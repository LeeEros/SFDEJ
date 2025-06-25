import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";

export default function Home() {
  return (
    <>
      <PageMeta
        title="SFDEJ - Admin Dashboard"
        description="Sistema de Feedback de Empresários Juniores - Dashboard Administrativo"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <MonthlySalesChart />
        </div>
      </div>
    </>
  );
}
