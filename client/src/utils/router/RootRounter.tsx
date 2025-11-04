import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import AppRouteOutlet from "./AppRouteOutlet";
import Login from "../../whitelabel/src/molecules/login/M-Login";
import { m_loginData } from "../../whitelabel/src/molecules/login/m-login.data";

const Test = () => {
  return <Login {...m_loginData} />;
};

const Kur = () => {
  return (
    <div>
      <h1>Vmro Dpmne 1111</h1>
    </div>
  );
};

const routes = createRoutesFromElements(
  <>
    <Route path="/" element={<AppRouteOutlet />}>
      <Route index element={<Test />} />
      <Route path="/personal" element={<Kur />} />
    </Route>
  </>
);
export const router = createBrowserRouter(routes);
