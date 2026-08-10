import "server-only";
import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import { renderEmail, renderEmailText, type EmailBlock } from "./template";

/**
 * Transactional e-posta gönderimi (Resend).
 *
 * RESEND_API_KEY tanımlı değilse gönderim yapılmaz; e-posta konsola loglanır
 * ve `{ skipped: true }` döner. Böylece domain/anahtar hazır olmadan da
 * sipariş akışı yerelde uçtan uca çalıştırılabilir.
 */

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? `${BRAND.name} <onboarding@resend.dev>`;

let client: Resend | null = null;
function getClient(): Resend | null {
  if (!apiKey) return null;
  client ??= new Resend(apiKey);
  return client;
}

export type SendResult =
  | { ok: true; id: string | null }
  | { ok: false; skipped: true }
  | { ok: false; error: string };

async function send(
  to: string | string[],
  subject: string,
  block: EmailBlock,
): Promise<SendResult> {
  const resend = getClient();

  if (!resend) {
    console.warn(
      `[email] RESEND_API_KEY yok — gönderilmedi.\n  Kime: ${Array.isArray(to) ? to.join(", ") : to}\n  Konu: ${subject}`,
    );
    return { ok: false, skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html: renderEmail(block),
    text: renderEmailText(block),
  });

  if (error) {
    console.error("[email] gönderim hatası:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data?.id ?? null };
}

const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// --- Sipariş akışı şablonları ----------------------------------------------

/** 1. Talep formu gönderildiğinde müşteriye. */
export function sendOrderReceivedEmail(args: {
  to: string;
  fullName: string;
  orderNumber: string;
}): Promise<SendResult> {
  return send(args.to, `Talebiniz alındı — ${args.orderNumber}`, {
    preheader: `Sipariş numaranız ${args.orderNumber}. Davetiyeniz hazırlanmaya başlandı.`,
    eyebrow: "Talebiniz alındı",
    heading: `Teşekkürler, ${args.fullName}`,
    paragraphs: [
      `Davetiye talebiniz bize ulaştı. Sipariş numaranız: ${args.orderNumber}`,
      "Ekibimiz davetiyenizi hazırlamaya başlıyor. Hazır olduğunda size tekrar yazacağız; süreci panelinizden de takip edebilirsiniz.",
    ],
    cta: { label: "Siparişimi Görüntüle", url: `${siteUrl()}/panel` },
  });
}

/** 2. Admin siparişi "İşlemde"ye çektiğinde müşteriye (opsiyonel). */
export function sendOrderInProgressEmail(args: {
  to: string;
  fullName: string;
  orderNumber: string;
}): Promise<SendResult> {
  return send(args.to, `Davetiyeniz hazırlanıyor — ${args.orderNumber}`, {
    preheader: "Tasarımcımız davetiyeniz üzerinde çalışmaya başladı.",
    eyebrow: "Hazırlanıyor",
    heading: `Davetiyeniz üzerinde çalışıyoruz`,
    paragraphs: [
      `Merhaba ${args.fullName}, ${args.orderNumber} numaralı siparişiniz işleme alındı.`,
      "Hazır olduğunda davetiye linkiniz e-posta ile size iletilecek ve panelinizde görünür olacak.",
    ],
    cta: { label: "Panele Git", url: `${siteUrl()}/panel` },
  });
}

/** 3. Admin linki girip siparişi "Tamamlandı"ya çektiğinde müşteriye. */
export function sendOrderCompletedEmail(args: {
  to: string;
  fullName: string;
  orderNumber: string;
  invitationUrl: string;
}): Promise<SendResult> {
  return send(args.to, `Davetiyeniz hazır! — ${args.orderNumber}`, {
    preheader: "Davetiye linkiniz hazır, paylaşmaya başlayabilirsiniz.",
    eyebrow: "Hazır",
    heading: "Davetiyeniz hazır",
    paragraphs: [
      `Merhaba ${args.fullName}, ${args.orderNumber} numaralı siparişiniz tamamlandı.`,
      "Aşağıdaki bağlantıyı misafirlerinizle WhatsApp, SMS veya sosyal medya üzerinden paylaşabilirsiniz. Katılım yanıtlarını panelinizden takip edebilirsiniz.",
      args.invitationUrl,
    ],
    cta: { label: "Davetiyemi Görüntüle", url: args.invitationUrl },
  });
}

/** 4. Yeni talep geldiğinde ekibe. */
export function sendNewOrderAdminAlert(args: {
  orderNumber: string;
  customerName: string;
  eventType: string;
}): Promise<SendResult> {
  const to = process.env.EMAIL_ADMIN;
  if (!to) {
    console.warn("[email] EMAIL_ADMIN tanımlı değil — admin bildirimi atlandı.");
    return Promise.resolve({ ok: false, skipped: true });
  }
  return send(to, `Yeni sipariş: ${args.orderNumber}`, {
    preheader: `${args.customerName} · ${args.eventType}`,
    eyebrow: "Yeni talep",
    heading: `Yeni sipariş — ${args.orderNumber}`,
    paragraphs: [
      `Müşteri: ${args.customerName}`,
      `Etkinlik türü: ${args.eventType}`,
    ],
    cta: {
      label: "Siparişi Aç",
      url: `${siteUrl()}/admin/siparisler/${args.orderNumber}`,
    },
  });
}
