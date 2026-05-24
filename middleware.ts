import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminPath, isProtected } from "@/lib/auth/route-policy";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminRoute = isAdminPath(pathname);
  if (!adminRoute && !isProtected(pathname)) {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Supabase is required for every protected surface. Without it we
    // cannot resolve a session, so we always punt to /sign-in (which has
    // its own helpful empty state when env vars are missing).
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(signInUrl);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getSession() refreshes an expired access token via the setAll
  // callback above. getUser() then validates the (possibly refreshed)
  // token against Supabase. Without the getSession() call, a user
  // with an expired token would silently fail on subsequent requests.
  await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("next", pathname);
    return redirectWithCookies(signInUrl, response);
  }

  if (adminRoute) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return redirectWithCookies(new URL("/", request.url), response);
    }
  }

  return response;
}

// Build a redirect response that preserves any auth cookies Supabase
// just refreshed on the in-flight `response`. Without this, a session
// that gets refreshed mid-request and then bounces to /sign-in (or /)
// loses the freshly-issued access/refresh tokens, and the user gets
// kicked back to /sign-in on the next navigation despite being valid.
function redirectWithCookies(to: URL, source: NextResponse): NextResponse {
  const redir = NextResponse.redirect(to);
  source.cookies.getAll().forEach((cookie) => {
    redir.cookies.set(cookie);
  });
  return redir;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
