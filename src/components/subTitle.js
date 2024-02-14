import React from "react";
import { Box, Typography } from "@mui/material";

function SubTitle({ title, description }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#00C1F0",
          fontSize: { sm: "20px", xs: "18px" },
          fontWeight: "600",
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: "rgba(255, 255, 255, 0.50)",
          fontSize: { sm: "16px", xs: "14px" },
          fontWeight: "400",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

export default SubTitle;
