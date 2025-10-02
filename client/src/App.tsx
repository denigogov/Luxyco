import "./test.scss";
import Button from "./whitelabel/src/atoms/button/A-Button";
import type { ButtonTypes } from "./whitelabel/src/atoms/button/a-button.types";

const App = () => {
  const button: ButtonTypes = {
    label: "some text",
    size: "large",
    type: "button",
    style: "primary",
    className: "test",
  };

  return (
    <div className="test">
      app
      <Button {...button} />
    </div>
  );
};

export default App;
