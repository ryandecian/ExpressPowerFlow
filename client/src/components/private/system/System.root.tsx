/* Import des hooks React */
import { useEffect, useState } from "react";

/* Import des Utils */
import fetchAPI from "../../../utils/fetchAPI.utils";

type FetchResultType = {
    error: string | null;
    data: Record<string, unknown> | null;
};

function System_Root() {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<Record<string, unknown> | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchData() {
            setLoading(true);

            const result: FetchResultType = await fetchAPI("GET", "/system");

            if (!isMounted) {
                return;
            }

            setError(result.error);
            setData(result.data);
            setLoading(false);
        }

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <section>
                <p>Chargement…</p>
            </section>
        );
    }

    if (error) {
        return (
            <section>
                <p>Erreur : {error}</p>
            </section>
        );
    }

    return (
        <section>
            <p>{String(data?.data)}</p>
        </section>
    );
}

export default System_Root;
