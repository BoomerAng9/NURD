import { Link } from "wouter";
import {
  Users,
  GraduationCap,
  Lightbulb,
  Calendar,
  MessageCircle,
  BookOpen,
} from "lucide-react";

/**
 * Tribe — community landing page.
 *
 * Deeper-build theme. Maps to mockup IMG_1839 in docs/design/PAGE_INVENTORY.md.
 *
 * "JOIN THE TRIBE" hero + 6 community feature cards + bottom CTA.
 */
export default function Tribe() {
  return (
    <div data-theme="deep" className="bg-background text-foreground min-h-screen circuit-bg">
      <section className="container py-16 md:py-24 lg:py-28">
        {/* Hero */}
        <div className="text-center mb-14 md:mb-20 max-w-3xl mx-auto">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-4">
            Community
          </p>
          <h1 className="font-sans font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-[hsl(var(--neon-green))] leading-[1.05] mb-6 uppercase">
            Join the Tribe
          </h1>
          <p className="text-xl md:text-2xl text-foreground font-light leading-relaxed mb-3">
            Building the ultimate community of tech enthusiasts, innovators, and creators.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Where collective growth, knowledge sharing, and impactful learning define our shared mission.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          <TribeCard
            Icon={Users}
            title="Collaboration Studio"
            description="Real-time pair programming and group projects to build together."
          />
          <TribeCard
            Icon={GraduationCap}
            title="Mentorship Network"
            description="Learn directly from experienced Nurds and industry leaders."
          />
          <TribeCard
            Icon={Lightbulb}
            title="Project Showcase"
            description="Share your builds, get feedback, and inspire the community."
          />
          <TribeCard
            Icon={Calendar}
            title="Events & Workshops"
            description="Join regular learning events, hackathons, and skill-building sessions."
          />
          <TribeCard
            Icon={MessageCircle}
            title="Discord Community"
            description="Real-time chat, networking, and instant support from the Tribe."
          />
          <TribeCard
            Icon={BookOpen}
            title="Resources Hub"
            description="Access a shared library of knowledge, best practices, and tools."
          />
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <Link
            href="/auth?intent=join-tribe"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[hsl(var(--neon-green))] text-background font-sans text-base font-semibold uppercase tracking-wordmark hover:bg-[hsl(var(--neon-green)/0.9)] transition-colors"
          >
            Become a Nurd — Join Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to NurdsCode
            </Link>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Powered by: A.I.M.S.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface TribeCardProps {
  Icon: typeof Users;
  title: string;
  description: string;
}

function TribeCard({ Icon, title, description }: TribeCardProps) {
  return (
    <div className="neon-card p-7 md:p-8">
      <Icon
        className="h-9 w-9 text-[hsl(var(--neon-green))] mb-5"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="font-sans font-semibold text-xl md:text-2xl tracking-tight text-foreground mb-3">
        {title}
      </h3>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
