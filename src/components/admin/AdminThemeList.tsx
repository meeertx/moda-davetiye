"use client";

import { useState } from "react";
import type { Theme } from "@/data/themes";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface Props {
  themes: Theme[];
}

export default function AdminThemeList({ themes }: Props) {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [copied, setCopied] = useState(false);

  // Dynamic parameters for prompt customization
  const [clientNames, setClientNames] = useState("Mert & Ece");
  const [clientInitials, setClientInitials] = useState("M & E");
  const [eventDate, setEventDate] = useState("29.07.2027");

  const filteredThemes = themes.filter((t) => {
    if (filterCategory === "all") return true;
    return t.category === filterCategory;
  });

  // Calculate dynamic AI prompt based on user inputs
  const getDynamicPrompt = (theme: Theme) => {
    if (!theme.promptInfo) return "";
    let prompt = theme.promptInfo.aiPrompt;

    // Replace placeholders with client specific data
    prompt = prompt.replace(/Mert & Ece/g, clientNames);
    prompt = prompt.replace(/M & E/g, clientInitials);
    prompt = prompt.replace(/29\.07\.2027/g, eventDate);
    prompt = prompt.replace(/29 \/ 07 \/ 2027/g, eventDate.split(".").join(" / "));

    return prompt;
  };

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gridCols = "grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.5fr] min-w-[840px]";

  return (
    <div>
      {/* Kategori Filtreleri */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Tümü (" + themes.length + ")" },
          { key: "dugun", label: "Düğün" },
          { key: "nisan", label: "Nişan" },
          { key: "kina", label: "Kına" },
          { key: "save_the_date", label: "Save the Date" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterCategory(cat.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              filterCategory === cat.key
                ? "bg-accent text-white shadow-sm"
                : "bg-paper-alt text-muted hover:text-foreground border border-line-panel"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tablo Yapısı */}
      <div className="bg-paper-alt border border-line-panel rounded-[10px] overflow-x-auto">
        <div
          className={`${gridCols} px-5 py-3.5 text-xs tracking-[0.03em] uppercase text-muted border-b border-line-panel font-medium`}
        >
          <div>Tema Adı</div>
          <div>Kategori</div>
          <div>Sıra</div>
          <div>Durum</div>
          <div>Paket</div>
          <div className="text-right">AI Prompt</div>
        </div>

        {filteredThemes.map((t) => (
          <div
            key={t.slug}
            className={`${gridCols} px-5 py-3 text-[13.5px] border-b border-line-soft items-center hover:bg-paper/50 transition-colors`}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-10 rounded-[4px] border border-line-soft shadow-xs shrink-0"
                style={{ background: t.stripeSmall }}
              />
              <div>
                <div className="font-medium text-foreground">{t.name}</div>
                <div className="text-xs text-muted truncate max-w-[220px]">
                  {t.blurb}
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-paper border border-line-panel">
                {t.categoryLabel}
              </span>
            </div>

            <div className="text-muted text-xs font-mono">{t.order}</div>

            <div>
              <Badge tone={t.active ? "ok" : "muted"}>
                {t.active ? "Aktif" : "Pasif"}
              </Badge>
            </div>

            <div className="text-muted text-xs">{t.tierLabel}</div>

            <div className="text-right">
              {t.promptInfo ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setSelectedTheme(t)}
                  className="text-xs py-1 px-3"
                >
                  ✨ AI Prompt
                </Button>
              ) : (
                <span className="text-xs text-muted opacity-50">-</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI PROMPT MODALI */}
      {selectedTheme && selectedTheme.promptInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-paper border border-line-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            {/* Kapat Butonu */}
            <button
              onClick={() => setSelectedTheme(null)}
              className="absolute top-4 right-4 text-muted hover:text-foreground w-8 h-8 rounded-full flex items-center justify-center hover:bg-paper-alt transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-12 rounded-md border border-line-panel shrink-0"
                style={{ background: selectedTheme.stripeSmall }}
              />
              <div>
                <span className="text-xs uppercase tracking-wider text-accent font-medium">
                  {selectedTheme.categoryLabel} • {selectedTheme.tierLabel}
                </span>
                <h2 className="text-xl font-display font-semibold m-0 text-foreground">
                  {selectedTheme.name}
                </h2>
              </div>
            </div>

            {/* Tasarım Özeti */}
            <div className="mb-5 bg-paper-alt p-3.5 rounded-lg border border-line-panel text-sm leading-relaxed">
              <div className="text-xs font-semibold text-muted mb-1 uppercase tracking-wider">
                Tasarım Özeti (Türkçe)
              </div>
              <p className="m-0 text-foreground/90">{selectedTheme.promptInfo.designSummary}</p>
            </div>

            {/* Dinamik Müşteri Bilgileri Formu */}
            <div className="mb-5 p-4 bg-accent/5 border border-accent/20 rounded-lg">
              <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span>✏️</span> Müşteriye Özel Parametre Düzenleyici
              </div>
              <p className="text-xs text-muted mb-3">
                Aşağıdaki alanları müşterinizin bilgileriyle değiştirin, AI promptu otomatik güncellensin:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">
                    Çift İsimleri
                  </label>
                  <input
                    type="text"
                    value={clientNames}
                    onChange={(e) => setClientNames(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-line-panel bg-paper focus:outline-none focus:border-accent"
                    placeholder="Mert & Ece"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">
                    Baş Harfler (Monogram)
                  </label>
                  <input
                    type="text"
                    value={clientInitials}
                    onChange={(e) => setClientInitials(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-line-panel bg-paper focus:outline-none focus:border-accent"
                    placeholder="M & E"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1">
                    Tarih
                  </label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-line-panel bg-paper focus:outline-none focus:border-accent"
                    placeholder="29.07.2027"
                  />
                </div>
              </div>
            </div>

            {/* AI Prompt Metni */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  AI Görsel Üretim Promptu (İngilizce 9:16)
                </span>
                <span className="text-xs text-muted">Format: 9:16 Dikey</span>
              </div>
              <div className="relative group">
                <textarea
                  readOnly
                  rows={6}
                  value={getDynamicPrompt(selectedTheme)}
                  className="w-full p-3.5 bg-zinc-950 text-zinc-100 font-mono text-xs rounded-lg border border-zinc-800 focus:outline-none leading-relaxed resize-none"
                />
              </div>
            </div>

            {/* Alt İpuçları & Kopyala Butonu */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 border-t border-line-panel">
              <div className="text-xs text-muted">
                💡 <span className="font-semibold text-foreground">Midjourney Parametresi:</span>{" "}
                <code className="bg-paper-alt px-1.5 py-0.5 rounded border border-line-panel font-mono">
                  {selectedTheme.promptInfo.midjourneyParams || "--ar 9:16 --v 6 --style raw"}
                </code>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedTheme(null)}
                  className="flex-1 sm:flex-initial"
                >
                  Kapat
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleCopyPrompt(getDynamicPrompt(selectedTheme))}
                  className="flex-1 sm:flex-initial"
                >
                  {copied ? "✓ Kopyalandı!" : "📋 Prompt'u Kopyala"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
