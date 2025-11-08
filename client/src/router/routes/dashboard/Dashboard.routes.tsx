import { Route } from "react-router";

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1> page
  </div>
);

export const DashboardsRoutes = (
  <Route path="/Dashboard" element={<Dashboard />} />
);
