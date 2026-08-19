import Link from "next/link";
import Logo from "@/components/marketing/Logo";
import { inputClass } from "@/components/ui/field";

/** Auth formlarındaki ortak input görünümü. */
export const authInput = inputClass("marketing", "bg-cream");

interface Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  /** Kartın altındaki yönlendirme satırları */
  below?: React.ReactNode;
  /** Kart genişliği — giriş/sıfırlama 400px, kayıt 420px */
  width?: 400 | 420;
  /** Başlık boyutu — sıfırlama sayfasında 26px, diğerlerinde 28px */
  titleSize?: 26 | 28;
  /**
   * Logonun altında görünen küçük bağlam etiketi.
   * Yönetim panelinde "Yönetim Paneli" olarak kullanılır.
   */
  eyebrow?: string;
}

/**
 * Giriş / kayıt / şifre sıfırlama ve yönetim girişi için ortak kart düzeni.
 * Dört ekran da aynı açık, sıcak dünyayı paylaşır — yönetim girişi ayrı bir
 * koyu tema taşımaz, farkı `eyebrow` etiketiyle belli eder.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
  below,
  width = 400,
  titleSize = 28,
  eyebrow,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center font-body text-ink bg-cream px-5 py-10 sm:p-10 relative overflow-hidden">
      {/* Ambient background light glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 blur-[130px] pointer-events-none rounded-full" />

      <div
        className={`w-full relative z-10 ${width === 400 ? "max-w-[420px]" : "max-w-[450px]"}`}
      >
        <Link
          href="/"
          className="block text-center text-ink mb-3 group transition-transform duration-200 hover:scale-105"
        >
          <Logo size={26} />
        </Link>

        {eyebrow ? (
          <div className="text-center text-[11.5px] tracking-[0.18em] uppercase text-gold font-semibold mb-6">
            {eyebrow}
          </div>
        ) : (
          <div className="mb-6" />
        )}

        <div className="glass-luxury border border-gold/30 rounded-2xl p-8 sm:p-10 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.08)]">
          <h1
            className={`font-display font-medium ${
              titleSize === 28 ? "text-[30px]" : "text-[26px]"
            } m-0 mb-2.5 text-center text-ink tracking-tight`}
          >
            {title}
          </h1>
          <p className="text-xs sm:text-[13.5px] text-muted text-center font-light m-0 mb-8 leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>

        {below}
      </div>
    </div>
  );
}
