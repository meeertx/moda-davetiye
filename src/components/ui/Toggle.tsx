/**
 * Salt görsel açık/kapalı anahtarı — prototipteki gibi statik.
 * Etkileşim backend turunda form durumuna bağlanacak.
 */
export default function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className={`w-10 h-[22px] rounded-xl relative ${
        on ? "bg-gold" : "bg-line-panel"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white absolute top-[3px] ${
          on ? "right-[3px]" : "left-[3px]"
        }`}
      />
    </div>
  );
}
