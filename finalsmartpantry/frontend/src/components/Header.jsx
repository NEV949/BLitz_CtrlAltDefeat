import { ChefHat, LayoutPanelTop, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const highlights = [
  { icon: Sparkles, label: 'Waste-aware ranking' },
  { icon: ShieldCheck, label: 'DB-backed auth' },
  { icon: LayoutPanelTop, label: '3–4 card recommendation grid' },
  { icon: Zap, label: 'JSON now, API later' }
];

export default function Header({ user }) {
  return (
    <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 px-6 py-7 shadow-2xl backdrop-blur-2xl sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(129,140,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute -right-10 top-8 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-violet-400/10 blur-3xl" />

      <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
            <Sparkles size={14} /> SmartPantry Plus
          </div>

          <h1 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl sm:leading-[1.05]">
            Premium pantry planning, now with login, persistence, and a recommendation wall that stops making you scroll like a maniac.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Add ingredients with freshness, sign in to keep your experience personal, and get horizontally packed recipe recommendations ranked by coverage, urgency, and quantity fit.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div key={label} className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-slate-200">
                <Icon size={16} className="text-cyan-300" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-[290px] gap-4 sm:grid-cols-2 xl:w-[390px]">
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/35 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-400">Scoring model</span>
              <ChefHat className="text-cyan-300" size={20} />
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between"><span>Coverage</span><span className="text-cyan-200">50 pts</span></div>
              <div className="flex items-center justify-between"><span>Freshness priority</span><span className="text-violet-200">30 pts</span></div>
              <div className="flex items-center justify-between"><span>Quantity fit</span><span className="text-amber-200">20 pts</span></div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-cyan-400/12 via-white/5 to-violet-400/12 p-5">
            <p className="text-sm text-slate-400">Signed in chef</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current user</p>
                <p className="mt-2 font-medium">{user?.name || 'Guest mode'}</p>
                <p className="mt-1 text-slate-400">{user?.email || 'Login to unlock persistent access'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
