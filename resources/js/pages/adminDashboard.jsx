import { IncomeSummary } from '../pages/tips-moto/components/IncomeSummary';
import { RecentPurchases } from '../pages/tips-moto/components/RecentPurchases';
import AdminLayout from '@/layouts/AdminLayout/adminLayout.jsx';

export default function DashboardPage({ setCurrentPage }) {
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/*<StatsCards matches={allMatches} />*/}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <IncomeSummary />
                <RecentPurchases onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}

DashboardPage.layout = (page) => <AdminLayout>{page}</AdminLayout>;
