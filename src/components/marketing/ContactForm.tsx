"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/ui/field";

const field = inputClass("marketing");

/**
 * İletişim formu. Prototipte olduğu gibi gönderim yalnızca buton etiketini
 * değiştirir — gerçek gönderim backend turunda bağlanacak.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <input
        placeholder="Adınız Soyadınız"
        aria-label="Adınız Soyadınız"
        className={field}
      />
      <input
        type="email"
        placeholder="E-posta"
        aria-label="E-posta"
        className={field}
      />
      <textarea
        placeholder="Mesajınız"
        aria-label="Mesajınız"
        className={inputClass("marketing", "min-h-[130px] resize-y")}
      />
      <Button
        onClick={() => setSent(true)}
        variant="primary"
        size="lg"
        shape="sharp"
        block
      >
        {sent ? "Mesajınız Alındı ✓" : "Mesajı Gönder"}
      </Button>
    </div>
  );
}
