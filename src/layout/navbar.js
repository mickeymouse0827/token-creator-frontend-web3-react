import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useAuthContext } from "../providers/AuthProvider";

export function shorten(str) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export default function Navbar() {
  const { address, loading, connect, disconnect } = useAuthContext();

  const handleWalletConnect = () => {
    address ? disconnect() : connect();
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: "100vw",
        height: { sm: "100px", xs: "72px" },
        // borderBottom: "1px solid rgba(255, 255, 255, 0.10)",
        background: "rgba(0, 0, 0, 0.72);",
        backdropFilter: "blur(10px)",
        zIndex: "10",
      }}
    >
      <Container
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          img: {
            // ":nth-child(1)": {
            // display: { sm: "flex", xs: "none" },
            width: "160px",
            // },
            // ":nth-child(2)": {
            //   display: { sm: "none", xs: "flex" },
            //   height: "60%",
            // },
          },
        }}
      >
        <img alt="" src="./logo512.png" />
        {/* <img alt="" src="./favicon.png" /> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <Box
            sx={{
              width: "1px",
              height: "28px",
              background: "#ffffff",
              opacity: "0.2",
              marginRight: { sm: "50px", xs: "20px" },
            }}
          /> */}
          <Box
            sx={
              {
                // width: { sm: "130px", xs: "130px" },
                // height: { sm: "35px", xs: "35px" },
                // borderRadius: "27px",
                // padding: "2px",
                // background:
                //   "linear-gradient(90deg, #00C1F0 0%, #040C15 49.00%, #00C1F0 100%)",
                // ":hover": {
                //   background: "#00C1F0",
                // },
              }
            }
          >
            <Button
              sx={{
                width: "130px",
                height: "35px",
                borderRadius: "27px",
                border: "1px solid white",
                background: "transparent",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "none",
                ":hover": {
                  background: "white",
                  color: "black",
                },
              }}
              onClick={handleWalletConnect}
              // disabled={loading}
            >
              <CircularProgress
                sx={{
                  display: loading ? "flex" : "none",
                  width: { sm: "24px !important", xs: "24px !important" },
                  height: { sm: "24px !important", xs: "24px !important" },
                  color: "white",
                }}
              />
              <Typography
                sx={{ display: loading ? "none" : { md: "block", xs: "none" } }}
              >
                {address ? shorten(address) : "Connect Wallet"}
              </Typography>
              <Typography
                sx={{ display: loading ? "none" : { md: "none", xs: "block" } }}
              >
                {address ? shorten(address) : "Connect"}
              </Typography>
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
