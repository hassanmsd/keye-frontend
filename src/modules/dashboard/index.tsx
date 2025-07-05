import { Box } from "@mui/material";

import Spreadsheet from "./Spreadsheet";

const Dashboard = () => {
  return (
    <Box height={"100vh"} width={"100vw"} display={"flex"} overflow={"hidden"}>
      <Spreadsheet />
    </Box>
  );
};

export default Dashboard;
