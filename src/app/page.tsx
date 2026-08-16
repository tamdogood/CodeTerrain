import Link from "next/link";
import { ArrowDown, ArrowRight, ExternalLink, GitFork } from "lucide-react";

import { RepositoryLibrary } from "@/components/repository-library";
import { buttonVariants } from "@/components/ui/button";
import { repositories } from "@/lib/repositories";
import { siteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CodeTerrain",
  url: siteUrl,
  description:
    "Interactive maps show how open-source codebases work, with links to the exact source files.",
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <header className="site-header">
        <div className="shell header-inner">
          <Brand />
          <nav aria-label="Main navigation">
            <a href="#library" className="nav-link focus-ring">
              Library
            </a>
            <a
              href="https://github.com/tamdogood/CodeTerrain"
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "header-github")}
            >
              <GitFork aria-hidden="true" />
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">
              <span /> Source-linked architecture maps
            </p>
            <h1>
              See how the code
              <br />
              <em>works.</em>
            </h1>
            <p className="hero-lede">
              Follow real request and data paths through open-source code. Every
              explanation links to the exact file at a pinned commit.
            </p>
            <div className="hero-actions">
              <a
                href="#library"
                className={cn(buttonVariants({ size: "lg" }), "primary-cta")}
              >
                Explore repositories <ArrowDown aria-hidden="true" />
              </a>
            </div>
            <dl className="hero-stats">
              <div>
                <dt>{String(repositories.length).padStart(2, "0")}</dt>
                <dd>codebases mapped</dd>
              </div>
              <div>
                <dt>{String(repositories.filter(({ status }) => status === "live").length).padStart(2, "0")}</dt>
                <dd>maps available</dd>
              </div>
              <div>
                <dt>100%</dt>
                <dd>paths linked to source</dd>
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

      <div className="shell">
        <RepositoryLibrary />
      </div>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <Brand />
          <p>{repositories.length} open-source codebases, mapped from source.</p>
          <a
            href="https://github.com/tamdogood/CodeTerrain"
            target="_blank"
            rel="noreferrer"
            className="footer-link focus-ring"
          >
            View on GitHub <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </footer>
    </main>
  );
}
