import { Alert, Snackbar as MUISnackbar } from "@mui/material";

import { SnackbarArgs } from "../../types/global";

export const Snackbar = ({
  isOpen,
  onClose,
  severity,
  message,
  autoHideDuration = 5000,
}: SnackbarArgs) => {
  return (
    <div>
      {isOpen && (
        <MUISnackbar
          open={isOpen}
          autoHideDuration={autoHideDuration}
          onClose={onClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={onClose} severity={severity} variant="filled">
            {message}
          </Alert>
        </MUISnackbar>
      )}
    </div>
  );
};

export default Snackbar;
