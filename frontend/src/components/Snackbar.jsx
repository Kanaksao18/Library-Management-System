import React from "react";
import MuiSnackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Snackbar = ({ open, onClose, message, severity = "info" }) => (
  <MuiSnackbar open={open} autoHideDuration={4000} onClose={onClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
    <MuiAlert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
      {message}
    </MuiAlert>
  </MuiSnackbar>
);

export default Snackbar; 