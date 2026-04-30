import { Route, Routes } from "react-router-dom";
import BusinessIntakePage from "./pages/BusinessIntakePage";
import MarketingStrategyPage from "./pages/MarketingStrategyPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BusinessIntakePage />} />
      <Route path="/strategy" element={<MarketingStrategyPage />} />
    </Routes>
  );
}

export default App;
