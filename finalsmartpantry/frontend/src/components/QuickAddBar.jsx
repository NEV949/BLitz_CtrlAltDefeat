import { Plus } from 'lucide-react';

const suggestions = [
  { name: 'egg', qty: 4, freshness: 'fresh' },
  { name: 'milk', qty: 1, freshness: 'medium' },
  { name: 'rice', qty: 2, freshness: 'fresh' },
  { name: 'potato', qty: 3, freshness: 'near-expiry' },
  { name: 'cheese', qty: 1, freshness: 'medium' },
  { name: 'capsicum', qty: 2, freshness: 'fresh' },
  { name: 'paneer', qty: 1, freshness: 'medium' },
  { name: 'tomato', qty: 3, freshness: 'near-expiry' }
];

export default function QuickAddBar({ onQuickAdd }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Quick pantry starters</h2>
          <p className="mt-1 text-sm text-slate-400">One click. No typing. Efficient laziness is still a valid survival strategy.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {suggestions.map((item) => (
          <button
            type="button"
            key={`${item.name}-${item.freshness}`}
            onClick={() => onQuickAdd({ ...item })}
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-300/25 hover:bg-slate-900/70 hover:text-white"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/20">
              <Plus size={15} />
            </span>
            <span className="capitalize">{item.name}</span>
            <span className="text-slate-500">•</span>
            <span>{item.qty}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
