import { useState } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

/**
 * /account — Profile Settings dashboard, deeper-build dark canon.
 * Derived from owner mockup IMG_1867.
 *
 * Phase 1 scope: visual + controlled local state for the Edit Profile + Security
 * panes. Submit handlers stub a console.log (Phase 2 wires to /api/users/[id]).
 *
 * NOTE: replaces the prior Replit-auth Account stub which was imported in App.tsx
 * but never routed. The /settings route (ProfileSettings.tsx) remains untouched.
 *
 * Phase 1 limitation: this is a flat single page. Per docs/design/PAGE_INVENTORY.md
 * the Profile pane is the canonical Phase 1 surface; sub-routes (Security, Preferences,
 * Workspace, Billing, Privacy) are visual-only nav for now and can land as
 * dedicated pages in a later wave.
 */

type SidebarSection = {
  key: string;
  label: string;
  icon: string;
  active?: boolean;
  items: { label: string; icon: string; active?: boolean }[];
};

const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    key: "profile",
    label: "Profile",
    icon: "account_circle",
    active: true,
    items: [
      { label: "Edit Profile", icon: "edit", active: true },
      { label: "Avatar & Bio", icon: "badge" },
      { label: "Account Info", icon: "info" },
    ],
  },
  {
    key: "security",
    label: "Security & Access",
    icon: "security",
    items: [
      { label: "Password & Authentication", icon: "lock" },
      { label: "Connected Accounts", icon: "link" },
      { label: "Active Sessions", icon: "devices" },
      { label: "Two-Factor Authentication", icon: "enhanced_encryption" },
    ],
  },
  {
    key: "preferences",
    label: "Preferences",
    icon: "tune",
    items: [
      { label: "Editor Settings", icon: "code" },
      { label: "Voice & Audio", icon: "mic" },
      { label: "Notifications", icon: "notifications" },
      { label: "Theme & Display", icon: "palette" },
    ],
  },
  {
    key: "workspace",
    label: "Workspace",
    icon: "workspaces",
    items: [
      { label: "Team Management", icon: "group" },
      { label: "Project Settings", icon: "settings" },
      { label: "Integrations", icon: "integration_instructions" },
      { label: "API Keys", icon: "key" },
    ],
  },
  {
    key: "billing",
    label: "Billing & Usage",
    icon: "receipt_long",
    items: [
      { label: "Plan & Subscription", icon: "credit_card" },
      { label: "Payment Methods", icon: "payment" },
      { label: "Invoices & Billing History", icon: "history" },
      { label: "Usage Analytics", icon: "analytics" },
    ],
  },
  {
    key: "privacy",
    label: "Privacy & Data",
    icon: "privacy_tip",
    items: [
      { label: "Data & Privacy", icon: "verified_user" },
      { label: "Download Data", icon: "download" },
      { label: "Delete Account", icon: "delete" },
    ],
  },
];

