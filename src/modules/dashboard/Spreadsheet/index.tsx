import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";

import { useSpreadsheetHistory } from "../../../hooks/useSpreadsheetHistory";
import { useSpreadsheet } from "../../../hooks/useSpreadsheet";

import { getSpreadsheetColumns } from "../columns";
import Toolbar from "../Toolbar";
import Snackbar from "../../../components/Snackbar";

import {
  CellFormat,
  CellFormatMap,
  SalesRow,
} from "../../../types/spreadsheet";
import { SnackbarArgs } from "../../../types/global";

import styles from "./styles.module.scss";

const Spreadsheet = () => {
  // Tracks currently selected cell by id and field for formatting actions
  const [selectedCell, setSelectedCell] = useState<{
    id: number | string;
    field: string;
  } | null>(null);

  // Loading state for async data fetch or localStorage load
  const [loading, setLoading] = useState(true);
  // Snackbar state for showing notifications/errors
  const [snackbar, setSnackbar] = useState<SnackbarArgs>({ isOpen: false });

  // Undo/redo history management hook with generic types for rows and formats
  const {
    push,
    undo: undoHistory,
    redo: redoHistory,
    canUndo,
    canRedo,
  } = useSpreadsheetHistory<SalesRow[], CellFormatMap>();

  // Main spreadsheet data & formatting hook handling rows and cell formats
  const {
    rows,
    setRows,
    cellFormats,
    setCellFormats,
    toggleFormat,
    setColor,
    setAlign,
  } = useSpreadsheet({
    setSnackbar,
    setLoading,
  });

  // Memoized columns to avoid unnecessary recalculations on each render
  const columns = useMemo(
    () => getSpreadsheetColumns(cellFormats),
    [cellFormats]
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ isOpen: false });
  };

  // Current formatting styles of the selected cell
  const currentFormat = selectedCell
    ? cellFormats[`${selectedCell.id}_${selectedCell.field}`] || {}
    : {};

  // Format toggle handler: pushes current state to history then toggles format
  const onToggleFormat = (key: keyof CellFormat) => {
    if (!selectedCell) return;
    push({ rows, cellFormats });
    toggleFormat(selectedCell.id, selectedCell.field, key);
  };

  // Color setter handler with history push
  const onSetColor = (color: string) => {
    if (!selectedCell) return;
    push({ rows, cellFormats });
    setColor(selectedCell.id, selectedCell.field, color);
  };

  // Alignment setter handler with history push
  const onToggleAlignment = (align: "left" | "center" | "right") => {
    if (!selectedCell) return;
    push({ rows, cellFormats });
    setAlign(selectedCell.id, selectedCell.field, align);
  };

  // Undo changes by restoring previous snapshot from history
  const undo = () => {
    const previous = undoHistory({ rows, cellFormats });
    if (!previous) return;
    setRows(previous.rows);
    setCellFormats(previous.cellFormats);
  };

  // Redo changes by restoring next snapshot from history
  const redo = () => {
    const next = redoHistory({ rows, cellFormats });
    if (!next) return;
    setRows(next.rows);
    setCellFormats(next.cellFormats);
  };

  // Update rows state after a row is edited, used by DataGrid's processRowUpdate
  const handleRowUpdate = (newRow: any, oldRow: any) => {
    if (newRow === oldRow) return oldRow;
    const updatedRows = rows.map((r) => (r.id === oldRow.id ? newRow : r));
    setRows(updatedRows);
    return newRow;
  };

  return (
    <Paper
      sx={{
        flexGrow: 1,
        margin: 2,
        padding: 2,
        overflow: "hidden",
        borderRadius: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
      elevation={2}
    >
      {/* Toolbar with formatting and undo/redo controls */}
      <Toolbar
        selectedCell={selectedCell}
        currentFormat={currentFormat}
        toggleFormat={onToggleFormat}
        setColor={onSetColor}
        toggleAlignment={onToggleAlignment}
        undo={undo}
        redo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* DataGrid container */}
      <Box sx={{ overflow: "hidden", flexGrow: 1 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          sortingOrder={["asc", "desc"]}
          processRowUpdate={handleRowUpdate}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          onCellClick={(params) => {
            setSelectedCell({ id: params.id, field: params.field });
          }}
          className={styles.DocumentGrid}
        />
      </Box>

      {/* Snackbar for messages */}
      <Snackbar
        isOpen={snackbar.isOpen}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Paper>
  );
};

export default Spreadsheet;
