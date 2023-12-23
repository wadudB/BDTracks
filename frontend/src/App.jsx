import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Commodities from "./pages/Commodities";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/commodities" element={<Commodities />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
