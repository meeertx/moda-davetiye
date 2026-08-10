"use client";

import { useActionState, useState } from "react";
import { createOrderAction, type ActionState } from "@/app/actions/orders";
import { EVENT_TYPES } from "@/lib/orders";
import { draftToQuery, type OrderDraft } from "@/lib/order-draft";
import { getTheme } from "@/data/themes";
import PhotoUploader from "./PhotoUploader";
import FormMessage from "@/components/ui/FormMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import { inputClass, labelClass } from "@/components/ui/field";
import Link from "next/link";

const input = inputClass("marketing");
const label = labelClass;
const section = "border-t border-line pt-8 mt-8";
const sectionTitle = "font-display font-medium text-2xl m-0 mb-1";
const sectionHint = "text-[13px] text-muted m-0 mb-5";
const dashedButton =
  "cursor-pointer px-4 py-2.5 border border-dashed border-line bg-transparent rounded-[4px] text-[13px] text-muted self-start " +
  "transition-colors duration-150 hover:border-gold hover:text-ink";

interface ProgramRow {
  id: number;
  time: string;
  title: string;
}

let nextId = 1;

export default function OrderDetailsForm({
  draft,
  userId,
}: {
  draft: OrderDraft;
  userId: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    createOrderAction,
    {},
  );

  const [program, setProgram] = useState<ProgramRow[]>([
    { id: nextId++, time: "", title: "" },
  ]);
  const [questions, setQuestions] = useState<{ id: number; text: string }[]>([]);
  const [menu, setMenu] = useState<{ id: number; text: string }[]>([]);

  const theme = getTheme(draft.themeSlug)!;

  return (
    <form action={formAction}>
      {/* 1. aşamadan gelen bilgiler */}
      <input type="hidden" name="event_type" value={draft.eventType} />
      <input type="hidden" name="bride_name" value={draft.brideName} />
      <input type="hidden" name="groom_name" value={draft.groomName} />
      <input type="hidden" name="event_date" value={draft.eventDate} />
      <input type="hidden" name="theme_preference" value={draft.themeSlug} />
      <input
        type="hidden"
        name="program"
        value={JSON.stringify(
          program
            .filter((p) => p.time.trim() || p.title.trim())
            .map(({ time, title }) => ({ time: time.trim(), title: title.trim() })),
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

      {state.error && (
        <div className="mb-6">
          <FormMessage>{state.error}</FormMessage>
        </div>
      )}

      {/* ÖZET */}
      <div className="flex gap-4 items-center p-5 bg-paper border border-line rounded-[4px]">
        <div
          className="w-[54px] h-[68px] shrink-0 rounded-[2px]"
          style={{ background: theme.stripe }}
        />
        <div className="flex-1">
          <div className="font-display text-xl font-semibold">
            {draft.brideName} &amp; {draft.groomName}
          </div>
          <div className="text-[13px] text-muted">
            {EVENT_TYPES[draft.eventType]} · {theme.name} · {draft.eventDate}
          </div>
        </div>
        <Link
          href={`/davetiye-talebi?${draftToQuery(draft)}`}
          className="text-[13px] shrink-0"
        >
          Değiştir
        </Link>
      </div>

      {/* İLETİŞİM */}
      <div className={section}>
        <h2 className={sectionTitle}>İletişim</h2>
        <p className={sectionHint}>Size ulaşabileceğimiz numara.</p>
        <div className="max-w-[320px]">
          <label htmlFor="contact_phone" className={label}>
            Telefon *
          </label>
          <input
            id="contact_phone"
            name="contact_phone"
            type="tel"
            required
            placeholder="05__ ___ __ __"
            className={input}
          />
        </div>
      </div>

      {/* AİLELER */}
      <div className={section}>
        <h2 className={sectionTitle}>Aileler</h2>
        <p className={sectionHint}>
          Davetiyede çiftin isimlerinin altında yer alır. İstemiyorsanız boş
          bırakın.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bride_parents" className={label}>
              Gelinin Ailesi
            </label>
            <input
              id="bride_parents"
              name="bride_parents"
              placeholder="Sibel &amp; Hakan Yıldırım"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="groom_parents" className={label}>
              Damadın Ailesi
            </label>
            <input
              id="groom_parents"
              name="groom_parents"
              placeholder="Gül &amp; Erdem Şahin"
              className={input}
            />
          </div>
        </div>
      </div>

      {/* MEKAN */}
      <div className={section}>
        <h2 className={sectionTitle}>Mekan ve Konum</h2>
        <p className={sectionHint}>
          Henüz kesinleşmediyse boş bırakabilirsiniz, sonra tamamlarız.
        </p>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="venue_name" className={label}>
              Mekan Adı
            </label>
            <input
              id="venue_name"
              name="venue_name"
              placeholder="Four Seasons Bosphorus"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="venue_address" className={label}>
              Açık Adres
            </label>
            <input
              id="venue_address"
              name="venue_address"
              placeholder="Çırağan Cad. No:1, Beşiktaş, İstanbul"
              className={input}
            />
          </div>
          <div>
            <label htmlFor="venue_map_url" className={label}>
              Harita Bağlantısı
            </label>
            <input
              id="venue_map_url"
              name="venue_map_url"
              type="url"
              placeholder="https://maps.google.com/…"
              className={input}
            />
          </div>
        </div>
      </div>

      {/* PROGRAM */}
      <div className={section}>
        <h2 className={sectionTitle}>Program Akışı</h2>
        <p className={sectionHint}>
          Günün akışı — saat ve başlık olarak yazın.
        </p>
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
                aria-label={`${i + 1}. program saati`}
                className="w-[100px] px-3 py-2.5 border border-line rounded-[2px] text-sm bg-paper"
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
                aria-label={`${i + 1}. program başlığı`}
                className="flex-1 px-3 py-2.5 border border-line rounded-[2px] text-sm bg-paper"
              />
              {program.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setProgram((p) => p.filter((r) => r.id !== row.id))
                  }
                  aria-label="Satırı sil"
                  className="cursor-pointer bg-transparent border-0 text-muted text-lg px-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProgram((p) => [...p, { id: nextId++, time: "", title: "" }])
            }
            className={dashedButton}
          >
            + Program Satırı Ekle
          </button>
        </div>
      </div>

      {/* MENÜ */}
      <div className={section}>
        <h2 className={sectionTitle}>Menü</h2>
        <p className={sectionHint}>
          İkram edilecek yemekler — her satıra bir tabak. Boş bırakırsanız
          davetiyede menü bölümü çıkmaz.
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
                placeholder="Mevsim Salatası"
                aria-label={`${i + 1}. menü satırı`}
                className="flex-1 px-3 py-2.5 border border-line rounded-[2px] text-sm bg-paper"
              />
              <button
                type="button"
                onClick={() => setMenu((m) => m.filter((r) => r.id !== row.id))}
                aria-label="Satırı sil"
                className="cursor-pointer bg-transparent border-0 text-muted text-lg px-1"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setMenu((m) => [...m, { id: nextId++, text: "" }])}
            className={dashedButton}
          >
            + Menü Satırı Ekle
          </button>
        </div>
      </div>

      {/* EK BİLGİLER */}
      <div className={section}>
        <h2 className={sectionTitle}>Ek Bilgiler</h2>
        <p className={sectionHint}>
          Vale hizmeti, anlaşmalı otel, kıyafet kodu gibi notlar. Her satır
          davetiyede ayrı bir madde olarak görünür.
        </p>
        <textarea
          id="extra_info"
          name="extra_info"
          rows={4}
          placeholder={
            "Vale hizmeti mevcuttur\nAnlaşmalı otel: Swissôtel — %20 indirim\nKıyafet kodu: Şık günlük"
          }
          aria-label="Ek bilgiler"
          className={`${input} resize-y`}
        />
      </div>

      {/* HİKAYE VE FOTOĞRAF */}
      <div className={section}>
        <h2 className={sectionTitle}>Hikayeniz ve Fotoğraflar</h2>
        <p className={sectionHint}>
          Davetiyede yer almasını istediğiniz kısa bir metin ve fotoğraflar.
        </p>
        <div className="flex flex-col gap-5">
          <div>
            <label htmlFor="story" className={label}>
              Hikayeniz
            </label>
            <textarea
              id="story"
              name="story"
              rows={5}
              placeholder="Nasıl tanıştınız, bu güne nasıl geldiniz…"
              className={`${input} resize-y`}
            />
          </div>
          <div>
            <span className={label}>Fotoğraflar</span>
            <PhotoUploader userId={userId} />
          </div>
        </div>
      </div>

      {/* RSVP */}
      <div className={section}>
        <h2 className={sectionTitle}>Katılım (RSVP) Ayarları</h2>
        <p className={sectionHint}>
          Misafirlerinizin katılım bildirimi nasıl toplansın?
        </p>
        <div className="flex flex-col gap-5">
          <div className="max-w-[240px]">
            <label htmlFor="rsvp_deadline" className={label}>
              Yanıt Son Tarihi
            </label>
            <input
              id="rsvp_deadline"
              name="rsvp_deadline"
              type="date"
              className={input}
            />
          </div>

          <label className="flex gap-2.5 items-center text-sm">
            <input
              type="checkbox"
              name="rsvp_plus_one"
              value="1"
              defaultChecked
            />
            Misafirler yanlarında bir kişi (+1) getirebilsin
          </label>

          <div>
            <span className={label}>Misafire Sorulacak Ek Sorular</span>
            <div className="flex flex-col gap-3 items-start">
              {questions.map((q, i) => (
                <div key={q.id} className="flex gap-3 items-center w-full">
                  <input
                    value={q.text}
                    onChange={(e) =>
                      setQuestions((qs) =>
                        qs.map((x) =>
                          x.id === q.id ? { ...x, text: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="Menü tercihiniz? (Et / Vejetaryen)"
                    aria-label={`${i + 1}. soru`}
                    className={input}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuestions((qs) => qs.filter((x) => x.id !== q.id))
                    }
                    aria-label="Soruyu sil"
                    className="cursor-pointer bg-transparent border-0 text-muted text-lg px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setQuestions((qs) => [...qs, { id: nextId++, text: "" }])
                }
                className={dashedButton}
              >
                + Soru Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MÜZİK */}
      <div className={section}>
        <h2 className={sectionTitle}>Müzik</h2>
        <p className={sectionHint}>
          Davetiyeniz açıldığında çalmasını istediğiniz parça. Bağlantı
          (YouTube, Spotify) ya da sadece şarkı adı yazabilirsiniz — parçayı
          biz hazırlayıp davetiyeye ekleriz.
        </p>
        <input
          id="music_note"
          name="music_note"
          placeholder="Örn. Canon in D — Piano, ya da bir bağlantı"
          className={input}
        />
      </div>

      {/* HEDİYE */}
      <div className={section}>
        <h2 className={sectionTitle}>Hediye</h2>
        <p className={sectionHint}>İsterseniz boş bırakın.</p>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="gift_note" className={label}>
              Not
            </label>
            <input
              id="gift_note"
              name="gift_note"
              placeholder="Varlığınız en güzel hediyemiz olacak."
              className={input}
            />
          </div>
          <div className="max-w-[420px]">
            <label htmlFor="gift_iban" className={label}>
              IBAN
            </label>
            <input
              id="gift_iban"
              name="gift_iban"
              placeholder="TR__ ____ ____ ____ ____ ____ __"
              className={input}
            />
          </div>
        </div>
      </div>

      {/* EK NOT */}
      <div className={section}>
        <h2 className={sectionTitle}>Eklemek İstedikleriniz</h2>
        <p className={sectionHint}>
          Renk tercihi, özel istek, aklınıza takılan her şey.
        </p>
        <textarea
          id="contact_note"
          name="contact_note"
          rows={4}
          className={`${input} resize-y`}
        />
      </div>

      <div className="mt-10">
        <SubmitButton
          pendingLabel="Siparişiniz oluşturuluyor…"
          variant="primary"
          size="lg"
          shape="sharp"
        >
          Siparişi Oluştur
        </SubmitButton>
        <p className="text-xs text-muted mt-3 m-0">
          Sipariş oluşturulduktan sonra bilgileri yalnızca ekibimiz
          güncelleyebilir — değişiklik için bize yazmanız yeterli.
        </p>
      </div>
    </form>
  );
}
