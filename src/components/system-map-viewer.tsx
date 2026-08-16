"use client";

import {
  BookOpen,
  Box,
  CircleHelp,
  ExternalLink,
  FileCode2,
  Focus,
  Layers3,
  Minus,
  Plus,
  Route,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  MapEdge,
  MapNode,
  MapNodeKind,
  SystemMap,
} from "@/lib/system-map";

type Selection = { type: "node" | "edge"; id: string };
type EdgeKind = MapEdge["kind"];

const MIN_ZOOM = 0.75;
const MAX_ZOOM = 1.8;
const DEFAULT_ZOOM = 1.3;
const ZOOM_STEP = 0.05;
const clampZoom = (value: number) =>
  Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));

const edgeKinds: readonly { kind: EdgeKind; label: string; help: string }[] = [
  { kind: "control", label: "Control", help: "A command or decision that causes work." },
  { kind: "data", label: "Data", help: "Information passed between parts of the system." },
  { kind: "state", label: "State", help: "A durable or shared value that changes over time." },
];

const nodeKinds: readonly { kind: MapNodeKind; label: string }[] = [
  { kind: "entry", label: "Entry" },
  { kind: "service", label: "Service" },
  { kind: "compute", label: "Compute" },
  { kind: "storage", label: "Storage" },
  { kind: "runtime", label: "Runtime" },
  { kind: "tooling", label: "Tooling" },
  { kind: "external", label: "External" },
];

const dimensions: Record<MapNodeKind, { width: number; depth: number; base: number }> = {
  entry: { width: 68, depth: 22, base: 30 },
  service: { width: 82, depth: 28, base: 38 },
  compute: { width: 76, depth: 25, base: 46 },
  storage: { width: 88, depth: 30, base: 34 },
  runtime: { width: 72, depth: 24, base: 52 },
  tooling: { width: 78, depth: 26, base: 36 },
  external: { width: 62, depth: 21, base: 42 },
};

function pointFor(node: MapNode) {
  return { x: 55 + node.x * 8.9, y: 48 + node.y * 5.4 };
}

function edgePath(from: MapNode, to: MapNode) {
  const start = pointFor(from);
  const end = pointFor(to);
  const bend = Math.max(28, Math.min(70, Math.abs(end.x - start.x) * 0.12));
  const middleX = (start.x + end.x) / 2;
  const middleY = (start.y + end.y) / 2 - bend;

  return `M ${start.x} ${start.y} Q ${middleX} ${middleY} ${end.x} ${end.y}`;
}

function splitLabel(label: string) {
  if (label.length < 15 || !label.includes(" ")) return [label];
  const words = label.split(" ");
  const midpoint = label.length / 2;
  let length = 0;
  let splitAt = 1;

  for (let index = 0; index < words.length - 1; index += 1) {
    length += words[index].length + 1;
    if (Math.abs(length - midpoint) < Math.abs(words.slice(0, splitAt).join(" ").length - midpoint)) {
      splitAt = index + 1;
    }
  }

  return [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];
}

const compactPayload = (payload: string) =>
  payload.length > 24 ? `${payload.slice(0, 22)}…` : payload;

function BuildingGlyph({ node, x, y, height }: { node: MapNode; x: number; y: number; height: number }) {
  if (node.kind === "storage") {
    return (
      <g className="map-building-glyph" aria-hidden="true">
        <path d={`M ${x - 17} ${y - height + 13} Q ${x} ${y - height + 21} ${x + 17} ${y - height + 13}`} />
        <path d={`M ${x - 17} ${y - height + 25} Q ${x} ${y - height + 33} ${x + 17} ${y - height + 25}`} />
      </g>
    );
  }

  if (node.kind === "external") {
    return (
      <g className="map-building-glyph" aria-hidden="true">
        <path d={`M ${x} ${y - height - 7} v -17`} />
        <circle cx={x} cy={y - height - 28} r="3" />
        <path d={`M ${x - 10} ${y - height - 22} Q ${x} ${y - height - 34} ${x + 10} ${y - height - 22}`} />
      </g>
    );
  }

  if (node.kind === "compute" || node.kind === "runtime") {
    return (
      <g className="map-building-glyph map-building-windows" aria-hidden="true">
        {[0, 1, 2].map((column) => (
          <rect key={column} x={x - 21 + column * 15} y={y - height + 15} width="7" height="12" rx="1" />
        ))}
      </g>
    );
  }

  return (
    <g className="map-building-glyph" aria-hidden="true">
      <path d={`M ${x - 18} ${y - height + 18} h 36`} />
      <path d={`M ${x - 11} ${y - height + 29} h 22`} />
    </g>
  );
}

