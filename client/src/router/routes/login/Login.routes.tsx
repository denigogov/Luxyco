import { Route } from "react-router";
import Login from "../../../whitelabel/src/molecules/login/M-Login";
import { m_loginData } from "../../../whitelabel/src/molecules/login/m-login.data";

const LoginPage = () => <Login {...m_loginData} />;
const PasswordReset = () => <div>Password reset page</div>;

export const LoginRoutes = (
  <Route path="login" element={<LoginPage />}>
    <Route path="password-reset" element={<PasswordReset />} />
  </Route>
);
