import type { ActionType } from "../../sim/types";
import ActionCard from "./ActionCard";

const ACTIONS: ActionType[] = [
  "INCREASE_CAPACITY",
  "IMPROVE_SCHEDULING",
  "FREEZE_SCOPE",
  "PUSH_RELEASE",
  "INVEST_TOOLING",
];

export default function ActionGrid({
  selected,
  onSelect,
}: {
  selected: ActionType | null;
  onSelect: (action: ActionType) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {ACTIONS.map((a) => (
        <ActionCard key={a} action={a} selected={selected === a} onSelect={() => onSelect(a)} />
      ))}
    </div>
  );
}
