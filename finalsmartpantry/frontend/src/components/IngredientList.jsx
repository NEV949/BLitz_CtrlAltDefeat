import { Trash2 } from 'lucide-react';

const freshnessStyles = {
  'near-expiry': 'border-rose-400/20 bg-rose-500/10 text-rose-100',
  medium: 'border-amber-400/20 bg-amber-500/10 text-amber-100',
  fresh: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
};

export default function IngredientList({ ingredients, onRemove, onClear }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Current pantry</h2>
          <p className="mt-1 text-sm text-slate-400">Duplicates get merged, so your pantry stays readable instead of turning into a grocery ransom note.</p>
        </div>

        {ingredients.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-2 text-sm text-slate-200 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-white"
          >
            Clear all
          </button>
        )}
      </div>

      {ingredients.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-slate-950/35 p-6 text-sm text-slate-400">
          Your pantry is empty. Add ingredients or tap a quick starter above.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          {ingredients.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-medium capitalize text-white">{item.name}</p>
                  <span className={`rounded-full border px-2 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${freshnessStyles[item.freshness]}`}>
                    {item.freshness.replace('-', ' ')}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">Qty: {item.qty}</p>
              </div>

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-2xl border border-white/10 p-2.5 text-slate-400 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-200"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
