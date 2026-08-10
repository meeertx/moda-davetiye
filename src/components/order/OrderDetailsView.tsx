import { formatDate } from "@/lib/orders";
import type { OrderDetails } from "@/types/supabase";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[170px_1fr] gap-4 py-3 border-b border-line-soft last:border-b-0">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="text-sm break-words whitespace-pre-line">
        {value || "—"}
      </div>
    </div>
  );
}

const sectionTitle =
  "text-[13px] tracking-[0.03em] uppercase text-muted mb-3";
const card = "bg-paper-alt border border-line-panel rounded-[10px] p-7";

/**
 * Siparişin 2. aşamada toplanan detaylarını gösterir.
 * Hem müşteri hem admin detay sayfasında aynı görünüm kullanılır;
 * fotoğraflar yalnızca imzalı URL üretilebildiğinde gösterilir.
 */
export default function OrderDetailsView({
  details,
  photoUrls,
}: {
  details: OrderDetails;
  /** Storage'dan üretilmiş imzalı URL'ler */
  photoUrls?: string[];
}) {
  const hasVenue =
    details.venue_name || details.venue_address || details.venue_map_url;
  const hasRsvp =
    details.rsvp_deadline || details.rsvp_questions.length > 0;
  const hasGift = details.gift_note || details.gift_iban;

  return (
    <div className="flex flex-col gap-6">
      {hasVenue && (
        <div className={card}>
          <div className={sectionTitle}>Mekan ve Konum</div>
          <Row label="Mekan adı" value={details.venue_name} />
          <Row label="Açık adres" value={details.venue_address} />
          <Row
            label="Harita"
            value={
              details.venue_map_url ? (
                <a
                  href={details.venue_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Haritada aç →
                </a>
              ) : null
            }
          />
        </div>
      )}

      {details.program.length > 0 && (
        <div className={card}>
          <div className={sectionTitle}>Program Akışı</div>
          <div className="flex flex-col gap-3">
            {details.program.map((p, i) => (
              <div
                key={`${p.time}-${i}`}
                className="flex gap-5 items-baseline border-b border-line-soft last:border-b-0 pb-3 last:pb-0"
              >
                <div className="font-display text-lg text-gold w-20 shrink-0">
                  {p.time || "—"}
                </div>
                <div className="text-sm">{p.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(details.story || photoUrls?.length) && (
        <div className={card}>
          <div className={sectionTitle}>Hikaye ve Fotoğraflar</div>
          {details.story && (
            <p className="text-sm leading-[1.8] whitespace-pre-line m-0 mb-5">
              {details.story}
            </p>
          )}
          {photoUrls?.length ? (
            <div className="grid grid-cols-4 gap-2.5">
              {photoUrls.map((url) => (
                // Supabase imzalı URL'leri kısa ömürlü — next/image ile
                // önbelleklenmeleri anlamsız olur.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt=""
                  className="w-full aspect-square object-cover rounded-[4px] border border-line"
                />
              ))}
            </div>
          ) : details.photos.length > 0 ? (
            <p className="text-[13px] text-muted m-0">
              {details.photos.length} fotoğraf yüklendi.
            </p>
          ) : null}
        </div>
      )}

      {hasRsvp && (
        <div className={card}>
          <div className={sectionTitle}>Katılım (RSVP) Ayarları</div>
          <Row
            label="Yanıt son tarihi"
            value={formatDate(details.rsvp_deadline)}
          />
          <Row
            label="+1 izni"
            value={details.rsvp_plus_one ? "Var" : "Yok"}
          />
          <Row
            label="Ek sorular"
            value={
              details.rsvp_questions.length
                ? details.rsvp_questions.join("\n")
                : null
            }
          />
        </div>
      )}

      {details.music_note && (
        <div className={card}>
          <div className={sectionTitle}>Müzik Talebi</div>
          <p className="text-sm leading-[1.7] m-0 break-words">
            {details.music_note}
          </p>
        </div>
      )}

      {hasGift && (
        <div className={card}>
          <div className={sectionTitle}>Hediye</div>
          <Row label="Not" value={details.gift_note} />
          <Row label="IBAN" value={details.gift_iban} />
        </div>
      )}
    </div>
  );
}
