// pages/DashboardAccount.jsx
import { Head, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/layouts/UserDashboardLayout/UserDashboardLayout.jsx';
import { UserAccountPage } from '@/pages/tips-moto/components/UserAccountPage';

export default function DashboardAccount() {
    const { props } = usePage();
    const currentUser = props.auth?.user;

    return (
        <>
            <Head title="Account - Dashboard" />
            <UserAccountPage
                currentUser={currentUser}
            />
        </>
    );
}

DashboardAccount.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;
