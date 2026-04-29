import { Link } from "wouter";
import { motion } from "framer-motion";
import madeInPlrImg from "@/assets/made-in-pooler-green.png";

/**
 * Dreamers — innovative explainer for "An FOAI Space for Modern Dreamers."
 *
 * Manifesto-format. Hero: full phrase as oversized italic serif.
 * Body: word-by-word definition strip with stagger reveal. Closing: brand
 * promise + CTA strip. Editorial Claude-warm-paper feel.
 */
export default function Dreamers() {
  return (
    <div className="bg-background text-foreground">
      {/* ============== HERO — the phrase ============== */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-32 max-w-5xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6">
            The manifesto
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-serif italic font-medium text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-foreground"
          >
            An FOAI Space<br />
            for Modern<br />
            Dreamers.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="font-mono uppercase tracking-wordmark text-[11px] text-muted-foreground mt-10"
          >
            Six words. One philosophy. ↓
          </motion.p>
        </div>
      </section>

      {/* ============== UNPACKED — six words ============== */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-24 max-w-5xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-10">
            01 The phrase, unpacked
          </p>
          <div className="space-y-12 md:space-y-16">
            <WordRow
              num="01"
              word="An"
              gloss="open"
              body={
                <>
                  Not <em>the</em>. Not <em>your</em>. <strong>An.</strong> One of many.
                  This is one of the rooms; you&apos;re welcome to walk in. Anyone is.
                </>
              }
            />
            <WordRow
              num="02"
              word="FOAI"
              gloss="the future of AI, plural"
              body={
                <>
                  Not <em>an AI tool</em>. Not <em>an AI company</em>.
                  The Future Of AI as a household — coffee, sports data, code, services
                  — verticals run by software, attended by humans. The whole household,
                  not a single product.
                </>
              }
            />
            <WordRow
              num="03"
              word="Space"
              gloss="room to think"
              body={
                <>
                  A place. Not a feature list. Not a workflow. A <strong>space</strong>{" "}
                  with edges, with a door, with somewhere to sit. Where the act of
                  building has a context — Pooler, lowcountry, palms, drip-NURD, paper-warm light.
                </>
              }
            />
            <WordRow
              num="04"
              word="for"
              gloss="purpose-built"
              body={
                <>
                  Built <em>for</em> someone, not built and then aimed. The work
                  starts from a person — what they&apos;re trying to make — and we
                  hand them tools that fit the shape of their hand.
                </>
              }
            />
            <WordRow
              num="05"
              word="Modern"
              gloss="now, today, this minute"
              body={
                <>
                  Modern means tools that exist <em>this week</em>. AI-paired
                  coding, voice-first interfaces, agent runtimes you can talk to.
                  Not the AI promised in five years — the AI shipping today.
                </>
              }
            />
            <WordRow
              num="06"
              word="Dreamers"
              gloss="you"
              body={
                <>
                  Naturally Unstoppable Resourceful Dreamers. The 8-year-old building
                  her first Scratch game. The 30-year-old building his first SaaS.
                  The 60-year-old building her first anything. If you&apos;re
                  dreaming about something you haven&apos;t built yet, this room
                  is for you.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* ============== THE PROMISE ============== */}
      <section className="border-b border-border">
        <div className="container py-20 md:py-28 max-w-3xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-6">
            02 What this means
          </p>
          <div className="space-y-6 text-xl md:text-2xl text-foreground leading-relaxed font-light">
            <p>
              We don&apos;t sell answers.
            </p>
            <p>
              We make room for your questions.
            </p>
            <p>
              We pair you with AI that doesn&apos;t pretend to know what you want
              — it asks. Then it helps you build it.
            </p>
            <p className="font-serif italic text-foreground/95 pt-4 border-t border-border/60 mt-10">
              Because the world you want to live in starts with someone willing to
              imagine it. And then, willing to build it.
            </p>
          </div>
        </div>
      </section>

      {/* ============== CTA STRIP ============== */}
      <section className="border-b border-border">
        <div className="container py-16 md:py-20 max-w-4xl">
          <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-8">
            03 Where to start
          </p>
          <div className="grid sm:grid-cols-3 gap-px bg-border">
            <Link
              href="/access-ai"
              className="group bg-background p-6 md:p-8 hover:bg-secondary transition-colors block"
            >
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                Build
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-foreground">
                Open V.I.B.E.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-paired coding workbench. Operator-grade, not a wizard.
              </p>
              <p className="mt-6 font-mono uppercase tracking-wordmark text-[10px] text-foreground group-hover:underline underline-offset-4">
                Open →
              </p>
            </Link>
            <Link
              href="/tribe"
              className="group bg-background p-6 md:p-8 hover:bg-secondary transition-colors block"
            >
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                Connect
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-foreground">
                Join the Tribe
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Builders, mentors, weekly events. Find your people.
              </p>
              <p className="mt-6 font-mono uppercase tracking-wordmark text-[10px] text-foreground group-hover:underline underline-offset-4">
                Join →
              </p>
            </Link>
            <Link
              href="/about"
              className="group bg-background p-6 md:p-8 hover:bg-secondary transition-colors block"
            >
              <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground mb-3">
                Explore
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-foreground">
                Tour FOAI
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Visit the verticals. Coffee, sports data, software services.
              </p>
              <p className="mt-6 font-mono uppercase tracking-wordmark text-[10px] text-foreground group-hover:underline underline-offset-4">
                Tour →
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer>
        <div className="container py-10 md:py-14">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 text-center">
            <Link
              href="/"
              className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to NurdsCode
            </Link>
            <span aria-hidden="true" className="hidden md:inline text-muted-foreground/50 select-none">
              |
            </span>
            <img src={madeInPlrImg} alt="Made in PLR" className="h-10 md:h-12 object-contain" />
            <span aria-hidden="true" className="hidden md:inline text-muted-foreground/50 select-none">
              |
            </span>
            <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
              Powered by: A.I.M.S.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface WordRowProps {
  num: string;
  word: string;
  gloss: string;
  body: React.ReactNode;
}

function WordRow({ num, word, gloss, body }: WordRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-baseline"
    >
      <div className="flex items-baseline gap-3 md:flex-col md:items-start md:gap-1 md:min-w-[12rem]">
        <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground">
          {num}
        </p>
        <h3 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight text-foreground">
          {word}
        </h3>
        <p className="font-mono uppercase tracking-wordmark text-[10px] text-muted-foreground/70 italic">
          / {gloss} /
        </p>
      </div>
      <p className="text-lg md:text-xl text-foreground/85 leading-relaxed font-light max-w-2xl">
        {body}
      </p>
    </motion.div>
  );
}
