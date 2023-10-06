// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { authRoutes, mainPage, protectedRoutes } from "./router/routes";
// import { verifyToken } from "@/services/authServices";
// import { useEffect } from "react";

// export function middleware(request: NextRequest) {
//   let isAuthenticated:boolean = false;
//   const verifyAccessToken = async ()=>{  
//     try {
//       const response = await verifyToken(JSON.stringify(request.cookies.get("user")));
//       if(response.status === 201){
//         isAuthenticated = true;
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   verifyAccessToken()

//   if (protectedRoutes.includes(request.nextUrl.pathname)&&!isAuthenticated) {
//     const response = NextResponse.redirect(new URL("/login", request.url));
//     return response;
//   }

//   if (authRoutes.includes(request.nextUrl.pathname) && isAuthenticated) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }
  
//   if (mainPage.includes(request.nextUrl.pathname)) {
//     if(isAuthenticated){
//         return NextResponse.redirect(new URL("/dashboard", request.url));
//     }
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

// }