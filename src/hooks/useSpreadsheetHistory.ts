import { useState } from "react";

type Snapshot<T, U> = {
  rows: T;
  cellFormats: U;
};

// Custom hook to manage undo/redo history for spreadsheet state snapshots (rows and formatting).
export const useSpreadsheetHistory = <T = any[], U = Record<string, any>>() => {
  const [history, setHistory] = useState<Snapshot<T, U>[]>([]);
  const [future, setFuture] = useState<Snapshot<T, U>[]>([]);

  // Push new snapshot and clear redo future
  function push(snapshot: Snapshot<T, U>) {
    setHistory((prev) => [...prev, snapshot]);
    setFuture([]);
  }

  // Undo: returns previous snapshot or null if none
  const undo = (current: Snapshot<T, U>) => {
    if (history.length === 0) return null;
    const previous = history[history.length - 1];
    setFuture((f) => [current, ...f]);
    setHistory((h) => h.slice(0, h.length - 1));
    return previous;
  };

  // Redo: returns next snapshot or null if none
  const redo = (current: Snapshot<T, U>) => {
    if (future.length === 0) return null;
    const next = future[0];
    setHistory((h) => [...h, current]);
    setFuture((f) => f.slice(1));
    return next;
  };

  return {
    history,
    future,
    push,
    undo,
    redo,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
  };
};
