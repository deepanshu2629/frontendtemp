import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Profile from "./pages/Profile";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/recommendations" element={<Recommendations />}/>
    </Routes>
  );
}

export default App;