export default function Account() {
  const { toast } = useToast();

  // Edit Profile pane controlled state
  const [fullName, setFullName] = useState("");
  const [email] = useState(""); // read-only per mockup; populated from auth in Phase 2
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Security pane controlled state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Visual sidebar state — local only in Phase 1
  const [activeSection, setActiveSection] = useState("profile");
  const [activeItem, setActiveItem] = useState("Edit Profile");

  // Naive password strength heuristic for the visual meter only.
  const passwordStrength = ((): { label: string; pct: number } => {
    const len = newPassword.length;
    if (len === 0) return { label: "—", pct: 0 };
    if (len < 8) return { label: "Weak", pct: 25 };
    if (len < 12) return { label: "Fair", pct: 55 };
    if (len < 16) return { label: "Strong", pct: 85 };
    return { label: "Excellent", pct: 100 };
  })();

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    // Phase 2 wires to /api/users/[id]
    console.log("Phase 2 wires to /api/users/[id]", {
      fullName,
      username,
      bio,
      location,
      github,
      portfolio,
    });
    setTimeout(() => {
      setSavingProfile(false);
      toast({ title: "Profile saved (locally).", description: "Phase 2 will persist to your account." });
    }, 400);
  }

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match.", variant: "destructive" });
      return;
    }
    setUpdatingPassword(true);
    // Phase 2 wires to /api/users/[id]
    console.log("Phase 2 wires to /api/users/[id]", { passwordChange: true });
    setTimeout(() => {
      setUpdatingPassword(false);
      toast({ title: "Password updated (locally).", description: "Phase 2 will persist to your account." });
    }, 400);
  }

  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <div className="flex min-h-screen relative z-10">
        {/* ============== LEFT SIDEBAR ============== */}
        <aside className="hidden lg:flex w-72 bg-card/40 backdrop-blur-sm p-6 flex-shrink-0 border-r border-border/50 flex-col gap-6 text-sm">
          <h2 className="font-sans font-bold text-2xl text-foreground px-3 tracking-tight">SETTINGS</h2>
          <nav className="flex flex-col gap-6">
            {SIDEBAR_SECTIONS.map((section) => {
              const isSectionActive = activeSection === section.key;
              return (
                <div key={section.key}>
                  <button
                    type="button"
                    onClick={() => setActiveSection(section.key)}
                    className="w-full flex justify-between items-center text-muted-foreground hover:text-foreground px-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="material-symbols-outlined"
                        style={
                          isSectionActive
                            ? { color: "hsl(var(--neon-green))" }
                            : undefined
                        }
                      >
                        {section.icon}
                      </span>
                      <span className="font-bold">{section.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-[18px]">
                      {isSectionActive ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                  {isSectionActive && (
                    <ul className="mt-2 space-y-1">
                      {section.items.map((item) => {
                        const isItemActive = activeItem === item.label;
                        return (
                          <li key={item.label}>
                            <button
                              type="button"
                              onClick={() => setActiveItem(item.label)}
                              className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors"
                              style={
                                isItemActive
                                  ? {
                                      background: "hsl(var(--neon-green) / 0.1)",
                                      color: "hsl(var(--neon-green))",
                                    }
                                  : undefined
                              }
                            >
                              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                              <span>{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ============== MAIN CONTENT ============== */}
        <main className="flex-grow p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="font-sans font-bold text-3xl md:text-4xl tracking-tight text-foreground">
                Profile Settings
              </h1>
              <p
                className="inline-block pb-1 mt-1 font-mono uppercase tracking-wordmark text-[11px] border-b-2"
                style={{
                  color: "hsl(var(--neon-green))",
                  borderColor: "hsl(var(--neon-green))",
                }}
              >
                Edit Profile
              </p>
            </div>

            {/* ───── Edit Profile card ───── */}
            <form
              onSubmit={handleSaveProfile}
              className="bg-card p-6 sm:p-8 rounded-2xl border border-border"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0 flex flex-col items-center gap-4">
                  <div className="relative w-36 h-36 group">
                    {/* TODO: replace with extracted asset from IMG_1867 */}
                    <div
                      data-alt="User avatar placeholder"
                      className="rounded-full w-full h-full border-2 border-border bg-secondary grid place-items-center"
                    >
                      <span
                        className="material-symbols-outlined text-[64px]"
                        style={{ color: "hsl(var(--muted-foreground))" }}
                      >
                        person
                      </span>
                    </div>
                    <button
                      type="button"
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Upload photo"
                    >
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-background border border-border"
                        style={{ color: "hsl(var(--foreground))" }}
                      >
                        <span className="material-symbols-outlined text-[18px]">upload</span>
                        Upload Photo
                      </div>
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="full-name"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Full Name <span style={{ color: "hsl(var(--destructive))" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      autoComplete="name"
                      required
                      className="w-full bg-background border-2 rounded-lg px-3 py-2 focus:outline-none placeholder:text-muted-foreground/50"
                      style={{ borderColor: "hsl(var(--neon-green))" }}
                    />
                  </div>

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      readOnly
                      disabled
                      placeholder="—"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-10 text-muted-foreground"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-9 text-muted-foreground text-[20px]">
                      lock
                    </span>
                  </div>

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="your-handle"
                      autoComplete="username"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-[hsl(var(--neon-green))] placeholder:text-muted-foreground/50"
                    />
                    {username.length >= 3 && (
                      <span
                        className="material-symbols-outlined absolute right-3 top-9 text-[20px]"
                        style={{ color: "hsl(var(--neon-green))" }}
                      >
                        check_circle
                      </span>
                    )}
                  </div>

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Bio/About
                    </label>
                    <textarea
                      id="bio"
                      rows={3}
                      maxLength={120}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell us a little about yourself..."
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-[hsl(var(--neon-green))] placeholder:text-muted-foreground/50"
                    />
                    <span className="absolute bottom-2 right-3 text-xs text-muted-foreground pointer-events-none">
                      {120 - bio.length}
                    </span>
                  </div>

                  <div className="md:col-span-2 border-t border-border my-2" />

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-muted-foreground mb-1 pl-8"
                    >
                      Location
                    </label>
                    <span className="material-symbols-outlined absolute left-0 top-8 text-muted-foreground text-[20px]">
                      person_pin_circle
                    </span>
                    <input
                      type="text"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, Region"
                      autoComplete="address-level2"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--neon-green))] placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium text-muted-foreground mb-1 pl-8"
                    >
                      GitHub URL
                    </label>
                    <span className="material-symbols-outlined absolute left-0 top-8 text-muted-foreground text-[20px]">
                      code
                    </span>
                    <input
                      type="url"
                      id="github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/your-handle"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--neon-green))] placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <div className="md:col-span-2 relative">
                    <label
                      htmlFor="portfolio"
                      className="block text-sm font-medium text-muted-foreground mb-1 pl-8"
                    >
                      Portfolio/Website URL
                    </label>
                    <span className="material-symbols-outlined absolute left-0 top-8 text-muted-foreground text-[20px]">
                      language
                    </span>
                    <input
                      type="url"
                      id="portfolio"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://your-site.dev"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--neon-green))] placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="font-mono uppercase tracking-wordmark text-[12px] rounded-lg px-6 py-2.5 transition-transform active:scale-95 disabled:opacity-60"
                  style={{
                    background: "hsl(var(--neon-green))",
                    color: "hsl(var(--background))",
                    boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                  }}
                >
                  {savingProfile ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>

            {/* ───── Security & Access card ───── */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-border">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                {/* Password column */}
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <h3 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground">
                    Security &amp; Access
                  </h3>

                  <div>
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrent ? "text" : "password"}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-16 focus:outline-none focus:border-[hsl(var(--accent-gold))] placeholder:text-muted-foreground/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrent((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
                        aria-label={showCurrent ? "Hide password" : "Show password"}
                      >
                        {showCurrent ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••••••"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--accent-gold))] placeholder:text-muted-foreground/50"
                    />
                    <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${passwordStrength.pct}%`,
                          background: "hsl(var(--accent-gold))",
                        }}
                      />
                    </div>
                    <span
                      className="text-xs float-right mt-1"
                      style={{ color: "hsl(var(--accent-gold))" }}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-muted-foreground mb-1"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="••••••••••••"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-[hsl(var(--accent-gold))] placeholder:text-muted-foreground/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="w-full font-mono uppercase tracking-wordmark text-[12px] rounded-lg py-2.5 transition-transform active:scale-95 disabled:opacity-60"
                    style={{
                      background: "hsl(var(--neon-green))",
                      color: "hsl(var(--background))",
                      boxShadow: "0 0 20px hsl(var(--neon-green) / 0.3)",
                    }}
                  >
                    {updatingPassword ? "Updating…" : "Update Password"}
                  </button>
                </form>

                {/* Connected / Sessions / 2FA column */}
                <div className="space-y-8 pt-0 lg:pt-10">
                  {/* Connected accounts */}
                  <div>
                    <h4 className="font-bold text-foreground mb-4">Connected Accounts</h4>
                    <ul className="space-y-3">
                      <ConnectedAccountRow
                        provider="GitHub"
                        icon="code"
                        connected
                        meta="Connected | Last synced 18m"
                      />
                      <ConnectedAccountRow
                        provider="Google"
                        icon="g_translate"
                        connected={false}
                        meta="Not connected"
                      />
                      <ConnectedAccountRow
                        provider="Discord"
                        icon="forum"
                        connected
                        meta="Connected"
                      />
                    </ul>
                  </div>

                  {/* Active sessions */}
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Active Sessions</h4>
                    <div className="text-sm text-muted-foreground grid grid-cols-3 gap-2">
                      <span>Device</span>
                      <span>IP</span>
                      <span className="text-right">Last Active</span>
                    </div>
                    <div className="text-sm grid grid-cols-3 gap-2 mt-1 text-foreground">
                      <span>This browser</span>
                      <span className="text-muted-foreground">—</span>
                      <span className="text-right">Just now</span>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div>
                    <h4 className="font-bold text-foreground mb-2">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-bold" style={{ color: "hsl(var(--accent-gold))" }}>
                          Not configured
                        </p>
                      </div>
                      <button
                        type="button"
                        className="text-sm bg-secondary border border-border px-4 py-1.5 rounded-md hover:border-foreground/50 transition-colors"
                      >
                        Manage 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── Preferences toggles card ───── */}
            <PreferencesCard />

            {/* ───── Phase 1 footer note ───── */}
            <p className="text-xs text-muted-foreground text-center">
              Sub-routes for Security, Preferences, Workspace, Billing, and Privacy land in a later wave.
              For now everything lives on this single{" "}
              <Link href="/account" className="underline hover:text-foreground">
                /account
              </Link>{" "}
              page.
            </p>
          </div>
        </main>

        {/* ============== RIGHT SIDEBAR ============== */}
        <aside className="hidden xl:block w-72 bg-card/40 backdrop-blur-sm p-6 flex-shrink-0 border-l border-border/50">
          <div className="bg-card p-6 rounded-2xl border border-border sticky top-8">
            <h3 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-6">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <Stat label="Account Age" value="—" />
              <Stat label="Total Projects" value="—" />
              <Stat label="Total Deployments" value="—" />
              <Stat label="Team Size" value="—" />
            </div>
            <div className="border-t border-border my-6" />
            <Link
              href="/support"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">mail</span>
              Support Contact
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───── Helper components ───── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function ConnectedAccountRow({
  provider,
  icon,
  connected,
  meta,
}: {
  provider: string;
  icon: string;
  connected: boolean;
  meta: string;
}) {
  const [linked, setLinked] = useState(connected);
  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-secondary border border-border grid place-items-center">
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-foreground">
            {provider}
            {linked && (
              <span
                className="font-normal ml-1"
                style={{ color: "hsl(var(--neon-green))" }}
              >
                (Connected)
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{meta}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setLinked((v) => !v)}
        className="text-sm bg-secondary border border-border px-4 py-1 rounded-md hover:border-foreground/50 transition-colors"
      >
        {linked ? "Unlink" : "Connect"}
      </button>
    </li>
  );
}

function PreferencesCard() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [productUpdates, setProductUpdates] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <section className="bg-card p-6 sm:p-8 rounded-2xl border border-border">
      <h3 className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mb-6">
        Preferences
      </h3>
      <div className="space-y-4">
        <ToggleRow
          label="Email notifications"
          description="Account, security, and team activity."
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />
        <ToggleRow
          label="Product updates"
          description="New features, releases, and tips."
          checked={productUpdates}
          onChange={setProductUpdates}
        />
        <ToggleRow
          label="Anonymous usage analytics"
          description="Helps us improve the platform."
          checked={analyticsOptIn}
          onChange={setAnalyticsOptIn}
        />
        <ToggleRow
          label="Reduced motion"
          description="Minimize transitions and animated backgrounds."
          checked={reducedMotion}
          onChange={setReducedMotion}
        />
      </div>
    </section>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <div>
        <p className="font-bold text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
        style={{
          background: checked ? "hsl(var(--neon-green))" : "hsl(var(--secondary))",
          boxShadow: checked ? "0 0 12px hsl(var(--neon-green) / 0.4)" : undefined,
        }}
      >
        <span
          className="inline-block h-5 w-5 transform rounded-full bg-background transition-transform"
          style={{ transform: checked ? "translateX(22px)" : "translateX(2px)" }}
        />
        {/* Hidden checkbox so screen readers see canonical control */}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          aria-label={label}
        />
      </span>
    </label>
  );
}
