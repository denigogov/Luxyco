import { RouterProvider } from "react-router";
import { router } from "./router/RootRouter";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
