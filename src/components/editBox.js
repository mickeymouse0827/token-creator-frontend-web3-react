import React from "react";
import { Box, Input, Typography } from "@mui/material";

function EditBox({
  title,
  placeholder,
  value,
  onChangeContent,
  inputProps,
  isOptional,
  isDisable,
  isNumberType,
}) {
  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          ".MuiTypography-root": {
            textWrap: "nowrap",
            color: "white",
            fontSize: { sm: "16px", xs: "14px" },
            fontWeight: "400",
          },
        }}
      >
        <Typography>{title}</Typography>
        <Typography
          sx={{
            display: isOptional ? "none" : "flex",
            color: "#FF5924 !important",
          }}
        >
          *
        </Typography>
      </Box>
      <Input
        type={isNumberType ? "number" : ""}
        value={value}
        placeholder={placeholder}
        disabled={isDisable}
        onChange={(e) => onChangeContent(e.target.value)}
        inputProps={inputProps}
        sx={{
          marginTop: "5px",
          width: "100%",
          height: { sm: "60px", xs: "48px" },
          padding: "21px",
          borderRadius: "5px",
          border: "1px solid rgba(255, 255, 255, 0.07)",
          background: isDisable ? "rgba(11, 29, 51, 0.40)" : "#0B1D33",
          color: "#6587B0",
          fontSize: { sm: "16px", xs: "14px" },
          fontWeight: "400",
          "&::before": {
            display: "none",
          },
          "&::after": {
            display: "none",
          },
          ".Mui-disabled": {
            WebkitTextFillColor: "rgba(101, 135, 176, 0.60)",
          },
        }}
      />
    </>
  );
}

export default EditBox;
