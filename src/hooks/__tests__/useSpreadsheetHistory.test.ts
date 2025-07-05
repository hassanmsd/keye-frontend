import { renderHook, act } from "@testing-library/react";

import { useSpreadsheetHistory } from "../useSpreadsheetHistory";

describe("useSpreadsheetHistory", () => {
  it("pushes snapshots and performs undo/redo correctly", () => {
    const { result } = renderHook(() => useSpreadsheetHistory());

    const snapshot1 = {
      rows: [{ id: 1, product: "A" }],
      cellFormats: { "1_product": { bold: true } },
    };
    const snapshot2 = {
      rows: [{ id: 2, product: "B" }],
      cellFormats: { "2_product": { italic: true } },
    };

    // Push snapshot1
    act(() => {
      result.current.push(snapshot1);
    });
    // Push snapshot2
    act(() => {
      result.current.push(snapshot2);
    });

    // Now undo from snapshot2 state, expecting to get snapshot1
    let undoResult;
    act(() => {
      undoResult = result.current.undo(snapshot2);
    });

    expect(undoResult).toEqual(snapshot2);
    expect(result.current.canUndo).toBe(true); // no earlier snapshots after undo
    expect(result.current.canRedo).toBe(true); // redo is now possible

    // Redo from snapshot1 state, expecting snapshot2
    let redoResult;
    act(() => {
      redoResult = result.current.redo(snapshot1);
    });

    expect(redoResult).toEqual(snapshot2);
    expect(result.current.canUndo).toBe(true); // undo available again
    expect(result.current.canRedo).toBe(false); // no future snapshots after redo
  });

  it("undo returns null when no history", () => {
    const { result } = renderHook(() => useSpreadsheetHistory());

    let undoResult;
    act(() => {
      undoResult = result.current.undo({ rows: [], cellFormats: {} });
    });

    expect(undoResult).toBeNull();
    expect(result.current.canUndo).toBe(false);
  });

  it("redo returns null when no future", () => {
    const { result } = renderHook(() => useSpreadsheetHistory());

    let redoResult;
    act(() => {
      redoResult = result.current.redo({ rows: [], cellFormats: {} });
    });

    expect(redoResult).toBeNull();
    expect(result.current.canRedo).toBe(false);
  });
});
