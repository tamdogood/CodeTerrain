"use client";

import { Check, Copy, Maximize2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ViewerControls() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  async function openFullScreen() {
    try {
      await document.getElementById("system-map")?.requestFullscreen();
    } catch {
      // Fullscreen may be blocked by the browser or embedding context.
    }
  }

  return (
    <div className="viewer-actions" aria-live="polite">
      <Button type="button" variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <button
        type="button"
        className="viewer-icon-button focus-ring"
        aria-label="Open map full screen"
        title="Open map full screen"
        onClick={openFullScreen}
      >
        <Maximize2 aria-hidden="true" />
      </button>
    </div>
  );
}
