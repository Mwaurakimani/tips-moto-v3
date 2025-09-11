// pages/DashboardMyTips.jsx
import { Head, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/layouts/UserDashboardLayout/UserDashboardLayout.jsx';
import { UserMyTips } from '@/pages/tips-moto/components/UserMyTips';

export default function DashboardMyTips() {
    const { props } = usePage();
    const userTips = props.userTips.data
    const matches = props.matches ?? []
    const currentUser = props.auth?.user;
    const activePackages = props.activePackages

    return (
        <>
            <Head title="My Tips - Dashboard" />
            <UserMyTips
                currentUserEmail={currentUser?.email}
                userTips={userTips}
                allMatches={matches}
                userPackages = {activePackages}
                onGoToPackages={() => {
                    // This will be handled by the layout's navigation
                }}
            />
        </>
    );
}

DashboardMyTips.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;
