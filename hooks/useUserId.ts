// Import a client-side configured Supabase client
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import {createClient} from '@/utils/supabase/client'; // Adjust this import to your client setup

const useUserId = (): string | null => {
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setUserId(user.id);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
                setUserId(null);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: string, session: Session | null) => {
                setUserId(session?.user?.id || null);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return userId;
};

export default useUserId;
