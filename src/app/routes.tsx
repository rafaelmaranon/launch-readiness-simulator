import { Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import RoleSelect from "../pages/RoleSelect";
import Simulator from "../pages/Simulator";
import Debrief from "../pages/Debrief";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/role" element={<RoleSelect />} />
      <Route path="/sim" element={<Simulator />} />
      <Route path="/debrief" element={<Debrief />} />
    </Routes>
  );
}
