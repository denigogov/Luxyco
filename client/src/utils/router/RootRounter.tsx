import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router";
import AppRouteOutlet from "./AppRouteOutlet";

const Test = () => {
  return (
    <div>
      <h1>Vmro Dpmne Root</h1>
    </div>
  );
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
