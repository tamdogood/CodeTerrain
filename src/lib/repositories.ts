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
      "A terminal workspace runtime mapped from client requests through PTYs, detection, persistence, and remote transport.",
    category: "Developer tools",
    language: "Rust",
    difficulty: "Intermediate",
    concepts: ["IPC", "PTY runtime", "Persistence"],
    github: "https://github.com/herdrdev/herdr",
    accent: "#b8ff65",
    status: "live",
  },
  {
    slug: "llama-cpp",
    name: "llama.cpp",
    owner: "ggml-org",
    description:
      "Trace a prompt through tokenization, model loading, graph execution, sampling, and hardware backends.",
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
      "Follow agent work from CLI commands through issue graphs, local state, synchronization, and automation hooks.",
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
      "See how model loading, optimized kernels, adapters, training, and export make fine-tuning faster and leaner.",
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
      "Explore how an agent studies software, designs a command surface, implements a harness, and verifies the result.",
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
      "Learn how components become updates through reconciliation, scheduling, and platform renderers.",
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
      "Trace a request through routing, rendering, caching, bundling, and the React server boundary.",
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
      "Explore the workbench, extension host, editor core, language services, and process boundaries.",
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
      "See desired state move through the API server, storage, schedulers, controllers, and kubelets.",
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
      "Follow work from system calls into scheduling, memory, filesystems, networking, and drivers.",
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
      "Trace SQL through parsing, planning, execution, MVCC, write-ahead logging, and storage.",
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
      "Study a compact server built around an event loop, data structures, persistence, and replication.",
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
      "Understand container lifecycle, image layers, networking, storage drivers, and runtime boundaries.",
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
      "See how commits, trees, blobs, refs, indexes, packfiles, and transport fit together.",
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
      "Walk source code through parsing, type checking, borrow checking, MIR, and code generation.",
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
      "Explore the compiler, runtime scheduler, garbage collector, standard library, and toolchain.",
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
      "Follow Python source through parsing, bytecode compilation, evaluation, objects, and memory.",
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
      "Connect JavaScript execution to native bindings, the event loop, workers, streams, and networking.",
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
      "Study a modern runtime across TypeScript tooling, permissions, web APIs, V8, and Rust ops.",
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
      "Map an open-source backend platform across Postgres, auth, realtime, storage, APIs, and tooling.",
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
      "Follow observability data from plugins and queries into transformations, dashboards, and alerts.",
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
      "Learn how configuration becomes a dependency graph, plan, provider calls, and durable state.",
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
      "Explore integrations, entity state, the event bus, automations, services, and device I/O.",
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
      "Trace tensors through dispatch, autograd, operators, compilation, devices, and distributed execution.",
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
      "Map graphs and tensors across eager execution, kernels, devices, optimization, and serving.",
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
