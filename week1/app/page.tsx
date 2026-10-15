"use client";

import { useState } from "react";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

type Meal = {
  id: number;
  type: "Breakfast" | "Lunch" | "Snack" | "Dinner";
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  emoji: string;
};

// ─────────────────────────────────────────────
//  Static Mock Data
// ─────────────────────────────────────────────

const DAILY_TARGET = {
  calories: 2100,
  protein: 160,
  carbs: 200,
  fat: 60,
};

const MEALS: Meal[] = [
  {
    id: 1,
    type: "Breakfast",
    name: "Power Morning Bowl",
    description: "Oatmeal · 3 Boiled Eggs · Banana · Almond Milk",
    calories: 480,
    protein: 32,
    carbs: 55,
    fat: 12,
    time: "07:00 AM",
    emoji: "🥣",
  },
  {
    id: 2,
    type: "Lunch",
    name: "Lean Protein Plate",
    description: "Grilled Chicken Breast · Brown Rice · Steamed Broccoli",
    calories: 650,
    protein: 52,
    carbs: 70,
    fat: 14,
    time: "12:30 PM",
    emoji: "🍗",
  },
  {
    id: 3,
    type: "Snack",
    name: "Muscle Fuel Snack",
    description: "Greek Yogurt · Mixed Nuts · Honey Drizzle",
    calories: 320,
    protein: 22,
    carbs: 28,
    fat: 16,
    time: "03:30 PM",
    emoji: "🥜",
  },
  {
    id: 4,
    type: "Dinner",
    name: "Recovery Dinner",
    description: "Salmon Fillet · Quinoa · Asparagus · Olive Oil",
    calories: 650,
    protein: 54,
    carbs: 47,
    fat: 18,
    time: "07:00 PM",
    emoji: "🐟",
  },
];

const NAV_LINKS = ["Dashboard", "Workout", "Meal Plan"];

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────

function pct(value: number, total: number) {
  return Math.min(Math.round((value / total) * 100), 100);
}

function fmt(n: number) {
  return n.toLocaleString();
}

// ─────────────────────────────────────────────
//  Sub-components (inline, single file)
// ─────────────────────────────────────────────

