import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const token = request.cookies.get("auth_token")?.value;

	// Se não tiver token e tentar acessar /home
	if (!token && request.nextUrl.pathname.startsWith("/home")) {
		return NextResponse.redirect(new URL("/login", request.url));
	} else if (token && request.nextUrl.pathname === "/login" || (token && request.nextUrl.pathname === "/")) {
		console.log('teste');
		return NextResponse.redirect(new URL("/home", request.url));
	}

	return NextResponse.next();
}

// Define quais rotas o middleware roda
export const config = {
	matcher: ["/:path*"], // protege tudo que começa com /home
};
