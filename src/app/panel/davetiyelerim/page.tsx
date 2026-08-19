import type { Metadata } from "next";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import PanelShell from "@/components/panel/PanelShell";
import Badge from "@/components/ui/Badge";
import { createClient, withTimeout } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, formatDate } from "@/lib/orders";
import { getTheme } from "@/data/themes";

export const metadata: Metadata = { title: "Davetiyelerim" };

export default async function DavetiyelerimPage() {
  let invitations: any[] = [];

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const userRes = await withTimeout(supabase.auth.getUser(), 1500);
      const user = userRes.data?.user;

      if (user) {
        const { data: dbInvs } = await withTimeout(
          supabase
            .from("invitations")
            .select(
              "id, slug, theme_slug, event_type, bride_name, groom_name, event_at, published",
            )
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          1800,
        );

        if (dbInvs) {
          invitations = dbInvs.map((i) => ({ ...i, replies_count: 0 }));
        }
      }
    } catch (e) {
      console.warn("Supabase invitations fetch error:", e);
    }
  }

  return (
    <PanelShell>
      <div className="flex justify-between items-baseline mb-8 gap-4 pb-6 border-b border-gold/15">
        <div>
          <div className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-gold mb-1">
            CANLI DAVETİYE YÖNETİMİ
          </div>
          <h1 className="font-display font-medium text-3xl sm:text-4xl text-ink m-0 tracking-tight">
            Davetiyelerim
          </h1>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
          {invitations.length} Hazır Davetiye
        </div>
      </div>

      {!invitations.length ? (
        <div className="glass-luxury rounded-2xl p-12 text-center border border-gold/20 shadow-md">
          <p className="text-base text-muted font-light m-0 mb-6">
            Henüz oluşturulmuş yayında bir davetiyeniz bulunmuyor.
          </p>
          <ButtonLink href="/davetiye-talebi" variant="gold" size="md" shape="pill" className="apple-press font-semibold">
            Davetiye Talebi Oluştur →
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {invitations.map((inv) => {
            const theme = getTheme(inv.theme_slug);
            const couple =
              [inv.bride_name, inv.groom_name].filter(Boolean).join(" & ") ||
              EVENT_TYPES[inv.event_type as keyof typeof EVENT_TYPES] || "Davetiye";

            return (
              <div
                key={inv.id}
                className="glass-luxury rounded-2xl p-6 border border-gold/25 shadow-sm flex flex-col sm:flex-row gap-6 sm:items-center justify-between transition-all duration-200 apple-press"
              >
                <div
                  className="w-20 h-24 shrink-0 rounded-xl overflow-hidden shadow-md border border-gold/30 flex flex-col items-center justify-center p-2 text-white text-center"
                  style={theme ? { background: theme.stripe } : { background: "#1a1512" }}
                >
                  <span className="font-display italic text-amber-200 text-sm font-semibold">VIP</span>
                  <span className="text-[9px] uppercase tracking-widest text-gold-light mt-1 font-mono">DİJİTAL</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-display text-2xl font-semibold text-ink tracking-tight">
                      {couple}
                    </span>
                    <Badge tone={inv.published ? "ok" : "neutral"}>
                      {inv.published ? "Yayında" : "Hazırlanıyor"}
                    </Badge>
                  </div>

                  <div className="text-xs text-muted font-light mb-1">
                    Etkinlik Türü: <span className="font-medium text-ink">{EVENT_TYPES[inv.event_type as keyof typeof EVENT_TYPES] || "Düğün"}</span> · {formatDate(inv.event_at)}
                  </div>

                  {inv.published && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-medium mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{inv.replies_count > 0 ? `${inv.replies_count} Konuk Yanıt Verdi (RSVP)` : "Katılım bekleniyor"}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  {inv.published && (
                    <ButtonLink
                      href={`/panel/davetiye/${inv.slug}`}
                      variant="secondary"
                      size="sm"
                      shape="pill"
                      className="apple-press"
                    >
                      RSVP Yanıtları
                    </ButtonLink>
                  )}
                  <ExternalButtonLink
                    href={`/davetiye/${inv.slug}`}
                    variant="gold"
                    size="sm"
                    shape="pill"
                    className="apple-press font-semibold"
                  >
                    {inv.published ? "Davetiyeyi Aç →" : "Önizle →"}
                  </ExternalButtonLink>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelShell>
  );
}
