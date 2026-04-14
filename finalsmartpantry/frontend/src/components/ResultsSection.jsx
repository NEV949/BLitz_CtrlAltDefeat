import { LoaderCircle, WandSparkles } from 'lucide-react';
import ResultCard from './ResultCard';

function EmptyState() {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-slate-950/35 p-10 text-center text-slate-400">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300">
        <WandSparkles size={22} />
      </div>
      <p className="text-base text-slate-300">No recommendations yet.</p>
      <p className="mt-2 text-sm">Add a few ingredients, hit recommend, and the cards will fill left-to-right like a proper dashboard.</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-10 text-center text-slate-300">
      <LoaderCircle className="mx-auto mb-4 animate-spin text-cyan-300" size={26} />
      <p className="text-base font-medium">Crunching pantry logic...</p>
      <p className="mt-2 text-sm text-slate-400">Ranking by coverage, freshness, and quantity fit.</p>
    </div>
  );
}

export default function ResultsSection({ loading, results }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
            <WandSparkles size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Recipe recommendations</h2>
            <p className="mt-1 text-sm text-slate-400">3–4 per row on wide screens, so the good stuff stays visible without the scroll marathon.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-slate-300">
          {results.length} result{results.length === 1 ? '' : 's'}
        </div>
      </div>

      {loading ? <LoadingState /> : results.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {results.map((recipe, index) => (
            <ResultCard key={recipe.id} recipe={recipe} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
