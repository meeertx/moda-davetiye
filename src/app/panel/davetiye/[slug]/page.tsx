import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import PanelShell from "@/components/panel/PanelShell";
import NotConfiguredNotice from "@/components/panel/NotConfiguredNotice";
import Badge from "@/components/ui/Badge";
import { ExternalButtonLink } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDateTime } from "@/lib/orders";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Katılım Yanıtları" };

const statCard =
  "bg-paper-alt border border-line-panel rounded-[10px] p-[18px]";

export default async function RsvpListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSupabaseConfigured) {
    return (
      <PanelShell>
        <NotConfiguredNotice />
      </PanelShell>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/giris?next=/panel/davetiye/${slug}`);

  // user_id filtresi: RLS zaten sınırlıyor, bu müşteri alanını rolden
  // bağımsız olarak "kendi davetiyem"e kilitler.
  const { data: invitation } = await supabase
    .from("invitations")
    .select(
      "id, slug, bride_name, groom_name, published, rsvp_enabled, guest_photos_enabled",
    )
    .eq("slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invitation) notFound();

  // Onay bekleyen misafir fotoğrafı sayısı — başlıkta rozet olarak durur
  const { count: pendingPhotos } = invitation.guest_photos_enabled
    ? await supabase
        .from("guest_photos")
        .select("id", { count: "exact", head: true })
        .eq("invitation_id", invitation.id)
        .eq("approved", false)
    : { count: 0 };

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("*")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  const list = rsvps ?? [];
  const attending = list.filter((r) => r.attending);
  const totalGuests = attending.reduce((sum, r) => sum + r.party_size, 0);

  const couple =
    [invitation.bride_name, invitation.groom_name].filter(Boolean).join(" & ") ||
    "Davetiyeniz";

  return (
    <PanelShell>
      <Link href="/panel/davetiyelerim" className="text-[13px] text-muted">
        ← Davetiyelerime dön
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-1 flex-wrap">
        <h1 className="font-display font-medium text-[32px] m-0">{couple}</h1>
        <Badge tone={invitation.published ? "ok" : "neutral"}>
          {invitation.published ? "Yayında" : "Hazırlanıyor"}
        </Badge>
      </div>
      <p className="text-sm text-muted m-0 mb-6 break-all">
        {BRAND.domain}/{invitation.slug}
      </p>

      {invitation.guest_photos_enabled && (
        <Link
          href={`/panel/davetiye/${slug}/anilar`}
          className="inline-flex items-center gap-2.5 text-[13.5px] bg-paper-alt border border-line-panel rounded-[10px] px-4 py-3 mb-8 text-ink hover:border-gold transition-colors"
        >
          Misafir Anıları
          {pendingPhotos ? (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gold text-[11px] text-white">
              {pendingPhotos}
            </span>
          ) : null}
          <span aria-hidden="true">→</span>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Toplam Yanıt", value: list.length, cls: "" },
          { label: "Katılıyor", value: attending.length, cls: "text-ok-fg" },
          {
            label: "Katılamıyor",
            value: list.length - attending.length,
            cls: "text-danger-fg",
          },
          { label: "Toplam Kişi", value: totalGuests, cls: "" },
        ].map((s) => (
          <div key={s.label} className={statCard}>
            <div className="text-xs text-muted mb-1.5">{s.label}</div>
            <div className={`font-display text-[26px] font-semibold ${s.cls}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {!invitation.rsvp_enabled && (
        <p className="text-sm text-muted mb-6">
          Bu davetiyede katılım bildirimi kapalı.
        </p>
      )}

      {!list.length ? (
        <div className="bg-paper-alt border border-line-panel rounded-[10px] p-10 text-center">
          <div className="font-display text-xl mb-2">Henüz yanıt yok</div>
          <p className="text-sm text-muted leading-[1.7] m-0 mb-5">
            Davetiye bağlantınızı misafirlerinizle paylaştıkça yanıtlar
            burada birikecek.
          </p>
          <ExternalButtonLink
            href={`/${invitation.slug}`}
            variant="secondary"
            size="sm"
          >
            Davetiyeyi Aç →
          </ExternalButtonLink>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((r) => (
            <div
              key={r.id}
              className="bg-paper-alt border border-line-panel rounded-[10px] px-5 py-4"
            >
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <span className="text-[15px]">{r.guest_name}</span>
                <Badge tone={r.attending ? "ok" : "danger"}>
                  {r.attending ? "Katılıyor" : "Katılamıyor"}
                </Badge>
                {r.attending && r.party_size > 1 && (
                  <span className="text-[13px] text-muted">
                    {r.party_size} kişi
                  </span>
                )}
                <span className="text-[13px] text-muted ml-auto">
                  {formatDateTime(r.created_at)}
                </span>
              </div>

              {r.note && (
                <p className="text-[13.5px] text-muted leading-[1.6] m-0 mt-2">
                  {r.note}
                </p>
              )}

              {Object.entries(r.answers ?? {}).map(([q, a]) => (
                <p
                  key={q}
                  className="text-[13px] text-muted leading-[1.6] m-0 mt-1.5"
                >
                  <span className="text-slate">{q}</span> {a}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
    </PanelShell>
  );
}
