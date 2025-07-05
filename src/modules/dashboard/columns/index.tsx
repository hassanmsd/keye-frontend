import { GridColDef, GridCellParams } from "@mui/x-data-grid";

import { DASHBOARD_COLUMNS } from "../../const";

// Returns DataGrid columns with custom cell rendering and styling based on cellFormats.
export const getSpreadsheetColumns = (
  // Map of cell keys to formatting info
  cellFormats: Record<string, any>
): GridColDef[] => [
  {
    field: "rowNumber",
    headerName: "#",
    width: 60,
    headerAlign: "center",
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: (params: GridCellParams) => (
      <div
        style={{
          padding: "0 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {params.value as React.ReactNode}
      </div>
    ),
  },
  // Spread the rest of the columns from your dashboard config
  ...DASHBOARD_COLUMNS.map((col) => ({
    field: col.key,
    headerName: col.name,
    width: 250,
    headerAlign: "center" as any,
    // All other columns are editable
    editable: true,
    type: col.key === "product" ? ("string" as any) : "number",
    renderCell: (params: GridCellParams) => {
      const key = `${params.id}_${params.field}`;
      const format = cellFormats[key] || {};
      const style: React.CSSProperties = {
        fontWeight: format.bold ? "bold" : "normal",
        fontStyle: format.italic ? "italic" : "normal",
        textDecoration: format.underline ? "underline" : "none",
        backgroundColor: format.color || "inherit",
        textAlign: format.align || "left",
        display: "flex",
        alignItems: "center",
        justifyContent:
          format.align === "center"
            ? "center"
            : format.align === "right"
            ? "flex-end"
            : "flex-start",
        padding: "0 8px",
        boxSizing: "border-box",
      };
      return <div style={style}>{params.value as React.ReactNode}</div>;
    },
  })),
];
