import React, { useMemo, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car,
  LayoutDashboard,
  CalendarClock,
  ShieldCheck,
  Wrench,
  Bell,
  FileText,
  Users,
  LogIn,
  LogOut,
  Plus,
  Search,
  Info,
  Settings,
} from "lucide-react";

/**
 * DriveWise Fleet — Frontend v1 (React Preview)
 * ------------------------------------------------------
 * Multi-page preview in a single file (for quick iteration).
 * Uses React Router for routing + Tailwind for styling.
 * You can copy this into a Vite app later without big changes.
 */

// ---------------------------------------------------------
// Mock Auth
// ---------------------------------------------------------
function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = typeof localStorage !== "undefined" && localStorage.getItem("dw_user");
    return raw ? JSON.parse(raw) : null;
  });
  const login = (email) => {
    const u = { id: "u_1", name: "Fleet Admin", email };
    setUser(u);
    if (typeof localStorage !== "undefined") localStorage.setItem("dw_user", JSON.stringify(u));
  };
  const logout = () => {
    setUser(null);
    if (typeof localStorage !== "undefined") localStorage.removeItem("dw_user");
  };
  return { user, login, logout };
}

// ---------------------------------------------------------
// Layouts
// ---------------------------------------------------------
function AppShell({ children, onOpenAdd }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <TopBar onOpenAdd={onOpenAdd} />
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  const items = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/vehicles", label: "Vehicles", icon: Car },
    { to: "/reminders", label: "Reminders", icon: Bell },
    { to: "/documents", label: "Documents", icon: FileText },
    { to: "/account", label: "Account", icon: Users },
  ];
  return (
    <aside className="w-60 hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 min-h-screen">
      <div className="p-4 flex items-center gap-2">
        <Car className="w-6 h-6" />
        <span className="font-semibold">DriveWise Fleet</span>
        <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800">Preview</span>
      </div>
      <nav className="p-2 space-y-1">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-xl text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900 ${
                isActive ? "bg-neutral-100 dark:bg-neutral-900 font-medium" : ""
              }`
            }
          >
            <it.icon className="w-4 h-4" />
            {it.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto p-3 text-xs text-neutral-500">© {new Date().getFullYear()} DriveWise</div>
    </aside>
  );
}

function TopBar({ onOpenAdd }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="md:hidden flex items-center gap-2">
          <Car className="w-5 h-5" />
          <span className="font-semibold">DriveWise Fleet</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onOpenAdd} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm bg-black text-white hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Auth Pages
// ---------------------------------------------------------
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid place-items-center bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Car className="w-6 h-6" />
          <div className="font-semibold">DriveWise Fleet</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const nav = useNavigate();
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <div className="text-lg font-semibold">Log in</div>
          <div className="text-sm text-neutral-500">Enter your email and password</div>
        </div>
        <div className="space-y-2">
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" />
          <input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder="Password" className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" />
        </div>
        <button
          onClick={() => { onLogin(email); nav("/dashboard"); }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm"
        >
          <LogIn className="w-4 h-4" /> Log in
        </button>
        <div className="text-xs text-neutral-500">
          <Link className="underline" to="/forgot">Forgot password?</Link>
        </div>
        <div className="text-xs">No account? <Link className="underline" to="/signup">Sign up</Link></div>
      </div>
    </AuthLayout>
  );
}

function SignupPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="text-lg font-semibold">Create account</div>
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Password" type="password" />
        <button onClick={()=> nav("/login") } className="w-full rounded-xl bg-black text-white px-3 py-2 text-sm">Continue</button>
        <div className="text-xs"><Link className="underline" to="/login">Back to login</Link></div>
      </div>
    </AuthLayout>
  );
}

function ForgotPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="text-lg font-semibold">Forgot password</div>
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button onClick={()=> nav("/login") } className="w-full rounded-xl bg-black text-white px-3 py-2 text-sm">Send reset link</button>
        <div className="text-xs"><Link className="underline" to="/login">Back to login</Link></div>
      </div>
    </AuthLayout>
  );
}

// ---------------------------------------------------------
// Data & Utilities
// ---------------------------------------------------------
const seedVehicles = [
  {
    id: "veh_1",
    plate: "KZC 123",
    vin: "WVWZZZ1JZXW000001",
    make: "Toyota",
    model: "Corolla",
    year: 2018,
    color: "White",
    owner: "Noyanlar Fleet",
    photo: "https://images.unsplash.com/photo-1555231953-8e46195a8f78?q=80&w=1200&auto=format&fit=crop",
    odometer: 86500,
    mot: { date: "2025-11-22", result: "Pass" },
    insurance: { start: "2025-01-01", end: "2025-12-31", insurer: "Kıbrıs Sigorta", policy: "TR-NS-99812" },
    nextService: { date: "2025-12-10", type: "Oil + Filters" },
    maintenance: [
      { date: "2025-06-02", km: 82000, type: "Oil Change", cost: 75, notes: "5W-30" },
      { date: "2024-12-10", km: 76000, type: "Front brake pads", cost: 120, notes: "Brembo" },
    ],
    crashes: [ { date: "2023-03-12", severity: "minor", desc: "Rear bumper scratch", cost: 250 }],
    docs: [ { name: "MOT Cert 2024.pdf", type: "inspection" }, { name: "Insurance 2025.pdf", type: "insurance" } ],
  },
  {
    id: "veh_2",
    plate: "NBT 507",
    vin: "WAUZZZ8K9DA123456",
    make: "Hyundai",
    model: "i20",
    year: 2020,
    color: "Blue",
    owner: "Noymax Development",
    photo: "https://images.unsplash.com/photo-1605559424843-9e4c1a79f6a8?q=80&w=1200&auto=format&fit=crop",
    odometer: 41200,
    mot: { date: "2026-01-15", result: "Pass" },
    insurance: { start: "2025-04-15", end: "2026-04-14", insurer: "Near East Insurance", policy: "NE-44121" },
    nextService: { date: "2026-02-01", type: "Full Service" },
    maintenance: [{ date: "2025-02-01", km: 38000, type: "Tire Rotation", cost: 30 }],
    crashes: [], docs: [{ name: "Reg-Card.png", type: "registration" }],
  },
  {
    id: "veh_3",
    plate: "GME 904",
    vin: "VF1BB0R0A12398765",
    make: "Renault",
    model: "Clio",
    year: 2016,
    color: "Silver",
    owner: "Olea Residence",
    photo: "https://images.unsplash.com/photo-1600359758489-0867abfa9f74?q=80&w=1200&auto=format&fit=crop",
    odometer: 125300,
    mot: { date: "2025-10-29", result: "Due" },
    insurance: { start: "2025-03-01", end: "2025-11-01", insurer: "Anadolu Sigorta", policy: "AN-22219" },
    nextService: { date: "2025-11-05", type: "Belts & Coolant" },
    maintenance: [{ date: "2025-05-30", km: 119000, type: "Battery Replace", cost: 140 }],
    crashes: [{ date: "2022-08-20", severity: "moderate", desc: "Door dent LH", cost: 480 }],
    docs: [{ name: "MOT Cert 2023.pdf", type: "inspection" }],
  },
];

const fmt = (d) => new Date(d).toLocaleDateString();
const daysUntil = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
};
const cls = (...xs) => xs.filter(Boolean).join(" ");

// ---------------------------------------------------------
// Reusable UI
// ---------------------------------------------------------
function StatCard({ title, icon: Icon, value, hint }) {
  return (
    <motion.div layout className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm text-neutral-500">{title}</div>
          <div className="text-xl font-semibold">{value}</div>
          {hint && <div className="text-xs text-neutral-500 mt-0.5">{hint}</div>}
        </div>
      </div>
    </motion.div>
  );
}

function Tag({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    danger: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return <span className={cls("px-2 py-0.5 text-xs rounded-full", tones[tone])}>{children}</span>;
}

function VehicleRow({ v, onOpen }) {
  const motDays = daysUntil(v.mot?.date);
  const insDays = daysUntil(v.insurance?.end);
  const svcDays = daysUntil(v.nextService?.date);
  const badge = (n) => (n <= 7 ? "danger" : n <= 30 ? "warning" : "success");
  return (
    <tr className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
      <td className="py-3 px-2"><div className="font-medium">{v.plate}</div><div className="text-xs text-neutral-500">{v.vin}</div></td>
      <td className="py-3 px-2">
        <div className="font-medium">{v.make} {v.model}</div>
        <div className="text-xs text-neutral-500">{v.year} · {v.color}</div>
      </td>
      <td className="py-3 px-2"><Tag tone={badge(motDays)}>MOT: {fmt(v.mot.date)} ({motDays}d)</Tag></td>
      <td className="py-3 px-2"><Tag tone={badge(insDays)}>Insurance: {fmt(v.insurance.end)} ({insDays}d)</Tag></td>
      <td className="py-3 px-2"><Tag tone={badge(svcDays)}>Service: {fmt(v.nextService.date)} ({svcDays}d)</Tag></td>
      <td className="py-3 px-2 text-right">
        <button onClick={() => onOpen(v)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <Info className="w-4 h-4"/> Details
        </button>
      </td>
    </tr>
  );
}

function VehicleTable({ items, onOpen }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr className="text-left">
            <th className="py-2 px-2 font-medium">Plate / VIN</th>
            <th className="py-2 px-2 font-medium">Vehicle</th>
            <th className="py-2 px-2 font-medium">MOT</th>
            <th className="py-2 px-2 font-medium">Insurance</th>
            <th className="py-2 px-2 font-medium">Next Service</th>
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((v) => (
            <VehicleRow key={v.id} v={v} onOpen={onOpen} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VehicleDrawer({ open, onClose, vehicle }) {
  if (!vehicle) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }}
          className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <img src={vehicle.photo} alt="car" className="w-14 h-14 object-cover rounded-xl" />
            <div>
              <div className="text-lg font-semibold">{vehicle.make} {vehicle.model} — {vehicle.plate}</div>
              <div className="text-xs text-neutral-500">VIN {vehicle.vin}</div>
            </div>
            <button onClick={onClose} className="ml-auto rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Settings className="w-5 h-5 rotate-45"/></button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <section className="space-y-2">
              <div className="text-sm font-medium">Quick Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard title="MOT" icon={CalendarClock} value={`${fmt(vehicle.mot.date)} (${daysUntil(vehicle.mot.date)}d)`} />
                <StatCard title="Insurance" icon={ShieldCheck} value={`${fmt(vehicle.insurance.end)} (${daysUntil(vehicle.insurance.end)}d)`} />
                <StatCard title="Next Service" icon={Wrench} value={`${fmt(vehicle.nextService.date)} (${daysUntil(vehicle.nextService.date)}d)`} />
                <StatCard title="Odometer" icon={Car} value={`${vehicle.odometer.toLocaleString()} km`} />
              </div>
            </section>
            <section className="space-y-2">
              <div className="text-sm font-medium">Maintenance</div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
                {vehicle.maintenance.map((m, i) => (
                  <div key={i} className="p-3 flex items-center gap-3">
                    <Wrench className="w-4 h-4" />
                    <div className="text-sm flex-1">
                      <div className="font-medium">{m.type}</div>
                      <div className="text-xs text-neutral-500">{fmt(m.date)} • {m.km.toLocaleString()} km</div>
                    </div>
                    <div className="text-sm">£{m.cost}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-2">
              <div className="text-sm font-medium">Crash / Damage</div>
              {vehicle.crashes.length === 0 ? (
                <div className="text-sm text-neutral-500">No records.</div>
              ) : (
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
                  {vehicle.crashes.map((c, i) => (
                    <div key={i} className="p-3 flex items-center gap-3">
                      <Bell className="w-4 h-4" />
                      <div className="text-sm flex-1">
                        <div className="font-medium capitalize">{c.severity} incident</div>
                        <div className="text-xs text-neutral-500">{fmt(c.date)} — {c.desc}</div>
                      </div>
                      <div className="text-sm">£{c.cost}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <section className="space-y-2">
              <div className="text-sm font-medium">Documents</div>
              <div className="grid grid-cols-2 gap-2">
                {vehicle.docs.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-2 text-sm">
                    <FileText className="w-4 h-4"/> {d.name}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------------------------------------------------------
// Pages
// ---------------------------------------------------------
function DashboardPage({ vehicles }) {
  const stats = useMemo(() => {
    const now = new Date();
    const upTo = (d) => (new Date(d) - now) / (1000 * 60 * 60 * 24) <= 30;
    const mot = vehicles.filter((v) => upTo(v.mot.date)).length;
    const ins = vehicles.filter((v) => upTo(v.insurance.end)).length;
    const svc = vehicles.filter((v) => upTo(v.nextService.date)).length;
    return { mot, ins, svc };
  }, [vehicles]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Vehicles" icon={Car} value={vehicles.length} />
        <StatCard title="MOT ≤ 30d" icon={CalendarClock} value={stats.mot} hint="Keep your fleet compliant" />
        <StatCard title="Insurance ≤ 30d" icon={ShieldCheck} value={stats.ins} hint="Avoid policy lapses" />
        <StatCard title="Service ≤ 30d" icon={Wrench} value={stats.svc} hint="Prevent breakdowns" />
      </div>
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Welcome! Use the sidebar to jump to Vehicles, Reminders, or Documents. This dashboard will show charts and KPIs in the next iteration.</div>
      </div>
    </div>
  );
}

function VehiclesPage({ vehicles, onOpen, onCreate }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = vehicles.filter((v) => [v.plate, v.vin, v.make, v.model, String(v.year)].some((s)=> String(s).toLowerCase().includes(q)));
    if (filter === "30d") list = list.filter((v) => daysUntil(v.mot.date) <= 30 || daysUntil(v.insurance.end) <= 30 || daysUntil(v.nextService.date) <= 30);
    if (filter === "mot") list = list.sort((a,b)=> new Date(a.mot.date) - new Date(b.mot.date));
    if (filter === "insurance") list = list.sort((a,b)=> new Date(a.insurance.end) - new Date(b.insurance.end));
    if (filter === "service") list = list.sort((a,b)=> new Date(a.nextService.date) - new Date(b.nextService.date));
    return list;
  }, [vehicles, query, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4" />
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search plate, VIN, make, model..." className="w-full bg-transparent outline-none text-sm" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {[{k:"all",label:"All"},{k:"30d",label:"Due ≤ 30d"},{k:"mot",label:"MOT"},{k:"insurance",label:"Insurance"},{k:"service",label:"Service"}].map((f)=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} className={cls("px-3 py-1.5 text-sm rounded-xl border", filter===f.k?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900")}>{f.label}</button>
          ))}
        </div>
      </div>
      <VehicleTable items={filtered} onOpen={onOpen} />
      <div className="text-xs text-neutral-500">Tip: Use the **Add Vehicle** button (top bar) to insert a mock record.</div>
    </div>
  );
}

function RemindersPage({ vehicles }) {
  const items = useMemo(()=>{
    return vehicles.flatMap((v)=>[
      { id: `${v.id}_mot`, vehicle: v, type: "MOT", due: v.mot.date },
      { id: `${v.id}_ins`, vehicle: v, type: "Insurance", due: v.insurance.end },
      { id: `${v.id}_svc`, vehicle: v, type: "Service", due: v.nextService.date },
    ]).sort((a,b)=> new Date(a.due) - new Date(b.due));
  },[vehicles]);

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">Upcoming reminders</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it)=>{
          const d = daysUntil(it.due);
          const tone = d<=7?"danger":d<=30?"warning":"success";
          const Icon = it.type === "MOT" ? CalendarClock : it.type === "Insurance" ? ShieldCheck : Wrench;
          return (
            <div key={it.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><Icon className="w-5 h-5"/></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{it.type} — {it.vehicle.plate}</div>
                  <div className="text-xs text-neutral-500">{it.vehicle.make} {it.vehicle.model}</div>
                </div>
                <Tag tone={tone}>{fmt(it.due)} ({d}d)</Tag>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocumentsPage({ vehicles }) {
  const docs = vehicles.flatMap((v)=> v.docs.map((d,i)=> ({ id: `${v.id}_${i}`, v, d })));
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Documents</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map((x)=> (
          <div key={x.id} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-start gap-3">
            <FileText className="w-5 h-5"/>
            <div className="text-sm">
              <div className="font-medium">{x.d.name}</div>
              <div className="text-xs text-neutral-500">{x.v.plate} — {x.v.make} {x.v.model}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountPage({ onLogout }) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Account</div>
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Profile & organization settings will live here.</div>
        <button onClick={onLogout} className="mt-4 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <LogOut className="w-4 h-4"/> Log out
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// Root App
// ---------------------------------------------------------
function App() {
  const auth = useAuth();
  const [vehicles, setVehicles] = useState(seedVehicles);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [adding, setAdding] = useState(false);

  if (!auth.user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot" element={<ForgotPage />} />
          <Route path="*" element={<LoginPage onLogin={auth.login} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  function openVehicle(v) { setCurrent(v); setDrawerOpen(true); }
  function handleCreate() {
    const id = Math.random().toString(36).slice(2,8);
    const newV = {
      id: `veh_${id}`,
      plate: `NEW ${id.toUpperCase()}`,
      vin: "—",
      make: "Sample",
      model: "Vehicle",
      year: new Date().getFullYear(),
      color: "Gray",
      owner: "—",
      photo: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200&auto=format&fit=crop",
      odometer: 0,
      mot: { date: new Date(Date.now()+1000*60*60*24*90).toISOString().slice(0,10), result: "Due" },
      insurance: { start: new Date().toISOString().slice(0,10), end: new Date(Date.now()+1000*60*60*24*365).toISOString().slice(0,10), insurer: "—", policy: "—" },
      nextService: { date: new Date(Date.now()+1000*60*60*24*120).toISOString().slice(0,10), type: "General" },
      maintenance: [], crashes: [], docs: [],
    };
    setVehicles((prev)=> [newV, ...prev]);
    setAdding(false);
  }

  return (
    <BrowserRouter>
      <AppShell onOpenAdd={()=> setAdding(true)}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage vehicles={vehicles} />} />
          <Route path="/vehicles" element={<VehiclesPage vehicles={vehicles} onOpen={openVehicle} onCreate={()=>setAdding(true)} />} />
          <Route path="/reminders" element={<RemindersPage vehicles={vehicles} />} />
          <Route path="/documents" element={<DocumentsPage vehicles={vehicles} />} />
          <Route path="/account" element={<AccountPage onLogout={auth.logout} />} />
          <Route path="*" element={<DashboardPage vehicles={vehicles} />} />
        </Routes>
      </AppShell>

      <VehicleDrawer open={drawerOpen} onClose={()=> setDrawerOpen(false)} vehicle={current} />

      <AnimatePresence>
        {adding && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={()=> setAdding(false)} />
            <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }}
              className="relative w-full sm:w-[520px] bg-white dark:bg-neutral-950 rounded-t-2xl sm:rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><Plus className="w-4 h-4"/></div>
                <div className="font-semibold">Add Vehicle</div>
                <button onClick={()=> setAdding(false)} className="ml-auto rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"><Info className="w-5 h-5 rotate-180"/></button>
              </div>
              <div className="text-sm text-neutral-500 mb-3">(Demo) Clicking Save will add a sample vehicle with future MOT/Insurance/Service dates.</div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={()=> setAdding(false)} className="px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800">Cancel</button>
                <button onClick={handleCreate} className="px-3 py-2 text-sm rounded-xl bg-black text-white">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
