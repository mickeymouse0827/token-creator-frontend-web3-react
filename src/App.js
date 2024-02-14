import { Box } from "@mui/material";
import Navbar from "./layout/navbar";
import Home from "./pages/home";

function App() {
  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: "100px 0px 100px",
        }}
      >
        <Home />
      </Box>
    </>
  );
}

export default App;
