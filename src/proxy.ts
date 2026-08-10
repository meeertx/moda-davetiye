import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Next.js 16'da `middleware` dosya kuralının yerini `proxy` aldı.
 * Oturum tazeleme ve route koruması burada çalışır.
 */
export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Statik dosyalar ve görseller dışındaki tüm istekler.
     * Oturum çerezinin tazelenmesi için auth dışı sayfalardan da geçilir.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-touch-icon.png|icon-192.png|icon-512.png|logo.svg|logo-mark.svg|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
