import { AlertTriangle, CheckCircle2, CircleDashed, Sparkles } from 'lucide-react';

const styles = {
  Optimal: {
    badge: 'border-emerald-400/20 bg-emerald-500/15 text-emerald-100',
    ring: 'from-emerald-300/25 via-emerald-400/10 to-transparent',
    icon: CheckCircle2
  },
  Partial: {
    badge: 'border-amber-400/20 bg-amber-500/15 text-amber-100',
    ring: 'from-amber-300/25 via-amber-400/10 to-transparent',
    icon: CircleDashed
  },
  Low: {
    badge: 'border-rose-400/20 bg-rose-500/15 text-rose-100',
    ring: 'from-rose-300/25 via-rose-400/10 to-transparent',
    icon: AlertTriangle
  }
};

export default function ResultCard({ recipe, index }) {
  const { icon: Icon, badge, ring } = styles[recipe.classification];

  return (
    <article className={`overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${ring} bg-slate-950/45 p-5 transition hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_20px_60px_rgba(15,23,42,0.35)]`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-300">
            <Sparkles size={13} className="text-cyan-300" /> #{index + 1}
          </div>
          <h3 className="text-lg font-semibold text-white">{recipe.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">{recipe.description}</p>
        </div>

        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] ${badge}`}>
          <Icon size={14} /> {recipe.classification}
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-300">
          <span>Recommendation score</span>
          <span>{recipe.score}/100</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300" style={{ width: `${recipe.score}%` }} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Matched</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.matched.length ? recipe.matched.map((item) => (
              <span key={item.name} className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
                {item.name} · {item.availableQty}/{item.requiredQty}
              </span>
            )) : <span className="text-sm text-slate-500">No matches yet</span>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Missing</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {recipe.missing.length ? recipe.missing.map((ingredient) => (
              <span key={ingredient} className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-xs text-rose-100">{ingredient}</span>
            )) : <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">Nothing missing</span>}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm leading-6 text-slate-300">
        {recipe.reason}
      </div>
    </article>
  );
}
