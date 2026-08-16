export type RepoCategory =
  | "Web"
  | "Systems"
  | "Infrastructure"
  | "Data"
  | "AI"
  | "Developer tools";

export type Repository = {
  slug: string;
  name: string;
  owner: string;
  description: string;
  category: RepoCategory;
  language: string;
  difficulty: "Approachable" | "Intermediate" | "Advanced";
  concepts: readonly string[];
  github: string;
  accent: string;
  status: "live" | "planned";
  mapPath?: string;
  snapshot?: string;
};

export const categories = [
  "All",
  "Web",
  "Systems",
  "Infrastructure",
  "Data",
  "AI",
  "Developer tools",
] as const;

export const repositories: readonly Repository[] = [
  {
    slug: "herdr",
    name: "Herdr",
    owner: "herdrdev",
    description:
      "Herdr handles client requests, terminal sessions, saved state, and remote connections.",
    category: "Developer tools",
    language: "Rust",
    difficulty: "Intermediate",
    concepts: ["IPC", "PTY runtime", "Persistence"],
    github: "https://github.com/herdrdev/herdr",
    accent: "#b8ff65",
    status: "live",
    mapPath: "/maps/herdr-system-map.html",
    snapshot: "master · 51b7064",
  },
  {
    slug: "llama-cpp",
    name: "llama.cpp",
    owner: "ggml-org",
    description:
      "llama.cpp loads a model, tokenizes a prompt, runs its compute graph, and samples the next token.",
    category: "AI",
    language: "C / C++",
    difficulty: "Advanced",
    concepts: ["Inference", "GGUF", "Quantization"],
    github: "https://github.com/ggml-org/llama.cpp",
    accent: "#f3c86b",
    status: "live",
  },
  {
    slug: "beads",
    name: "Beads",
    owner: "gastownhall",
    description:
      "Beads turns CLI commands into issue graphs, syncs local state, and runs automation hooks.",
    category: "Developer tools",
    language: "Go",
    difficulty: "Intermediate",
    concepts: ["Issue graph", "Agent memory", "Sync"],
    github: "https://github.com/gastownhall/beads",
    accent: "#ff8f70",
    status: "live",
  },
  {
    slug: "unsloth",
    name: "Unsloth",
    owner: "unslothai",
    description:
      "Unsloth uses optimized kernels and adapters to load, train, and export fine-tuned models.",
    category: "AI",
    language: "Python",
    difficulty: "Advanced",
    concepts: ["Fine-tuning", "LoRA", "Kernels"],
    github: "https://github.com/unslothai/unsloth",
    accent: "#9b8cff",
    status: "live",
  },
  {
    slug: "cli-anything",
    name: "CLI-Anything",
    owner: "HKUDS",
    description:
      "CLI-Anything studies an app, designs its commands, builds a harness, and tests the result.",
    category: "Developer tools",
    language: "Python",
    difficulty: "Approachable",
    concepts: ["Agent harness", "CLI design", "Evaluation"],
    github: "https://github.com/HKUDS/CLI-Anything",
    accent: "#5ce0b2",
    status: "live",
  },
  {
    slug: "react",
    name: "React",
    owner: "facebook",
    description:
      "React schedules component updates, reconciles the tree, and sends changes to a renderer.",
    category: "Web",
    language: "JavaScript",
    difficulty: "Advanced",
    concepts: ["Fiber", "Scheduler", "Reconciliation"],
    github: "https://github.com/facebook/react",
    accent: "#69d9ff",
    status: "live",
  },
  {
    slug: "nextjs",
    name: "Next.js",
    owner: "vercel",
    description:
      "Next.js routes requests, renders React on the server, caches results, and bundles the app.",
    category: "Web",
    language: "TypeScript",
    difficulty: "Advanced",
    concepts: ["App Router", "RSC", "Caching"],
    github: "https://github.com/vercel/next.js",
    accent: "#f5f7f2",
    status: "live",
  },
  {
    slug: "vscode",
    name: "VS Code",
    owner: "microsoft",
    description:
      "The VS Code workbench, editor, language services, and extension host communicate across processes.",
    category: "Developer tools",
    language: "TypeScript",
    difficulty: "Advanced",
    concepts: ["Extension host", "IPC", "Workbench"],
    github: "https://github.com/microsoft/vscode",
    accent: "#53a9ff",
    status: "live",
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    owner: "kubernetes",
    description:
      "Kubernetes turns desired state into work across its API server, controllers, scheduler, and kubelets.",
    category: "Infrastructure",
    language: "Go",
    difficulty: "Advanced",
    concepts: ["Control loops", "Scheduling", "Reconciliation"],
    github: "https://github.com/kubernetes/kubernetes",
    accent: "#6d92ff",
    status: "live",
  },
  {
    slug: "linux",
    name: "Linux",
    owner: "torvalds",
    description:
      "Linux handles a system call across the scheduler, memory, filesystems, network stack, and drivers.",
    category: "Systems",
    language: "C",
    difficulty: "Advanced",
    concepts: ["Syscalls", "Kernel", "Drivers"],
    github: "https://github.com/torvalds/linux",
    accent: "#ffd45b",
    status: "live",
  },
  {
    slug: "postgresql",
    name: "PostgreSQL",
    owner: "postgres",
    description:
      "PostgreSQL parses and plans SQL, executes it under MVCC, and records changes in storage and WAL.",
    category: "Data",
    language: "C",
    difficulty: "Advanced",
    concepts: ["Query planner", "MVCC", "WAL"],
    github: "https://github.com/postgres/postgres",
    accent: "#6eabde",
    status: "live",
  },
  {
    slug: "redis",
    name: "Redis",
    owner: "redis",
    description:
      "Redis uses one event loop to serve its data structures, persist changes, and replicate them.",
    category: "Data",
    language: "C",
    difficulty: "Intermediate",
    concepts: ["Event loop", "Replication", "Persistence"],
    github: "https://github.com/redis/redis",
    accent: "#ff6b62",
    status: "live",
  },
  {
    slug: "moby",
    name: "Moby",
    owner: "moby",
    description:
      "Moby creates containers from image layers and connects them to storage, networks, and a runtime.",
    category: "Infrastructure",
    language: "Go",
    difficulty: "Advanced",
    concepts: ["Containers", "Images", "Networking"],
    github: "https://github.com/moby/moby",
    accent: "#52c8ff",
    status: "live",
  },
  {
    slug: "git",
    name: "Git",
    owner: "git",
    description:
      "Git builds commits from its index and object graph, then stores and transfers them as packfiles.",
    category: "Developer tools",
    language: "C",
    difficulty: "Intermediate",
    concepts: ["Object graph", "Refs", "Packfiles"],
    github: "https://github.com/git/git",
    accent: "#f27b55",
    status: "live",
  },
  {
    slug: "rust",
    name: "Rust",
    owner: "rust-lang",
    description:
      "The Rust compiler parses code, checks its types and borrows, lowers it to MIR, and generates a binary.",
    category: "Systems",
    language: "Rust",
    difficulty: "Advanced",
    concepts: ["Compiler", "Borrow checker", "MIR"],
    github: "https://github.com/rust-lang/rust",
    accent: "#f0a36c",
    status: "live",
  },
  {
    slug: "go",
    name: "Go",
    owner: "golang",
    description:
      "Go's compiler and toolchain produce code that runs on its scheduler, garbage collector, and standard library.",
    category: "Systems",
    language: "Go",
    difficulty: "Advanced",
    concepts: ["Goroutines", "GC", "Compiler"],
    github: "https://github.com/golang/go",
    accent: "#5fd5dc",
    status: "live",
  },
  {
    slug: "cpython",
    name: "CPython",
    owner: "python",
    description:
      "CPython turns source into bytecode, evaluates it, and manages Python objects in memory.",
    category: "Systems",
    language: "C / Python",
    difficulty: "Advanced",
    concepts: ["Interpreter", "Bytecode", "Object model"],
    github: "https://github.com/python/cpython",
    accent: "#ffd85a",
    status: "live",
  },
  {
    slug: "nodejs",
    name: "Node.js",
    owner: "nodejs",
    description:
      "Node.js connects JavaScript to native code, the event loop, workers, streams, and the network.",
    category: "Systems",
    language: "C++ / JavaScript",
    difficulty: "Advanced",
    concepts: ["Event loop", "V8", "libuv"],
    github: "https://github.com/nodejs/node",
    accent: "#78c878",
    status: "live",
  },
  {
    slug: "deno",
    name: "Deno",
    owner: "denoland",
    description:
      "Deno connects TypeScript tooling and web APIs to V8, Rust ops, and its permission checks.",
    category: "Systems",
    language: "Rust / TypeScript",
    difficulty: "Advanced",
    concepts: ["Runtime ops", "Permissions", "Web APIs"],
    github: "https://github.com/denoland/deno",
    accent: "#d5ff72",
    status: "live",
  },
  {
    slug: "supabase",
    name: "Supabase",
    owner: "supabase",
    description:
      "Supabase builds auth, realtime updates, storage, and APIs around PostgreSQL.",
    category: "Data",
    language: "TypeScript",
    difficulty: "Intermediate",
    concepts: ["Auth", "Realtime", "Storage"],
    github: "https://github.com/supabase/supabase",
    accent: "#4ee6a4",
    status: "live",
  },
  {
    slug: "grafana",
    name: "Grafana",
    owner: "grafana",
    description:
      "Grafana queries data through plugins, transforms the results, and feeds dashboards and alerts.",
    category: "Data",
    language: "Go / TypeScript",
    difficulty: "Advanced",
    concepts: ["Plugins", "Queries", "Alerting"],
    github: "https://github.com/grafana/grafana",
    accent: "#ff9d4d",
    status: "live",
  },
  {
    slug: "terraform",
    name: "Terraform",
    owner: "hashicorp",
    description:
      "Terraform turns configuration into a dependency graph, a plan, provider calls, and saved state.",
    category: "Infrastructure",
    language: "Go",
    difficulty: "Advanced",
    concepts: ["DAG", "Providers", "State"],
    github: "https://github.com/hashicorp/terraform",
    accent: "#a98cff",
    status: "live",
  },
  {
    slug: "home-assistant",
    name: "Home Assistant",
    owner: "home-assistant",
    description:
      "Home Assistant links integrations and device I/O to entity state, events, services, and automations.",
    category: "Infrastructure",
    language: "Python",
    difficulty: "Intermediate",
    concepts: ["Event bus", "Integrations", "State"],
    github: "https://github.com/home-assistant/core",
    accent: "#4cc4ff",
    status: "live",
  },
  {
    slug: "pytorch",
    name: "PyTorch",
    owner: "pytorch",
    description:
      "PyTorch dispatches tensor operations, records autograd, compiles graphs, and runs across devices.",
    category: "AI",
    language: "Python / C++",
    difficulty: "Advanced",
    concepts: ["Autograd", "Dispatch", "Tensors"],
    github: "https://github.com/pytorch/pytorch",
    accent: "#ff7657",
    status: "live",
  },
  {
    slug: "tensorflow",
    name: "TensorFlow",
    owner: "tensorflow",
    description:
      "TensorFlow runs tensors eagerly or as graphs, selects kernels and devices, then optimizes and serves models.",
    category: "AI",
    language: "C++ / Python",
    difficulty: "Advanced",
    concepts: ["Graphs", "Kernels", "Devices"],
    github: "https://github.com/tensorflow/tensorflow",
    accent: "#ffaf4a",
    status: "live",
  },
] as const;

export const repositoryBySlug = (slug: string) =>
  repositories.find((repository) => repository.slug === slug);

if (
  new Set(repositories.map(({ slug }) => slug)).size !== repositories.length
) {
  throw new Error("Repository catalog has duplicate slugs");
}
