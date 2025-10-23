import React, { useMemo, useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Car, LayoutDashboard, CalendarClock, ShieldCheck, Wrench, Bell, FileText, Users,
  LogIn, LogOut, Plus, Search, Info, Settings, SunMedium, Moon, Languages, Trash2, Edit3, X
} from "lucide-react";

/**
 * DriveWise Fleet — Frontend v2 (production-ready preview)
 * - Theme toggle (persisted)
 * - EN/TR language toggle
 * - Vehicles table (sort, paginate)
 * - Add/Edit/Delete vehicles (persist in localStorage)
 * - Details drawer, Reminders, Documents, Settings, Account, 404
 */

const LS_KEY  = "dw_fleet_vehicles";
const LS_USER = "dw_user";
const LS_PREF = "dw_prefs"; // { theme, lang, reminderLeadDays }

const prefersDark = () =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

function loadVehicles() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? seedVehicles; } catch { return seedVehicles; }
}
function saveVehicles(vs) { localStorage.setItem(LS_KEY, JSON.stringify(vs)); }

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(LS_PREF)) ?? { theme: prefersDark() ? "dark" : "light", lang: "en", reminderLeadDays: 30 };
  } catch {
    return { theme: "light", lang: "en", reminderLeadDays: 30 };
  }
}
function savePrefs(p) { localStorage.setItem(LS_PREF, JSON.stringify(p)); }

const dict = {
  en: {
    app: "DriveWise Fleet", login: "Log in", email: "Email", password: "Password",
    forgot: "Forgot password?", signup: "Sign up", createAccount: "Create account",
    continue: "Continue", backToLogin: "Back to login",
    dashboard: "Dashboard", vehicles: "Vehicles", reminders: "Reminders",
    documents: "Documents", account: "Account", addVehicle: "Add Vehicle",
    mot: "MOT", insurance: "Insurance", service: "Service", nextService: "Next Service",
    due30: "Due ≤ 30d", searchPlaceholder: "Search plate, VIN, make, model...",
    emptyVehicles: "No vehicles yet. Click Add Vehicle to create one.",
    edit: "Edit", remove: "Remove", save: "Save", cancel: "Cancel", details: "Details",
    quickStats: "Quick Stats", maintenance: "Maintenance", crash: "Crash / Damage",
    docs: "Documents", noRecords: "No records.", docName: "Document name",
    reminderLead: "Reminder lead time (days)", settings: "Settings", profile: "Profile",
    logout: "Log out", added: "Added", updated: "Updated", deleted: "Deleted",
    of: "of", rows: "rows",
  },
  tr: {
    app: "DriveWise Filo", login: "Giriş Yap", email: "E-posta", password: "Şifre",
    forgot: "Şifremi unuttum", signup: "Kayıt ol", createAccount: "Hesap oluştur",
    continue: "Devam et", backToLogin: "Girişe dön",
    dashboard: "Panel", vehicles: "Araçlar", reminders: "Hatırlatmalar",
    documents: "Belgeler", account: "Hesap", addVehicle: "Araç Ekle",
    mot: "Muayene", insurance: "Sigorta", service: "Servis", nextService: "Sonraki Servis",
    due30: "≤ 30gün", searchPlaceholder: "Plaka, şase, marka, model ara...",
    emptyVehicles: "Henüz araç yok. Araç Ekle ile oluşturun.",
    edit: "Düzenle", remove: "Sil", save: "Kaydet", cancel: "Vazgeç", details: "Detay",
    quickStats: "Hızlı Bilgiler", maintenance: "Bakım", crash: "Kaza / Hasar",
    docs: "Belgeler", noRecords: "Kayıt yok.", docName: "Belge adı",
    reminderLead: "Hatırlatma süresi (gün)", settings: "Ayarlar", profile: "Profil",
    logout: "Çıkış", added: "Eklendi", updated: "Güncellendi", deleted: "Silindi",
    of: "/", rows: "kayıt",
  }
};

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
    crashes: [{ date: "2023-03-12", severity: "minor", desc: "Rear bumper scratch", cost: 250 }],
    docs: [{ name: "MOT Cert 2024.pdf", type: "inspection" }, { name: "Insurance 2025.pdf", type: "insurance" }],
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
    crashes: [],
    docs: [{ name: "Reg-Card.png", type: "registration" }],
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
const daysUntil = (dateStr) => Math.ceil((new Date(dateStr) - new Date()) / 86400000);
const cls = (...xs) => xs.filter(Boolean).join(" ");
const badge = (n) => (n <= 7 ? "danger" : n <= 30 ? "warning" : "success");

