import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./utils/state/Auth.tsx";
import { UIProvider } from "./whitelabel/src/global/utils/state/UIContext.tsx";

import UIkit from "uikit";
import Icons from "uikit/dist/js/uikit-icons";

import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit.min.js";
import App from "./App.tsx";
import { QueryProvider } from "./query/QueryProvider.tsx";

UIkit.use(Icons);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryProvider>
        <UIProvider>
          <App />
        </UIProvider>
      </QueryProvider>
    </AuthProvider>
  </StrictMode>
);
