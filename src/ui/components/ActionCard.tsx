import type { ActionType } from "../../sim/types";

export default function ActionCard({
  action,
  selected,
  onSelect,
}: {
  action: ActionType;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={
        "rounded-lg border p-4 text-left " +
        (selected ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white hover:border-slate-300")
      }
      onClick={onSelect}
      type="button"
    >
      <div className="font-medium">{action.replace(/_/g, " ")}</div>
      <div className="mt-1 text-sm text-slate-600">Select for this week.</div>
    </button>
  );
}
