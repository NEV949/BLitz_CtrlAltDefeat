import { AlertTriangle, BarChart3, Salad, ShieldCheck } from 'lucide-react';

function getFreshnessMix(ingredients) {
  return {
    near: ingredients.filter((item) => item.freshness === 'near-expiry').length,
    medium: ingredients.filter((item) => item.freshness === 'medium').length,
    fresh: ingredients.filter((item) => item.freshness === 'fresh').length
  };
}

export default function PantryInsights({ ingredients, results, user }) {
  const mix = getFreshnessMix(ingredients);
  const topScore = results[0]?.score ?? 0;
  const topLabel = results[0]?.name ?? 'No recommendation yet';
  const cards = [
    {
      title: 'Best current match',
      value: topScore ? `${topScore}/100` : '—',
      sub: topLabel,
      icon: BarChart3,
      tone: 'from-cyan-400/16 to-transparent text-cyan-100'
    },
    {
      title: 'Near-expiry rescue',
      value: mix.near,
      sub: mix.near ? 'Use these first' : 'Nothing urgent',
      icon: AlertTriangle,
      tone: 'from-rose-400/16 to-transparent text-rose-100'
    },
    {
      title: 'Pantry variety',
      value: ingredients.length,
      sub: ingredients.length >= 5 ? 'Good flexibility' : 'Add more for stronger matches',
      icon: Salad,
      tone: 'from-emerald-400/16 to-transparent text-emerald-100'
    },
    {
      title: 'User status',
      value: user ? 'Protected' : 'Guest',
      sub: user ? `${user.name} is signed in` : 'Login to persist auth',
      icon: ShieldCheck,
      tone: 'from-violet-400/16 to-transparent text-violet-100'
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, sub, icon: Icon, tone }) => (
        <article key={title} className={`rounded-[1.7rem] border border-white/10 bg-gradient-to-br ${tone} bg-slate-950/35 p-5 backdrop-blur-xl`}>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-slate-400">{title}</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2.5"><Icon size={18} /></div>
          </div>
          <div className="text-3xl font-semibold text-white">{value}</div>
          <p className="mt-2 line-clamp-2 text-sm text-slate-300">{sub}</p>
        </article>
      ))}
    </section>
  );
}
