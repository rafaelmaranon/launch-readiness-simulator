import type { ForecastTag as ForecastTagType } from "../../sim/types";

export default function ForecastTag({ tag }: { tag: ForecastTagType }) {
  const styles: Record<ForecastTagType, string> = {
    ON_TRACK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    AT_RISK: "bg-amber-50 text-amber-700 border-amber-200",
    MISS_LIKELY: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <span className={"inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium " + styles[tag]}>
      {tag.replace(/_/g, " ")}
    </span>
  );
}
