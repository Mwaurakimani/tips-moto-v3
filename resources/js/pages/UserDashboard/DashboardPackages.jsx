// pages/DashboardPackages.jsx
import { Head, usePage } from '@inertiajs/react';
import UserDashboardLayout from '@/layouts/UserDashboardLayout/UserDashboardLayout.jsx';
import { UserPackagesBrowser } from '@/pages/tips-moto/components/UserPackagesBrowser';

export default function DashboardPackages() {
    const { props } = usePage();
    const { packages = [], matches = [] } = props;

    const currentUser = props.auth?.user;

    return (
        <>
            <Head title="Packages - Dashboard" />
            <UserPackagesBrowser
                allMatches={matches}
                currentUser={currentUser}
                packages={packages}
            />
        </>
    );
}

DashboardPackages.layout = (page) => <UserDashboardLayout>{page}</UserDashboardLayout>;
