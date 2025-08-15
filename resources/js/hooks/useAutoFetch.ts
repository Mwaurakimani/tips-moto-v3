// resources/js/hooks/useAutoFetch.ts
import { useEffect, useMemo, useState } from 'react';

type AsyncFn = (...args: any[]) => Promise<any>;
type LoaderMap = Record<string, AsyncFn>;
type ArgsMap = Record<string, any[] | undefined>;

export function useAutoFetch(loaders: LoaderMap, args?: ArgsMap) {
    const [data, setData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, unknown>>({});

    const keys = useMemo(() => Object.keys(loaders).filter(k => typeof loaders[k] === 'function' && k.startsWith('get')), [loaders]);

    const fetchKey = async (key: string) => {
        try {
            setLoading(prev => ({ ...prev, [key]: true }));
            const res = await loaders[key](...(args?.[key] ?? []));
            setData(prev => ({ ...prev, [key]: res }));
            setErrors(prev => ({ ...prev, [key]: undefined }));
        } catch (e) {
            setErrors(prev => ({ ...prev, [key]: e }));
        } finally {
            setLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const refetch = async (onlyKey?: string) => {
        if (onlyKey) return fetchKey(onlyKey);
        await Promise.all(keys.map(fetchKey));
    };

    useEffect(() => { refetch(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, keys);

    return { data, loading, errors, refetch };
}

/** Variant that auto-detects getters from a props object */
export function useAutoFetchFromProps<P extends Record<string, any>>(props: P, args?: ArgsMap) {
    const loaders: LoaderMap = useMemo(() => {
        const out: LoaderMap = {};
        for (const [k, v] of Object.entries(props)) {
            if (k.startsWith('get') && typeof v === 'function') out[k] = v as AsyncFn;
        }
        return out;
    }, [props]);
    return useAutoFetch(loaders, args);
}
