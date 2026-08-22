"use client";

import {
  useVirtualizer,
  type VirtualItem,
} from "@tanstack/react-virtual";
import {
  type CSSProperties,
  type Key,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

import { cn } from "~/lib/utils";

export type VirtualizedListProps<T> = {
  items: T[];
  getItemKey: (item: T, index: number) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  itemClassName?: string;
  estimateSize?: number;
  overscan?: number;
  height?: CSSProperties["height"];
  resetKey?: string | number;
};

const defaultHeight = "min(70vh, 640px)";

export function VirtualizedList<T>({
  items,
  getItemKey,
  renderItem,
  className,
  itemClassName,
  estimateSize = 72,
  overscan = 8,
  height = defaultHeight,
  resetKey,
}: VirtualizedListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    getItemKey: (index) => {
      const item = items[index];

      return item === undefined ? index : getItemKey(item, index);
    },
    overscan,
  });

  useEffect(() => {
    if (resetKey !== undefined) {
      virtualizer.scrollToOffset(0);
    }
  }, [resetKey, virtualizer]);

  return (
    <div
      ref={parentRef}
      role="list"
      className={cn(
        "min-h-0 w-full overflow-auto overscroll-contain rounded-xl border border-stone-200 bg-white shadow-sm",
        className
      )}
      style={{ height }}
    >
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualizer.getVirtualItems().map((virtualItem: VirtualItem) => {
          const item = items[virtualItem.index];

          if (item === undefined) {
            return null;
          }

          return (
            <div
              key={virtualItem.key}
              ref={virtualizer.measureElement}
              data-index={virtualItem.index}
              role="listitem"
              className={cn(
                "absolute left-0 top-0 w-full",
                itemClassName
              )}
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {renderItem(item, virtualItem.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
