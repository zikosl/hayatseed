import { Droplet, Power } from "lucide-react";
import { useIrrigation, formatDuration } from "@/lib/irrigation";
import { useI18n } from "@/lib/i18n";

export function IrrigationCore({
  compact = false,
  showTimer = true,
}: {
  compact?: boolean;
  showTimer?: boolean;
}) {
  const { isOn, toggle, elapsed } = useIrrigation();
  const { t } = useI18n();
  const size = compact ? "h-32 w-32" : "h-44 w-44";

  return (
    <div className="flex flex-col items-center">
      {showTimer && (
        <div className="mb-3 text-center">
          <div className="text-[10px] font-bold tracking-widest text-muted-foreground">
            {t("irr.timer")}
          </div>
          <div
            className={`font-mono text-2xl font-bold tabular-nums ${isOn ? "text-primary" : "text-muted-foreground"}`}
          >
            {formatDuration(isOn ? elapsed : 0)}
          </div>
        </div>
      )}
      <button
        onClick={toggle}
        aria-label={isOn ? t("irr.tapStop") : t("irr.tapStart")}
        className="relative grid place-items-center"
      >
        {isOn && (
          <>
            <span
              className={`absolute inline-block ${size} rounded-full bg-teal/30 animate-ripple`}
            />
            <span
              className={`absolute inline-block ${size} rounded-full bg-teal/30 animate-ripple-delay`}
            />
          </>
        )}
        <span
          className={`${size} rounded-full grid place-items-center transition-all ${
            isOn ? "bg-gradient-hero shadow-soft animate-drop-pulse" : "bg-muted-foreground/40"
          }`}
        >
          {isOn ? (
            <Droplet className="h-16 w-16 text-primary-foreground" strokeWidth={2.2} />
          ) : (
            <Power className="h-16 w-16 text-primary-foreground" strokeWidth={2.2} />
          )}
        </span>
      </button>
      <p className="mt-3 text-sm font-medium text-foreground text-center">
        {isOn ? t("irr.tapStop") : t("irr.tapStart")}
      </p>
    </div>
  );
}
