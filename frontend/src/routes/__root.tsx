import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AppStateProvider } from "@/lib/app-state";
import { AuthProvider } from "@/lib/auth";
import { IrrigationProvider } from "@/lib/irrigation";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("root.notFound")}
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          {t("nav.home")}
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Hayatseed — Bringing Life to Dry Lands" },
      {
        name: "description",
        content: "Smart irrigation, hydroseeding and landscaping in Algeria.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'globalThis.process = globalThis.process || { env: {} }; globalThis.process.env.TSS_PRERENDERING = globalThis.process.env.TSS_PRERENDERING || "false"; globalThis.process.env.TSS_SHELL = globalThis.process.env.TSS_SHELL || "false";',
          }}
        />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <AppStateProvider>
        <AuthProvider>
          <IrrigationProvider>
            <Layout />
            <Toaster position="top-right" richColors closeButton />
          </IrrigationProvider>
        </AuthProvider>
      </AppStateProvider>
    </I18nProvider>
  );
}
