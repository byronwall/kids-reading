"use client";

import { type ReactNode } from "react";

import { Button } from "~/components/ui/button";

/**
 * Keep stored font sizes inside a sane range. Older sessions may hold values
 * written before clamping existed, so clamp at render time too, not only when
 * writing.
 */
export function clampFontSize(
  value: number,
  min: number,
  max: number,
  fallback: number
) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, value));
}

export function PracticeLoading(props: { label: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 py-12 text-center"
    >
      <p className="animate-pulse text-sm text-slate-500">{props.label}</p>
    </div>
  );
}

export function PracticeError(props: { label: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-sm font-medium text-red-700">{props.label}</p>
      <Button variant="outline" onClick={props.onRetry}>
        Try again
      </Button>
    </div>
  );
}

export function PracticeEmpty(props: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <p className="text-lg font-semibold text-slate-900">{props.title}</p>
      {props.children ? (
        <div className="max-w-sm text-sm text-slate-600">{props.children}</div>
      ) : null}
    </div>
  );
}
