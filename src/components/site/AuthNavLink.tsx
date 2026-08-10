"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Header'ın sağ ucundaki oturum bağlantısı.
 *
 * Oturum SUNUCUDA değil istemcide okunuyor: pazarlama sayfaları statik
 * üretiliyor ve burada `cookies()` çağırmak hepsini dinamiğe çevirir,
 * her ziyarette sunucuya ve Supabase'e gidilirdi. Bunun karşılığı,
 * giriş yapmış kullanıcıda etiketin bir anlığına "Giriş Yap" görünmesi.
 */
export default function AuthNavLink({ className }: { className: string }) {
  // Varsayılan "çıkış yapılmış": ziyaretçilerin çoğunluğu için doğru olan
  // ve Supabase yapılandırılmadığında da geçerli kalan durum.
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const supabase = createClient();
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(Boolean(data.session));
    });

    // Başka bir sekmede giriş/çıkış yapılırsa etiket güncel kalsın
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setSignedIn(Boolean(session));
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return (
    <Link href={signedIn ? "/panel" : "/giris"} className={className}>
      {signedIn ? "Hesabım" : "Giriş Yap"}
    </Link>
  );
}
