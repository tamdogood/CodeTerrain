"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  categories,
  repositories,
  type RepoCategory,
  type Repository,
} from "@/lib/repositories";

type CategoryFilter = RepoCategory | "All";

function MiniCity({ accent }: { accent: string }) {
  return (
    <div
      className="mini-city"
      style={{ "--repo-accent": accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className="mini-route mini-route-one" />
      <span className="mini-route mini-route-two" />
      <span className="mini-block mini-block-one" />
      <span className="mini-block mini-block-two" />
      <span className="mini-block mini-block-three" />
      <span className="mini-block mini-block-four" />
      <span className="mini-packet mini-packet-one" />
      <span className="mini-packet mini-packet-two" />
    </div>
  );
}

function RepositoryCard({ repository }: { repository: Repository }) {
  const isLive = repository.status === "live";

  return (
    <article
      className="repo-card group"
      style={{ "--repo-accent": repository.accent } as CSSProperties}
    >
      <Link
        href={`/repo/${repository.slug}`}
        className="repo-visual focus-ring"
        aria-label={`${isLive ? "Open" : "Preview"} ${repository.name}`}
      >
        <div className="repo-card-topline">
          <Badge className={isLive ? "status-live" : "status-planned"}>
            <span className="status-dot" />
            {isLive ? "Live map" : "Planned"}
          </Badge>
          <span className="repo-number">
            {String(repositories.indexOf(repository) + 1).padStart(2, "0")}
          </span>
        </div>
        <MiniCity accent={repository.accent} />
      </Link>

      <div className="repo-card-body">
        <div className="repo-title-row">
          <div>
            <p className="repo-owner">{repository.owner} /</p>
            <h3>{repository.name}</h3>
          </div>
          <Link
            href={`/repo/${repository.slug}`}
            className="card-arrow focus-ring"
            aria-label={`${isLive ? "Open map for" : "View learning plan for"} ${repository.name}`}
          >
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <p className="repo-description">{repository.description}</p>
        <div className="concept-list" aria-label="Topics">
          {repository.concepts.map((concept) => (
            <span key={concept}>{concept}</span>
          ))}
        </div>
        <div className="repo-card-footer">
          <span>{repository.language}</span>
          <a
            href={repository.github}
            target="_blank"
            rel="noreferrer"
            className="github-link focus-ring"
            aria-label={`Open ${repository.name} on GitHub`}
          >
            GitHub <ExternalLink aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

export function RepositoryLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("All");
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.current?.focus();
      }
    }

    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const filteredRepositories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return repositories.filter((repository) => {
      const matchesCategory =
        category === "All" || repository.category === category;
      const searchable = [
        repository.name,
        repository.owner,
        repository.description,
        repository.language,
        ...repository.concepts,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchable.includes(normalizedQuery);
    });
  }, [category, query]);

  return (
    <section className="library-section" id="library" aria-labelledby="library-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Map library</p>
          <h2 id="library-title">Pick a codebase</h2>
        </div>
        <p>
          Open a map to trace the main paths and jump to the source.
        </p>
      </div>

      <div className="library-toolbar">
        <label className="search-box">
          <span className="sr-only">Search repositories</span>
          <Search aria-hidden="true" />
          <Input
            ref={searchInput}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by repo, language, or topic"
          />
          <kbd>⌘ K</kbd>
        </label>

        <div className="category-list" aria-label="Filter by category">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className="category-button"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div className="results-line" aria-live="polite">
        <span>{filteredRepositories.length} codebases</span>
        <span className="results-rule" />
        <span>Each citation links to the mapped commit</span>
      </div>

      {filteredRepositories.length > 0 ? (
        <div className="repo-grid">
          {filteredRepositories.map((repository) => (
            <RepositoryCard key={repository.slug} repository={repository} />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <Sparkles aria-hidden="true" />
          <h3>No codebases found</h3>
          <p>Try a language like &quot;Rust&quot; or a topic like &quot;event loop.&quot;</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </section>
  );
}
