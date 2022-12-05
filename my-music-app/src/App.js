import { Box} from "@chakra-ui/react";
import AllRoutes from "./AllRoutes/AllRoutes";
import "./App.css";
import Navbar from "./Components/Navbar";

function App() {

  return ( 
    <Box>
      <Navbar/>
      <AllRoutes/>
    </Box>
  );
}

export default App;
