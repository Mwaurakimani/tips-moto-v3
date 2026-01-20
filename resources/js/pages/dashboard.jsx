
// pages/dashboard.jsx
import { Head, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/layouts/UserDashboardLayout/UserDashboardLayout.jsx';
import { UserDashboardOverview } from '@/pages/tips-moto/components/UserDashboardOverview';

export default function Dashboard() {
    const { props } = usePage();
    const { matches = [], stats = {}, todayFreeTipsMessage = '' } = props;

    // Get user from layout context or props
    const currentUser = props.auth?.user;

    return (
        <>
            <Head title="Dashboard" />
            <UserDashboardOverview
                currentUser={currentUser}
                allMatches={matches}
                stats={stats}
                todayFreeTipsMessage={todayFreeTipsMessage}
            />
        </>
    );
}

Dashboard.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;
