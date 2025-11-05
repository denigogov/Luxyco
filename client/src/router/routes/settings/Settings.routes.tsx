import { Navigate, Route } from "react-router";

const Price = () => (
  <div>
    <h1>Price</h1> page
  </div>
);
const Status = () => (
  <div>
    <h1>Status</h1> page
  </div>
);

export const SettingsRoutes = (
  <Route path="/settings">
    <Route index element={<Navigate to="/settings/price" replace />} />
    <Route path="price" element={<Price />} />
    <Route path="status" element={<Status />} />
  </Route>
);
