/**
 * /projects — Featured Projects gallery, deeper-build dark canon per
 * IMG_1864 mockup.
 *
 * Phase 1 scope: static gallery with placeholder imagery + tech-stack
 * pills. Project entries are owner-curated examples of what builders
 * have shipped on the NurdsCode platform. Content here is illustrative
 * — Phase 2 wires this to a real `/api/projects` feed.
 *
 * Pill categorization (preserved from source mockup):
 *   • neon-orange  → languages / platforms (Python, IoT, C++, Mobile, C#)
 *   • neon-cyan    → frameworks / services (React, AI/ML, Cloud, Flutter,
 *                    Firebase, SQL, WebRTC, Node.js, AWS, Game Dev)
 *   • accent-gold  → specialty / niche (Analytics, Unity)
 *
 * Per `feedback_never_publish_internal_tool_names.md`: every tag here
 * is a public-knowledge framework/language/cloud name. Nothing internal
 * (Modal/Cloudflare/OpenAI/Groq/Anthropic/Drizzle/Wouter) is surfaced.
 */

type PillTone = "lang" | "framework" | "specialty";

interface Pill {
  label: string;
  tone: PillTone;
}

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  imageDataAlt: string;
  pills: Pill[];
}

const PROJECTS: Project[] = [
  {
    title: "AI Marketing Suite",
    description: "Automated content creation and social media management.",
    imageUrl: "https://placehold.co/400x250/1d2026/e1e2eb?text=AI+Dashboard",
    imageDataAlt:
      "Screenshot of an AI marketing dashboard with charts and graphs.",
    pills: [
      { label: "Python", tone: "lang" },
      { label: "React", tone: "framework" },
      { label: "AI/ML", tone: "framework" },
    ],
  },
  {
    title: "Smart Automation Platform",
    description: "Optimizing industrial workflows with IoT and robotics.",
    imageUrl: "https://placehold.co/400x250/1d2026/e1e2eb?text=Robotics",
    imageDataAlt:
      "Illustration of robotic arms working on an assembly line in a factory.",
    pills: [
      { label: "IoT", tone: "lang" },
      { label: "C++", tone: "lang" },
      { label: "Cloud", tone: "framework" },
    ],
  },
  {
    title: "S.T.E.A.M. Learning App",
    description: "Interactive learning for future innovators.",
    imageUrl: "https://placehold.co/400x250/1d2026/e1e2eb?text=S.T.E.A.M.+App",
    imageDataAlt:
      "UI mockup of a mobile learning application for S.T.E.A.M. education.",
    pills: [
      { label: "Flutter", tone: "framework" },
      { label: "Firebase", tone: "framework" },
      { label: "Mobile", tone: "lang" },
    ],
  },
  {
    title: "Financial Forecasting Tool",
    description: "Predictive analytics for better decision making.",
    imageUrl:
      "https://placehold.co/400x250/1d2026/e1e2eb?text=Financial+Dashboard",
    imageDataAlt:
      "Screenshot of a financial forecasting dashboard with dark theme and colorful charts.",
    pills: [
      { label: "Python", tone: "lang" },
      { label: "SQL", tone: "framework" },
      { label: "Analytics", tone: "specialty" },
    ],
  },
  {
    title: "Cloud Video Editor",
    description: "Collaborative video production in the cloud.",
    imageUrl: "https://placehold.co/400x250/1d2026/e1e2eb?text=Video+Editor",
    imageDataAlt:
      "Screenshot of a cloud-based video editor interface with a timeline and preview window.",
    pills: [
      { label: "WebRTC", tone: "framework" },
      { label: "Node.js", tone: "framework" },
      { label: "AWS", tone: "framework" },
    ],
  },
  {
    title: "Nurd's Adventure Game",
    description: "Action-packed game with advanced physics.",
    imageUrl: "https://placehold.co/400x250/1d2026/e1e2eb?text=Adventure+Game",
    imageDataAlt:
      "Screenshot of a 2D adventure game featuring a character on a hoverboard in a suburban setting.",
    pills: [
      { label: "Unity", tone: "specialty" },
      { label: "C#", tone: "lang" },
      { label: "Game Dev", tone: "framework" },
    ],
  },
];

export default function Projects() {
  return (
    <div
      data-theme="deep"
      className="bg-background text-foreground min-h-screen circuit-bg"
    >
      <main>
        <section className="py-16 sm:py-24">
          <div className="container mx-auto max-w-[1280px] px-6">
            {/* ============== HEADLINE ============== */}
            <div className="flex flex-col items-center mb-12">
              <h1 className="font-sans font-bold text-4xl sm:text-5xl text-foreground uppercase tracking-wider text-center">
                Featured Projects
              </h1>
              <div
                className="h-1 w-48 mt-2 rounded-full"
                style={{ background: "hsl(var(--neon-orange))" }}
              />
            </div>

            {/* ============== PROJECT GRID ============== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {PROJECTS.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="bg-card rounded-xl border border-border p-6 flex flex-col"
      style={{
        boxShadow: "0 0 24px hsl(var(--neon-cyan) / 0.08)",
      }}
    >
      {/* TODO: replace with extracted asset from IMG_1864 */}
      <img
        src={project.imageUrl}
        alt={project.title}
        data-alt={project.imageDataAlt}
        className="rounded-lg w-full aspect-[16/10] object-cover"
      />
      <h2 className="font-sans font-semibold text-2xl text-foreground mt-6 leading-snug">
        {project.title}
      </h2>
      <p className="text-base text-muted-foreground mt-2 flex-grow leading-relaxed">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-2 mt-6">
        {project.pills.map((pill) => (
          <TechPill key={pill.label} pill={pill} />
        ))}
      </div>
    </article>
  );
}

function TechPill({ pill }: { pill: Pill }) {
  const palette = pillPalette(pill.tone);
  return (
    <span
      className="text-sm px-3 py-1 rounded-full font-medium"
      style={{
        background: palette.bg,
        color: palette.fg,
      }}
    >
      [{pill.label}]
    </span>
  );
}

function pillPalette(tone: PillTone): { bg: string; fg: string } {
  switch (tone) {
    case "lang":
      // Languages / platforms — neon-orange (mapped from source #ffb77f)
      return {
        bg: "hsl(var(--neon-orange) / 0.85)",
        fg: "hsl(var(--background))",
      };
    case "specialty":
      // Specialty / niche — accent-gold (mapped from source #e5c07b)
      return {
        bg: "hsl(var(--accent-gold) / 0.85)",
        fg: "hsl(var(--background))",
      };
    case "framework":
    default:
      // Frameworks / services — neon-cyan (mapped from source #569cd6)
      return {
        bg: "hsl(var(--neon-cyan) / 0.85)",
        fg: "hsl(var(--background))",
      };
  }
}
