import { BrowserRouter, Routes, Route } from "react-router-dom";
import {routes} from "@/routes";
import { Login , Verify, Onboard} from "@/pages/auth";
import { Home } from "@/pages";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.verify} element={<Verify />} />
        <Route path={routes.onboard} element={<Onboard />} />
        <Route path={routes.home} element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;