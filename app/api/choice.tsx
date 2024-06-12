import { createClient } from "@/utils/supabase/server";

// - Choice.tsx
//     - Updates user table and acts table for new activity sign-up
//     - Gets user input from a drop down menu about which activity they would like
//     - When the user is inputing we should be tracking who they are signing up for (themselves for their party members 