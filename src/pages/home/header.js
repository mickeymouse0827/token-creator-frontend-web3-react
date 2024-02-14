import React from "react";
import { Box, Typography } from "@mui/material";

function Header() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "540px",
        background: "url(./header-background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          marginTop: "200px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
          ".MuiTypography-root": {
            color: "white",
            fontSize: { md: "55px", sm: "42px", xs: "22px" },
            fontWeight: "600",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Typography>Create Your</Typography>
        <Typography
          sx={{
            color: "#00C1F0 !important",
            margin: "0 16px",
          }}
        >
          ERC20
        </Typography>
        <Typography>Token</Typography>
      </Box>
      <Typography
        sx={{
          marginTop: "25px",
          width: "100%",
          maxWidth: "760px",
          padding: { md: "0px 0px", sm: "0px 12px", xs: "0px 8px" },
          color: "white",
          textAlign: "center",
          fontSize: { md: "18px", sm: "16px", xs: "14px" },
          lineHeight: { md: "30px", sm: "28px", xs: "24px" },
          textTransform: "capitalize",
          fontWeight: "400",
        }}
      >
        Easily deploy Smart Contract for an ERC20 Token on Ethereum. between
        several features like Mintable, , Deflationary, Taxable, and others,
        giving your token its unique identity. Login. No setup. No coding
        required.
      </Typography>
    </Box>
  );
}

export default Header;
