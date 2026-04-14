import { useState } from 'react';
import { LockKeyhole, Mail, User2 } from 'lucide-react';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function AuthPanel({ mode, onModeChange, onSubmit, loading, error }) {
  const [form, setForm] = useState(initialForm);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(form);
    setForm((prev) => ({ ...prev, password: '' }));
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">{mode === 'login' ? 'Welcome back' : 'Create your SmartPantry account'}</h2>
          <p className="mt-1 text-sm text-slate-400">Save your pantry flow with a real login instead of hoping the browser remembers everything.</p>
        </div>
      </div>

      <div className="mb-5 inline-flex rounded-2xl border border-white/10 bg-slate-950/40 p-1">
        {['login', 'register'].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onModeChange(value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${mode === value ? 'bg-white text-slate-950' : 'text-slate-300 hover:text-white'}`}
          >
            {value === 'login' ? 'Login' : 'Register'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <label className="block">
            <span className="mb-2 block text-sm text-slate-300">Name</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
              <User2 size={18} className="text-cyan-300" />
              <input
                required
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="Sharon Sam"
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </div>
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Email</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <Mail size={18} className="text-cyan-300" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              placeholder="you@example.com"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Password</span>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3">
            <LockKeyhole size={18} className="text-cyan-300" />
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </label>

        {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login to pantry' : 'Create account'}
        </button>
      </form>
    </section>
  );
}
