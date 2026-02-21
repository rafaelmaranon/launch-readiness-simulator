import type { DecisionLogEntry } from "../../app/types";
import Card from "./Card";

export default function DecisionLog({ entries }: { entries: DecisionLogEntry[] }) {
  return (
    <Card>
      <div className="text-sm font-medium">Decision Log</div>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {entries.length === 0 ? (
          <div className="text-slate-500">No decisions yet.</div>
        ) : (
          entries.map((d) => (
            <div key={`${d.week}-${d.action}`}>
              Week {d.week}: {d.action.replace(/_/g, " ")}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
