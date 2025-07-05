import { useEffect, useState } from "react";

import {
  CellFormat,
  CellFormatMap,
  LocalStorageKeys,
  SalesRow,
} from "../types/spreadsheet";
import { SnackbarArgs } from "../types/global";

import {
  loadDataFromLocalStorage,
  saveDataToLocalStorage,
} from "../utils/storage";
import { fetchGrowthData } from "../api";

interface UseSpreadsheetProps {
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarArgs>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Custom hook to manage spreadsheet data, formatting, and persistence with localStorage and remote data fetching.
export const useSpreadsheet = ({
  setSnackbar,
  setLoading,
}: UseSpreadsheetProps) => {
  const [rows, setRows] = useState<SalesRow[]>([]);
  const [cellFormats, setCellFormats] = useState<CellFormatMap>({});

  // Load data from localStorage on mount or fallback to fetch API data
  useEffect(() => {
    const saved = loadDataFromLocalStorage(LocalStorageKeys.SPREADSHEET_DATA);
    if (saved?.rows?.length) {
      try {
        setRows(saved.rows);
        setCellFormats(saved.cellFormats || {});
      } catch (e) {
        setSnackbar({
          isOpen: true,
          severity: "error",
          message: "Failed to load from local storage",
        });
        loadInitialData();
      } finally {
        setLoading(false);
      }
    } else {
      loadInitialData();
    }
  }, []);

  // Fetch initial spreadsheet data from API
  const loadInitialData = async () => {
    try {
      const res = await fetchGrowthData();
      const rowData = res?.Values?.items.map((item, index) => ({
        id: index,
        rowNumber: index + 1,
        ...item,
      }));
      setRows(rowData);
    } catch (err) {
      setSnackbar({
        isOpen: true,
        severity: "error",
        message: "Failed to fetch rows",
      });
    } finally {
      setLoading(false);
    }
  };

  // Persist rows and formatting changes to localStorage
  useEffect(() => {
    if (rows.length === 0) return;

    try {
      saveDataToLocalStorage(LocalStorageKeys.SPREADSHEET_DATA, {
        rows,
        cellFormats,
      });
    } catch (e) {
      setSnackbar({
        isOpen: true,
        severity: "error",
        message: "Failed to save spreadsheet data",
      });
    }
  }, [rows, cellFormats]);

  // Toggle formatting (bold, italic, underline) for a specific cell
  const toggleFormat = (
    rowId: number | string,
    field: string,
    formatKey: keyof CellFormat
  ) => {
    const cellKey = `${rowId}_${field}`;
    setCellFormats((prev) => {
      const prevFormat = prev[cellKey] || {};
      return {
        ...prev,
        [cellKey]: {
          ...prevFormat,
          [formatKey]: !prevFormat[formatKey],
        },
      };
    });
  };

  // Set text color for a specific cell
  const setColor = (rowId: number | string, field: string, color: string) => {
    const cellKey = `${rowId}_${field}`;
    setCellFormats((prev) => ({
      ...prev,
      [cellKey]: {
        ...prev[cellKey],
        color,
      },
    }));
  };

  // Set text alignment for a specific cell
  const setAlign = (
    rowId: number | string,
    field: string,
    align: "left" | "center" | "right"
  ) => {
    const cellKey = `${rowId}_${field}`;
    setCellFormats((prev) => ({
      ...prev,
      [cellKey]: {
        ...prev[cellKey],
        align,
      },
    }));
  };

  return {
    rows,
    setRows,
    cellFormats,
    setCellFormats,
    toggleFormat,
    setColor,
    setAlign,
  };
};
