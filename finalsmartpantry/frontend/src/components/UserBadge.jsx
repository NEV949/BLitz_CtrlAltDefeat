import { LogOut, ShieldCheck, UserCircle2 } from 'lucide-react';

export default function UserBadge({ user, onLogout }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-400/12 via-white/5 to-violet-400/12 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3 text-cyan-300">
          <UserCircle2 size={22} />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
          <ShieldCheck size={14} /> Auth active
        </div>
      </div>

      <p className="text-sm text-slate-400">Logged in as</p>
      <h3 className="mt-1 text-xl font-semibold text-white">{user.name}</h3>
      <p className="mt-1 text-sm text-slate-300">{user.email}</p>

      <button
        type="button"
        onClick={onLogout}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-200 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-white"
      >
        <LogOut size={16} /> Logout
      </button>
    </section>
  );
}
