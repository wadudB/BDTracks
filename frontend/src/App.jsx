import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Box, CircularProgress } from "@mui/material";
import Home from "./pages/Home";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Commodities = lazy(() => import("./pages/Commodities"));
const Constituencies = lazy(() => import("./pages/Constituencies"));
const Admin = lazy(() => import("./pages/Admin"));

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Suspense
          fallback={
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="85vh"
            >
              <CircularProgress />
            </Box>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/commodities" element={<Commodities />} />
            <Route path="/election-survey" element={<Constituencies />} />
            <Route path="/road-accident-dashboard" element={<Dashboard />} />
            <Route path="/access_only/admin" element={<Admin />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
