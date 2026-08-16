import Link from "next/link";
import { ArrowDown, ArrowRight, ExternalLink, GitFork } from "lucide-react";

import { RepositoryLibrary } from "@/components/repository-library";
import { buttonVariants } from "@/components/ui/button";
import { repositories } from "@/lib/repositories";
import { cn } from "@/lib/utils";

function Brand() {
  return (
    <Link href="/" className="brand focus-ring" aria-label="CodeTerrain home">
      <span className="brand-mark" aria-hidden="true">
        <span />
      </span>
      <span>CodeTerrain</span>
    </Link>
  );
}

function HeroMap() {
  return (
    <div className="hero-map" aria-label="Preview of an isometric code map">
      <div className="hero-map-bar">
        <span className="window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>herdr / runtime-map</span>
        <span className="hero-live"><i /> live</span>
      </div>
      <div className="hero-map-canvas" aria-hidden="true">
        <span className="hero-district district-one">CLIENTS</span>
        <span className="hero-district district-two">RUNTIME</span>
        <span className="hero-district district-three">STORAGE</span>
        <span className="hero-line hero-line-one" />
        <span className="hero-line hero-line-two" />
        <span className="hero-line hero-line-three" />
        <span className="hero-pulse pulse-one" />
        <span className="hero-pulse pulse-two" />
        <span className="hero-building building-one"><i /></span>
        <span className="hero-building building-two"><i /></span>
        <span className="hero-building building-three"><i /></span>
        <span className="hero-building building-four"><i /></span>
        <span className="hero-building building-five"><i /></span>
      </div>
      <div className="hero-map-caption">
        <div>
          <span>Selected path</span>
          <strong>Interactive attach</strong>
        </div>
        <div>
          <span>Payload</span>
          <strong>Request → PTY bytes</strong>
        </div>
        <ArrowRight aria-hidden="true" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#how-it-works" className="nav-link focus-ring">
              How it works
            </a>
            <a href="#library" className="nav-link focus-ring">
              Library
            </a>
            <a
              href="https://github.com/herdrdev/herdr"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "header-github")}
            >
              <GitFork aria-hidden="true" />
              Live repo
            </a>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span /> Open-source architecture, made legible
            </p>
            <h1>
              Don’t just read code.
              <br />
              <em>See how it moves.</em>
            </h1>
            <p className="hero-lede">
              Interactive, source-cited system maps that turn famous
              repositories into explorable worlds—built for curious developers,
              not architecture astronauts.
            </p>
            <div className="hero-actions">
              <Link
                href="/repo/herdr"
                className={cn(buttonVariants({ size: "lg" }), "primary-cta")}
              >
                Explore a live map <ArrowRight aria-hidden="true" />
              </Link>
              <a
                href="#library"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "secondary-cta")}
              >
                Browse the roadmap <ArrowDown aria-hidden="true" />
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>{String(repositories.length).padStart(2, "0")}</dt>
                <dd>codebases tracked</dd>
              </div>
              <div>
                <dt>{String(repositories.filter(({ status }) => status === "live").length).padStart(2, "0")}</dt>
                <dd>interactive maps live</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>live paths cited</dd>
              </div>
            </dl>
          </div>
          <div className="hero-visual">
            <div className="coordinate coordinate-top">37.7749° N</div>
            <HeroMap />
            <div className="coordinate coordinate-bottom">SYSTEM / 001</div>
          </div>
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
        <div className="shell workflow-grid">
          <div className="workflow-intro">
            <p className="eyebrow">Learn by following the flow</p>
            <h2>From “what is this?” to “I know where to look.”</h2>
          </div>
          <ol className="workflow-steps">
            <li>
              <span>01</span>
              <div>
                <h3>Choose a journey</h3>
                <p>Start with a real user action instead of a folder tree.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Trace the payload</h3>
                <p>Watch data cross real boundaries, with jargon explained in context.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Open the evidence</h3>
                <p>Every claim links to the exact file at a pinned commit.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <div className="shell">
        <RepositoryLibrary />
      </div>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <Brand />
          <p>Built to make intimidating codebases feel navigable.</p>
          <a
            href="https://github.com/herdrdev/herdr"
            target="_blank"
            rel="noreferrer"
            className="footer-link focus-ring"
          >
            View the live repo <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
