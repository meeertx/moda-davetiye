import type { Metadata } from "next";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/Button";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import Badge from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { EVENT_TYPES, formatDate } from "@/lib/orders";
import { getTheme } from "@/data/themes";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Davetiyelerim" };

/** Müşterinin davetiyeleri — RLS gereği yalnızca kendisininkiler döner. */
export default async function DavetiyelerimPage() {
  if (!isSupabaseConfigured) {
    return (
      <PanelShell>
        <h1 className="font-display font-medium text-[32px] m-0 mb-8">
          Davetiyelerim
        </h1>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: invitations } = await supabase
    .from("invitations")
    .select(
      "id, slug, theme_slug, event_type, bride_name, groom_name, event_at, published",
    )
    .eq("user_id", user?.id ?? "")
    .order("created_at", { ascending: false });

  // Her davetiyenin yanıt sayısı
  const counts = new Map<string, number>();
  if (invitations?.length) {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("invitation_id")
      .in(
        "invitation_id",
        invitations.map((i) => i.id),
      );
    for (const r of rsvps ?? [])
      counts.set(r.invitation_id, (counts.get(r.invitation_id) ?? 0) + 1);
  }

  return (
    <PanelShell>
      <h1 className="font-display font-medium text-[32px] m-0 mb-1">
        Davetiyelerim
      </h1>
      <p className="text-sm text-muted m-0 mb-7">
        Hazırlanan davetiyeleriniz ve katılım yanıtları.
      </p>

      {!invitations?.length ? (
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-10 text-center">
          <div className="font-display text-xl mb-2">
            Henüz davetiyeniz hazırlanmadı
          </div>
          <p className="text-sm text-muted leading-[1.7] m-0 mb-5">
            Siparişiniz işleme alındığında davetiyeniz burada görünecek.
          </p>
          <ButtonLink href="/panel" variant="primary" size="sm">
            Siparişlerimi Gör
          </ButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {invitations.map((inv) => {
            const theme = getTheme(inv.theme_slug);
            const couple =
              [inv.bride_name, inv.groom_name].filter(Boolean).join(" & ") ||
              EVENT_TYPES[inv.event_type];
            const replies = counts.get(inv.id) ?? 0;

            return (
              <div
                key={inv.id}
                className="bg-paper-alt border border-line-panel rounded-[10px] p-5 flex flex-col sm:flex-row gap-5 sm:items-center"
              >
                <div
                  className="w-16 h-20 shrink-0 rounded-md"
                  style={theme ? { background: theme.stripe } : undefined}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <span className="font-display text-xl font-semibold">
                      {couple}
                    </span>
                    <Badge tone={inv.published ? "ok" : "neutral"}>
                      {inv.published ? "Yayında" : "Hazırlanıyor"}
                    </Badge>
                  </div>
                  <div className="text-[13px] text-muted break-all">
                    {inv.published
                      ? `${BRAND.domain}/${inv.slug}`
                      : "Yayına alındığında bağlantısı burada görünecek"}
                    {inv.event_at && ` · ${formatDate(inv.event_at)}`}
                  </div>
                  {inv.published && (
                    <div className="text-[13px] text-muted mt-1">
                      {replies > 0
                        ? `${replies} katılım yanıtı`
                        : "Henüz yanıt yok"}
                    </div>
                  )}
                </div>

                <div className="flex gap-2.5 shrink-0 flex-wrap">
                  {inv.published && (
                    <ButtonLink
                      href={`/panel/davetiye/${inv.slug}`}
                      variant="secondary"
                      size="sm"
                    >
                      Yanıtlar
                    </ButtonLink>
                  )}
                  <ExternalButtonLink
                    href={`/${inv.slug}`}
                    variant="primary"
                    size="sm"
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
