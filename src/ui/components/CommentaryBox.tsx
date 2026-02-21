import Card from "./Card";

export default function CommentaryBox({ lines }: { lines: string[] }) {
  return (
    <Card>
      <div className="text-sm font-medium">Commentary</div>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        {lines.length === 0 ? (
          <div className="text-slate-500">Run a week to get executive commentary.</div>
        ) : (
          lines.map((c, i) => <div key={i}>{c}</div>)
        )}
      </div>
    </Card>
  );
}
