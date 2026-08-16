import type { SourceCitation, SystemMap } from "@/lib/system-map";

const repositories = {
  unsloth: {
    name: "unslothai/unsloth",
    commit: "aa3f3c2799ae9284a6d4592bf902f3d02a52b69c",
  },
  linux: {
    name: "torvalds/linux",
    commit: "3eb40771c00a8488fa6ed2cc1fe203477908bf38",
  },
  rust: {
    name: "rust-lang/rust",
    commit: "67854e511de21d881bb16426996cd4259d44aa2e",
  },
  go: {
    name: "golang/go",
    commit: "72aa6db7943024b48c4d41c1fbc32b57b9fa036e",
  },
  cpython: {
    name: "python/cpython",
    commit: "c1447994a42004a81a8caca026218daf69d451c8",
  },
  nodejs: {
    name: "nodejs/node",
    commit: "04a0c270bea9903d823fdc21c6ae3b0ccbe302fa",
  },
  pytorch: {
    name: "pytorch/pytorch",
    commit: "8f988c9c6b3586efbc00a981d9d8cac11f26bcdb",
  },
  tensorflow: {
    name: "tensorflow/tensorflow",
    commit: "45bf59db030a4b27742c3274b414080c358db36e",
  },
} as const;

type RepositoryKey = keyof typeof repositories;

function cite(
  repository: RepositoryKey,
  path: string,
  label: string,
): SourceCitation {
  const { name, commit } = repositories[repository];

  return {
    label,
    path,
    url: `https://github.com/${name}/blob/${commit}/${path}`,
  };
}

