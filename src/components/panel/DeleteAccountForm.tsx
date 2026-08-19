"use client";

import { useState, useTransition } from "react";
import { deleteAccountAction } from "@/app/actions/auth";
import Button from "@/components/ui/Button";

export default function DeleteAccountForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    const confirmed = window.confirm(
      "⚠️ DİKKAT: Hesabınızı silmek üzeresiniz!\n\nTüm siparişleriniz, oluşturduğunuz davetiyeler ve kayıtlarınız KALICI olarak silinecektir. Bu işlem geri alınamaz!\n\nHesabınızı silmek istediğinize emin misiniz?",
    );

    if (!confirmed) return;

    startTransition(async () => {
      setError(null);
      const res = await deleteAccountAction();
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      <p className="text-xs text-muted leading-relaxed font-light m-0">
        Hesabınızı silmeniz durumunda profiliniz, sipariş geçmişiniz ve yayındaki tüm davetiyeleriniz kalıcı olarak veritabanımızdan temizlenir. Bu işlem anında gerçekleşir ve geri alınamaz.
      </p>

      <div className="pt-2">
        <Button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          variant="secondary"
          shape="pill"
          size="sm"
          className="bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-500/30 font-semibold apple-press"
        >
          {isPending ? "Hesabınız Siliniyor…" : "🗑️ Hesabımı Kalıcı Olarak Sil"}
        </Button>
      </div>
    </div>
  );
}
