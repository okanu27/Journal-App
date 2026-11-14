import { createClient } from "@supabase/supabase-js";

export const getUserSupabase = async (accessToken) => {
    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            global: {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            },

            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    );
};