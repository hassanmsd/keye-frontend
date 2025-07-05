interface SnackbarArgs {
  isOpen?: boolean;
  onClose?: () => void;
  severity?: Severity;
  message?: string;
  autoHideDuration?: number;
}

type Severity = "success" | "error" | "info" | "warning";

export type { SnackbarArgs, Severity };
