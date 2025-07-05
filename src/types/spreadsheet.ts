interface Cell {
  value: string | number;
  bold?: boolean;
  italic?: boolean;
}

type Row = Record<string, Cell>;

interface Column {
  name: string;
  key: string;
}

interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  align?: "left" | "center" | "right";
}

type CellFormatMap = Record<string, CellFormat>;

// enum for localStorage keys
enum LocalStorageKeys {
  SPREADSHEET_DATA = "spreadsheet-data",
}

interface SalesRow {
  id: number;
  rowNumber?: number;
  product: string;
  [year: string]: number | string | undefined;
}

export type { Row, Column, CellFormat, CellFormatMap, SalesRow };

export { LocalStorageKeys };