export const batchC = [
  {
    slug: "unsloth",
    title: "Unsloth",
    subtitle: "A fast fine-tuning path from a model ID to optimized training and portable weights.",
    orientation:
      "Start at the public model-loading API on the upper left. The middle buildings prepare model and token data, the GPU district performs training work, and the right edge publishes the result.",
    snapshot: {
      branch: "main",
      commit: "aa3f3c2",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "api",
        label: "Fast model API",
        district: "User interface",
        kind: "entry",
        summary: "The Python-facing classes learners call to load and adapt a model.",
        responsibility:
          "Expose FastLanguageModel, FastVisionModel, and trainer-compatible entry points while selecting the supported backend.",
        x: 10,
        y: 15,
        height: 2,
        citations: [cite("unsloth", "unsloth/__init__.py", "Public model and trainer exports")],
      },
      {
        id: "loader",
        label: "Model loader",
        district: "Preparation",
        kind: "service",
        summary: "Resolves configuration, adapter state, quantization, and the matching model family.",
        responsibility:
          "Turn a repository ID plus loading options into a model/tokenizer pair, then dispatch to the architecture-specific patcher.",
        x: 32,
        y: 18,
        height: 3,
        citations: [cite("unsloth", "unsloth/models/loader.py", "FastLanguageModel.from_pretrained dispatch")],
      },
      {
        id: "patcher",
        label: "Model patcher",
        district: "Preparation",
        kind: "runtime",
        summary: "Replaces selected Transformer methods with Unsloth's faster implementations.",
        responsibility:
          "Patch attention, decoder, causal-language-model, and PEFT forward paths while preserving the Transformers model interface.",
        x: 56,
        y: 18,
        height: 4,
        citations: [cite("unsloth", "unsloth/models/llama.py", "Llama forward-path patching")],
      },
      {
        id: "tokenizer",
        label: "Tokenizer pipeline",
        district: "Preparation",
        kind: "service",
        summary: "Loads, repairs, and validates the tokenizer used to turn text into token IDs.",
        responsibility:
          "Keep tokenizer vocabulary and chat templates compatible with the model, including special-token repairs and trainer integration.",
        x: 30,
        y: 47,
        height: 2,
        citations: [cite("unsloth", "unsloth/tokenizer_utils.py", "Tokenizer loading and repair")],
      },
      {
        id: "kernels",
        label: "Fused GPU kernels",
        district: "Accelerated compute",
        kind: "compute",
        summary: "Custom autograd operations fuse common LoRA projections and activations.",
        responsibility:
          "Execute optimized forward and backward tensor math so fewer intermediate tensors and kernel launches are needed.",
        x: 76,
        y: 43,
        height: 3,
        citations: [cite("unsloth", "unsloth/kernels/fast_lora.py", "Fused LoRA autograd kernels")],
      },
      {
        id: "trainer",
        label: "Training loop",
        district: "Accelerated compute",
        kind: "compute",
        summary: "An SFTTrainer-compatible loop prepares batches, losses, optimizers, and updates.",
        responsibility:
          "Coordinate packed token batches and repeated forward/backward steps while applying Unsloth's trainer compatibility patches.",
        x: 53,
        y: 70,
        height: 4,
        citations: [cite("unsloth", "unsloth/trainer.py", "UnslothTrainer and TRL patches")],
      },
      {
        id: "exporter",
        label: "Model exporter",
        district: "Artifacts",
        kind: "storage",
        summary: "Writes adapters, merged weights, quantized formats, tokenizers, and model cards.",
        responsibility:
          "Convert live model state into local Hugging Face or GGUF artifacts without losing tokenizer and configuration metadata.",
        x: 75,
        y: 78,
        height: 2,
        citations: [cite("unsloth", "unsloth/save.py", "Merged, GGUF, and adapter save paths")],
      },
      {
        id: "hub",
        label: "Model hub",
        district: "Artifacts",
        kind: "external",
        summary: "The remote destination for versioned model files and metadata.",
        responsibility:
          "Receive uploaded weights, tokenizer assets, configuration, and model-card information for later download and inference.",
        x: 90,
        y: 57,
        height: 2,
        citations: [cite("unsloth", "unsloth/save.py", "Hugging Face push-to-hub integration")],
      },
    ],
    edges: [
      {
        id: "api-load",
        from: "api",
        to: "loader",
        kind: "control",
        label: "Request a model",
        payload: "model ID, revision, sequence length, dtype, quantization flags",
        description:
          "FastLanguageModel.from_pretrained forwards the learner's loading choices to the central family dispatcher.",
        citations: [cite("unsloth", "unsloth/models/loader.py", "Language-model loading entry point")],
      },
      {
        id: "load-patch",
        from: "loader",
        to: "patcher",
        kind: "control",
        label: "Select architecture",
        payload: "AutoConfig, model type, loading options",
        description:
          "Configuration inspection selects FastLlamaModel or another compatible patcher before the checkpoint is materialized.",
        citations: [cite("unsloth", "unsloth/models/loader.py", "Architecture dispatch table")],
      },
      {
        id: "load-tokenizer",
        from: "loader",
        to: "tokenizer",
        kind: "data",
        label: "Load text vocabulary",
        payload: "tokenizer files, special-token map, chat template",
        description:
          "The loader obtains a matching tokenizer and the tokenizer utilities repair common model/tokenizer mismatches.",
        citations: [cite("unsloth", "unsloth/tokenizer_utils.py", "AutoTokenizer compatibility path")],
      },
      {
        id: "patch-kernels",
        from: "patcher",
        to: "kernels",
        kind: "control",
        label: "Install fast operations",
        payload: "patched forward functions and LoRA projection parameters",
        description:
          "Patched model layers route eligible projection and activation work through optimized autograd functions.",
        citations: [cite("unsloth", "unsloth/models/llama.py", "Fast attention and decoder forwards")],
      },
      {
        id: "tokens-trainer",
        from: "tokenizer",
        to: "trainer",
        kind: "data",
        label: "Build training batches",
        payload: "input_ids, attention masks, labels, packed examples",
        description:
          "Text examples become tensors the trainer can batch, pad, pack, and feed to the model.",
        citations: [cite("unsloth", "unsloth/trainer.py", "SFT packing and tokenizer handling")],
      },
      {
        id: "model-trainer",
        from: "patcher",
        to: "trainer",
        kind: "state",
        label: "Hand off trainable model",
        payload: "patched model, PEFT adapters, training configuration",
        description:
          "The trainer owns a patched model whose small adapter parameters can be updated while base weights remain frozen or quantized.",
        citations: [cite("unsloth", "unsloth/models/llama.py", "PEFT model preparation")],
      },
      {
        id: "trainer-kernels",
        from: "trainer",
        to: "kernels",
        kind: "data",
        label: "Run forward and backward",
        payload: "activation tensors, gradients, LoRA A/B weights",
        description:
          "Each training step sends tensor work through fused forward and backward functions and receives gradients for the adapters.",
        citations: [cite("unsloth", "unsloth/kernels/fast_lora.py", "LoRA forward/backward autograd functions")],
      },
      {
        id: "trainer-export",
        from: "trainer",
        to: "exporter",
        kind: "state",
        label: "Freeze a checkpoint",
        payload: "trained adapter tensors, base weights, tokenizer, config",
        description:
          "After training, save helpers collect model state and choose adapter-only, merged, quantized, or GGUF output.",
        citations: [cite("unsloth", "unsloth/save.py", "Checkpoint serialization choices")],
      },
      {
        id: "export-hub",
        from: "exporter",
        to: "hub",
        kind: "data",
        label: "Publish artifacts",
        payload: "weight shards, tokenizer files, config.json, model card",
        description:
          "Push helpers upload the completed artifact set to a named Hub repository.",
        citations: [cite("unsloth", "unsloth/save.py", "Hub upload implementation")],
      },
    ],
    journeys: [
      {
        id: "fine-tune",
        label: "Fine-tune a language model",
        summary:
          "Follow a model ID and text examples into a patched model, token batches, and fused training operations.",
        edgeIds: [
          "api-load",
          "load-patch",
          "load-tokenizer",
          "patch-kernels",
          "tokens-trainer",
          "model-trainer",
          "trainer-kernels",
        ],
      },
      {
        id: "publish",
        label: "Publish the trained result",
        summary:
          "Turn the trainer's in-memory state into a reproducible local artifact and upload it for reuse.",
        edgeIds: ["trainer-export", "export-hub"],
      },
    ],
    glossary: [
      {
        term: "Tokenizer",
        definition: "A reversible-ish mapping that turns text into integer token IDs a model can process.",
      },
      {
        term: "LoRA",
        definition: "Low-Rank Adaptation: small trainable matrices added to selected layers so the full model need not be retrained.",
      },
      {
        term: "PEFT",
        definition: "Parameter-Efficient Fine-Tuning, the broader family of techniques that update only a small subset of parameters.",
      },
      {
        term: "Quantization",
        definition: "Storing or computing model values at lower precision, such as 4-bit, to reduce memory and often increase speed.",
      },
      {
        term: "Autograd",
        definition: "PyTorch's system for recording tensor operations and computing gradients during backward propagation.",
      },
      {
        term: "Fused kernel",
        definition: "A GPU routine that combines several tensor operations to avoid extra memory traffic and launch overhead.",
      },
      {
        term: "Checkpoint",
        definition: "A saved snapshot of model parameters and the metadata needed to restore or distribute them.",
      },
      {
        term: "GGUF",
        definition: "A portable model file format commonly used by llama.cpp-style local inference runtimes.",
      },
    ],
    learningPath: [
      {
        title: "Trace loading first",
        description:
          "Read models/loader.py from FastLanguageModel.from_pretrained until it selects an architecture-specific patcher.",
      },
      {
        title: "Compare one patched layer",
        description:
          "Match the assignments in models/llama.py to the fused forward/backward implementation in kernels/fast_lora.py.",
      },
      {
        title: "Complete the artifact lifecycle",
        description:
          "Follow one save_pretrained_merged or push_to_hub path and list every file needed to reload the result.",
      },
    ],
  },
  {
    slug: "linux",
    title: "Linux kernel",
    subtitle: "Two kernel journeys: reading a file from storage and sending bytes over a network device.",
    orientation:
      "The system-call gate sits at the upper left. The storage path runs across the center to NVMe; the networking path drops toward the socket and device stack. Return-data arrows show bytes traveling back toward user space.",
    snapshot: {
      branch: "master",
      commit: "3eb4077",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "syscall",
        label: "System-call gate",
        district: "Kernel boundary",
        kind: "entry",
        summary: "The architecture-specific transition from user mode into kernel work.",
        responsibility:
          "Decode the system-call number and arguments, enter the generic kernel handler, then prepare a safe return to user mode.",
        x: 10,
        y: 17,
        height: 3,
        citations: [cite("linux", "arch/x86/entry/common.c", "x86 syscall entry and exit")],
      },
      {
        id: "vfs",
        label: "Virtual filesystem",
        district: "Filesystem",
        kind: "service",
        summary: "A common file API above concrete filesystems and device types.",
        responsibility:
          "Validate file descriptors and ranges, then route read/write requests through the selected file_operations implementation.",
        x: 30,
        y: 20,
        height: 3,
        citations: [cite("linux", "fs/read_write.c", "VFS read and write paths")],
      },
      {
        id: "ext4",
        label: "ext4 filesystem",
        district: "Filesystem",
        kind: "storage",
        summary: "A concrete filesystem that maps file offsets to extents and pages.",
        responsibility:
          "Implement ext4 file operations and choose buffered or direct I/O while preserving inode and journaling rules.",
        x: 50,
        y: 22,
        height: 2,
        citations: [cite("linux", "fs/ext4/file.c", "ext4 file operations")],
      },
      {
        id: "page-cache",
        label: "Page cache",
        district: "Memory and I/O",
        kind: "storage",
        summary: "Memory-backed cached file pages that can satisfy reads without touching a device.",
        responsibility:
          "Look up file folios, coordinate readahead, wait for missing data, and copy available bytes into the caller's iterator.",
        x: 62,
        y: 47,
        height: 2,
        citations: [cite("linux", "mm/filemap.c", "Generic file-page cache reads")],
      },
      {
        id: "block",
        label: "Block multi-queue",
        district: "Memory and I/O",
        kind: "runtime",
        summary: "The scalable block layer that turns bios into queued hardware requests.",
        responsibility:
          "Allocate, merge, schedule, and dispatch block requests through per-CPU and hardware submission queues.",
        x: 76,
        y: 25,
        height: 4,
        citations: [cite("linux", "block/blk-mq.c", "blk-mq request dispatch")],
      },
      {
        id: "nvme",
        label: "NVMe driver",
        district: "Hardware edge",
        kind: "external",
        summary: "The PCI driver that submits storage commands to an NVMe controller.",
        responsibility:
          "Map request data for DMA, fill an NVMe command, ring device queues, and complete the block request after an interrupt or poll.",
        x: 91,
        y: 47,
        height: 3,
        citations: [cite("linux", "drivers/nvme/host/pci.c", "NVMe PCI queue implementation")],
      },
      {
        id: "socket",
        label: "Socket and TCP",
        district: "Networking",
        kind: "service",
        summary: "The socket boundary plus TCP protocol machinery for reliable byte streams.",
        responsibility:
          "Translate socket calls into protocol operations and let TCP segment, sequence, acknowledge, retransmit, and receive bytes.",
        x: 31,
        y: 68,
        height: 3,
        citations: [
          cite("linux", "net/socket.c", "Socket system-call layer"),
          cite("linux", "net/ipv4/tcp.c", "TCP protocol operations"),
        ],
      },
      {
        id: "net-device",
        label: "Network device core",
        district: "Hardware edge",
        kind: "external",
        summary: "The shared path between protocol packets and a concrete network driver.",
        responsibility:
          "Queue outbound sk_buffs to a device and deliver received packets back into the protocol stack while applying queueing and polling rules.",
        x: 72,
        y: 76,
        height: 3,
        citations: [cite("linux", "net/core/dev.c", "Network transmit and receive core")],
      },
    ],
    edges: [
      {
        id: "syscall-vfs",
        from: "syscall",
        to: "vfs",
        kind: "control",
        label: "Enter read",
        payload: "file descriptor, user buffer, byte count, offset",
        description:
          "After syscall dispatch, the read implementation resolves a file descriptor and enters the generic VFS read path.",
        citations: [cite("linux", "fs/read_write.c", "ksys_read and vfs_read")],
      },
      {
        id: "vfs-ext4",
        from: "vfs",
        to: "ext4",
        kind: "control",
        label: "Call file operations",
        payload: "struct file, kiocb, iov_iter",
        description:
          "VFS dispatches through the opened file's operations table; an ext4 inode selects ext4's read iterator.",
        citations: [cite("linux", "fs/ext4/file.c", "ext4_file_operations dispatch")],
      },
      {
        id: "ext4-cache",
        from: "ext4",
        to: "page-cache",
        kind: "data",
        label: "Resolve cached file data",
        payload: "mapping, file position, requested byte range",
        description:
          "Buffered reads use the generic file cache, where file offsets identify cached or missing folios.",
        citations: [cite("linux", "mm/filemap.c", "filemap read iterator")],
      },
      {
        id: "cache-block",
        from: "page-cache",
        to: "block",
        kind: "control",
        label: "Fill a cache miss",
        payload: "bio with disk sectors and memory pages",
        description:
          "When requested pages are not uptodate, filesystem read-ahead and I/O eventually submit block work for those pages.",
        citations: [cite("linux", "block/blk-mq.c", "Block request allocation and submission")],
      },
      {
        id: "block-nvme",
        from: "block",
        to: "nvme",
        kind: "data",
        label: "Submit device command",
        payload: "request tag, NVMe command, DMA-mapped segments",
        description:
          "blk-mq hands a queued request to the NVMe driver, which maps its payload and submits it to a controller queue.",
        citations: [cite("linux", "drivers/nvme/host/pci.c", "NVMe request queueing")],
      },
      {
        id: "cache-vfs",
        from: "page-cache",
        to: "vfs",
        kind: "data",
        label: "Return file bytes",
        payload: "copied bytes, updated position, result count",
        description:
          "Cached folios are copied into the user's iterator and the completed byte count unwinds through VFS.",
        citations: [cite("linux", "mm/filemap.c", "Copy cached folios to the read iterator")],
      },
      {
        id: "syscall-socket",
        from: "syscall",
        to: "socket",
        kind: "control",
        label: "Enter send or receive",
        payload: "socket descriptor, msghdr, flags, byte buffers",
        description:
          "Socket syscalls import user message metadata and delegate to the selected protocol's send or receive operation.",
        citations: [cite("linux", "net/socket.c", "Socket sendmsg/recvmsg handling")],
      },
      {
        id: "socket-device",
        from: "socket",
        to: "net-device",
        kind: "data",
        label: "Transmit packets",
        payload: "sk_buff packets with TCP and IP headers",
        description:
          "TCP turns stream bytes into packets that reach the device transmit queue as socket buffers.",
        citations: [cite("linux", "net/core/dev.c", "dev_queue_xmit packet path")],
      },
      {
        id: "device-socket",
        from: "net-device",
        to: "socket",
        kind: "data",
        label: "Deliver received packets",
        payload: "received sk_buff packets and protocol metadata",
        description:
          "The receive core feeds device packets into upper protocol handlers, where TCP can reassemble bytes for a waiting socket.",
        citations: [cite("linux", "net/core/dev.c", "Network receive processing")],
      },
    ],
    journeys: [
      {
        id: "file-read",
        label: "Read a file",
        summary:
          "Trace a read syscall through VFS and ext4; a cache miss reaches NVMe, while returned bytes travel back through the page cache.",
        edgeIds: [
          "syscall-vfs",
          "vfs-ext4",
          "ext4-cache",
          "cache-block",
          "block-nvme",
          "cache-vfs",
        ],
      },
      {
        id: "tcp-io",
        label: "Send and receive TCP bytes",
        summary:
          "Follow a socket call into TCP and the network-device layer, then see received packets return to the socket.",
        edgeIds: ["syscall-socket", "socket-device", "device-socket"],
      },
    ],
    glossary: [
      {
        term: "System call",
        definition: "A controlled transition that lets a user-space program request privileged kernel work.",
      },
      {
        term: "VFS",
        definition: "The Virtual Filesystem: a common interface that hides differences between ext4, tmpfs, network filesystems, and more.",
      },
      {
        term: "Page cache",
        definition: "RAM used to retain file contents so later reads may avoid slower storage I/O.",
      },
      {
        term: "folio",
        definition: "A Linux memory-management unit representing one or more physically contiguous pages managed together.",
      },
      {
        term: "bio",
        definition: "A block I/O description that carries target sectors and memory segments through the block layer.",
      },
      {
        term: "blk-mq",
        definition: "Linux's multi-queue block subsystem, designed to feed modern storage devices from many CPUs efficiently.",
      },
      {
        term: "sk_buff",
        definition: "The kernel's packet object, containing network data plus protocol and routing metadata.",
      },
      {
        term: "DMA",
        definition: "Direct Memory Access, which lets a device move bytes to or from RAM without the CPU copying each byte.",
      },
    ],
    learningPath: [
      {
        title: "Begin at a syscall boundary",
        description:
          "Compare arch/x86/entry/common.c with fs/read_write.c to separate CPU entry mechanics from generic kernel policy.",
      },
      {
        title: "Follow one cache miss",
        description:
          "Trace the structs passed from filemap code toward blk-mq and note where a file offset becomes storage sectors.",
      },
      {
        title: "Contrast files with sockets",
        description:
          "Read net/socket.c and net/core/dev.c and identify the equivalent boundary, buffering, and driver handoff concepts.",
      },
    ],
  },
  {
    slug: "rust",
    title: "Rust compiler",
    subtitle: "How rustc turns source text into checked MIR, optimized machine code, and a linked program.",
    orientation:
      "Read the compiler city from upper left to lower right. Source becomes increasingly semantic through parsing, HIR, types, and MIR before the backend emits and links native code.",
    snapshot: {
      branch: "main",
      commit: "67854e5",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "driver",
        label: "rustc driver",
        district: "Compiler entrance",
        kind: "entry",
        summary: "The top-level coordinator for one compiler invocation.",
        responsibility:
          "Parse command-line options, create the compiler session, install callbacks, and drive the query-based compilation pipeline.",
        x: 10,
        y: 15,
        height: 3,
        citations: [cite("rust", "compiler/rustc_driver_impl/src/lib.rs", "Compiler driver orchestration")],
      },
      {
        id: "parser",
        label: "Parser",
        district: "Front end",
        kind: "service",
        summary: "Turns Rust tokens into an abstract syntax tree (AST).",
        responsibility:
          "Consume token streams, report syntax errors, and construct syntax nodes while retaining spans for diagnostics.",
        x: 28,
        y: 19,
        height: 2,
        citations: [cite("rust", "compiler/rustc_parse/src/lib.rs", "Parser crate entry points")],
      },
      {
        id: "hir",
        label: "HIR lowering",
        district: "Front end",
        kind: "compute",
        summary: "Converts surface syntax into rustc's simpler High-level Intermediate Representation.",
        responsibility:
          "Desugar convenient syntax, assign stable compiler IDs, and produce HIR nodes used by semantic analyses.",
        x: 47,
        y: 16,
        height: 3,
        citations: [cite("rust", "compiler/rustc_ast_lowering/src/lib.rs", "AST-to-HIR lowering")],
      },
      {
        id: "typeck",
        label: "Type checker",
        district: "Semantic checks",
        kind: "compute",
        summary: "Infers expression types and verifies that operations and method calls are valid.",
        responsibility:
          "Walk HIR bodies, create type variables and obligations, resolve methods, and record type-dependent results.",
        x: 67,
        y: 26,
        height: 4,
        citations: [cite("rust", "compiler/rustc_hir_typeck/src/lib.rs", "HIR body type checking")],
      },
      {
        id: "mir-build",
        label: "MIR builder",
        district: "Semantic checks",
        kind: "compute",
        summary: "Lowers typed function bodies into control-flow graphs over places and operations.",
        responsibility:
          "Construct basic blocks, statements, terminators, temporaries, and explicit drops in Mid-level Intermediate Representation.",
        x: 42,
        y: 49,
        height: 3,
        citations: [cite("rust", "compiler/rustc_mir_build/src/lib.rs", "MIR construction queries")],
      },
      {
        id: "borrowck",
        label: "Borrow checker",
        district: "Semantic checks",
        kind: "runtime",
        summary: "Uses MIR to reject invalid aliasing, moves, and lifetimes.",
        responsibility:
          "Compute move paths and region constraints, then ensure references never outlive data or conflict with active access.",
        x: 68,
        y: 53,
        height: 4,
        citations: [cite("rust", "compiler/rustc_borrowck/src/lib.rs", "MIR borrow-checking query")],
      },
      {
        id: "mir-opt",
        label: "MIR optimizer",
        district: "Back end",
        kind: "tooling",
        summary: "Transforms verified MIR into a cleaner form for code generation.",
        responsibility:
          "Run ordered MIR passes such as simplification, inlining, constant propagation, and drop-related cleanup.",
        x: 50,
        y: 77,
        height: 3,
        citations: [cite("rust", "compiler/rustc_mir_transform/src/lib.rs", "MIR pass pipeline")],
      },
      {
        id: "codegen",
        label: "LLVM and linker",
        district: "Back end",
        kind: "external",
        summary: "Produces object code with LLVM and combines objects and libraries into the final binary.",
        responsibility:
          "Translate optimized MIR through the LLVM backend, emit codegen units, and invoke the platform linker with native dependencies.",
        x: 84,
        y: 76,
        height: 4,
        citations: [
          cite("rust", "compiler/rustc_codegen_llvm/src/lib.rs", "LLVM code-generation backend"),
          cite("rust", "compiler/rustc_codegen_ssa/src/back/link.rs", "Native linker invocation"),
        ],
      },
    ],
    edges: [
      {
        id: "driver-parser",
        from: "driver",
        to: "parser",
        kind: "control",
        label: "Parse the crate",
        payload: "source files, edition, cfg options, diagnostic handler",
        description:
          "The driver starts compilation and requests an AST for the input crate through the parser interfaces.",
        citations: [cite("rust", "compiler/rustc_driver_impl/src/lib.rs", "Driver compilation phases")],
      },
      {
        id: "parser-hir",
        from: "parser",
        to: "hir",
        kind: "data",
        label: "Lower syntax",
        payload: "AST items, expressions, attributes, source spans",
        description:
          "Parsed syntax is lowered and desugared into HIR, which removes surface-level variation for later passes.",
        citations: [cite("rust", "compiler/rustc_ast_lowering/src/lib.rs", "Crate and item lowering")],
      },
      {
        id: "hir-typeck",
        from: "hir",
        to: "typeck",
        kind: "data",
        label: "Check semantic bodies",
        payload: "HIR body IDs, definitions, generics, trait bounds",
        description:
          "The type checker queries lowered bodies and records inferred types, adjustments, and obligations.",
        citations: [cite("rust", "compiler/rustc_hir_typeck/src/lib.rs", "Type-check provider and body checks")],
      },
      {
        id: "typeck-mir",
        from: "typeck",
        to: "mir-build",
        kind: "state",
        label: "Build typed control flow",
        payload: "type-check results, inferred adjustments, function body",
        description:
          "MIR construction uses type-checking results to make implicit operations and control flow explicit.",
        citations: [cite("rust", "compiler/rustc_mir_build/src/lib.rs", "Typed MIR build providers")],
      },
      {
        id: "mir-borrowck",
        from: "mir-build",
        to: "borrowck",
        kind: "data",
        label: "Validate ownership",
        payload: "MIR basic blocks, places, moves, borrows, source scopes",
        description:
          "Borrow checking consumes MIR because its explicit control flow makes moves and reference lifetimes analyzable.",
        citations: [cite("rust", "compiler/rustc_borrowck/src/lib.rs", "Borrow-check input and result")],
      },
      {
        id: "borrowck-opt",
        from: "borrowck",
        to: "mir-opt",
        kind: "control",
        label: "Release verified MIR",
        payload: "borrow-checked MIR plus promoted constants",
        description:
          "Only semantically valid bodies continue into the ordered MIR optimization and cleanup pipeline.",
        citations: [cite("rust", "compiler/rustc_mir_transform/src/lib.rs", "Optimized MIR query pipeline")],
      },
      {
        id: "opt-codegen",
        from: "mir-opt",
        to: "codegen",
        kind: "data",
        label: "Emit and link native code",
        payload: "optimized MIR, monomorphized instances, object files, linker arguments",
        description:
          "The LLVM backend lowers each codegen unit, then rustc's linker layer combines the emitted objects into the requested artifact.",
        citations: [
          cite("rust", "compiler/rustc_codegen_llvm/src/lib.rs", "LLVM backend implementation"),
          cite("rust", "compiler/rustc_codegen_ssa/src/back/link.rs", "Link command construction"),
        ],
      },
    ],
    journeys: [
      {
        id: "understand-source",
        label: "Understand a Rust crate",
        summary:
          "Watch raw syntax become stable HIR and acquire inferred types before lower-level execution details appear.",
        edgeIds: ["driver-parser", "parser-hir", "hir-typeck"],
      },
      {
        id: "prove-and-emit",
        label: "Prove safety and emit a binary",
        summary:
          "Turn typed bodies into MIR, enforce ownership, optimize the verified program, and hand native objects to the linker.",
        edgeIds: ["typeck-mir", "mir-borrowck", "borrowck-opt", "opt-codegen"],
      },
    ],
    glossary: [
      {
        term: "AST",
        definition: "Abstract Syntax Tree: a tree that closely represents the grammar and written structure of source code.",
      },
      {
        term: "HIR",
        definition: "High-level Intermediate Representation: desugared Rust syntax arranged for semantic analysis.",
      },
      {
        term: "MIR",
        definition: "Mid-level Intermediate Representation: a control-flow graph with explicit temporaries, moves, and drops.",
      },
      {
        term: "Borrow checking",
        definition: "Static analysis that enforces Rust's ownership, aliasing, and reference-lifetime rules.",
      },
      {
        term: "Query system",
        definition: "rustc's demand-driven engine for computing and caching facts such as a body's type or optimized MIR.",
      },
      {
        term: "Monomorphization",
        definition: "Creating concrete machine-code versions of generic functions for the types actually used.",
      },
      {
        term: "Codegen unit",
        definition: "A partition of a crate compiled independently so optimization and object emission can run in parallel.",
      },
      {
        term: "LLVM",
        definition: "The compiler backend rustc commonly uses for low-level optimization and machine-code generation.",
      },
    ],
    learningPath: [
      {
        title: "Track one expression",
        description:
          "Pick a small Rust expression and identify how its AST shape is simplified in HIR before type checking.",
      },
      {
        title: "Draw one MIR body",
        description:
          "Compile with MIR output enabled, then label its basic blocks, terminators, moves, and drops using rustc_mir_build as a guide.",
      },
      {
        title: "Connect safety to codegen",
        description:
          "Trace why borrow checking happens on MIR before optimization, then follow the verified body toward LLVM and the linker.",
      },
    ],
  },
  {
    slug: "go",
    title: "Go toolchain and runtime",
    subtitle: "A Go program's path from `go build` through native linking, then through goroutines, GC, and network polling at runtime.",
    orientation:
      "The upper row is the build-time toolchain. Its executable enters the runtime district below, where the scheduler coordinates goroutines with garbage collection and non-blocking network I/O.",
    snapshot: {
      branch: "master",
      commit: "72aa6db",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "go-command",
        label: "go command",
        district: "Toolchain",
        kind: "entry",
        summary: "The CLI front door for build, test, run, install, and module-aware commands.",
        responsibility:
          "Parse global flags, select a subcommand, initialize build context, and report command diagnostics and exit status.",
        x: 9,
        y: 16,
        height: 2,
        citations: [cite("go", "src/cmd/go/main.go", "go command entry point")],
      },
      {
        id: "builder",
        label: "Build coordinator",
        district: "Toolchain",
        kind: "tooling",
        summary: "Plans package actions and invokes compiler and linker tools in dependency order.",
        responsibility:
          "Turn packages and build flags into an action graph, reuse cached outputs, and execute compilation and linking work.",
        x: 29,
        y: 18,
        height: 3,
        citations: [cite("go", "src/cmd/go/internal/work/build.go", "Package build action graph")],
      },
      {
        id: "compiler",
        label: "Compiler front end",
        district: "Toolchain",
        kind: "compute",
        summary: "Parses and type-checks a package before lowering it for optimization.",
        responsibility:
          "Initialize a compilation, load syntax, type-check declarations and bodies, and prepare the package for backend generation.",
        x: 49,
        y: 15,
        height: 3,
        citations: [
          cite("go", "src/cmd/compile/internal/gc/main.go", "Compiler phase coordination"),
          cite("go", "src/cmd/compile/internal/noder/noder.go", "Syntax and type-check front end"),
        ],
      },
      {
        id: "ssa",
        label: "SSA backend",
        district: "Toolchain",
        kind: "compute",
        summary: "Optimizes typed functions in Static Single Assignment form and emits machine instructions.",
        responsibility:
          "Lower functions into SSA, run architecture-aware optimization passes, allocate registers, and emit object code.",
        x: 69,
        y: 19,
        height: 4,
        citations: [cite("go", "src/cmd/compile/internal/ssagen/ssa.go", "SSA generation and code emission")],
      },
      {
        id: "linker",
        label: "Go linker",
        district: "Toolchain",
        kind: "storage",
        summary: "Combines package objects, runtime code, symbols, and relocations into an executable.",
        responsibility:
          "Load object files, resolve reachable symbols, lay out executable sections, apply relocations, and write the final binary.",
        x: 89,
        y: 17,
        height: 3,
        citations: [cite("go", "src/cmd/link/internal/ld/main.go", "Linker main pipeline")],
      },
      {
        id: "scheduler",
        label: "Goroutine scheduler",
        district: "Runtime",
        kind: "runtime",
        summary: "Multiplexes many goroutines over a smaller set of operating-system threads.",
        responsibility:
          "Manage runnable queues, processors, threads, parking, wakeups, stack growth, and transitions around blocking work.",
        x: 34,
        y: 61,
        height: 4,
        citations: [cite("go", "src/runtime/proc.go", "G-M-P scheduler implementation")],
      },
      {
        id: "gc",
        label: "Garbage collector",
        district: "Runtime",
        kind: "service",
        summary: "Reclaims unreachable heap objects with a concurrent mark-and-sweep collector.",
        responsibility:
          "Start GC cycles, coordinate mark workers and write barriers, sweep spans, and pace CPU work against allocation.",
        x: 58,
        y: 78,
        height: 3,
        citations: [cite("go", "src/runtime/mgc.go", "Concurrent garbage collection")],
      },
      {
        id: "netpoll",
        label: "Network poller",
        district: "Runtime",
        kind: "external",
        summary: "Bridges non-blocking operating-system I/O readiness back to waiting goroutines.",
        responsibility:
          "Register descriptors, wait in the platform poller, translate readiness into runnable goroutines, and enforce deadlines.",
        x: 80,
        y: 61,
        height: 3,
        citations: [
          cite("go", "src/runtime/netpoll.go", "Portable runtime network-poller contract"),
          cite("go", "src/runtime/netpoll_epoll.go", "Linux epoll backend")],
      },
    ],
    edges: [
      {
        id: "command-build",
        from: "go-command",
        to: "builder",
        kind: "control",
        label: "Select build work",
        payload: "subcommand, package patterns, build flags, environment",
        description:
          "The command front end dispatches `go build` or `go run` into the work package's build planning logic.",
        citations: [cite("go", "src/cmd/go/main.go", "Command registration and dispatch")],
      },
      {
        id: "build-compiler",
        from: "builder",
        to: "compiler",
        kind: "control",
        label: "Compile each package",
        payload: "Go source list, import configuration, compiler flags",
        description:
          "The action graph invokes the compiler for stale packages after their imported dependencies are available.",
        citations: [cite("go", "src/cmd/go/internal/work/build.go", "Compile action execution")],
      },
      {
        id: "compiler-ssa",
        from: "compiler",
        to: "ssa",
        kind: "data",
        label: "Lower typed functions",
        payload: "typed IR functions, declarations, escape information",
        description:
          "After syntax and type processing, function bodies enter SSA construction and target-specific code generation.",
        citations: [cite("go", "src/cmd/compile/internal/ssagen/ssa.go", "buildssa and compile pipeline")],
      },
      {
        id: "ssa-linker",
        from: "ssa",
        to: "linker",
        kind: "data",
        label: "Hand off package objects",
        payload: "object files, symbols, relocations, export data",
        description:
          "Compiled package archives carry machine code and metadata that the linker combines with dependencies and runtime objects.",
        citations: [cite("go", "src/cmd/link/internal/ld/main.go", "Object loading and link phases")],
      },
      {
        id: "link-runtime",
        from: "linker",
        to: "scheduler",
        kind: "state",
        label: "Start the executable runtime",
        payload: "linked runtime symbols, program entry, initialized data",
        description:
          "Every linked Go executable includes runtime startup that initializes scheduling before the program's main goroutine runs.",
        citations: [cite("go", "src/runtime/proc.go", "Runtime main and scheduler initialization")],
      },
      {
        id: "scheduler-poll",
        from: "scheduler",
        to: "netpoll",
        kind: "control",
        label: "Park on I/O",
        payload: "poll descriptor, read/write mode, deadline",
        description:
          "A goroutine waiting on non-blocking network I/O is parked while its descriptor remains registered with the poller.",
        citations: [cite("go", "src/runtime/netpoll.go", "netpollblock goroutine parking")],
      },
      {
        id: "poll-scheduler",
        from: "netpoll",
        to: "scheduler",
        kind: "control",
        label: "Wake ready goroutines",
        payload: "readiness events and goroutine list",
        description:
          "The poller converts ready file descriptors into runnable goroutines and injects them back into scheduler work.",
        citations: [cite("go", "src/runtime/netpoll.go", "Ready-list delivery to scheduler")],
      },
      {
        id: "scheduler-gc",
        from: "scheduler",
        to: "gc",
        kind: "control",
        label: "Schedule collection work",
        payload: "GC phase, mark-worker mode, pacing targets",
        description:
          "The runtime arranges dedicated or fractional mark workers on scheduler processors during a concurrent collection cycle.",
        citations: [cite("go", "src/runtime/mgc.go", "Mark-worker scheduling")],
      },
      {
        id: "gc-scheduler",
        from: "gc",
        to: "scheduler",
        kind: "state",
        label: "Resume with reclaimed heap",
        payload: "marked object graph, swept spans, updated heap goal",
        description:
          "Collection transitions and brief stop-the-world phases coordinate with runnable goroutines before normal scheduling resumes.",
        citations: [cite("go", "src/runtime/mgc.go", "GC phase transitions and world restart")],
      },
    ],
    journeys: [
      {
        id: "build-program",
        label: "Build a Go executable",
        summary:
          "Follow package selection into compilation, SSA optimization, object emission, and final linking with the runtime.",
        edgeIds: ["command-build", "build-compiler", "compiler-ssa", "ssa-linker", "link-runtime"],
      },
      {
        id: "serve-connection",
        label: "Wait for network I/O",
        summary:
          "See a goroutine park without blocking an OS thread, wake on readiness, and share runtime capacity with concurrent GC.",
        edgeIds: ["scheduler-poll", "poll-scheduler", "scheduler-gc", "gc-scheduler"],
      },
    ],
    glossary: [
      {
        term: "Package action graph",
        definition: "A dependency graph of compile, archive, and link steps needed to produce the requested Go target.",
      },
      {
        term: "SSA",
        definition: "Static Single Assignment, an IR where each value is defined once, making many optimizations easier.",
      },
      {
        term: "Goroutine",
        definition: "A lightweight Go execution context managed by the runtime rather than directly by the operating system.",
      },
      {
        term: "G-M-P model",
        definition: "Go scheduling terms: G is a goroutine, M an OS thread, and P the resources needed to execute Go code.",
      },
      {
        term: "netpoll",
        definition: "The runtime layer that waits for many network descriptors without dedicating a blocked thread to each one.",
      },
      {
        term: "epoll",
        definition: "Linux's scalable readiness-notification API, used by Go's Linux network-poller backend.",
      },
      {
        term: "Concurrent GC",
        definition: "A collector that performs most marking while application goroutines continue running.",
      },
      {
        term: "Write barrier",
        definition: "A small check on pointer writes that keeps the collector's view of the object graph correct during concurrent marking.",
      },
    ],
    learningPath: [
      {
        title: "Build one tiny package",
        description:
          "Run `go build -x` and match the printed compile/link commands to cmd/go/internal/work/build.go.",
      },
      {
        title: "Learn G-M-P visually",
        description:
          "Read runtime/proc.go's scheduler comments, then sketch how two Ps can run many goroutines across changing Ms.",
      },
      {
        title: "Connect I/O and GC",
        description:
          "Trace how netpoll returns ready goroutines and how concurrent mark workers compete for the same scheduler processors.",
      },
    ],
  },
  {
    slug: "cpython",
    title: "CPython",
    subtitle: "How the reference Python implementation parses a script, produces bytecode, evaluates objects, and imports more code.",
    orientation:
      "Start at the command-line gate. The source pipeline runs across the upper and middle rows into the bytecode evaluator; objects and memory sit below it, while imports loop new modules back through compilation.",
    snapshot: {
      branch: "main",
      commit: "c144799",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "cli",
        label: "Python CLI",
        district: "Process boundary",
        kind: "entry",
        summary: "The process-level entry that interprets command-line configuration and selects what to run.",
        responsibility:
          "Initialize main configuration, process `-c`, `-m`, files, or stdin, and hand execution to the appropriate runtime path.",
        x: 9,
        y: 16,
        height: 2,
        citations: [cite("cpython", "Modules/main.c", "Command-line execution driver")],
      },
      {
        id: "runner",
        label: "Source runner",
        district: "Front end",
        kind: "service",
        summary: "Connects source files or strings to parsing, compilation, and frame evaluation.",
        responsibility:
          "Read source with the requested mode, build an AST, compile it to a code object, and evaluate that object in dictionaries.",
        x: 27,
        y: 20,
        height: 3,
        citations: [cite("cpython", "Python/pythonrun.c", "PyRun source execution pipeline")],
      },
      {
        id: "parser",
        label: "PEG parser",
        district: "Front end",
        kind: "compute",
        summary: "Recognizes Python grammar and builds the abstract syntax tree.",
        responsibility:
          "Drive the generated PEG rules over tokenizer input, track errors and source locations, and return module or expression AST nodes.",
        x: 47,
        y: 16,
        height: 3,
        citations: [cite("cpython", "Parser/pegen.c", "PEG parser runtime")],
      },
      {
        id: "compiler",
        label: "Bytecode compiler",
        district: "Front end",
        kind: "tooling",
        summary: "Transforms AST statements and expressions into executable code objects.",
        responsibility:
          "Build scopes and instruction sequences, assemble bytecode and exception tables, and produce constants, names, and nested code objects.",
        x: 67,
        y: 23,
        height: 4,
        citations: [cite("cpython", "Python/compile.c", "AST-to-code-object compiler")],
      },
      {
        id: "evaluator",
        label: "Bytecode evaluator",
        district: "Interpreter core",
        kind: "runtime",
        summary: "Executes Python frames one instruction at a time, with specialization for hot operations.",
        responsibility:
          "Maintain frames and value stacks, dispatch bytecodes, call functions, handle exceptions, and return Python objects.",
        x: 52,
        y: 52,
        height: 4,
        citations: [
          cite("cpython", "Python/ceval.c", "Frame evaluation support"),
          cite("cpython", "Python/bytecodes.c", "Bytecode instruction definitions"),
        ],
      },
      {
        id: "objects",
        label: "Object protocol",
        district: "Interpreter core",
        kind: "service",
        summary: "The common representation and operations shared by every Python value.",
        responsibility:
          "Provide type-based dispatch, reference counting, identity, string representation, comparisons, and generic attribute behavior.",
        x: 76,
        y: 52,
        height: 3,
        citations: [cite("cpython", "Objects/object.c", "Base object and type protocol")],
      },
      {
        id: "memory",
        label: "Allocator and GC",
        district: "Memory",
        kind: "storage",
        summary: "Allocates object memory and reclaims reference cycles that reference counting alone cannot free.",
        responsibility:
          "Serve small-object arenas and pools, track container objects, find unreachable cycles, and release reclaimed memory.",
        x: 75,
        y: 79,
        height: 3,
        citations: [
          cite("cpython", "Objects/obmalloc.c", "Python small-object allocator"),
          cite("cpython", "Python/gc.c", "Cycle-detecting garbage collector")],
      },
      {
        id: "imports",
        label: "Import system",
        district: "Modules",
        kind: "storage",
        summary: "Resolves module names, coordinates loaders, and caches initialized modules.",
        responsibility:
          "Check sys.modules, locate a module specification, create a module, execute its code once, and manage recursive or failed imports.",
        x: 25,
        y: 72,
        height: 3,
        citations: [
          cite("cpython", "Python/import.c", "C import runtime support"),
          cite("cpython", "Lib/importlib/_bootstrap.py", "Core import state machine")],
      },
    ],
    edges: [
      {
        id: "cli-runner",
        from: "cli",
        to: "runner",
        kind: "control",
        label: "Choose input mode",
        payload: "filename or command string, flags, encoding and runtime configuration",
        description:
          "The CLI chooses a file, command, module, or stdin path and invokes the matching source-execution routine.",
        citations: [cite("cpython", "Modules/main.c", "Main input-mode dispatch")],
      },
      {
        id: "runner-parser",
        from: "runner",
        to: "parser",
        kind: "data",
        label: "Parse source",
        payload: "decoded source, grammar start rule, compiler flags",
        description:
          "PyRun asks the parser to convert source input into a location-aware AST in file, eval, or single-statement mode.",
        citations: [cite("cpython", "Python/pythonrun.c", "Parser invocation from PyRun")],
      },
      {
        id: "parser-compiler",
        from: "parser",
        to: "compiler",
        kind: "data",
        label: "Compile the AST",
        payload: "AST module, source filename, optimization level, future flags",
        description:
          "The compiler walks parsed nodes, resolves scopes, emits instructions, and assembles a code object.",
        citations: [cite("cpython", "Python/compile.c", "AST compilation entry points")],
      },
      {
        id: "compiler-evaluator",
        from: "compiler",
        to: "evaluator",
        kind: "data",
        label: "Evaluate bytecode",
        payload: "PyCodeObject, globals, locals, builtins",
        description:
          "The source runner wraps the code object in an execution frame and passes it to the interpreter for evaluation.",
        citations: [cite("cpython", "Python/pythonrun.c", "Code-object evaluation")],
      },
      {
        id: "evaluator-objects",
        from: "evaluator",
        to: "objects",
        kind: "control",
        label: "Perform Python operations",
        payload: "stack values, type slots, operands, call arguments",
        description:
          "Bytecodes implement language behavior by invoking object and type protocols for calls, attributes, arithmetic, and comparisons.",
        citations: [cite("cpython", "Python/bytecodes.c", "Object operations in bytecode handlers")],
      },
      {
        id: "objects-memory",
        from: "objects",
        to: "memory",
        kind: "state",
        label: "Allocate and retain values",
        payload: "object size, reference counts, GC tracking links",
        description:
          "New Python values request managed memory; object lifetime updates reference counts and may place containers under cycle tracking.",
        citations: [cite("cpython", "Objects/obmalloc.c", "Object-memory allocation domains")],
      },
      {
        id: "evaluator-imports",
        from: "evaluator",
        to: "imports",
        kind: "control",
        label: "Execute an import",
        payload: "module name, from-list, import level, current globals",
        description:
          "Import bytecodes hand module resolution to the import machinery instead of directly opening a source file.",
        citations: [cite("cpython", "Python/bytecodes.c", "IMPORT_NAME bytecode semantics")],
      },
      {
        id: "imports-runner",
        from: "imports",
        to: "runner",
        kind: "data",
        label: "Execute discovered module",
        payload: "module spec, loader, source or cached code, module namespace",
        description:
          "For a source module, importlib asks its loader for code and executes it inside the newly created module namespace.",
        citations: [cite("cpython", "Lib/importlib/_bootstrap.py", "Module load and exec protocol")],
      },
      {
        id: "memory-evaluator",
        from: "memory",
        to: "evaluator",
        kind: "state",
        label: "Reclaim unreachable state",
        payload: "freed objects, finalized cycles, allocator pools",
        description:
          "Reference-count decrements and periodic cycle collection reclaim objects while execution continues with remaining live values.",
        citations: [cite("cpython", "Python/gc.c", "Cycle collection and finalization")],
      },
    ],
    journeys: [
      {
        id: "run-script",
        label: "Run a Python script",
        summary:
          "Trace source from CLI selection through PEG parsing and compilation into bytecode-driven object operations and managed memory.",
        edgeIds: [
          "cli-runner",
          "runner-parser",
          "parser-compiler",
          "compiler-evaluator",
          "evaluator-objects",
          "objects-memory",
          "memory-evaluator",
        ],
      },
      {
        id: "import-module",
        label: "Import a source module",
        summary:
          "Follow an import instruction through module discovery and back into the same source execution pipeline for newly found code.",
        edgeIds: ["evaluator-imports", "imports-runner", "runner-parser", "parser-compiler", "compiler-evaluator"],
      },
    ],
    glossary: [
      {
        term: "PEG parser",
        definition: "A Parsing Expression Grammar parser chooses ordered grammar alternatives and can express Python's syntax directly.",
      },
      {
        term: "AST",
        definition: "Abstract Syntax Tree: structured nodes such as functions, calls, names, and loops derived from source text.",
      },
      {
        term: "Bytecode",
        definition: "Compact interpreter instructions stored in a code object rather than native CPU machine instructions.",
      },
      {
        term: "Frame",
        definition: "The execution record for one Python call, containing its code, instruction position, local values, and operand stack.",
      },
      {
        term: "Reference counting",
        definition: "Tracking how many owning references point to an object and usually freeing it when that count reaches zero.",
      },
      {
        term: "Cycle collector",
        definition: "A collector that finds unreachable groups whose objects reference each other and therefore never reach a zero count alone.",
      },
      {
        term: "Type slot",
        definition: "A C-level function pointer through which a Python type supplies behavior such as addition, calling, or attribute access.",
      },
      {
        term: "sys.modules",
        definition: "Python's process-wide module cache, consulted first so an initialized module normally executes only once.",
      },
    ],
    learningPath: [
      {
        title: "Watch source become bytecode",
        description:
          "Use Python's `ast` and `dis` modules on a tiny function, then match those two representations to Parser/pegen.c and Python/compile.c.",
      },
      {
        title: "Trace one instruction",
        description:
          "Choose a familiar opcode in Python/bytecodes.c and follow the object protocol calls and reference-count changes it performs.",
      },
      {
        title: "Study an import miss",
        description:
          "Follow _find_and_load in importlib/_bootstrap.py and note the cache checks, lock, module creation, execution, and cleanup order.",
      },
    ],
  },
  {
    slug: "nodejs",
    title: "Node.js",
    subtitle: "How Node boots a V8 environment, loads a main module, and carries TCP bytes through JavaScript, C++, and libuv.",
    orientation:
      "The startup path crosses the upper row from the native process into JavaScript module loading. The lower runtime loop connects JavaScript APIs to native bindings, TCP handles, and libuv readiness callbacks.",
    snapshot: {
      branch: "main",
      commit: "04a0c27",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "native-entry",
        label: "Native entry",
        district: "Startup",
        kind: "entry",
        summary: "The small executable entry that hands process arguments into Node's C++ runtime.",
        responsibility:
          "Normalize platform startup details and call Node's Start entry point with argc and argv.",
        x: 9,
        y: 16,
        height: 2,
        citations: [cite("nodejs", "src/node_main.cc", "Node executable main function")],
      },
      {
        id: "environment",
        label: "V8 environment",
        district: "Startup",
        kind: "runtime",
        summary: "The C++ owner of one JavaScript isolate, context, event loop, and Node process state.",
        responsibility:
          "Initialize V8 and libuv resources, create an Environment, expose process bindings, and coordinate startup and shutdown.",
        x: 29,
        y: 18,
        height: 4,
        citations: [
          cite("nodejs", "src/node.cc", "Node process startup"),
          cite("nodejs", "src/api/environment.cc", "Environment lifecycle API")],
      },
      {
        id: "bootstrap",
        label: "JS bootstrap",
        district: "Startup",
        kind: "service",
        summary: "Trusted internal JavaScript that constructs the process object and runtime globals.",
        responsibility:
          "Install per-process and per-context primitives, expose internal bindings safely, and prepare execution of the user's main entry point.",
        x: 49,
        y: 15,
        height: 3,
        citations: [cite("nodejs", "lib/internal/bootstrap/node.js", "Node JavaScript bootstrap")],
      },
      {
        id: "modules",
        label: "Module loaders",
        district: "JavaScript layer",
        kind: "tooling",
        summary: "Resolves and evaluates CommonJS or ECMAScript modules.",
        responsibility:
          "Choose the main-entry format, resolve specifiers and filenames, cache modules, wrap CommonJS, and link or evaluate ESM graphs.",
        x: 70,
        y: 20,
        height: 3,
        citations: [
          cite("nodejs", "lib/internal/main/run_main_module.js", "Main-module bootstrap"),
          cite("nodejs", "lib/internal/modules/cjs/loader.js", "CommonJS loader"),
          cite("nodejs", "lib/internal/modules/esm/loader.js", "ES module loader")],
      },
      {
        id: "js-api",
        label: "JavaScript APIs",
        district: "JavaScript layer",
        kind: "service",
        summary: "User-facing modules such as net and streams that express async work as JavaScript objects and callbacks.",
        responsibility:
          "Validate arguments, maintain stream state and backpressure, and translate high-level socket operations into native handle requests.",
        x: 82,
        y: 48,
        height: 3,
        citations: [
          cite("nodejs", "lib/net.js", "JavaScript TCP socket API"),
          cite("nodejs", "lib/internal/streams/readable.js", "Readable stream state machine")],
      },
      {
        id: "bindings",
        label: "Native bindings",
        district: "Native bridge",
        kind: "compute",
        summary: "The controlled bridge that makes selected C++ facilities callable from internal JavaScript.",
        responsibility:
          "Register built-in native modules, cache exports per environment, and expose internalBinding without a general FFI boundary.",
        x: 59,
        y: 48,
        height: 3,
        citations: [cite("nodejs", "src/node_binding.cc", "Built-in binding registry and loader")],
      },
      {
        id: "tcp-wrap",
        label: "TCPWrap",
        district: "Native bridge",
        kind: "compute",
        summary: "A C++ wrapper joining JavaScript socket requests to a libuv TCP handle.",
        responsibility:
          "Create, bind, listen, connect, open, and inspect uv_tcp_t handles while delivering request completion into JavaScript.",
        x: 39,
        y: 73,
        height: 3,
        citations: [cite("nodejs", "src/tcp_wrap.cc", "TCPWrap native handle")],
      },
      {
        id: "libuv",
        label: "libuv event loop",
        district: "Operating-system edge",
        kind: "external",
        summary: "The cross-platform native loop for descriptor readiness, timers, and asynchronous callbacks.",
        responsibility:
          "Manage loop iterations and TCP stream watchers, call platform polling primitives, and invoke ready-handle callbacks on the loop thread.",
        x: 16,
        y: 73,
        height: 4,
        citations: [
          cite("nodejs", "deps/uv/src/unix/core.c", "Unix libuv loop core"),
          cite("nodejs", "deps/uv/src/unix/tcp.c", "Unix TCP handle operations")],
      },
    ],
    edges: [
      {
        id: "entry-environment",
        from: "native-entry",
        to: "environment",
        kind: "control",
        label: "Start Node",
        payload: "argc, argv, process flags, platform state",
        description:
          "The executable main passes process arguments to the C++ startup path that initializes the runtime and creates an Environment.",
        citations: [cite("nodejs", "src/node_main.cc", "main-to-Start handoff")],
      },
      {
        id: "environment-bootstrap",
        from: "environment",
        to: "bootstrap",
        kind: "control",
        label: "Run trusted bootstrap",
        payload: "V8 context, process object, internal binding accessors",
        description:
          "Once a context exists, Node evaluates its internal bootstrap modules to construct the JavaScript-side runtime.",
        citations: [cite("nodejs", "src/node.cc", "Environment bootstrap execution")],
      },
      {
        id: "bootstrap-modules",
        from: "bootstrap",
        to: "modules",
        kind: "control",
        label: "Run main entry",
        payload: "entry filename or specifier, module-format decision",
        description:
          "The bootstrap selects the run-main path, which chooses ESM or CommonJS behavior for the application entry.",
        citations: [cite("nodejs", "lib/internal/main/run_main_module.js", "Main-module dispatch")],
      },
      {
        id: "modules-js",
        from: "modules",
        to: "js-api",
        kind: "data",
        label: "Evaluate application modules",
        payload: "module source, imports/exports, cached module namespace",
        description:
          "Evaluated application code imports built-in modules and creates JavaScript sockets, streams, callbacks, and other API objects.",
        citations: [cite("nodejs", "lib/internal/modules/cjs/loader.js", "Built-in and source module loading")],
      },
      {
        id: "js-bindings",
        from: "js-api",
        to: "bindings",
        kind: "control",
        label: "Call a native primitive",
        payload: "validated socket options, request wrapper, JS callback",
        description:
          "Internal JavaScript calls a registered built-in binding after the public API has normalized user input and stream state.",
        citations: [cite("nodejs", "src/node_binding.cc", "internalBinding module lookup")],
      },
      {
        id: "bindings-tcp",
        from: "bindings",
        to: "tcp-wrap",
        kind: "control",
        label: "Create TCP work",
        payload: "address, port, socket flags, connect/listen request",
        description:
          "The TCP binding constructs or operates a TCPWrap associated with the current JavaScript environment.",
        citations: [cite("nodejs", "src/tcp_wrap.cc", "TCP binding initialization and methods")],
      },
      {
        id: "tcp-libuv",
        from: "tcp-wrap",
        to: "libuv",
        kind: "data",
        label: "Submit native I/O",
        payload: "uv_tcp_t handle, buffers, address, callback request",
        description:
          "TCPWrap translates the native request into libuv TCP and stream operations registered with the event loop.",
        citations: [cite("nodejs", "deps/uv/src/unix/tcp.c", "libuv TCP implementation")],
      },
      {
        id: "libuv-tcp",
        from: "libuv",
        to: "tcp-wrap",
        kind: "control",
        label: "Report readiness or completion",
        payload: "status code, readable/writable event, completed byte count",
        description:
          "The loop observes descriptor readiness and invokes the native handle callbacks associated with completed network work.",
        citations: [cite("nodejs", "deps/uv/src/unix/stream.c", "Stream readiness and I/O callbacks")],
      },
      {
        id: "tcp-js",
        from: "tcp-wrap",
        to: "js-api",
        kind: "data",
        label: "Deliver bytes and callbacks",
        payload: "Buffer chunks, errors, connection and completion events",
        description:
          "Native callbacks re-enter JavaScript, where sockets feed readable streams and writes release backpressure state.",
        citations: [cite("nodejs", "lib/internal/streams/readable.js", "Readable stream chunk delivery")],
      },
    ],
    journeys: [
      {
        id: "launch-app",
        label: "Launch the main module",
        summary:
          "Follow the native process into V8 and trusted bootstrap code, then see how Node chooses and evaluates the application's module graph.",
        edgeIds: ["entry-environment", "environment-bootstrap", "bootstrap-modules", "modules-js"],
      },
      {
        id: "tcp-roundtrip",
        label: "Complete asynchronous TCP I/O",
        summary:
          "Trace a JavaScript socket request down through bindings and libuv, then follow readiness, bytes, and callbacks back up.",
        edgeIds: ["js-bindings", "bindings-tcp", "tcp-libuv", "libuv-tcp", "tcp-js"],
      },
    ],
    glossary: [
      {
        term: "V8 isolate",
        definition: "An independent V8 JavaScript heap and execution instance with its own garbage-collected state.",
      },
      {
        term: "Environment",
        definition: "Node's C++ object tying one V8 context to process state, libuv handles, bindings, and cleanup hooks.",
      },
      {
        term: "CommonJS",
        definition: "Node's historical module system built around require(), module.exports, filename resolution, and a module cache.",
      },
      {
        term: "ESM",
        definition: "The ECMAScript module system based on import/export syntax, URL-like specifiers, linking, and asynchronous evaluation.",
      },
      {
        term: "Native binding",
        definition: "A built-in C++ module exposed to trusted internal JavaScript so it can reach runtime or operating-system facilities.",
      },
      {
        term: "libuv",
        definition: "Node's cross-platform C library for the event loop, asynchronous I/O, timers, processes, and threads.",
      },
      {
        term: "Backpressure",
        definition: "A signal that a consumer or destination is full, asking a producer to pause instead of buffering without limit.",
      },
      {
        term: "Event loop",
        definition: "A repeated cycle that waits for ready events and invokes their callbacks on the JavaScript thread.",
      },
    ],
    learningPath: [
      {
        title: "Separate boot layers",
        description:
          "Read node_main.cc, node.cc, and bootstrap/node.js in order and write down what becomes possible at each boundary.",
      },
      {
        title: "Load the same module two ways",
        description:
          "Compare the CJS and ESM loaders for resolution, caching, linking, and when user code is evaluated.",
      },
      {
        title: "Trace one TCP callback",
        description:
          "Start at net.Socket.connect, identify the TCPWrap request and uv_tcp_t operation, then follow the completion back to JavaScript.",
      },
    ],
  },
  {
    slug: "pytorch",
    title: "PyTorch",
    subtitle: "How tensors reach device operators, record gradients, compile graphs, and synchronize distributed training.",
    orientation:
      "The tensor API enters dispatch in the center. The eager/autograd route bends toward the engine and distributed reducer; the compilation route goes through Dynamo and Inductor before both paths meet device operators.",
    snapshot: {
      branch: "main",
      commit: "8f988c9",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "tensor-api",
        label: "Tensor API",
        district: "Python surface",
        kind: "entry",
        summary: "Python Tensor methods and operator objects used by application and model code.",
        responsibility:
          "Expose tensor behavior, normalize Python-level arguments, and invoke registered operators without hard-coding a device implementation.",
        x: 9,
        y: 18,
        height: 2,
        citations: [
          cite("pytorch", "torch/_tensor.py", "Python Tensor class"),
          cite("pytorch", "torch/_ops.py", "Python operator namespace")],
      },
      {
        id: "dispatcher",
        label: "c10 dispatcher",
        district: "Operator core",
        kind: "runtime",
        summary: "Chooses the next operator implementation using schema and dispatch keys.",
        responsibility:
          "Look up an operator handle, calculate keys from tensor state, and route calls through layers such as Autograd to CPU, CUDA, or another backend.",
        x: 32,
        y: 22,
        height: 4,
        citations: [cite("pytorch", "aten/src/ATen/core/dispatch/Dispatcher.cpp", "Operator registration and dispatch")],
      },
      {
        id: "device-ops",
        label: "ATen device ops",
        district: "Operator core",
        kind: "compute",
        summary: "Concrete tensor kernels that execute math on the selected CPU or accelerator backend.",
        responsibility:
          "Validate shapes and dtypes, select an implementation, and launch native CPU loops, BLAS calls, or CUDA kernels over tensor storage.",
        x: 78,
        y: 26,
        height: 4,
        citations: [
          cite("pytorch", "aten/src/ATen/native/LinearAlgebra.cpp", "Native linear-algebra operators"),
          cite("pytorch", "aten/src/ATen/native/cuda/Blas.cpp", "CUDA BLAS operators")],
      },
      {
        id: "autograd-graph",
        label: "Autograd graph",
        district: "Gradient runtime",
        kind: "service",
        summary: "Backward Function nodes and saved tensors that remember how eager outputs were produced.",
        responsibility:
          "Attach gradient functions to differentiable results, connect next edges, and retain only the forward values needed later for derivatives.",
        x: 52,
        y: 45,
        height: 3,
        citations: [cite("pytorch", "torch/csrc/autograd/function.h", "Autograd Node and Edge model")],
      },
      {
        id: "autograd-engine",
        label: "Autograd engine",
        district: "Gradient runtime",
        kind: "runtime",
        summary: "Schedules backward graph nodes once their output-gradient dependencies are ready.",
        responsibility:
          "Create a GraphTask, accumulate incoming gradients, run ready nodes on worker queues, and deliver final gradients or errors.",
        x: 75,
        y: 62,
        height: 4,
        citations: [cite("pytorch", "torch/csrc/autograd/engine.cpp", "Backward execution engine")],
      },
      {
        id: "dynamo",
        label: "TorchDynamo",
        district: "Compilation",
        kind: "tooling",
        summary: "Captures Python frame behavior into guarded FX graphs while preserving safe fallbacks.",
        responsibility:
          "Intercept eligible frames, specialize on observed conditions, create graph segments, and call a backend compiler for each guarded graph.",
        x: 28,
        y: 61,
        height: 3,
        citations: [cite("pytorch", "torch/_dynamo/eval_frame.py", "Python frame capture and optimization")],
      },
      {
        id: "inductor",
        label: "TorchInductor",
        district: "Compilation",
        kind: "compute",
        summary: "Lowers captured FX graphs into fused, device-specific compiled code.",
        responsibility:
          "Apply graph passes, select decompositions, lower operations, generate kernels and wrappers, and return a callable compiled artifact.",
        x: 49,
        y: 79,
        height: 4,
        citations: [cite("pytorch", "torch/_inductor/compile_fx.py", "FX graph compilation pipeline")],
      },
      {
        id: "distributed",
        label: "Distributed reducer",
        district: "Distributed training",
        kind: "external",
        summary: "Buckets gradients and launches collectives so model replicas converge on matching updates.",
        responsibility:
          "Receive autograd-ready hooks, copy gradients into buckets, determine reduction order, and run process-group all-reduce operations such as NCCL.",
        x: 91,
        y: 80,
        height: 3,
        citations: [
          cite("pytorch", "torch/csrc/distributed/c10d/reducer.cpp", "DistributedDataParallel gradient reducer"),
          cite("pytorch", "torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp", "NCCL collective process group")],
      },
    ],
    edges: [
      {
        id: "tensor-dispatch",
        from: "tensor-api",
        to: "dispatcher",
        kind: "control",
        label: "Invoke an operator",
        payload: "operator schema, tensor arguments, scalar and keyword arguments",
        description:
          "A Python operator resolves to a dispatcher handle instead of selecting a CPU, CUDA, autograd, or compiled implementation itself.",
        citations: [cite("pytorch", "torch/_ops.py", "OpOverload invocation")],
      },
      {
        id: "dispatch-autograd",
        from: "dispatcher",
        to: "autograd-graph",
        kind: "control",
        label: "Enter autograd wrapper",
        payload: "dispatch-key set, differentiable tensor inputs, gradient metadata",
        description:
          "When grad mode and tensor keys require it, dispatch selects an Autograd wrapper that prepares history around the lower backend call.",
        citations: [cite("pytorch", "torch/csrc/autograd/VariableTypeManual.cpp", "Autograd dispatch wrappers")],
      },
      {
        id: "autograd-device",
        from: "autograd-graph",
        to: "device-ops",
        kind: "data",
        label: "Redispatch tensor math",
        payload: "tensor storage, sizes, strides, dtype, device key",
        description:
          "The autograd layer redispatches below itself so the backend kernel performs the actual forward calculation while history is recorded.",
        citations: [cite("pytorch", "aten/src/ATen/core/dispatch/Dispatcher.cpp", "Redispatch to lower dispatch keys")],
      },
      {
        id: "autograd-engine",
        from: "autograd-graph",
        to: "autograd-engine",
        kind: "control",
        label: "Start backward",
        payload: "root gradient edges, output gradients, retain/create-graph flags",
        description:
          "Tensor.backward or grad creates an engine task rooted at selected graph edges and waits for dependency-driven execution.",
        citations: [cite("pytorch", "torch/csrc/autograd/engine.cpp", "Engine execute and GraphTask setup")],
      },
      {
        id: "tensor-dynamo",
        from: "tensor-api",
        to: "dynamo",
        kind: "control",
        label: "Capture Python execution",
        payload: "Python frame, tensor examples, guards, backend callback",
        description:
          "Under torch.compile, Dynamo evaluates frames symbolically and separates graphable tensor work from required graph breaks.",
        citations: [cite("pytorch", "torch/_dynamo/eval_frame.py", "Optimized frame callback")],
      },
      {
        id: "dynamo-inductor",
        from: "dynamo",
        to: "inductor",
        kind: "data",
        label: "Compile an FX graph",
        payload: "GraphModule, example inputs, shape and guard information",
        description:
          "Dynamo hands a captured graph segment and representative tensor inputs to the selected backend, commonly TorchInductor.",
        citations: [cite("pytorch", "torch/_inductor/compile_fx.py", "compile_fx backend entry")],
      },
      {
        id: "inductor-device",
        from: "inductor",
        to: "device-ops",
        kind: "data",
        label: "Run generated kernels",
        payload: "compiled wrapper, fused kernels, tensor buffers and launch metadata",
        description:
          "The compiled callable launches generated kernels and may retain ATen calls for operations that remain external or are intentionally not fused.",
        citations: [cite("pytorch", "torch/_inductor/compile_fx.py", "Compiled graph callable construction")],
      },
      {
        id: "engine-reducer",
        from: "autograd-engine",
        to: "distributed",
        kind: "control",
        label: "Mark a gradient ready",
        payload: "parameter index, gradient tensor, bucket state",
        description:
          "DistributedDataParallel installs autograd hooks; as gradients finish, the reducer marks parameters ready and fills their communication buckets.",
        citations: [cite("pytorch", "torch/csrc/distributed/c10d/reducer.cpp", "Reducer autograd hooks and buckets")],
      },
      {
        id: "reducer-device",
        from: "distributed",
        to: "device-ops",
        kind: "data",
        label: "All-reduce gradient buckets",
        payload: "flattened gradient tensors, NCCL communicator, stream and work handle",
        description:
          "The process group launches device collectives and later exposes completion so reduced bucket values can be copied back to parameters.",
        citations: [cite("pytorch", "torch/csrc/distributed/c10d/ProcessGroupNCCL.cpp", "NCCL all-reduce work")],
      },
    ],
    journeys: [
      {
        id: "eager-backward",
        label: "Run eager forward and backward",
        summary:
          "Follow a Python tensor operation through dispatch, autograd recording, the device kernel, backward scheduling, and optional gradient reduction.",
        edgeIds: [
          "tensor-dispatch",
          "dispatch-autograd",
          "autograd-device",
          "autograd-engine",
          "engine-reducer",
          "reducer-device",
        ],
      },
      {
        id: "compile-graph",
        label: "Compile a model region",
        summary:
          "See torch.compile capture guarded Python behavior, lower an FX graph, and run fused code over the same tensor devices.",
        edgeIds: ["tensor-dynamo", "dynamo-inductor", "inductor-device"],
      },
    ],
    glossary: [
      {
        term: "Dispatch key",
        definition: "A tag derived from tensor state that selects layers such as Autograd and backends such as CPU or CUDA.",
      },
      {
        term: "ATen",
        definition: "PyTorch's core tensor library and operator vocabulary, with implementations for multiple devices and data types.",
      },
      {
        term: "Autograd graph",
        definition: "A dynamic graph of backward functions connecting differentiable outputs to the inputs that produced them.",
      },
      {
        term: "FX graph",
        definition: "A Python-level graph representation whose nodes describe calls, inputs, attributes, and outputs.",
      },
      {
        term: "Guard",
        definition: "A condition that must still hold for previously compiled code to be safe to reuse on a new call.",
      },
      {
        term: "Graph break",
        definition: "A point Dynamo cannot or should not capture, so Python runs that region and compilation may resume later.",
      },
      {
        term: "Gradient bucket",
        definition: "A contiguous group of parameter gradients reduced together to overlap communication with ongoing backward work.",
      },
      {
        term: "NCCL",
        definition: "NVIDIA's library for fast multi-GPU collectives such as all-reduce, broadcast, and all-gather.",
      },
    ],
    learningPath: [
      {
        title: "Inspect dispatcher choices",
        description:
          "Choose one operator and use PyTorch dispatch inspection tools, then connect its key order to Dispatcher.cpp and its ATen kernel.",
      },
      {
        title: "Draw a backward graph",
        description:
          "Print grad_fn and next_functions for a tiny expression, then map those nodes to function.h and engine.cpp.",
      },
      {
        title: "Explain one compiled graph",
        description:
          "Use torch.compile diagnostics on a small function and identify its Dynamo guards, FX operations, Inductor output, and graph breaks.",
      },
    ],
  },
  {
    slug: "tensorflow",
    title: "TensorFlow",
    subtitle: "Two execution paths from Python tensors: immediate eager operations and optimized `tf.function` graphs.",
    orientation:
      "The Python API starts at upper left. Eager calls take the short center route to kernels; decorated functions travel through tracing, function storage, Grappler, and the graph executor before joining the same kernel and device layer.",
    snapshot: {
      branch: "master",
      commit: "45bf59d",
      analyzedAt: "2026-08-16",
    },
    nodes: [
      {
        id: "python-api",
        label: "Python tensor API",
        district: "Python surface",
        kind: "entry",
        summary: "Python objects and operation helpers through which user code constructs TensorFlow work.",
        responsibility:
          "Represent symbolic or eager tensors, track graphs and name scopes, convert values, and route operation creation according to execution mode.",
        x: 9,
        y: 18,
        height: 2,
        citations: [cite("tensorflow", "tensorflow/python/framework/ops.py", "Tensor and graph Python core")],
      },
      {
        id: "eager",
        label: "Eager bridge",
        district: "Immediate execution",
        kind: "runtime",
        summary: "Executes one operation now and returns concrete tensors to Python.",
        responsibility:
          "Marshal Python inputs and attributes, choose eager fast or fallback execution, call the C runtime, and translate status and outputs.",
        x: 34,
        y: 22,
        height: 3,
        citations: [
          cite("tensorflow", "tensorflow/python/eager/execute.py", "Python eager execute helpers"),
          cite("tensorflow", "tensorflow/core/common_runtime/eager/execute.cc", "C++ eager operation execution")],
      },
      {
        id: "tracer",
        label: "tf.function tracer",
        district: "Graph construction",
        kind: "tooling",
        summary: "Specializes a Python function into reusable concrete graphs.",
        responsibility:
          "Canonicalize calls, select or create a ConcreteFunction, trace tensor operations, and cache specializations by input type and context.",
        x: 27,
        y: 54,
        height: 3,
        citations: [cite("tensorflow", "tensorflow/python/eager/polymorphic_function/polymorphic_function.py", "Polymorphic tf.function tracing")],
      },
      {
        id: "function-library",
        label: "Function library",
        district: "Graph construction",
        kind: "storage",
        summary: "Stores graph-defined functions and instantiates callable graph bodies for the runtime.",
        responsibility:
          "Register FunctionDefs, resolve signatures and attributes, instantiate function graphs, and cache reusable runtime handles.",
        x: 48,
        y: 70,
        height: 3,
        citations: [cite("tensorflow", "tensorflow/core/framework/function.cc", "FunctionDef library and instantiation")],
      },
      {
        id: "grappler",
        label: "Grappler optimizer",
        district: "Graph execution",
        kind: "compute",
        summary: "Applies coordinated graph rewrites before execution.",
        responsibility:
          "Run configured optimizer passes over a GrapplerItem, including pruning, constant folding, layout, remapping, and function rewrites.",
        x: 68,
        y: 72,
        height: 3,
        citations: [cite("tensorflow", "tensorflow/core/grappler/optimizers/meta_optimizer.cc", "Grappler meta-optimizer pipeline")],
      },
      {
        id: "executor",
        label: "Graph executor",
        district: "Graph execution",
        kind: "runtime",
        summary: "Schedules graph nodes when their control and tensor inputs are ready.",
        responsibility:
          "Build per-step execution state, propagate tagged tensors, schedule ready nodes, manage asynchronous kernels, and finish or cancel a step.",
        x: 82,
        y: 52,
        height: 4,
        citations: [cite("tensorflow", "tensorflow/core/common_runtime/executor.cc", "Graph executor implementation")],
      },
      {
        id: "op-kernels",
        label: "OpKernel registry",
        district: "Native compute",
        kind: "compute",
        summary: "Creates the native implementation registered for an operation, device type, and constraints.",
        responsibility:
          "Match NodeDef operations to registered kernel definitions, construct OpKernel instances, and execute synchronous or asynchronous compute methods.",
        x: 61,
        y: 31,
        height: 4,
        citations: [cite("tensorflow", "tensorflow/core/framework/op_kernel.cc", "Kernel registration, creation, and context")],
      },
      {
        id: "devices",
        label: "Device manager",
        district: "Native compute",
        kind: "external",
        summary: "Owns named CPU or accelerator devices and resolves where tensors and kernels execute.",
        responsibility:
          "Register local devices, find them by canonical name, expose device attributes, and coordinate device lookup for runtime placement.",
        x: 91,
        y: 24,
        height: 3,
        citations: [cite("tensorflow", "tensorflow/core/common_runtime/device_mgr.cc", "Dynamic device manager")],
      },
    ],
    edges: [
      {
        id: "api-eager",
        from: "python-api",
        to: "eager",
        kind: "control",
        label: "Execute immediately",
        payload: "op name, eager tensors, attributes, output dtypes, context",
        description:
          "Outside graph tracing, generated Python wrappers call eager helpers that marshal a single operation for immediate execution.",
        citations: [cite("tensorflow", "tensorflow/python/eager/execute.py", "quick_execute and execute helpers")],
      },
      {
        id: "eager-kernel",
        from: "eager",
        to: "op-kernels",
        kind: "control",
        label: "Resolve an eager kernel",
        payload: "operation inputs, attrs, selected device, cancellation state",
        description:
          "The eager runtime prepares a node and resolves the registered native kernel that can execute it on the chosen device.",
        citations: [cite("tensorflow", "tensorflow/core/common_runtime/eager/execute.cc", "Eager node preparation and execution")],
      },
      {
        id: "kernel-device",
        from: "op-kernels",
        to: "devices",
        kind: "data",
        label: "Run device computation",
        payload: "Tensor buffers, allocator, stream/device context, kernel attributes",
        description:
          "An OpKernelContext supplies device and allocator services while the selected kernel reads input tensors and writes outputs.",
        citations: [cite("tensorflow", "tensorflow/core/framework/op_kernel.cc", "OpKernelContext device and tensor access")],
      },
      {
        id: "device-api",
        from: "devices",
        to: "python-api",
        kind: "data",
        label: "Return eager tensors",
        payload: "output tensor handles or an error status",
        description:
          "Completed eager output handles are converted back into Python-visible Tensor objects; errors become Python exceptions.",
        citations: [cite("tensorflow", "tensorflow/python/eager/execute.py", "Eager output and status conversion")],
      },
      {
        id: "api-tracer",
        from: "python-api",
        to: "tracer",
        kind: "control",
        label: "Call a decorated function",
        payload: "Python arguments, TensorSpecs, execution context, function options",
        description:
          "A tf.function call chooses a cached ConcreteFunction or traces a new specialization for the observed input contract.",
        citations: [cite("tensorflow", "tensorflow/python/eager/polymorphic_function/polymorphic_function.py", "Polymorphic function call path")],
      },
      {
        id: "tracer-function",
        from: "tracer",
        to: "function-library",
        kind: "state",
        label: "Register a concrete graph",
        payload: "FunctionDef, input/output signature, captures, attributes",
        description:
          "Tracing produces a concrete graph-backed function whose definition and captured values can be registered with the runtime.",
        citations: [cite("tensorflow", "tensorflow/core/framework/function.cc", "FunctionDef registration and lookup")],
      },
      {
        id: "function-grappler",
        from: "function-library",
        to: "grappler",
        kind: "data",
        label: "Prepare graph optimization",
        payload: "GraphDef, feeds, fetches, function library, optimizer configuration",
        description:
          "The graph and its callable boundaries form a GrapplerItem that the meta-optimizer passes through configured rewrites.",
        citations: [cite("tensorflow", "tensorflow/core/grappler/optimizers/meta_optimizer.cc", "MetaOptimizer graph input")],
      },
      {
        id: "grappler-executor",
        from: "grappler",
        to: "executor",
        kind: "data",
        label: "Schedule optimized graph",
        payload: "optimized graph nodes, edges, placements, control dependencies",
        description:
          "The executor consumes the rewritten graph and creates runtime state that tracks pending inputs and ready nodes for one step.",
        citations: [cite("tensorflow", "tensorflow/core/common_runtime/executor.cc", "Executor graph and step state")],
      },
      {
        id: "executor-kernel",
        from: "executor",
        to: "op-kernels",
        kind: "control",
        label: "Execute a ready node",
        payload: "NodeItem, input tensors, rendezvous state, frame and iteration tags",
        description:
          "When dependencies are satisfied, the executor prepares an OpKernelContext and invokes the node's synchronous or asynchronous kernel.",
        citations: [cite("tensorflow", "tensorflow/core/common_runtime/executor.cc", "Ready-node kernel invocation")],
      },
    ],
    journeys: [
      {
        id: "eager-op",
        label: "Run one eager operation",
        summary:
          "Follow a Python call immediately through the eager runtime into a registered device kernel and back as concrete tensor handles.",
        edgeIds: ["api-eager", "eager-kernel", "kernel-device", "device-api"],
      },
      {
        id: "function-call",
        label: "Trace and run tf.function",
        summary:
          "See Python execution specialize into a stored graph, pass through Grappler, and execute ready graph nodes on device kernels.",
        edgeIds: [
          "api-tracer",
          "tracer-function",
          "function-grappler",
          "grappler-executor",
          "executor-kernel",
          "kernel-device",
        ],
      },
    ],
    glossary: [
      {
        term: "Eager execution",
        definition: "Running each TensorFlow operation immediately so Python receives concrete tensor results step by step.",
      },
      {
        term: "tf.function",
        definition: "A decorator that traces tensor operations into specialized callable graphs for optimization and reuse.",
      },
      {
        term: "ConcreteFunction",
        definition: "One traced graph specialization with a specific structured input signature and captured values.",
      },
      {
        term: "FunctionDef",
        definition: "TensorFlow's serialized graph-level definition of a reusable function and its attributes.",
      },
      {
        term: "Grappler",
        definition: "TensorFlow's graph optimizer framework, which coordinates rewrites before runtime execution.",
      },
      {
        term: "OpKernel",
        definition: "The native implementation of an operation for a particular device and registration constraint set.",
      },
      {
        term: "Control edge",
        definition: "A graph dependency requiring one operation to finish before another can run without carrying a tensor value.",
      },
      {
        term: "Placement",
        definition: "The decision assigning each graph operation to a compatible named device such as a CPU or GPU.",
      },
    ],
    learningPath: [
      {
        title: "Compare eager with traced calls",
        description:
          "Run a tiny function normally and under tf.function, then inspect tracing count and the ConcreteFunction graph operations.",
      },
      {
        title: "Follow one OpKernel",
        description:
          "Choose a simple operation, find its kernel registration, and connect its input tensors and device context to op_kernel.cc.",
      },
      {
        title: "Observe a graph rewrite",
        description:
          "Enable graph optimizer diagnostics and identify one Grappler change before following the optimized node into executor.cc.",
      },
    ],
  },
] satisfies readonly SystemMap[];
