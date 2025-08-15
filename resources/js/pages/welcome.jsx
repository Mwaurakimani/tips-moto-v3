// resources/js/pages/Welcome.tsx (or wherever your Inertia Welcome page lives)
import { Head } from '@inertiajs/react';
import AppContainer from '@/app-container';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <AppContainer forceApp showToaster={false} />
        </>
    );
}
