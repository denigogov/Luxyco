import { router } from "./utils/router/RootRounter";
import { RouterProvider } from "react-router";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
