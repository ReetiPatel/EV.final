import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MethodSelection from "./pages/MethodSelection";
import FocusDirectrixConstruction from "./pages/FocusDirectrixConstruction";
import ArcCircleConstruction from "./pages/ArcCircleConstruction";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/methods" element={<MethodSelection />} />
          <Route path="/construction/focus-directrix" element={<FocusDirectrixConstruction />} />
          <Route path="/construction/arc-circle" element={<ArcCircleConstruction />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
