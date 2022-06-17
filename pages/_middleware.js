import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    //const url = req.nextUrl.clone();
    //url.pathname = '/login';

    // Token exists if user logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    // Allow requests if the following are true
    // 1. request for next-auth session & provider fetching
    // 2. token exists
    if (pathname.includes("/api/auth") || token) {
        return NextResponse.next();
    }

    // Redirect to login if no token & requesting protected route 
    if (!token && pathname !== "/login") {
        return NextResponse.rewrite(new URL('/login', req.url));
    }
}