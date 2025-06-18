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
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            request.cookies.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    const roleRoutes: Record<string, string> = {
      admin: "/admin",
      program_director: "/pds/dashboard",
      counselor: "/counselors/dashboard",
      family_camp_attendee: "/family_camp/dashboard",
    };

    const rolesRequiringApproval = ["admin", "program_director", "counselor"];

    if (user) {
      const userMetadata = typeof user.user_metadata === "string"
        ? JSON.parse(user.user_metadata)
        : user.user_metadata;

      const role = userMetadata?.role;
      const approved = userMetadata?.approved;

      // Block unapproved users for restricted roles
      if (
        rolesRequiringApproval.includes(role) &&
        approved !== true &&
        Object.values(roleRoutes).some(route => path.startsWith(route))
      ) {
        return NextResponse.redirect(new URL("/approval-pending", request.url));
      }

      // Check if user is trying to access a role-restricted path
      for (const [expectedRole, protectedPath] of Object.entries(roleRoutes)) {
        if (path.startsWith(protectedPath) && role !== expectedRole) {
          return NextResponse.redirect(new URL("/not-authorized", request.url));
        }
      }

    } else {
      // Not logged in and trying to access protected routes
      const protectedPaths = Object.values(roleRoutes);
      if (protectedPaths.some(p => path.startsWith(p))) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    return response;
  } catch (e) {
    console.error("Error in middleware:", e);
    return NextResponse.redirect(new URL("/error", request.url));
  }
};
