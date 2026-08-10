import { ButtonLink } from "@/components/ui/Button";

interface Props {
  icon: string;
  iconClass: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Ödeme sonucu gibi tek mesajlı, tam ekran ortalanmış sonuç ekranları. */
export default function ResultScreen({
  icon,
  iconClass,
  title,
  body,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center font-body text-ink bg-cream text-center p-10">
      <div className="max-w-[460px]">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-[28px] mx-auto mb-7 ${iconClass}`}
        >
          {icon}
        </div>
        <h1 className="font-display font-medium text-[34px] m-0 mb-3.5">
          {title}
        </h1>
        <p className="text-[15px] leading-[1.7] text-muted m-0 mb-8">{body}</p>
        <ButtonLink href={ctaHref} variant="primary" size="lg" shape="sharp">
          {ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
