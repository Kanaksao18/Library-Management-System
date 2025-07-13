import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
    <CircularProgress />
  </Box>
);

export default Loader; 