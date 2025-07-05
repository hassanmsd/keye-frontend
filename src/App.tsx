import { BrowserRouter, Route, Routes } from "react-router-dom";

import DashboardPage from "./pages/dashboard";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* can add more routes in future */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
