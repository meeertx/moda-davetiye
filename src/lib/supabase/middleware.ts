import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/supabase";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  isSupabaseConfigured,
} from "./config";

/**
 * Oturum çerezini tazeler ve korumalı route'ları kapatır.
 *
 * Güvenlik notu: asıl yetki garantisi veritabanındaki RLS politikalarında.
 * Buradaki kontrol, yetkisiz kullanıcının admin arayüzünü (boş da olsa)
 * görmesini engellemek için ek bir katman.
 */
export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase yapılandırılmadıysa koruma uygulanmaz — proje henüz
  // bağlanmadan sitede gezinilebilsin diye.
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() çerezi tazeler — getSession() ile değiştirilmemeli.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminArea = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/giris";
  const isPanel = pathname.startsWith("/panel");
  // Talep akışının yalnızca son adımı korumalı: 1. adım ve demo önizleme
  // bilerek herkese açık, giriş ancak sipariş oluşturulurken isteniyor.
  const isOrderDetails = pathname.startsWith("/davetiye-talebi/detaylar");

  // Giriş yapmamış kullanıcı korumalı alanlara giremez
  if (!user && (isPanel || isOrderDetails)) {
    const url = request.nextUrl.clone();
    url.pathname = "/giris";
    url.search = "";
    // Sorgu parametreleri de taşınır — form verisi orada duruyor
    url.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // Admin alanı: giriş + rol kontrolü.
  // Böylece paylaşılacak tek adres /admin olur — giriş yapmamış ziyaretçi
  // otomatik olarak /admin/giris'e düşer.
  if (isAdminArea) {
    if (!user) {
      if (!isAdminLogin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/giris";
        return NextResponse.redirect(url);
      }
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const isAdmin = profile?.role === "admin";

      // Yetkisi olmayan giriş yapmış kullanıcı admin arayüzünü göremez.
      // (/admin/giris hariç — başka bir hesapla giriş yapmak isteyebilir.)
      if (!isAdmin && !isAdminLogin) {
        const url = request.nextUrl.clone();
        url.pathname = "/panel";
        return NextResponse.redirect(url);
      }

      // Zaten admin olarak girmişse giriş formunu tekrar gösterme
      if (isAdmin && isAdminLogin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
    }
  }

  // Giriş yapmış kullanıcı auth sayfalarında oyalanmasın.
  // `next` varsa oraya devam eder — talep akışı yarıda kalmasın diye.
  if (user && (pathname === "/giris" || pathname === "/kayit")) {
    const next = request.nextUrl.searchParams.get("next");
    const url = request.nextUrl.clone();
    url.search = "";

    if (next && next.startsWith("/") && !next.startsWith("//")) {
      const [nextPath, nextQuery] = next.split("?");
      url.pathname = nextPath;
      if (nextQuery) url.search = `?${nextQuery}`;
    } else {
      url.pathname = "/panel";
    }
    return NextResponse.redirect(url);
  }

  return response;
}