/** Top navigation bar */
function Navbar({ active }: { active: string }) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black tracking-tighter">FC</span>
          </div>
          <span className="text-black font-black text-xl tracking-widest">FITCORE</span>
        </div>

        {/* Nav links */}
        <nav aria-label="Navigasi utama" className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${link === active
                ? "bg-black text-white"
                : "text-zinc-700 hover:text-black hover:bg-zinc-100"
                }`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-black leading-none">Haikal R.</p>
            <p className="text-xs text-zinc-600 mt-0.5">Premium Member</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold select-none">
            HR
          </div>
        </div>
      </div>
    </header>
  );
}

/** Macro summary card */
function MacroCard({
  label,
  value,
  unit,
  consumed,
  total,
}: {
  label: string;
  value: number;
  unit: string;
  consumed: number;
  total: number;
}) {
  const progress = pct(consumed, total);
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">{label}</p>
        <span className="text-xs font-bold text-zinc-300">{progress}%</span>
      </div>
      <div>
        <p className="text-3xl font-black text-black leading-none">
          {fmt(value)}
          <span className="text-base font-semibold text-zinc-600 ml-1">{unit}</span>
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          {fmt(consumed)} / {fmt(total)} {unit} consumed
        </p>
      </div>
      {/* Progress bar */}
      <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/** Individual meal card */
function MealCard({
  meal,
  completed,
  onToggle,
}: {
  meal: Meal;
  completed: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className={`rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-300 ${completed
        ? "bg-black border-black"
        : "bg-white border-zinc-200 hover:border-zinc-400 shadow-sm hover:shadow-md"
        }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div aria-hidden="true"
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl select-none flex-shrink-0 ${completed ? "bg-white/10" : "bg-zinc-100"
              }`}
          >
            {meal.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${completed
                  ? "bg-white/15 text-white/70"
                  : "bg-zinc-100 text-zinc-500"
                  }`}
              >
                {meal.type}
              </span>
              <span className={`text-[10px] ${completed ? "text-white/60" : "text-zinc-600"}`}>
                {meal.time}
              </span>
            </div>
            <p
              className={`text-base font-bold mt-0.5 leading-tight ${completed ? "text-white" : "text-black"
                }`}
            >
              {meal.name}
            </p>
          </div>
        </div>

        {/* Calories badge */}
        <div className="text-right flex-shrink-0">
          <p
            className={`text-lg font-black leading-none ${completed ? "text-white" : "text-black"
              }`}
          >
            {meal.calories}
          </p>
          <p className={`text-[10px] font-semibold ${completed ? "text-white/70" : "text-zinc-600"}`}>
            kcal
          </p>
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-sm leading-relaxed ${completed ? "text-white/60" : "text-zinc-500"
          }`}
      >
        {meal.description}
      </p>

      {/* Macros row */}
      <div className="flex gap-4">
        {[
          { label: "Protein", val: meal.protein, unit: "g" },
          { label: "Carbs", val: meal.carbs, unit: "g" },
          { label: "Fat", val: meal.fat, unit: "g" },
        ].map((m) => (
          <div key={m.label}>
            <p
              className={`text-sm font-bold leading-none ${completed ? "text-white" : "text-black"
                }`}
            >
              {m.val}
              <span className={`text-[10px] font-semibold ml-0.5 ${completed ? "text-white/70" : "text-zinc-600"}`}>
                {m.unit}
              </span>
            </p>
            <p className={`text-[10px] mt-0.5 ${completed ? "text-white/60" : "text-zinc-600"}`}>
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Action button */}
      <button
        onClick={onToggle}
        className={`w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${completed
          ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
          : "bg-black text-white hover:bg-zinc-800 active:scale-95"
          }`}
      >
        {completed ? "✓ Completed" : "Mark as Completed"}
      </button>
    </article>
  );
}

/** Daily progress ring/bar section */
function ProgressSection({
  consumed,
  target,
  proteinConsumed,
  proteinTarget,
  completedCount,
  totalCount,
}: {
  consumed: number;
  target: number;
  proteinConsumed: number;
  proteinTarget: number;
  completedCount: number;
  totalCount: number;
}) {
  const calPct = pct(consumed, target);
  const protPct = pct(proteinConsumed, proteinTarget);
  const remaining = Math.max(target - consumed, 0);

  return (
    <div className="bg-black rounded-2xl p-6 text-white flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-white/70">
            Daily Progress
          </p>
          <p className="text-4xl font-black mt-1 leading-none">
            {fmt(consumed)}
            <span className="text-lg font-semibold text-white/60 ml-1">kcal</span>
          </p>
          <p className="text-sm text-white/70 mt-1">
            {fmt(remaining)} kcal remaining · Target {fmt(target)} kcal
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60 uppercase tracking-widest font-bold">Meals Done</p>
          <p className="text-4xl font-black mt-1 leading-none">
            {completedCount}
            <span className="text-lg font-semibold text-white/60">/{totalCount}</span>
          </p>
        </div>
      </div>

      {/* Calorie bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-white/70 mb-1.5">
          <span>Calories</span>
          <span>{calPct}%</span>
        </div>
        <div role="progressbar" aria-label="Progress kalori" aria-valuemin={0} aria-valuemax={100} aria-valuenow={calPct} className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-700"
            style={{ width: `${calPct}%` }}
          />
        </div>
      </div>

      {/* Protein bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-white/70 mb-1.5">
          <span>Protein — {fmt(proteinConsumed)}g / {fmt(proteinTarget)}g</span>
          <span>{protPct}%</span>
        </div>
        <div role="progressbar" aria-label="Progress kalori" aria-valuemin={0} aria-valuemax={100} aria-valuenow={calPct} className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/70 rounded-full transition-all duration-700"
            style={{ width: `${protPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  Page (default export)
// ─────────────────────────────────────────────

export default function Home() {
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  // Derived totals from completed meals only
  const consumedMeals = MEALS.filter((m) => completed.has(m.id));
  const consumedCalories = consumedMeals.reduce((s, m) => s + m.calories, 0);
  const consumedProtein = consumedMeals.reduce((s, m) => s + m.protein, 0);
  const consumedCarbs = consumedMeals.reduce((s, m) => s + m.carbs, 0);
  const consumedFat = consumedMeals.reduce((s, m) => s + m.fat, 0);

  return (
    <div className="min-h-screen bg-zinc-50 font-sans">
      {/* ── NAVBAR ── */}
      <Navbar active="Meal Plan" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-10">

        {/* ── HERO SECTION ── */}
        <section aria-labelledby="hero-title" className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-2.5 py-1 rounded-full">
                Cutting
              </span>
              <span className="text-xs text-zinc-600 font-semibold">
                Week 4 · Day 3
              </span>
            </div>
            <h1 id="hero-title" className="text-4xl sm:text-5xl font-black text-black leading-tight tracking-tight">
              Your Daily<br />
              <span className="text-zinc-600">Meal Plan.</span>
            </h1>
            <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
              Fuel your body strategically. Every meal is calculated to hit your
              cutting goal while preserving muscle mass.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 sm:flex-col sm:text-right">
            <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest">
                Target Calories
              </p>
              <p className="text-3xl font-black text-black leading-none mt-0.5">
                2,100
                <span className="text-sm font-semibold text-zinc-600 ml-1">kcal</span>
              </p>
            </div>
            <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4 shadow-sm">
              <p className="text-xs text-zinc-600 font-semibold uppercase tracking-widest">
                Protein Goal
              </p>
              <p className="text-3xl font-black text-black leading-none mt-0.5">
                160
                <span className="text-sm font-semibold text-zinc-600 ml-1">g</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── MACRO SUMMARY ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-600">
              Nutrition Summary
            </h2>
            <span className="text-xs text-zinc-600">
              Based on completed meals
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MacroCard
              label="Calories"
              value={DAILY_TARGET.calories}
              unit="kcal"
              consumed={consumedCalories}
              total={DAILY_TARGET.calories}
            />
            <MacroCard
              label="Protein"
              value={DAILY_TARGET.protein}
              unit="g"
              consumed={consumedProtein}
              total={DAILY_TARGET.protein}
            />
            <MacroCard
              label="Carbs"
              value={DAILY_TARGET.carbs}
              unit="g"
              consumed={consumedCarbs}
              total={DAILY_TARGET.carbs}
            />
            <MacroCard
              label="Fat"
              value={DAILY_TARGET.fat}
              unit="g"
              consumed={consumedFat}
              total={DAILY_TARGET.fat}
            />
          </div>
        </section>

        {/* ── MAIN GRID: Meals + Progress ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Meal Cards — takes 2/3 */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-600">
              Today&apos;s Meals
            </h2>
            {MEALS.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                completed={completed.has(meal.id)}
                onToggle={() => toggle(meal.id)}
              />
            ))}
          </div>

          {/* Sidebar — takes 1/3 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-zinc-600">
              Progress
            </h2>

            {/* Progress section */}
            <ProgressSection
              consumed={consumedCalories}
              target={DAILY_TARGET.calories}
              proteinConsumed={consumedProtein}
              proteinTarget={DAILY_TARGET.protein}
              completedCount={completed.size}
              totalCount={MEALS.length}
            />

            {/* Meal schedule */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-4">
                Schedule
              </p>
              <div className="flex flex-col gap-3">
                {MEALS.map((meal) => (
                  <div key={meal.id} className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${completed.has(meal.id) ? "bg-black" : "bg-zinc-200"
                        }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-bold leading-none ${completed.has(meal.id) ? "text-black line-through" : "text-black"
                            }`}
                        >
                          {meal.type}
                        </p>
                        <p className="text-xs text-zinc-600">{meal.time}</p>
                      </div>
                      <p className="text-xs text-zinc-600 mt-0.5">{meal.calories} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip card */}
            <div className="bg-zinc-100 rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-600 mb-2">
                Coach Tip
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Drink at least <strong className="text-black">3L of water</strong> today.
                Hydration directly impacts performance and fat loss during a cut.
              </p>
            </div>
          </div>
        </div>

        {/* ── MOTIVATIONAL FOOTER BANNER ── */}
        <section aria-labelledby="motivation-title" className="bg-black rounded-2xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-white text-2xl sm:text-3xl font-black leading-tight tracking-tight">
              Stay consistent.
            </p>
            <p className="text-white/70 text-base mt-1">
              Your results are built{" "}
              <span className="text-white font-bold">one meal at a time.</span>
            </p>
          </div>
          <div className="flex items-center gap-3 text-white/60 text-sm font-semibold">
            <span aria-hidden="true" className="text-3xl">🔥</span>
            <div>
              <p className="text-white font-black text-lg leading-none">
                {completed.size} / {MEALS.length}
              </p>
              <p className="text-white/60 text-xs mt-0.5">Meals Completed Today</p>
            </div>
          </div>
        </section>

        {/* ── PAGE FOOTER ── */}
        <footer className="flex items-center justify-between text-xs text-zinc-300 pb-4">
          <span className="font-black tracking-widest text-zinc-600">FITCORE</span>
          <span>© 2025 · Meal Plan Dashboard · Premium Membership</span>
        </footer>

      </main>
    </div>
  );
}
