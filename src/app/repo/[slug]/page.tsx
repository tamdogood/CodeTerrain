import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  GitFork,
  Map,
  MousePointer2,
  Route,
} from "lucide-react";

import { SystemMapViewer } from "@/components/system-map-viewer";
import { ViewerControls } from "@/components/viewer-controls";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { systemMapBySlug } from "@/data/maps";
import { cn } from "@/lib/utils";
import { repositories, repositoryBySlug } from "@/lib/repositories";

type RepoPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return repositories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: RepoPageProps): Promise<Metadata> {
  const repository = repositoryBySlug((await params).slug);

  if (!repository) return {};

  const title = `${repository.name} architecture map`;
  const url = `/repo/${repository.slug}`;

  return {
    title,
    description: repository.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: repository.description,
      type: "website",
      url,
      siteName: "CodeTerrain",
      locale: "en_US",
      images: [{
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CodeTerrain open-source architecture maps",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: repository.description,
      images: [{
        url: "/og.png",
        alt: "CodeTerrain open-source architecture maps",
      }],
    },
  };
}

function ViewerHeader({ slug }: { slug: string }) {
  const repository = repositoryBySlug(slug);

  if (!repository) return null;

  return (
    <header className="viewer-header">
      <div className="viewer-brand-group">
        <Link href="/" className="viewer-back focus-ring" aria-label="Back to library">
          <ArrowLeft aria-hidden="true" />
        </Link>
        <div className="viewer-divider" />
        <div className="viewer-title">
          <div>
            <span>{repository.owner} /</span>
            <h1>{repository.name}</h1>
          </div>
          <Badge className={repository.status === "live" ? "status-live" : "status-planned"}>
            <span className="status-dot" />
            {repository.status === "live" ? "Live map" : "Planned"}
          </Badge>
        </div>
      </div>
      <div className="viewer-header-actions">
        <a
          href={repository.github}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "repo-github-button")}
        >
          <GitFork aria-hidden="true" />
          <span>View repository</span>
          <ExternalLink aria-hidden="true" />
        </a>
        {repository.status === "live" && <ViewerControls mapPath={repository.mapPath} />}
      </div>
    </header>
  );
}

function CuratedMap({ slug }: { slug: string }) {
  const repository = repositoryBySlug(slug)!;
  const map = systemMapBySlug(slug)!;

  return (
    <main className="viewer-page">
      <ViewerHeader slug={slug} />
      <div className="viewer-context">
        <div>
          <span className="viewer-context-label">Snapshot</span>
          <strong>{map.snapshot.branch} · {map.snapshot.commit.slice(0, 8)}</strong>
        </div>
        <p>{map.subtitle}</p>
        <div className="viewer-hint">
          <MousePointer2 aria-hidden="true" /> Click a building or route
        </div>
      </div>
      <SystemMapViewer key={map.slug} map={map} accent={repository.accent} />
    </main>
  );
}

function LiveMap({ slug }: { slug: string }) {
  const repository = repositoryBySlug(slug)!;

  return (
    <main className="viewer-page">
      <ViewerHeader slug={slug} />
      <div className="viewer-context">
        <div>
          <span className="viewer-context-label">Snapshot</span>
          <strong>{repository.snapshot}</strong>
        </div>
        <p>
          Pick a path, then click a route or building. Each citation opens the
          source file used for the map.
        </p>
        <div className="viewer-hint">
          <MousePointer2 aria-hidden="true" /> Click to explore
        </div>
      </div>
      <section className="map-frame-shell" aria-label={`${repository.name} system map`}>
        <iframe
          src={repository.mapPath}
          title={`${repository.name} interactive system map`}
          className="map-frame"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer"
          style={{ colorScheme: "dark" }}
        />
      </section>
    </main>
  );
}

function PlannedMap({ slug }: { slug: string }) {
  const repository = repositoryBySlug(slug)!;

  return (
    <main className="planned-page">
      <ViewerHeader slug={slug} />
      <section className="planned-hero">
        <div className="planned-grid" aria-hidden="true">
          <span className="planned-building planned-building-one" />
          <span className="planned-building planned-building-two" />
          <span className="planned-building planned-building-three" />
          <span className="planned-building planned-building-four" />
          <span className="planned-route" />
        </div>
        <div className="planned-copy">
          <p className="eyebrow">Map coming soon · {repository.category}</p>
          <h2>The {repository.name} map is not ready yet.</h2>
          <p>
            We will publish it after we analyze the default branch and link each
            path to a pinned source file.
          </p>
          <div className="planned-actions">
            <a
              href={repository.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "primary-cta")}
            >
              Browse the repository <ExternalLink aria-hidden="true" />
            </a>
            <Link
              href="/#library"
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "secondary-cta")}
            >
              Back to library
            </Link>
          </div>
        </div>
      </section>

      <section className="learning-plan" aria-labelledby="learning-plan-title">
        <div className="learning-plan-heading">
          <p className="eyebrow">What the map will cover</p>
          <h2 id="learning-plan-title">Start with the system, then read the code</h2>
        </div>
        <div className="learning-cards">
          <article>
            <span className="learning-icon"><Map aria-hidden="true" /></span>
            <p className="learning-label">Orientation</p>
            <h3>System boundaries</h3>
            <p>
              The main subsystems, what each one owns, and why they are separate.
            </p>
          </article>
          <article>
            <span className="learning-icon"><Route aria-hidden="true" /></span>
            <p className="learning-label">Control and data</p>
            <h3>Request paths</h3>
            <p>
              How inputs become work, what crosses each boundary, and when state
              changes.
            </p>
          </article>
          <article>
            <span className="learning-icon"><GitFork aria-hidden="true" /></span>
            <p className="learning-label">Source files</p>
            <h3>Where to start</h3>
            <p>
              Which files to read first, with unfamiliar terms explained as they
              come up.
            </p>
          </article>
        </div>
      </section>

      <section className="topic-strip">
        <div>
          <span>Language</span>
          <strong>{repository.language}</strong>
        </div>
        <div>
          <span>Difficulty</span>
          <strong>{repository.difficulty}</strong>
        </div>
        <div className="topic-concepts">
          <span>Topics</span>
          <strong>{repository.concepts.join(" · ")}</strong>
        </div>
        <Link href="/#library" className="next-map-link focus-ring">
          Open another repo <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { slug } = await params;
  const repository = repositoryBySlug(slug);

  if (!repository) notFound();

  if (systemMapBySlug(slug)) return <CuratedMap slug={slug} />;

  return repository.mapPath ? (
    <LiveMap slug={slug} />
  ) : (
    <PlannedMap slug={slug} />
  );
}
