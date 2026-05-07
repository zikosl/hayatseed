import { Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Bell,
  Boxes,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cpu,
  Globe,
  Home,
  Info,
  LogOut,
  Settings,
  Shield,
  ShoppingBag,
  Sprout,
  Ticket,
  User as UserIcon,
  UserRoundCog,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/hayatseed-logo.png";
import { useAuth } from "@/lib/auth";
import { useAppState } from "@/lib/app-state";
import { useI18n, type Lang } from "@/lib/i18n";
import type { UserRole } from "@/lib/types";

type NavItem = {
  to: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const visitorNav: NavItem[] = [
  { to: "/", labelKey: "nav.home", icon: Home },
  { to: "/services", labelKey: "nav.services", icon: Sprout },
  { to: "/products", labelKey: "nav.products", icon: ShoppingBag },
  { to: "/about", labelKey: "nav.about", icon: Info },
];

const clientNav: NavItem[] = [
  { to: "/client", labelKey: "nav.overview", icon: Home },
  { to: "/client/smart-control", labelKey: "nav.smart", icon: Cpu },
  { to: "/client/orders", labelKey: "nav.orders", icon: ShoppingBag },
  { to: "/client/track", labelKey: "nav.tracking", icon: Ticket },
  { to: "/client/notifications", labelKey: "nav.notifications", icon: Bell },
  { to: "/client/account", labelKey: "nav.account", icon: UserRoundCog },
];

const adminNav: NavItem[] = [
  { to: "/admin", labelKey: "nav.dashboard", icon: Shield },
  { to: "/admin/orders", labelKey: "nav.orders", icon: ShoppingBag },
  { to: "/admin/products", labelKey: "nav.products", icon: Boxes },
  { to: "/admin/services", labelKey: "nav.services", icon: Sprout },
  { to: "/admin/clients", labelKey: "nav.clients", icon: Users },
  { to: "/admin/settings", labelKey: "nav.settings", icon: Settings },
];

function navForRole(role: UserRole) {
  if (role === "client") return clientNav;
  if (role === "admin") return adminNav;
  return visitorNav;
}

function workspacePathForRole(role: UserRole) {
  if (role === "admin") return "/admin";
  if (role === "client") return "/client";
  return "/auth";
}

function isActive(pathname: string, to: string) {
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Layout() {
  const { user, signOut } = useAuth();
  const { lang, setLang, t, dir } = useI18n();
  const { orders, notifications, users } = useAppState();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const role: UserRole = user?.role ?? "visitor";
  const isWorkspacePath =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/") ||
    location.pathname === "/client" ||
    location.pathname.startsWith("/client/");
  const workspaceMode = Boolean(user) && isWorkspacePath;
  const workspaceRole: UserRole =
    location.pathname === "/admin" || location.pathname.startsWith("/admin/")
      ? "admin"
      : location.pathname === "/client" ||
          location.pathname.startsWith("/client/")
        ? "client"
        : role;
  const nav = workspaceMode ? navForRole(workspaceRole) : visitorNav;
  const panelPath = workspacePathForRole(role);
  const langs: { code: Lang; label: string }[] = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "ar", label: "العربية" },
  ];

  const workspaceMeta = useMemo(() => {
    if (role === "client") {
      const unread = notifications.filter(
        (notification) =>
          notification.userId === user?.id && !notification.read,
      ).length;
      const myOrders = orders.filter(
        (order) => order.userId === user?.id,
      ).length;
      return {
        badge: unread
          ? `${unread} ${t("layout.unread")}`
          : t("layout.workspaceActive"),
        summary: `${myOrders} ${t("layout.trackedOrders")}`,
        note: t("layout.clientWorkspace"),
      };
    }

    if (role === "admin") {
      const clientCount = users.filter(
        (entry) => entry.role === "client",
      ).length;
      const newOrders = orders.filter((order) => order.status === "new").length;
      return {
        badge: newOrders
          ? `${newOrders} ${t("layout.newOrders")}`
          : t("layout.queueStable"),
        summary: `${clientCount} ${t("layout.clientsManaged")}`,
        note: t("layout.adminWorkspace"),
      };
    }

    return {
      badge: t("layout.visitorSpace"),
      summary: t("layout.browseOrderTrack"),
      note: t("layout.publicExperience"),
    };
  }, [notifications, orders, role, t, user?.id, users]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSidebarCollapsed(
      localStorage.getItem("hs_sidebar_collapsed") === "true",
    );
  }, []);

  function toggleSidebar() {
    setSidebarCollapsed((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        localStorage.setItem("hs_sidebar_collapsed", String(next));
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-gradient-surface text-foreground">
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
        <div className="shadow-nav mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[1.7rem] border border-border/70 bg-card/86 px-4 py-3 backdrop-blur-xl sm:px-5">
          <Link
            to="/"
            aria-label="Hayatseed"
            className="flex items-center gap-3"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl shadow-soft">
              <img
                src={logo}
                alt="Hayatseed"
                className="h-7 w-auto brightness-[1.07]"
              />
            </span>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-foreground">
                {t("layout.platform")}
              </div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {workspaceMeta.note}
              </div>
            </div>
          </Link>

          {!workspaceMode && (
            <nav className="hidden items-center gap-1 xl:flex">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(location.pathname, item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground/80 hover:bg-secondary/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="flex items-center gap-2">
            {user && !workspaceMode && (
              <Link
                to={panelPath}
                className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground md:inline-flex"
              >
                {t("nav.goPanel")} <ChevronRight className="h-4 w-4" />
              </Link>
            )}
            <div className="hidden items-center rounded-full border border-border/70 bg-secondary/45 px-3 py-2 text-xs font-medium text-muted-foreground lg:flex">
              {workspaceMode
                ? workspaceMeta.badge
                : user
                  ? t("layout.signedIn")
                  : workspaceMeta.badge}
            </div>
            <div className="relative">
              <button
                onClick={() => setLangOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/55 px-3 py-2 text-xs font-semibold"
              >
                <Globe className="h-3.5 w-3.5" />
                {lang.toUpperCase()}
              </button>
              {langOpen && (
                <div className="surface-card absolute right-0 mt-2 w-40 rounded-2xl p-1.5">
                  {langs.map((entry) => (
                    <button
                      key={entry.code}
                      onClick={() => {
                        setLang(entry.code);
                        setLangOpen(false);
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left text-sm ${
                        entry.code === lang
                          ? "bg-secondary font-semibold text-primary"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      {entry.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/55 px-2 py-1.5"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-hero text-sm font-semibold text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span
                    className={`hidden sm:block ${dir === "rtl" ? "text-right" : "text-left"}`}
                  >
                    <span className="block text-xs font-semibold">
                      {user.name}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {workspaceMeta.summary}
                    </span>
                  </span>
                </button>
                {menuOpen && (
                  <div className="surface-card absolute right-0 mt-2 w-64 rounded-2xl p-2">
                    <div className="border-b border-border px-3 py-2">
                      <div className="truncate text-sm font-semibold">
                        {user.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                    <Link
                      to={panelPath}
                      className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-secondary"
                    >
                      <UserIcon className="h-4 w-4" />
                      {t("nav.openWorkspace")}
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        setMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("nav.signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/order"
                  className="hidden rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary md:inline-flex"
                >
                  {t("nav.bookDemo")}
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  {t("auth.signin")} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {workspaceMode ? (
        <div className="mx-auto flex max-w-7xl gap-5 px-4 py-5 pb-28 lg:pb-10">
          <aside
            className={`surface-card sticky top-[6.25rem] hidden h-[calc(100vh-7.5rem)] shrink-0 rounded-[1.25rem] p-3 transition-[width] duration-300 lg:flex lg:flex-col ${
              sidebarCollapsed ? "w-20" : "w-72"
            }`}
          >
            <div
              className={`rounded-lg border border-white/60 bg-white/75 p-3 ${
                sidebarCollapsed ? "text-center" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                {!sidebarCollapsed && (
                  <div className="text-xs font-bold tracking-[0.18em] text-primary">
                    {workspaceRole === "admin"
                      ? t("layout.controlPanel")
                      : t("layout.clientPanel")}
                  </div>
                )}
                <button
                  onClick={toggleSidebar}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-foreground hover:bg-secondary"
                  aria-label={
                    sidebarCollapsed
                      ? t("layout.expandSidebar")
                      : t("layout.collapseSidebar")
                  }
                  title={
                    sidebarCollapsed
                      ? t("layout.expandSidebar")
                      : t("layout.collapseSidebar")
                  }
                >
                  {sidebarCollapsed ? (
                    <ChevronsRight className="h-4 w-4" />
                  ) : (
                    <ChevronsLeft className="h-4 w-4" />
                  )}
                </button>
              </div>
              {!sidebarCollapsed && (
                <>
                  <h2 className="mt-3 text-lg font-semibold leading-snug text-foreground">
                    {workspaceRole === "admin"
                      ? t("layout.adminLead")
                      : t("layout.clientLead")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {workspaceMeta.badge}
                  </p>
                </>
              )}
            </div>

            <nav className="mt-4 space-y-1.5">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = isActive(location.pathname, item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={sidebarCollapsed ? t(item.labelKey) : undefined}
                    className={`flex items-center rounded-lg text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-soft"
                        : "text-foreground/80 hover:bg-white/70 hover:text-foreground"
                    } ${
                      sidebarCollapsed
                        ? "h-11 justify-center px-0"
                        : "gap-3 px-4 py-3"
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {!sidebarCollapsed && t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>

            {!sidebarCollapsed && (
              <div className="mt-auto rounded-lg border border-white/60 bg-white/75 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("layout.workspaceNote")}
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {workspaceMeta.summary}
                </div>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {workspaceRole === "admin"
                    ? t("layout.adminNote")
                    : t("layout.clientNote")}
                </p>
              </div>
            )}
          </aside>

          <main className="min-h-[calc(100vh-9rem)] min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      ) : (
        <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-7xl px-4 py-5 pb-28 lg:pb-10">
          <Outlet />
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur lg:hidden">
        <div
          className={`mx-auto grid max-w-6xl gap-1 px-2 py-2 ${
            nav.length > 5 ? "grid-cols-6" : "grid-cols-5"
          }`}
        >
          {nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(location.pathname, item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
