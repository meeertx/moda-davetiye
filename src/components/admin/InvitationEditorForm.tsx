"use client";

import { useActionState, useState } from "react";
import {
  updateInvitationAction,
  togglePublishAction,
  type InvitationState,
} from "@/app/actions/invitations";
import { inputClass, labelClass, hintClass } from "@/components/ui/field";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";
import { THEMES } from "@/data/themes";
import { IMPLEMENTED_THEMES } from "@/components/invitation/ThemeRenderer";
import { BRAND } from "@/lib/brand";
import type { Database, ProgramItem } from "@/types/supabase";

type Row = Database["public"]["Tables"]["invitations"]["Row"];

const field = inputClass("panel");
const card = "bg-paper-alt border border-line-panel rounded-[10px] p-7";
const sectionTitle = "font-display font-medium text-xl m-0 mb-1";
const sectionHint = "text-[13px] text-muted m-0 mb-5 leading-[1.6]";
const dashed =
  "cursor-pointer px-4 py-2.5 border border-dashed border-line-panel bg-transparent rounded-[4px] text-[13px] text-muted self-start transition-colors hover:border-gold hover:text-ink";

let uid = 1;

/** ISO → <input type="datetime-local"> biçimi, yerel saat dilimiyle. */
function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function InvitationEditorForm({
  invitation,
  orderNumber,
}: {
  invitation: Row;
  orderNumber: string;
}) {
  const [saveState, saveAction] = useActionState<InvitationState, FormData>(
    updateInvitationAction,
    {},
  );
  const [pubState, pubAction] = useActionState<InvitationState, FormData>(
    togglePublishAction,
    {},
  );

  const [program, setProgram] = useState<(ProgramItem & { id: number })[]>(
    (invitation.program ?? []).map((p) => ({ ...p, id: uid++ })),
  );
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>(
    (invitation.rsvp_questions ?? []).map((text) => ({ id: uid++, text })),
  );
  const [menu, setMenu] = useState<{ id: number; text: string }[]>(
    (invitation.menu ?? []).map((text) => ({ id: uid++, text })),
  );
  const [slug, setSlug] = useState(invitation.slug);
  const [rsvpOn, setRsvpOn] = useState(invitation.rsvp_enabled);

  const publicUrl = `${BRAND.domain}/${slug}`;

  return (
    <div className="flex flex-col gap-6">
      {/* YAYIN DURUMU */}
      <form action={pubAction} className={card}>
        <input type="hidden" name="invitation_id" value={invitation.id} />
        <input type="hidden" name="order_number" value={orderNumber} />
        <input
          type="hidden"
          name="publish"
          value={invitation.published ? "0" : "1"}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className={sectionTitle}>
              {invitation.published ? "Yayında" : "Taslak"}
            </h2>
            <p className="text-[13px] text-muted m-0 mt-1 break-all">
              {invitation.published ? (
                <a
                  href={`https://${publicUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {publicUrl}
                </a>
              ) : (
                <>Yayına alındığında adres: {publicUrl}</>
              )}
            </p>
          </div>

          <div className="flex gap-2.5 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(`/${invitation.slug}`, "_blank")}
            >
              Önizle
            </Button>
            <SubmitButton
              variant={invitation.published ? "secondary" : "primary"}
              size="sm"
              pendingLabel="İşleniyor…"
            >
              {invitation.published ? "Yayından Kaldır" : "Yayına Al"}
            </SubmitButton>
          </div>
        </div>

        {pubState.error && (
          <div className="mt-4">
            <FormMessage>{pubState.error}</FormMessage>
          </div>
        )}
        {pubState.ok && (
          <div className="mt-4">
            <FormMessage tone="ok">{pubState.ok}</FormMessage>
            <Toast
              title="Yayın Durumu Güncellendi ✨"
              message={pubState.ok}
              type="success"
            />
          </div>
        )}
      </form>

      {/* İÇERİK */}
      <form action={saveAction} className="flex flex-col gap-6">
        <input type="hidden" name="invitation_id" value={invitation.id} />
        <input type="hidden" name="order_number" value={orderNumber} />
        <input
          type="hidden"
          name="program"
          value={JSON.stringify(
            program
              .filter((p) => p.time.trim() || p.title.trim())
              .map(({ time, title }) => ({
                time: time.trim(),
                title: title.trim(),
              })),
          )}
        />
        <input
          type="hidden"
          name="rsvp_questions"
          value={JSON.stringify(
            questions.map((q) => q.text.trim()).filter(Boolean),
          )}
        />
        <input
          type="hidden"
          name="menu"
          value={JSON.stringify(menu.map((m) => m.text.trim()).filter(Boolean))}
        />

        {saveState.error && <FormMessage>{saveState.error}</FormMessage>}
        {saveState.ok && (
          <>
            <FormMessage tone="ok">{saveState.ok}</FormMessage>
            <Toast
              title="Davetiye Kaydedildi ✨"
              message={saveState.ok}
              type="success"
            />
          </>
        )}

        <section className={card}>
          <h2 className={sectionTitle}>Temel Bilgiler</h2>
          <p className={sectionHint}>Davetiyenin açılış ekranında görünür.</p>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bride_name" className={labelClass}>
                  Gelin Adı
                </label>
                <input
                  id="bride_name"
                  name="bride_name"
                  defaultValue={invitation.bride_name ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="groom_name" className={labelClass}>
                  Damat Adı
                </label>
                <input
                  id="groom_name"
                  name="groom_name"
                  defaultValue={invitation.groom_name ?? ""}
                  className={field}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bride_parents" className={labelClass}>
                  Gelinin Ailesi
                </label>
                <input
                  id="bride_parents"
                  name="bride_parents"
                  placeholder="Sibel &amp; Hakan Yıldırım"
                  defaultValue={invitation.bride_parents ?? ""}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="groom_parents" className={labelClass}>
                  Damadın Ailesi
                </label>
                <input
                  id="groom_parents"
                  name="groom_parents"
                  placeholder="Gül &amp; Erdem Şahin"
                  defaultValue={invitation.groom_parents ?? ""}
                  className={field}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event_at" className={labelClass}>
                  Tarih ve Saat
                </label>
                <input
                  id="event_at"
                  name="event_at"
                  type="datetime-local"
                  defaultValue={toLocalInput(invitation.event_at)}
                  className={field}
                />
                <p className={hintClass}>Geri sayım buradan hesaplanır.</p>
              </div>
              <div>
                <label htmlFor="theme_slug" className={labelClass}>
                  Tema
                </label>
                <select
                  id="theme_slug"
                  name="theme_slug"
                  defaultValue={invitation.theme_slug}
                  className={field}
                >
                  {THEMES.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                      {IMPLEMENTED_THEMES.has(t.slug) ? "" : " (tasarımı hazırlanıyor)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="slug" className={labelClass}>
                Davetiye Adresi
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted">{BRAND.domain}/</span>
                <input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className={inputClass("panel", "flex-1 min-w-[220px]")}
                />
              </div>
              <p className={hintClass}>
                Küçük harf, rakam ve tire. Sondaki rastgele ek, adresin
                tahmin edilmesini engeller — kaldırmanızı önermem.
              </p>
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Mekan</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="venue_name" className={labelClass}>
                Mekan Adı
              </label>
              <input
                id="venue_name"
                name="venue_name"
                defaultValue={invitation.venue_name ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="venue_address" className={labelClass}>
                Açık Adres
              </label>
              <input
                id="venue_address"
                name="venue_address"
                defaultValue={invitation.venue_address ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="venue_map_url" className={labelClass}>
                Harita Bağlantısı
              </label>
              <input
                id="venue_map_url"
                name="venue_map_url"
                type="url"
                placeholder="https://maps.google.com/…"
                defaultValue={invitation.venue_map_url ?? ""}
                className={field}
              />
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Hikaye</h2>
          <p className={sectionHint}>Boş bırakılırsa bölüm gösterilmez.</p>
          <textarea
            name="story"
            rows={5}
            defaultValue={invitation.story ?? ""}
            className={`${field} resize-y`}
          />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Program</h2>
          <div className="flex flex-col gap-3 items-start">
            {program.map((row, i) => (
              <div key={row.id} className="flex gap-3 items-center w-full">
                <input
                  value={row.time}
                  onChange={(e) =>
                    setProgram((p) =>
                      p.map((r) =>
                        r.id === row.id ? { ...r, time: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="16:00"
                  aria-label={`${i + 1}. saat`}
                  className={inputClass("panel", "w-[110px]")}
                />
                <input
                  value={row.title}
                  onChange={(e) =>
                    setProgram((p) =>
                      p.map((r) =>
                        r.id === row.id ? { ...r, title: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="Nikah Töreni"
                  aria-label={`${i + 1}. başlık`}
                  className={inputClass("panel", "flex-1")}
                />
                <button
                  type="button"
                  onClick={() =>
                    setProgram((p) => p.filter((r) => r.id !== row.id))
                  }
                  aria-label="Satırı sil"
                  className="cursor-pointer bg-transparent border-0 text-muted hover:text-danger-fg text-lg px-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setProgram((p) => [...p, { id: uid++, time: "", title: "" }])
              }
              className={dashed}
            >
              + Satır Ekle
            </button>
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Menü</h2>
          <p className={sectionHint}>
            Her satır bir tabak. Boş bırakılırsa bölüm gösterilmez.
          </p>
          <div className="flex flex-col gap-3 items-start">
            {menu.map((row, i) => (
              <div key={row.id} className="flex gap-3 items-center w-full">
                <input
                  value={row.text}
                  onChange={(e) =>
                    setMenu((m) =>
                      m.map((r) =>
                        r.id === row.id ? { ...r, text: e.target.value } : r,
                      ),
                    )
                  }
                  placeholder="Kuzu Tandır"
                  aria-label={`${i + 1}. menü satırı`}
                  className={inputClass("panel", "flex-1")}
                />
                <button
                  type="button"
                  onClick={() => setMenu((m) => m.filter((r) => r.id !== row.id))}
                  aria-label="Satırı sil"
                  className="cursor-pointer bg-transparent border-0 text-muted hover:text-danger-fg text-lg px-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setMenu((m) => [...m, { id: uid++, text: "" }])}
              className={dashed}
            >
              + Menü Satırı Ekle
            </button>
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Ek Bilgiler</h2>
          <p className={sectionHint}>
            Vale, otel, kıyafet kodu… Her satır davetiyede ayrı bir madde
            olarak görünür.
          </p>
          <textarea
            name="extra_info"
            rows={4}
            defaultValue={invitation.extra_info ?? ""}
            aria-label="Ek bilgiler"
            className={`${field} resize-y`}
          />
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Katılım (RSVP)</h2>
          <div className="flex flex-col gap-4">
            <label className="flex gap-2.5 items-center text-sm">
              <input
                type="checkbox"
                name="rsvp_enabled"
                value="1"
                checked={rsvpOn}
                onChange={(e) => setRsvpOn(e.target.checked)}
              />
              Katılım bildirimi toplansın
            </label>

            {rsvpOn && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rsvp_deadline" className={labelClass}>
                      Yanıt Son Tarihi
                    </label>
                    <input
                      id="rsvp_deadline"
                      name="rsvp_deadline"
                      type="date"
                      defaultValue={invitation.rsvp_deadline ?? ""}
                      className={field}
                    />
                  </div>
                  <label className="flex gap-2.5 items-center text-sm sm:mt-7">
                    <input
                      type="checkbox"
                      name="rsvp_plus_one"
                      value="1"
                      defaultChecked={invitation.rsvp_plus_one}
                    />
                    +1 (refakatçi) izni
                  </label>
                </div>

                <div>
                  <span className={labelClass}>Misafire Sorulacak Sorular</span>
                  <div className="flex flex-col gap-3 items-start">
                    {questions.map((q, i) => (
                      <div key={q.id} className="flex gap-3 items-center w-full">
                        <input
                          value={q.text}
                          onChange={(e) =>
                            setQuestions((qs) =>
                              qs.map((x) =>
                                x.id === q.id
                                  ? { ...x, text: e.target.value }
                                  : x,
                              ),
                            )
                          }
                          aria-label={`${i + 1}. soru`}
                          className={field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setQuestions((qs) =>
                              qs.filter((x) => x.id !== q.id),
                            )
                          }
                          aria-label="Soruyu sil"
                          className="cursor-pointer bg-transparent border-0 text-muted hover:text-danger-fg text-lg px-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setQuestions((qs) => [...qs, { id: uid++, text: "" }])
                      }
                      className={dashed}
                    >
                      + Soru Ekle
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Anı Bırakın</h2>
          <p className={sectionHint}>
            Misafirler davetiyeye kendi fotoğraflarını bırakabilir. Gelen
            kareler doğrudan yayınlanmaz — çift, panelinden tek tek onaylar.
          </p>
          <label className="flex gap-2.5 items-center text-sm">
            <input
              type="checkbox"
              name="guest_photos_enabled"
              value="1"
              defaultChecked={invitation.guest_photos_enabled}
            />
            Misafirler fotoğraf yükleyebilsin
          </label>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Müzik</h2>
          <p className={sectionHint}>
            Davetiye açıldığında çalar ve sekme kapanana kadar döngüde
            devam eder. Doğrudan çalınabilir bir ses dosyası adresi olmalı
            (mp3/m4a) — YouTube bağlantısı çalışmaz. Dosyayı Supabase
            Storage&apos;daki <code>invitation-music</code> klasörüne
            yükleyip herkese açık adresini buraya yapıştırın.
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="music_url" className={labelClass}>
                Ses Dosyası Adresi
              </label>
              <input
                id="music_url"
                name="music_url"
                type="url"
                placeholder="https://…/parca.mp3"
                defaultValue={invitation.music_url ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="music_title" className={labelClass}>
                Parça Adı{" "}
                <span className="text-muted">(davetiyenin altında görünür)</span>
              </label>
              <input
                id="music_title"
                name="music_title"
                placeholder="Canon in D — Piano"
                defaultValue={invitation.music_title ?? ""}
                className={field}
              />
            </div>
          </div>
        </section>

        <section className={card}>
          <h2 className={sectionTitle}>Hediye</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="gift_note" className={labelClass}>
                Not
              </label>
              <input
                id="gift_note"
                name="gift_note"
                defaultValue={invitation.gift_note ?? ""}
                className={field}
              />
            </div>
            <div>
              <label htmlFor="gift_iban" className={labelClass}>
                IBAN
              </label>
              <input
                id="gift_iban"
                name="gift_iban"
                defaultValue={invitation.gift_iban ?? ""}
                className={inputClass("panel", "max-w-[420px]")}
              />
            </div>
          </div>
        </section>

        <SubmitButton
          variant="primary"
          size="md"
          pendingLabel="Kaydediliyor…"
          className="self-start"
        >
          Davetiyeyi Kaydet
        </SubmitButton>
      </form>
    </div>
  );
}
