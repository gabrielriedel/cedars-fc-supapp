// utils/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      },
    );

    await supabase.auth.getUser();

    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const userMetadata = typeof user.user_metadata === 'string' ? JSON.parse(user.user_metadata) : user.user_metadata;
      const role = userMetadata.role;

      if (role && request.nextUrl.pathname.startsWith('/admin')) {
        if (role !== "admin") {
          return NextResponse.redirect(new URL("/not-authorized", request.url));
        }
      }
    } else {
      if (request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Error in middleware:", e);
  }
};
