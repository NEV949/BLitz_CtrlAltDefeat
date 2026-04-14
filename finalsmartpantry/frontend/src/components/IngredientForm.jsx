import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

const initialState = {
  name: '',
  qty: 1,
  freshness: 'fresh'
};

export default function IngredientForm({ onAdd }) {
  const [form, setForm] = useState(initialState);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.name.trim()) return;

    onAdd({
      name: form.name.trim(),
      qty: Number(form.qty),
      freshness: form.freshness
    });

    setForm(initialState);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
          <PlusCircle size={18} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white sm:text-xl">Add pantry ingredient</h2>
          <p className="mt-1 text-sm text-slate-400">Name, quantity, freshness. Clean input, less chaos.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1.2fr_0.7fr_0.9fr_auto] md:items-end">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Ingredient</span>
          <input
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            placeholder="tomato"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Qty</span>
          <input
            type="number"
            min="1"
            value={form.qty}
            onChange={(event) => handleChange('qty', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300/35"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Freshness</span>
          <select
            value={form.freshness}
            onChange={(event) => handleChange('freshness', event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300/35"
          >
            <option value="fresh">Fresh</option>
            <option value="medium">Medium</option>
            <option value="near-expiry">Near expiry</option>
          </select>
        </label>

        <button
          type="submit"
          className="rounded-2xl bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 px-5 py-3 font-semibold text-slate-950 transition hover:-translate-y-0.5"
        >
          Add
        </button>
      </form>
    </section>
  );
}