function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const login = (email) => { const u = { id: "u_1", name: "Fleet Admin", email }; setUser(u); localStorage.setItem(LS_USER, JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem(LS_USER); };
  return { user, login, logout };
}
function usePrefs() {
  const [prefs, setPrefs] = useState(loadPrefs());
  useEffect(() => {
    savePrefs(prefs);
    if (prefs.theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [prefs]);
  return { prefs, setPrefs };
}

function AppShell({ children, t, lang, setLang, theme, toggleTheme, onOpenAdd }) {
  return (
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="flex">
        <Sidebar t={t} />
        <div className="flex-1 min-w-0">
          <TopBar t={t} lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} onOpenAdd={onOpenAdd} />
          <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
function Sidebar({ t }) {
  const items = [
    { to: "/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { to: "/vehicles", label: t.vehicles, icon: Car },
    { to: "/reminders", label: t.reminders, icon: Bell },
    { to: "/documents", label: t.documents, icon: FileText },
    { to: "/settings", label: t.settings, icon: Settings },
    { to: "/account", label: t.account, icon: Users },
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
function TopBar({ t, lang, setLang, theme, toggleTheme, onOpenAdd }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2">
        <div className="md:hidden flex items-center gap-2">
          <Car className="w-5 h-5" />
          <span className="font-semibold">DriveWise Fleet</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setLang(lang === "en" ? "tr" : "en")} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <Languages className="w-4 h-4" /> {lang.toUpperCase()}
          </button>
          <button onClick={toggleTheme} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            {theme === "dark" ? <Moon className="w-4 h-4" /> : <SunMedium className="w-4 h-4" />}
          </button>
          <button onClick={onOpenAdd} className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm bg-black text-white hover:opacity-90">
            <Plus className="w-4 h-4" /> {t.addVehicle}
          </button>
        </div>
      </div>
    </div>
  );
}

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
function LoginPage({ onLogin, t }) {
  const [email, setEmail] = useState(""); const [pwd, setPwd] = useState(""); const nav = useNavigate();
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div><div className="text-lg font-semibold">{t.login}</div><div className="text-sm text-neutral-500">{t.email} & {t.password}</div></div>
        <div className="space-y-2">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={t.email} className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" />
          <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder={t.password} className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" />
        </div>
        <button onClick={()=>{ onLogin(email); nav("/dashboard"); }} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white px-3 py-2 text-sm">
          <LogIn className="w-4 h-4" /> {t.login}
        </button>
        <div className="text-xs text-neutral-500"><Link className="underline" to="/forgot">{t.forgot}</Link></div>
        <div className="text-xs">No account? <Link className="underline" to="/signup">{t.signup}</Link></div>
      </div>
    </AuthLayout>
  );
}
function SignupPage({ t }) {
  const nav = useNavigate(); const [email,setEmail]=useState("");
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="text-lg font-semibold">{t.createAccount}</div>
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder={t.password} type="password" />
        <button onClick={()=> nav("/login")} className="w-full rounded-xl bg-black text-white px-3 py-2 text-sm">{t.continue}</button>
        <div className="text-xs"><Link className="underline" to="/login">{t.backToLogin}</Link></div>
      </div>
    </AuthLayout>
  );
}
function ForgotPage({ t }) {
  const nav = useNavigate(); const [email,setEmail]=useState("");
  return (
    <AuthLayout>
      <div className="space-y-4">
        <div className="text-lg font-semibold">{t.forgot}</div>
        <input className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" placeholder={t.email} value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={()=> nav("/login")} className="w-full rounded-xl bg-black text-white px-3 py-2 text-sm">{t.continue}</button>
        <div className="text-xs"><Link className="underline" to="/login">{t.backToLogin}</Link></div>
      </div>
    </AuthLayout>
  );
}

function StatCard({ title, icon: Icon, value, hint }) {
  return (
    <motion.div layout className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800"><Icon className="w-5 h-5" /></div>
        <div><div className="text-sm text-neutral-500">{title}</div><div className="text-xl font-semibold">{value}</div>{hint && <div className="text-xs text-neutral-500 mt-0.5">{hint}</div>}</div>
      </div>
    </motion.div>
  );
}
function Tag({ children, tone="neutral" }) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
    success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    danger:  "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  };
  return <span className={cls("px-2 py-0.5 text-xs rounded-full", tones[tone])}>{children}</span>;
}

function VehiclesTable({ items, onOpen, onEdit, onDelete, t }) {
  const [sortBy, setSortBy] = useState("plate");
  const [asc, setAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const sorted = useMemo(() => {
    const arr = [...items];
    arr.sort((a,b) => {
      const A = (sortBy==="vehicle") ? `${a.make} ${a.model}` : a[sortBy];
      const B = (sortBy==="vehicle") ? `${b.make} ${b.model}` : b[sortBy];
      return (A > B ? 1 : A < B ? -1 : 0) * (asc ? 1 : -1);
    });
    return arr;
  }, [items, sortBy, asc]);

  const total = sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = sorted.slice((page-1)*pageSize, page*pageSize);

  const header = (cell, key) => {
    const active = sortBy === key;
    return (
      <th className="py-2 px-2 font-medium">
        <button onClick={() => (active ? setAsc(!asc) : (setSortBy(key), setAsc(true)))} className={cls("inline-flex items-center gap-1", active && "underline")}>
          {cell}
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr className="text-left">
            {header("Plate / VIN","plate")}
            {header("Vehicle","vehicle")}
            {header(t.mot,"mot")}
            {header(t.insurance,"insurance")}
            {header(t.nextService,"nextService")}
            <th className="py-2 px-2"></th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((v) => (
            <tr key={v.id} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40">
              <td className="py-3 px-2"><div className="font-medium">{v.plate}</div><div className="text-xs text-neutral-500">{v.vin}</div></td>
              <td className="py-3 px-2"><div className="font-medium">{v.make} {v.model}</div><div className="text-xs text-neutral-500">{v.year} · {v.color}</div></td>
              <td className="py-3 px-2"><Tag tone={badge(daysUntil(v.mot?.date))}>{t.mot}: {fmt(v.mot.date)} ({daysUntil(v.mot.date)}d)</Tag></td>
              <td className="py-3 px-2"><Tag tone={badge(daysUntil(v.insurance?.end))}>{t.insurance}: {fmt(v.insurance.end)} ({daysUntil(v.insurance.end)}d)</Tag></td>
              <td className="py-3 px-2"><Tag tone={badge(daysUntil(v.nextService?.date))}>{t.service}: {fmt(v.nextService.date)} ({daysUntil(v.nextService.date)}d)</Tag></td>
              <td className="py-3 px-2 text-right space-x-2">
                <button onClick={() => onOpen(v)} className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900"><Info className="w-4 h-4"/> {t.details}</button>
                <button onClick={() => onEdit(v)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900"><Edit3 className="w-3 h-3"/> {t.edit}</button>
                <button onClick={() => onDelete(v)} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300 hover:bg-rose-50/60"><Trash2 className="w-3 h-3"/> {t.remove}</button>
              </td>
            </tr>
          ))}
          {pageItems.length===0 && (
            <tr><td colSpan={6}><div className="p-8 text-center text-sm text-neutral-500">{dict.en.emptyVehicles}</div></td></tr>
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div>{total} {dict.en.rows}</div>
        <div className="flex items-center gap-2">
          <button disabled={page===1} onClick={()=> setPage(p=>Math.max(1,p-1))} className="px-2 py-1 rounded border disabled:opacity-50">‹</button>
          <span>{page} {dict.en.of} {pages}</span>
          <button disabled={page===pages} onClick={()=> setPage(p=>Math.min(pages,p+1))} className="px-2 py-1 rounded border disabled:opacity-50">›</button>
        </div>
      </div>
    </div>
  );
}

function VehicleDrawer({ open, onClose, vehicle, t }) {
  if (!vehicle) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween", duration: 0.25 }}
          className="fixed inset-y-0 right-0 w-full sm:w-[560px] bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 z-50 flex flex-col">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
            <img src={vehicle.photo} alt="car" className="w-14 h-14 object-cover rounded-xl" />
            <div>
              <div className="text-lg font-semibold">{vehicle.make} {vehicle.model} — {vehicle.plate}</div>
              <div className="text-xs text-neutral-500">VIN {vehicle.vin}</div>
            </div>
            <button onClick={onClose} className="ml-auto rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-900"><X className="w-5 h-5"/></button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <section className="space-y-2">
              <div className="text-sm font-medium">{dict.en.quickStats}</div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard title={t.mot} icon={CalendarClock} value={`${fmt(vehicle.mot.date)} (${daysUntil(vehicle.mot.date)}d)`} />
                <StatCard title={t.insurance} icon={ShieldCheck} value={`${fmt(vehicle.insurance.end)} (${daysUntil(vehicle.insurance.end)}d)`} />
                <StatCard title={t.nextService} icon={Wrench} value={`${fmt(vehicle.nextService.date)} (${daysUntil(vehicle.nextService.date)}d)`} />
                <StatCard title="Odometer" icon={Car} value={`${vehicle.odometer.toLocaleString()} km`} />
              </div>
            </section>
            <section className="space-y-2">
              <div className="text-sm font-medium">{dict.en.maintenance}</div>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
                {vehicle.maintenance.length ? vehicle.maintenance.map((m, i) => (
                  <div key={i} className="p-3 flex items-center gap-3">
                    <Wrench className="w-4 h-4" />
                    <div className="text-sm flex-1">
                      <div className="font-medium">{m.type}</div>
                      <div className="text-xs text-neutral-500">{fmt(m.date)} • {m.km.toLocaleString()} km</div>
                    </div>
                    <div className="text-sm">£{m.cost}</div>
                  </div>
                )) : <div className="p-3 text-sm text-neutral-500">{dict.en.noRecords}</div>}
              </div>
            </section>
            <section className="space-y-2">
              <div className="text-sm font-medium">{dict.en.crash}</div>
              {vehicle.crashes.length === 0 ? (
                <div className="text-sm text-neutral-500">{dict.en.noRecords}</div>
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
              <div className="text-sm font-medium">{dict.en.docs}</div>
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

function DashboardPage({ vehicles }) {
  const stats = useMemo(() => {
    const now = new Date();
    const upTo = (d) => (new Date(d) - now) / 86400000 <= 30;
    const mot = vehicles.filter(v => upTo(v.mot.date)).length;
    const ins = vehicles.filter(v => upTo(v.insurance.end)).length;
    const svc = vehicles.filter(v => upTo(v.nextService.date)).length;
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
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          Use the sidebar to jump to Vehicles, Reminders, Documents, or Settings.
        </div>
      </div>
    </div>
  );
}

function VehiclesPage({ vehicles, setVehicles, onOpen, t }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = vehicles.filter(v => [v.plate, v.vin, v.make, v.model, String(v.year)].some(s => String(s).toLowerCase().includes(q)));
    if (filter === "30d") list = list.filter(v => daysUntil(v.mot.date) <= 30 || daysUntil(v.insurance.end) <= 30 || daysUntil(v.nextService.date) <= 30);
    if (filter === "mot") list = list.sort((a,b)=> new Date(a.mot.date) - new Date(b.mot.date));
    if (filter === "insurance") list = list.sort((a,b)=> new Date(a.insurance.end) - new Date(b.insurance.end));
    if (filter === "service") list = list.sort((a,b)=> new Date(a.nextService.date) - new Date(b.nextService.date));
    return list;
  }, [vehicles, query, filter]);

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ plate:"", make:"", model:"", year:"", color:"", vin:"" });

  const onEdit = (v) => { setEditing(v); setForm(v); setOpenForm(true); };
  const onDelete = (v) => { if (confirm("Delete vehicle?")) { const next = vehicles.filter(x=>x.id!==v.id); setVehicles(next); saveVehicles(next); } };

  function handleSave(){
    if (!form.plate || !form.make || !form.model) return;
    if (editing){
      const next = vehicles.map(v => v.id===editing.id ? { ...editing, ...form, year: Number(form.year)||editing.year } : v);
      setVehicles(next); saveVehicles(next);
    } else {
      const id = Math.random().toString(36).slice(2,8);
      const newV = {
        id: `veh_${id}`,
        plate: form.plate.toUpperCase(),
        vin: form.vin || "—",
        make: form.make,
        model: form.model,
        year: Number(form.year)||new Date().getFullYear(),
        color: form.color || "—",
        owner: "—",
        photo: "https://images.unsplash.com/photo-1494905998402-395d579af36f?q=80&w=1200&auto=format&fit=crop",
        odometer: 0,
        mot: { date: new Date(Date.now()+86400000*180).toISOString().slice(0,10), result: "Due" },
        insurance: { start: new Date().toISOString().slice(0,10), end: new Date(Date.now()+86400000*365).toISOString().slice(0,10), insurer: "—", policy: "—" },
        nextService: { date: new Date(Date.now()+86400000*120).toISOString().slice(0,10), type: "General" },
        maintenance: [], crashes: [], docs: [],
      };
      const next = [newV, ...vehicles]; setVehicles(next); saveVehicles(next);
    }
    setOpenForm(false); setEditing(null); setForm({ plate:"", make:"", model:"", year:"", color:"", vin:"" });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 px-3 py-2 w-full sm:w-96">
          <Search className="w-4 h-4" />
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full bg-transparent outline-none text-sm" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {[{k:"all",label:"All"},{k:"30d",label:t.due30},{k:"mot",label:t.mot},{k:"insurance",label:t.insurance},{k:"service",label:t.service}].map((f)=>(
            <button key={f.k} onClick={()=>setFilter(f.k)} className={cls("px-3 py-1.5 text-sm rounded-xl border", filter===f.k?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900")}>{f.label}</button>
          ))}
          <button onClick={()=>{ setOpenForm(true); setEditing(null); setForm({ plate:"", make:"", model:"", year:"", color:"", vin:"" }); }} className="px-3 py-1.5 text-sm rounded-xl bg-black text-white"><Plus className="w-4 h-4 inline-block mr-1"/>{t.addVehicle}</button>
        </div>
      </div>

      <VehiclesTable items={filtered} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} t={t} />

      <AnimatePresence>
        {openForm && (
          <Modal onClose={()=> setOpenForm(false)}>
            <div className="text-lg font-semibold mb-3">{editing? t.edit : t.addVehicle}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: "plate", label: "Plate" },
                { name: "vin", label: "VIN" },
                { name: "make", label: "Make" },
                { name: "model", label: "Model" },
                { name: "year", label: "Year" },
                { name: "color", label: "Color" },
              ].map(f=> (
                <div key={f.name}>
                  <label className="text-xs text-neutral-500">{f.label}</label>
                  <input value={form[f.name]||""} onChange={(e)=> setForm({...form,[f.name]: e.target.value})} placeholder={f.label} className="w-full mt-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={()=> setOpenForm(false)} className="px-3 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800">Cancel</button>
              <button onClick={handleSave} className="px-3 py-2 text-sm rounded-xl bg-black text-white">Save</button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function RemindersPage({ vehicles, prefs, setPrefs, t }) {
  const items = useMemo(()=>(
    vehicles.flatMap(v => ([
      { id: `${v.id}_mot`, vehicle: v, type: t.mot,       due: v.mot.date },
      { id: `${v.id}_ins`, vehicle: v, type: t.insurance, due: v.insurance.end },
      { id: `${v.id}_svc`, vehicle: v, type: t.service,   due: v.nextService.date },
    ])).sort((a,b)=> new Date(a.due) - new Date(b.due))
  ),[vehicles, t]);

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2">{t.reminders}</div>
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-3">
        <label className="text-sm">{t.reminderLead}</label>
        <input type="number" min={1} className="w-24 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
          value={prefs.reminderLeadDays} onChange={(e)=> setPrefs(p=> ({...p, reminderLeadDays: Number(e.target.value)||30}))} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it)=> {
          const d = daysUntil(it.due);
          const tone = d<=7?"danger":d<=30?"warning":"success";
          const Icon = it.type===t.mot ? CalendarClock : it.type===t.insurance ? ShieldCheck : Wrench;
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
  const docs = vehicles.flatMap(v => v.docs.map((d,i)=> ({ id: `${v.id}_${i}`, v, d })));
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Documents</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {docs.map(x => (
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

function SettingsPage({ prefs, setPrefs }) {
  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">Settings</div>
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">Profile & app preferences.</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="text-xs text-neutral-500">Language</label>
            <div className="mt-1 flex gap-2">
              <button onClick={()=> setPrefs(p=> ({...p, lang:'en'}))} className={cls("px-3 py-2 rounded-xl border", prefs.lang==='en'?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800")}>EN</button>
              <button onClick={()=> setPrefs(p=> ({...p, lang:'tr'}))} className={cls("px-3 py-2 rounded-xl border", prefs.lang==='tr'?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800")}>TR</button>
            </div>
          </div>
          <div>
            <label className="text-xs text-neutral-500">Theme</label>
            <div className="mt-1 flex gap-2">
              <button onClick={()=> setPrefs(p=> ({...p, theme:'light'}))} className={cls("px-3 py-2 rounded-xl border", prefs.theme==='light'?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800")}>Light</button>
              <button onClick={()=> setPrefs(p=> ({...p, theme:'dark'}))} className={cls("px-3 py-2 rounded-xl border", prefs.theme==='dark'?"bg-black text-white border-black":"border-neutral-200 dark:border-neutral-800")}>Dark</button>
            </div>
          </div>
        </div>
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

function NotFound(){
  const nav = useNavigate();
  return (
    <div className="min-h-[50vh] grid place-items-center">
      <div className="text-center">
        <div className="text-2xl font-semibold">404</div>
        <div className="text-sm text-neutral-500">Page not found</div>
        <button onClick={()=> nav('/dashboard')} className="mt-3 px-3 py-2 text-sm rounded-xl border">Go home</button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }){
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
        <motion.div initial={{ y: 32, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 32, opacity: 0 }} className="relative w-full sm:w-[560px] bg-white dark:bg-neutral-950 rounded-t-2xl sm:rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-4">
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const auth = useAuth();
  const { prefs, setPrefs } = usePrefs();
  const [vehicles, setVehicles] = useState(loadVehicles());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  useEffect(()=> saveVehicles(vehicles), [vehicles]);

  const t = dict[prefs.lang];

  if (!auth.user) {
    return (
      <Routes>
        <Route path="/signup" element={<SignupPage t={t} />} />
        <Route path="/forgot" element={<ForgotPage t={t} />} />
        <Route path="*" element={<LoginPage t={t} onLogin={auth.login} />} />
      </Routes>
    );
  }

  return (
    <>
      <AppShell
        t={t}
        lang={prefs.lang}
        setLang={(v)=> setPrefs(p=> ({...p, lang:v}))}
        theme={prefs.theme}
        toggleTheme={()=> setPrefs(p=> ({...p, theme: p.theme==='dark'?'light':'dark'}))}
        onOpenAdd={()=>{}}
      >
        <Routes>
          <Route path="/dashboard" element={<DashboardPage vehicles={vehicles} />} />
          <Route path="/vehicles" element={<VehiclesPage vehicles={vehicles} setVehicles={setVehicles} onOpen={(v)=>{ setCurrent(v); setDrawerOpen(true); }} t={t} />} />
          <Route path="/reminders" element={<RemindersPage vehicles={vehicles} prefs={prefs} setPrefs={setPrefs} t={t} />} />
          <Route path="/documents" element={<DocumentsPage vehicles={vehicles} />} />
          <Route path="/settings" element={<SettingsPage prefs={prefs} setPrefs={setPrefs} />} />
          <Route path="/account" element={<AccountPage onLogout={auth.logout} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>

      <VehicleDrawer open={drawerOpen} onClose={()=> setDrawerOpen(false)} vehicle={current} t={t} />
    </>
  );
}