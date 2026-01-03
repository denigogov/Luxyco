import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";

import Login from "../../../whitelabel/src/molecules/login/M-Login";
import { m_loginData } from "../../../whitelabel/src/molecules/login/m-login.data";
import { useAuth } from "../../../utils/hooks/useAuth";
import { apiPost } from "../../../api/http";
import type { AuthUser } from "../../../utils/state/Auth";
import {
  getLocalStorageGroup,
  setLocalStorageGroup,
} from "../../../whitelabel/src/global/utils/storage/localStorage";

type LoginResponse = {
  user: AuthUser;
  accessToken: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();

  const redirectToRaw = searchParams.get("redirectTo");

  let redirectToDecoded = "/";
  if (redirectToRaw) {
    try {
      redirectToDecoded = decodeURIComponent(redirectToRaw);
    } catch {
      redirectToDecoded = "/";
    }
  }

  const redirectTo = redirectToDecoded.startsWith("/")
    ? redirectToDecoded
    : "/";

  const localStorageUsername =
    getLocalStorageGroup("userPreference")?.username ?? "";

  const [form, setForm] = useState({
    username: localStorageUsername,
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) =>
      apiPost<LoginResponse>("/auth/login", body),
    onSuccess: (data) => {
      login(data);
      navigate(redirectTo, { replace: true });
    },
  });

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    loginMutation.mutate({
      username: form.username,
      password: form.password,
    });

    setLocalStorageGroup("userPreference", { username: form.username });
  };

  return (
    <Login
      {...m_loginData}
      onSubmit={handleSubmit}
      inputs={m_loginData.inputs.map((inp) => ({
        ...inp,
        onChange: handleChange,
        error: loginMutation.isError ? inp.error : {},
        autocomplete: inp.name === "username",
        value: inp.name === "username" ? form.username : form.password,
        autoFocus: inp.name === "password" && !!localStorageUsername,
      }))}
      submitButton={{
        ...m_loginData.submitButton,
        loading: loginMutation.isPending,
        disabled: loginMutation.isPending,
      }}
    />
  );
};

export default LoginPage;