function IsometricBuilding({
  node,
  active,
  muted,
  onSelect,
}: {
  node: MapNode;
  active: boolean;
  muted: boolean;
  onSelect: () => void;
}) {
  const { x, y } = pointFor(node);
  const size = dimensions[node.kind];
  const height = size.base + node.height * 9;
  const labels = splitLabel(node.label);
  const top = [
    `${x},${y - height - size.depth}`,
    `${x + size.width / 2},${y - height}`,
    `${x},${y - height + size.depth}`,
    `${x - size.width / 2},${y - height}`,
  ].join(" ");
  const left = [
    `${x - size.width / 2},${y - height}`,
    `${x},${y - height + size.depth}`,
    `${x},${y + size.depth}`,
    `${x - size.width / 2},${y}`,
  ].join(" ");
  const right = [
    `${x + size.width / 2},${y - height}`,
    `${x},${y - height + size.depth}`,
    `${x},${y + size.depth}`,
    `${x + size.width / 2},${y}`,
  ].join(" ");

  function onKeyDown(event: KeyboardEvent<SVGGElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <g
      className={`map-building map-building-${node.kind}${active ? " is-active" : ""}${muted ? " is-muted" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={`${node.label}: ${node.summary}`}
      aria-pressed={active}
      onClick={onSelect}
      onKeyDown={onKeyDown}
    >
      <ellipse className="map-building-shadow" cx={x} cy={y + size.depth + 7} rx={size.width * 0.57} ry={size.depth * 0.5} />
      <polygon className="map-building-left" points={left} />
      <polygon className="map-building-right" points={right} />
      <polygon className="map-building-roof" points={top} />
      <BuildingGlyph node={node} x={x} y={y} height={height} />
      <circle className="map-building-status" cx={x} cy={y - height - size.depth - 7} r="3.5" />
      <g className="map-building-label">
        <rect x={x - 55} y={y + size.depth + 14} width="110" height={labels.length === 1 ? 25 : 36} rx="6" />
        <text x={x} y={y + size.depth + 29} textAnchor="middle">
          {labels.map((line, index) => (
            <tspan key={line} x={x} dy={index === 0 ? 0 : 11}>{line}</tspan>
          ))}
        </text>
      </g>
    </g>
  );
}

function CitationList({ citations }: { citations: MapNode["citations"] }) {
  return (
    <ul className="map-citations">
      {citations.map((citation) => (
        <li key={`${citation.path}-${citation.url}`}>
          <a href={citation.url} target="_blank" rel="noreferrer">
            <FileCode2 aria-hidden="true" />
            <span>
              <strong>{citation.label}</strong>
              <code>{citation.path}</code>
            </span>
            <ExternalLink aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SystemMapViewer({ map, accent }: { map: SystemMap; accent: string }) {
  const [selection, setSelection] = useState<Selection>({ type: "node", id: map.nodes[0].id });
  const [journeyId, setJourneyId] = useState(map.journeys[0]?.id ?? "");
  const [visibleEdgeKinds, setVisibleEdgeKinds] = useState<ReadonlySet<EdgeKind>>(
    () => new Set(edgeKinds.map(({ kind }) => kind)),
  );
  const [glossaryTerm, setGlossaryTerm] = useState(map.glossary[0]?.term ?? "");
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const explainer = useRef<HTMLElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const panStart = useRef<{ pointerId: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const nodeById = useMemo(() => new Map(map.nodes.map((node) => [node.id, node])), [map.nodes]);
  const activeJourney = map.journeys.find(({ id }) => id === journeyId);
  const journeyEdgeIds = useMemo(() => new Set(activeJourney?.edgeIds ?? []), [activeJourney]);
  const journeyNodeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const edge of map.edges) {
      if (journeyEdgeIds.has(edge.id)) {
        ids.add(edge.from);
        ids.add(edge.to);
      }
    }
    return ids;
  }, [journeyEdgeIds, map.edges]);
  const selectedNode = selection.type === "node" ? nodeById.get(selection.id) : undefined;
  const selectedEdge = selection.type === "edge" ? map.edges.find(({ id }) => id === selection.id) : undefined;
  const activeGlossaryTerm = map.glossary.find(({ term }) => term === glossaryTerm) ?? map.glossary[0];

  useEffect(() => {
    const area = scrollArea.current;
    if (!area) return;

    const handleWheel = (event: WheelEvent) => {
      if (!event.deltaY) return;
      event.preventDefault();
      const sensitivity = event.ctrlKey ? 0.01 : 0.002;
      setZoom((value) => clampZoom(value - event.deltaY * sensitivity));
    };

    area.addEventListener("wheel", handleWheel, { passive: false });
    const frame = window.requestAnimationFrame(() => {
      area.scrollLeft = (area.scrollWidth - area.clientWidth) / 2;
      area.scrollTop = (area.scrollHeight - area.clientHeight) / 2;
    });

    return () => {
      area.removeEventListener("wheel", handleWheel);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  function selectItem(next: Selection) {
    setSelection(next);

    if (window.matchMedia("(max-width: 820px)").matches) {
      window.requestAnimationFrame(() => {
        explainer.current?.focus({ preventScroll: true });
        explainer.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start",
        });
      });
    }
  }

  function startPan(event: ReactPointerEvent<HTMLDivElement>) {
    const area = scrollArea.current;
    if (!area || event.button !== 0 || event.pointerType !== "mouse") return;

    panStart.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: area.scrollLeft,
      top: area.scrollTop,
      moved: false,
    };
    area.setPointerCapture(event.pointerId);
  }

  function movePan(event: ReactPointerEvent<HTMLDivElement>) {
    const area = scrollArea.current;
    const start = panStart.current;
    if (!area || !start || start.pointerId !== event.pointerId) return;

    const x = event.clientX - start.x;
    const y = event.clientY - start.y;
    if (!start.moved && Math.hypot(x, y) < 4) return;

    event.preventDefault();
    start.moved = true;
    area.classList.add("is-dragging");
    area.scrollLeft = start.left - x;
    area.scrollTop = start.top - y;
  }

  function stopPan(event: ReactPointerEvent<HTMLDivElement>) {
    const area = scrollArea.current;
    const start = panStart.current;
    if (!area || !start || start.pointerId !== event.pointerId) return;

    if (area.hasPointerCapture(event.pointerId)) area.releasePointerCapture(event.pointerId);
    area.classList.remove("is-dragging");
    panStart.current = null;

    if (start.moved) {
      suppressClick.current = true;
      window.requestAnimationFrame(() => { suppressClick.current = false; });
    }
  }

  function resetMap() {
    setZoom(DEFAULT_ZOOM);
    window.requestAnimationFrame(() => {
      const area = scrollArea.current;
      if (!area) return;
      area.scrollLeft = (area.scrollWidth - area.clientWidth) / 2;
      area.scrollTop = (area.scrollHeight - area.clientHeight) / 2;
    });
  }

  function toggleEdgeKind(kind: EdgeKind) {
    if (visibleEdgeKinds.has(kind) && visibleEdgeKinds.size > 1) {
      const hiddenEdges = new Set(map.edges.filter((edge) => edge.kind === kind).map(({ id }) => id));
      if (selection.type === "edge" && hiddenEdges.has(selection.id)) {
        setSelection({ type: "node", id: map.nodes[0].id });
      }
      if (activeJourney?.edgeIds.some((edgeId) => hiddenEdges.has(edgeId))) {
        setJourneyId("");
      }
    }

    setVisibleEdgeKinds((current) => {
      const next = new Set(current);
      if (next.has(kind) && next.size > 1) next.delete(kind);
      else next.add(kind);
      return next;
    });
  }

  return (
    <section
      id="system-map"
      className="system-map-viewer"
      style={{ "--map-accent": accent } as CSSProperties}
      aria-label={`${map.title} interactive architecture map`}
    >
      <div className="map-journey-bar">
        <div className="map-journey-intro">
          <Route aria-hidden="true" />
          <span>Choose a path</span>
        </div>
        <div className="map-journey-list" role="group" aria-label="System journeys">
          {map.journeys.map((journey, index) => (
            <button
              key={journey.id}
              type="button"
              aria-pressed={journey.id === journeyId}
              onClick={() => setJourneyId((current) => current === journey.id ? "" : journey.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {journey.label}
            </button>
          ))}
        </div>
        <p>{activeJourney?.summary ?? map.orientation}</p>
      </div>

      <div className="system-map-layout">
        <div className="map-workspace">
          <div className="map-canvas-header">
            <div>
              <span>System map</span>
              <strong>{map.nodes.length} components · {map.edges.length} connections</strong>
            </div>
            <div className="map-zoom-controls" aria-label="Map zoom controls">
              <button type="button" onClick={() => setZoom((value) => clampZoom(value - ZOOM_STEP))} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out">
                <Minus aria-hidden="true" />
              </button>
              <span>{Math.round(zoom * 100)}%</span>
              <button type="button" onClick={() => setZoom((value) => clampZoom(value + ZOOM_STEP))} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in">
                <Plus aria-hidden="true" />
              </button>
              <button type="button" onClick={resetMap} aria-label="Reset map view" title="Reset map view">
                <Focus aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            ref={scrollArea}
            className="map-scroll-area"
            onPointerDown={startPan}
            onPointerMove={movePan}
            onPointerUp={stopPan}
            onPointerCancel={stopPan}
            onClickCapture={(event) => {
              if (!suppressClick.current) return;
              event.preventDefault();
              event.stopPropagation();
              suppressClick.current = false;
            }}
          >
            {/* ponytail: fits today's 9–91 / 14–80 map coordinates; derive bounds if maps expand beyond them. */}
            <svg
              className="system-map-canvas"
              style={{
                width: `${zoom * 100}%`,
                height: `${zoom * 100}%`,
              }}
              viewBox="55 0 880 575"
              role="group"
              aria-labelledby={`${map.slug}-map-title ${map.slug}-map-description`}
            >
              <title id={`${map.slug}-map-title`}>{`${map.title} architecture`}</title>
              <desc id={`${map.slug}-map-description`}>{map.orientation}</desc>
              <defs>
                <pattern id={`${map.slug}-grid`} width="42" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 12 L 21 0 L 42 12 L 21 24 Z" fill="none" stroke="currentColor" strokeWidth="0.7" />
                </pattern>
                {edgeKinds.map(({ kind }) => (
                  <marker key={kind} id={`${map.slug}-${kind}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className={`map-arrow map-arrow-${kind}`} />
                  </marker>
                ))}
              </defs>
              <rect className="map-grid" width="1000" height="650" fill={`url(#${map.slug}-grid)`} />
              <g className="map-districts" aria-hidden="true">
                {[...new Set(map.nodes.map(({ district }) => district))].map((district, index) => {
                  const districtNodes = map.nodes.filter((node) => node.district === district);
                  const x = Math.min(...districtNodes.map((node) => pointFor(node).x)) - 66;
                  const y = Math.min(...districtNodes.map((node) => pointFor(node).y)) - 86;
                  return <text key={district} x={Math.max(20, x)} y={Math.max(28, y + index * 2)}>{district}</text>;
                })}
              </g>
              <g className="map-connections">
                {map.edges.map((edge, index) => {
                  if (!visibleEdgeKinds.has(edge.kind)) return null;
                  const from = nodeById.get(edge.from)!;
                  const to = nodeById.get(edge.to)!;
                  const path = edgePath(from, to);
                  const isJourneyEdge = journeyEdgeIds.has(edge.id);
                  const isSelected = selectedEdge?.id === edge.id;
                  const isMuted = Boolean(activeJourney) && !isJourneyEdge && !isSelected;
                  const midpoint = {
                    x: (pointFor(from).x + pointFor(to).x) / 2,
                    y: (pointFor(from).y + pointFor(to).y) / 2 - 35,
                  };

                  return (
                    <g key={edge.id} className={`map-edge map-edge-${edge.kind}${isJourneyEdge ? " is-journey" : ""}${isSelected ? " is-selected" : ""}${isMuted ? " is-muted" : ""}`}>
                      <path className="map-edge-line" d={path} markerEnd={`url(#${map.slug}-${edge.kind}-arrow)`} />
                      <path
                        className="map-edge-hit"
                        d={path}
                        role="button"
                        tabIndex={0}
                        aria-label={`${edge.label}. Payload: ${edge.payload}`}
                        aria-pressed={isSelected}
                        onClick={() => selectItem({ type: "edge", id: edge.id })}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectItem({ type: "edge", id: edge.id });
                          }
                        }}
                      />
                      {(isJourneyEdge || isSelected) && (
                        <g className="map-payload-label" transform={`translate(${midpoint.x} ${midpoint.y})`}>
                          <rect x="-58" y="-11" width="116" height="22" rx="5" />
                          <text textAnchor="middle" dominantBaseline="middle">{compactPayload(edge.payload)}</text>
                        </g>
                      )}
                      {isJourneyEdge && (
                        <circle className="map-packet" r="4">
                          <animateMotion dur={`${2.4 + (index % 3) * 0.45}s`} repeatCount="indefinite" path={path} />
                        </circle>
                      )}
                    </g>
                  );
                })}
              </g>
              <g className="map-buildings">
                {[...map.nodes]
                  .sort((a, b) => a.y - b.y)
                  .map((node) => (
                    <IsometricBuilding
                      key={node.id}
                      node={node}
                      active={selectedNode?.id === node.id}
                      muted={Boolean(activeJourney) && !journeyNodeIds.has(node.id) && selectedNode?.id !== node.id}
                      onSelect={() => selectItem({ type: "node", id: node.id })}
                    />
                  ))}
              </g>
            </svg>
          </div>

          <div className="map-legend" aria-label="Map legend">
            <div className="map-legend-group">
              <span className="map-legend-title">Connections</span>
              {edgeKinds.map(({ kind, label, help }) => (
                <button key={kind} type="button" className={`map-legend-edge map-legend-${kind}`} aria-pressed={visibleEdgeKinds.has(kind)} onClick={() => toggleEdgeKind(kind)} title={help}>
                  <i /> {label}
                </button>
              ))}
            </div>
            <div className="map-legend-group map-legend-buildings">
              <span className="map-legend-title">Buildings</span>
              {nodeKinds.map(({ kind, label }) => <span key={kind} className={`map-legend-node map-building-${kind}`}><i />{label}</span>)}
            </div>
          </div>
        </div>

        <aside ref={explainer} className="map-explainer" aria-live="polite" tabIndex={-1}>
          <div className="map-explainer-scroll">
            {selectedNode && (
              <>
                <div className="map-explainer-heading">
                  <span className={`map-kind map-building-${selectedNode.kind}`}><Box aria-hidden="true" /> {selectedNode.kind}</span>
                  <p>{selectedNode.district}</p>
                  <h2>{selectedNode.label}</h2>
                  <p className="map-explainer-summary">{selectedNode.summary}</p>
                </div>
                <section className="map-explainer-section">
                  <h3><Layers3 aria-hidden="true" /> Responsibility</h3>
                  <p>{selectedNode.responsibility}</p>
                </section>
                <section className="map-explainer-section">
                  <h3><FileCode2 aria-hidden="true" /> Source files</h3>
                  <CitationList citations={selectedNode.citations} />
                </section>
              </>
            )}

            {selectedEdge && (
              <>
                <div className="map-explainer-heading">
                  <span className={`map-kind map-kind-${selectedEdge.kind}`}><Route aria-hidden="true" /> {selectedEdge.kind} path</span>
                  <p>{nodeById.get(selectedEdge.from)?.label} → {nodeById.get(selectedEdge.to)?.label}</p>
                  <h2>{selectedEdge.label}</h2>
                  <div className="map-payload-card">
                    <span>Payload</span>
                    <code>{selectedEdge.payload}</code>
                  </div>
                  <p className="map-explainer-summary">{selectedEdge.description}</p>
                </div>
                <section className="map-explainer-section">
                  <h3><FileCode2 aria-hidden="true" /> Source files</h3>
                  <CitationList citations={selectedEdge.citations} />
                </section>
              </>
            )}

          </div>
        </aside>

        <div className="map-learning-dock">
          <section className="map-glossary">
            <h3><CircleHelp aria-hidden="true" /> Terms, in plain English</h3>
            <div className="map-glossary-list" aria-label="Glossary terms">
              {map.glossary.map(({ term }) => (
                <button
                  key={term}
                  type="button"
                  aria-pressed={term === activeGlossaryTerm?.term}
                  onClick={() => setGlossaryTerm(term)}
                >
                  {term}
                </button>
              ))}
            </div>
            {activeGlossaryTerm && (
              <p className="map-glossary-definition" aria-live="polite">
                <strong>{activeGlossaryTerm.term}</strong>
                {activeGlossaryTerm.definition}
              </p>
            )}
          </section>

          <section className="map-learning-path">
            <h3><BookOpen aria-hidden="true" /> How to study this repo</h3>
            <ol>
              {map.learningPath.map((step, index) => (
                <li key={step.title}>
                  <span>{index + 1}</span>
                  <div><strong>{step.title}</strong><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}
