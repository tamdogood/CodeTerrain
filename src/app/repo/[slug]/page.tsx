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

  return repository
    ? {
        title: repository.name,
        description: repository.description,
      }
    : {};
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
          <MousePointer2 aria-hidden="true" /> Select buildings &amp; routes
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
          Select a journey, then click any route or building. Citations open the
          exact source behind the explanation.
        </p>
        <div className="viewer-hint">
          <MousePointer2 aria-hidden="true" /> Interactive canvas
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
          <p className="eyebrow">Publishing roadmap · {repository.category}</p>
          <h2>{repository.name} is next terrain to chart.</h2>
          <p>
            This page is ready to share, but the architecture map is not yet
            published. It will only go live after the default branch is analyzed
            and every path is tied to a pinned source citation.
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
          <p className="eyebrow">Your future field guide</p>
          <h2 id="learning-plan-title">What this map will help you understand</h2>
        </div>
        <div className="learning-cards">
          <article>
            <span className="learning-icon"><Map aria-hidden="true" /></span>
            <p className="learning-label">Orientation</p>
            <h3>System boundaries</h3>
            <p>
              The major subsystems, what each owns, and why those boundaries
              exist.
            </p>
          </article>
          <article>
            <span className="learning-icon"><Route aria-hidden="true" /></span>
            <p className="learning-label">Control &amp; data</p>
            <h3>Real execution paths</h3>
            <p>
              How an input becomes work, which payload crosses each boundary,
              and where state changes.
            </p>
          </article>
          <article>
            <span className="learning-icon"><GitFork aria-hidden="true" /></span>
            <p className="learning-label">Source literacy</p>
            <h3>Files worth reading</h3>
            <p>
              A guided route into the code, with terminology explained in the
              context where it matters.
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
          <span>Learning focus</span>
          <strong>{repository.concepts.join(" · ")}</strong>
        </div>
        <Link href="/#library" className="next-map-link focus-ring">
          Explore another repo <ArrowRight aria-hidden="true" />
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
