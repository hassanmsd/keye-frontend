import { renderHook, act, waitFor } from "@testing-library/react";

import { useSpreadsheet } from "../useSpreadsheet";
import * as storageUtils from "../../utils/storage";
import { fetchGrowthData } from "../../api";

// Mock localStorage utility functions to control their behavior in tests
jest.mock("../../utils/storage", () => ({
  loadDataFromLocalStorage: jest.fn(),
  saveDataToLocalStorage: jest.fn(),
}));

// Mock API fetch function to avoid real network requests in tests
jest.mock("../../api", () => ({
  fetchGrowthData: jest.fn(),
}));

describe("useSpreadsheet", () => {
  // Mock functions to track snackbar and loading state changes
  const mockSetSnackbar = jest.fn();
  const mockSetLoading = jest.fn();

  // Clear all mock data
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads data from localStorage if available", async () => {
    // Setup localStorage mock to return pre-defined spreadsheet data
    const storedData = {
      rows: [{ id: 1, product: "A" }],
      cellFormats: { "1_product": { bold: true } },
    };
    (storageUtils.loadDataFromLocalStorage as jest.Mock).mockReturnValue(
      storedData
    );

    // Render hook with mocked dependencies
    const { result } = renderHook(() =>
      useSpreadsheet({
        setSnackbar: mockSetSnackbar,
        setLoading: mockSetLoading,
      })
    );

    // Wait for rows state to be populated
    await waitFor(() => {
      expect(result.current.rows.length).toBeGreaterThan(0);
    });

    // Verify localStorage load was called and data matches expected
    expect(storageUtils.loadDataFromLocalStorage).toHaveBeenCalled();
    expect(result.current.rows).toEqual(storedData.rows);
    expect(result.current.cellFormats).toEqual(storedData.cellFormats);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockSetSnackbar).not.toHaveBeenCalled();
  });

  it("fetches fallback data if no localStorage data", async () => {
    // Setup localStorage mock to return null, simulating empty cache
    (storageUtils.loadDataFromLocalStorage as jest.Mock).mockReturnValue(null);

    // Setup API mock to return fallback data
    (fetchGrowthData as jest.Mock).mockResolvedValue({
      Values: {
        items: [
          { product: "Fallback", "2020": 1, "2021": 2, id: 0, rowNumber: 1 },
        ],
      },
    });

    const { result } = renderHook(() =>
      useSpreadsheet({
        setSnackbar: mockSetSnackbar,
        setLoading: mockSetLoading,
      })
    );

    // Wait for rows to be populated from the API data
    await waitFor(() => {
      expect(result.current.rows.length).toBeGreaterThan(0);
    });

    // Confirm the API fetch was called and fallback data is used
    expect(fetchGrowthData).toHaveBeenCalled();
    expect(result.current.rows[0].product).toBe("Fallback");
    // Loading state should be turned off after data load
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("saves to localStorage when rows or formats change", async () => {
    // Setup initial localStorage data
    const storedData = {
      rows: [{ id: 1, product: "A" }],
      cellFormats: {},
    };
    (storageUtils.loadDataFromLocalStorage as jest.Mock).mockReturnValue(
      storedData
    );

    const { result } = renderHook(() =>
      useSpreadsheet({
        setSnackbar: mockSetSnackbar,
        setLoading: mockSetLoading,
      })
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBeGreaterThan(0);
    });

    // Clear calls made during initial mount/setup
    (jest.mocked(storageUtils.saveDataToLocalStorage) as jest.Mock).mockClear();

    // Update rows and verify localStorage save is called once
    act(() => {
      result.current.setRows([{ id: 2, product: "B" }]);
    });

    expect(storageUtils.saveDataToLocalStorage).toHaveBeenCalledTimes(1);

    // Update cell formats and verify localStorage save is called again
    act(() => {
      result.current.setCellFormats({ "2_product": { italic: true } });
    });

    expect(storageUtils.saveDataToLocalStorage).toHaveBeenCalledTimes(2);
  });
});
