import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  Workflow,
  Menu,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompliance } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/new", label: "New analysis", icon: FilePlus2 },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/how-it-works", label: "How it works", icon: Workflow },
  { to: "/judge-demo", label: "Judge demo", icon: PlayCircle },
] as const;

export function Logo({ inverted }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-md",
          inverted ? "bg-brand text-ink" : "bg-ink text-ink-foreground",
        )}
      >
        <ShieldCheck className="size-4.5" aria-hidden />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          ComplyFlow <span className="text-brand">AI</span>
        </span>
        <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Compliance operations copilot
        </span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { resetDemo } = useCompliance();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground sm:inline-flex"
              onClick={() => {
                resetDemo();
                toast.success("Demo workspace reset", {
                  description: "Seeded analyses and task states restored.",
                });
              }}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Reset demo
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/new">Analyse a document</Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border bg-background md:hidden">
            <nav className="mx-auto flex w-full max-w-7xl flex-col p-2">
              {NAV.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "bg-secondary text-foreground" }}
                >
                  <Icon className="size-4" aria-hidden />
                  {label}
                </Link>
              ))}
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 justify-start text-muted-foreground"
                onClick={() => {
                  resetDemo();
                  setOpen(false);
                  toast.success("Demo workspace reset");
                }}
              >
                <RotateCcw className="size-3.5" aria-hidden />
                Reset demo
              </Button>
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>ComplyFlow AI — compliance operations copilot. Not legal advice.</p>
          <p className="font-mono">Demo workspace · no sign-in required</p>
        </div>
      </footer>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="label-mono mb-1">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
