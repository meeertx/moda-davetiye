import { BRAND, BRAND_HEX as C } from "@/lib/brand";

export interface EmailBlock {
  /** Gelen kutusu önizlemesinde konu satırının yanında görünen kısa metin */
  preheader: string;
  heading: string;
  /** Her eleman ayrı bir paragraf */
  paragraphs: string[];
  cta?: { label: string; url: string };
  /** Başlığın üstündeki küçük yaldız etiket */
  eyebrow?: string;
}

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Marka kimliğine uygun, tablo tabanlı HTML e-posta şablonu.
 *
 * E-posta istemcileri flexbox/grid ve harici font desteklemediği için
 * tablo düzeni, satır içi stil ve sistem serif yığını kullanılır.
 */
export function renderEmail(block: EmailBlock): string {
  const { preheader, heading, paragraphs, cta, eyebrow } = block;

  const body = paragraphs
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${C.muted}">${escapeHtml(p)}</p>`,
    )
    .join("");

  const button = cta
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 0">
         <tr><td style="background:${C.ink};border-radius:2px">
           <a href="${escapeHtml(cta.url)}" style="display:inline-block;padding:15px 30px;font-family:Helvetica,Arial,sans-serif;font-size:14px;color:${C.cream};text-decoration:none">${escapeHtml(cta.label)}</a>
         </td></tr>
       </table>`
    : "";

  const eyebrowRow = eyebrow
    ? `<div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.gold};margin-bottom:14px">${escapeHtml(eyebrow)}</div>`
    : "";

  return `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};font-family:Helvetica,Arial,sans-serif">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${C.paper};border:1px solid ${C.line};border-radius:6px">

        <tr><td style="padding:32px 40px 0;text-align:center">
          <span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-style:italic;font-weight:600;color:${C.ink}">${BRAND.name}<span style="color:${C.gold}">.</span></span>
        </td></tr>

        <tr><td style="padding:32px 40px 40px">
          ${eyebrowRow}
          <h1 style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:26px;color:${C.ink}">${escapeHtml(heading)}</h1>
          ${body}
          ${button}
        </td></tr>

        <tr><td style="padding:24px 40px;background:${C.ink};border-radius:0 0 6px 6px">
          <p style="margin:0;font-size:12px;line-height:1.6;color:${C.line}">
            Bu e-posta ${BRAND.name} tarafından gönderildi.<br>
            Sorularınız için: <a href="mailto:${BRAND.email}" style="color:${C.goldLight};text-decoration:none">${BRAND.email}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`;
}

/** HTML desteklemeyen istemciler için düz metin karşılığı. */
export function renderEmailText(block: EmailBlock): string {
  const parts = [block.heading, "", ...block.paragraphs];
  if (block.cta) parts.push("", `${block.cta.label}: ${block.cta.url}`);
  parts.push("", `— ${BRAND.name} · ${BRAND.email}`);
  return parts.join("\n");
}
