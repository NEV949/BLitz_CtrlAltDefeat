import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ChefHat, Sparkles, TimerReset } from 'lucide-react';
import Header from './components/Header';
import IngredientForm from './components/IngredientForm';
import IngredientList from './components/IngredientList';
import PantryInsights from './components/PantryInsights';
import QuickAddBar from './components/QuickAddBar';
import ResultsSection from './components/ResultsSection';
import AuthPanel from './components/AuthPanel';
import UserBadge from './components/UserBadge';
import { fetchProfile, loginUser, recommendRecipes, registerUser, savePantry } from './services/api';

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bootLoading, setBootLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);
  const [pantrySaving, setPantrySaving] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('smartpantry-token');
      if (!token) {
        setBootLoading(false);
        return;
      }

      try {
        const data = await fetchProfile();
        setUser(data.user);
        setIngredients(data.user.pantry || []);
      } catch {
        localStorage.removeItem('smartpantry-token');
      } finally {
        setBootLoading(false);
      }
    };

    restoreSession();
  }, []);

  const stats = useMemo(() => {
    const nearExpiryCount = ingredients.filter((item) => item.freshness === 'near-expiry').length;
    const totalQty = ingredients.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const freshnessPressure = ingredients.length ? Math.round((nearExpiryCount / ingredients.length) * 100) : 0;

    return {
      total: ingredients.length,
      urgent: nearExpiryCount,
      totalQty,
      freshnessPressure
    };
  }, [ingredients]);

  const persistPantry = async (nextPantry) => {
    if (!user) return nextPantry;

    try {
      setPantrySaving(true);
      const data = await savePantry(nextPantry);
      setIngredients(data.pantry);
      setUser((prev) => (prev ? { ...prev, pantry: data.pantry } : prev));
      return data.pantry;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save pantry.');
      return nextPantry;
    } finally {
      setPantrySaving(false);
    }
  };

  const addIngredient = async (ingredient) => {
    const normalized = {
      name: ingredient.name.trim().toLowerCase(),
      qty: Number(ingredient.qty) || 1,
      freshness: ingredient.freshness
    };

    const nextPantry = (() => {
      const existingIndex = ingredients.findIndex((item) => item.name === normalized.name);

      if (existingIndex !== -1) {
        const updated = [...ingredients];
        updated[existingIndex] = {
          ...updated[existingIndex],
          qty: updated[existingIndex].qty + normalized.qty,
          freshness: normalized.freshness
        };
        return updated;
      }

      return [...ingredients, normalized];
    })();

    setIngredients(nextPantry);
    setError('');
    await persistPantry(nextPantry);
  };

  const removeIngredient = async (indexToRemove) => {
    const nextPantry = ingredients.filter((_, index) => index !== indexToRemove);
    setIngredients(nextPantry);
    setError('');
    await persistPantry(nextPantry);
  };

  const clearIngredients = async () => {
    setIngredients([]);
    setResults([]);
    setError('');
    await persistPantry([]);
  };

  const handleRecommend = async () => {
    if (!ingredients.length) {
      setError('Add at least one ingredient before requesting recommendations.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await recommendRecipes(ingredients);
      setResults(data.results);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (payload) => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const response = authMode === 'login' ? await loginUser(payload) : await registerUser(payload);
      localStorage.setItem('smartpantry-token', response.token);
      setUser(response.user);
      setIngredients(response.user.pantry || []);
      setResults([]);
      setError('');
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smartpantry-token');
    setUser(null);
    setIngredients([]);
    setResults([]);
    setAuthMode('login');
  };

  if (bootLoading) {
    return (
      <main className="min-h-screen bg-hero-gradient text-white">
        <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 px-8 py-10 text-center backdrop-blur-xl">
            <p className="text-lg font-semibold text-white">Restoring SmartPantry session...</p>
            <p className="mt-2 text-sm text-slate-400">One second. We are checking who owns this fridge.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen overflow-hidden bg-hero-gradient text-white">
        <div className="pointer-events-none fixed inset-0 opacity-60">
          <div className="absolute left-[8%] top-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-[110px]" />
          <div className="absolute right-[10%] top-8 h-56 w-56 rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[140px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-8 px-4 py-8 sm:px-6 lg:px-8">
          <Header user={null} />
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100">
                <Sparkles size={14} /> Login first
              </div>
              <h2 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">Register or sign in before the dashboard opens.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                New account means empty pantry. Existing account means your saved pantry comes back automatically after login. That way the dashboard belongs to the user, not to whichever browser tab survived the day.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-sm text-slate-400">Auth gate</p>
                  <p className="mt-3 text-2xl font-semibold text-white">100%</p>
                  <p className="mt-2 text-sm text-slate-300">Dashboard appears only after successful login or registration.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-sm text-slate-400">Per-user pantry</p>
                  <p className="mt-3 text-2xl font-semibold text-white">DB-backed</p>
                  <p className="mt-2 text-sm text-slate-300">Every account gets its own pantry history and saved state.</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-5">
                  <p className="text-sm text-slate-400">Recommendations</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Optimal-first</p>
                  <p className="mt-2 text-sm text-slate-300">Better scoring now favors stronger full or near-full matches first.</p>
                </div>
              </div>
            </section>

            <AuthPanel
              mode={authMode}
              onModeChange={setAuthMode}
              onSubmit={handleAuthSubmit}
              loading={authLoading}
              error={authError}
            />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-hero-gradient text-white">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-[8%] top-16 h-52 w-52 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="absolute right-[10%] top-8 h-56 w-56 rounded-full bg-violet-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header user={user} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Pantry items</p>
            <div className="mt-3 flex items-end justify-between gap-3"><p className="text-3xl font-semibold text-white">{stats.total}</p><Sparkles className="text-cyan-300" size={18} /></div>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Urgent ingredients</p>
            <div className="mt-3 flex items-end justify-between gap-3"><p className="text-3xl font-semibold text-rose-100">{stats.urgent}</p><TimerReset className="text-rose-300" size={18} /></div>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Total units</p>
            <div className="mt-3 flex items-end justify-between gap-3"><p className="text-3xl font-semibold text-white">{stats.totalQty}</p><ChefHat className="text-violet-300" size={18} /></div>
          </div>
          <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <p className="text-sm text-slate-400">Freshness pressure</p>
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-sm text-slate-300"><span>Urgency ratio</span><span>{stats.freshnessPressure}%</span></div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-rose-300 via-amber-300 to-cyan-300" style={{ width: `${stats.freshnessPressure}%` }} /></div>
            </div>
          </div>
        </section>

        <PantryInsights ingredients={ingredients} results={results} user={user} />

        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <QuickAddBar onQuickAdd={addIngredient} />
            <IngredientForm onAdd={addIngredient} />
            <IngredientList ingredients={ingredients} onRemove={removeIngredient} onClear={clearIngredients} />
            <button
              onClick={handleRecommend}
              disabled={loading || pantrySaving}
              className="w-full rounded-[1.7rem] bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-6 py-4 text-base font-semibold text-slate-950 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(56,189,248,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Recommending...' : pantrySaving ? 'Saving pantry...' : 'Recommend Recipes'}
            </button>
            {error && <div className="flex items-start gap-3 rounded-[1.5rem] border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100"><AlertCircle size={18} className="mt-0.5 shrink-0" />{error}</div>}
          </div>

          <div className="space-y-6">
            <UserBadge user={user} onLogout={handleLogout} />
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
              <h3 className="text-lg font-semibold text-white">What changed</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
                <li>• Authentication now gates the app properly. No login, no dashboard.</li>
                <li>• New users start with an empty pantry. Returning users get their own saved pantry back.</li>
                <li>• Recommendation scoring now penalizes weak partial matches harder, so stronger recipes rise first.</li>
              </ul>
            </div>
          </div>
        </section>

        <ResultsSection loading={loading} results={results} />
      </div>
    </main>
  );
}
