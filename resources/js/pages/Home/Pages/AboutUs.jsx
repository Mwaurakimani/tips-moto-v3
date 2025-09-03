import HomeLayout from '@/layouts/HomeLayout/HomeLayout.jsx';
import { Head, router } from '@inertiajs/react';
import { UserHeader } from '@/pages/tips-moto/components/UserHeader.jsx';
import { UserAboutPage } from '@/pages/tips-moto/components/UserAboutPage.js';

export default function AboutUs() {
    console.clear()

    return (
        <>
            <Head title="About Us" />
            <div className="min-h-screen bg-black">
                {/* Header */}
                <UserHeader currentPage="about-us"/>

                <UserAboutPage
                    onBackToHome={() => {router.visit(route('home'))}}
                    onNavigateToTips={() => router.visit(route('tips'))}
                    onBackToAdmin={() => {}}
                    onSignIn={() => {}}
                    onGetStarted={() => {}}
                />
            </div>
        </>
    );
}

AboutUs.layout = (page) => <HomeLayout>{page}</HomeLayout>;
