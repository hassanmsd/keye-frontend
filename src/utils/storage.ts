import { LocalStorageKeys } from "../types/spreadsheet";

// Generic save function
const saveDataToLocalStorage = (key: LocalStorageKeys, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Generic load function
const loadDataFromLocalStorage = (key: LocalStorageKeys) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

export { saveDataToLocalStorage, loadDataFromLocalStorage };
