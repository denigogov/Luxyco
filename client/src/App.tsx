import Button from "./whitelabel/src/atoms/button/a-button";

import type { ButtonTypes } from "./whitelabel/src/atoms/button/a-button.types";
import type { InputTypes } from "./whitelabel/src/atoms/input/a-input.types";
import Input from "./whitelabel/src/atoms/input/a-input";

const App = () => {
  const button: ButtonTypes = {
    label: "some text",
    size: "large",
    type: "button",
    style: "primary",
    disabled: false,
  };

  const input: InputTypes = {
    type: "text",
    label: "Label",
    placeholder: "placeholder",
    name: "username",
    autocomplete: false,
    required: true,
    icon: {
      name: "user",
      position: "left",
    },
  };

  return (
    <div className="test">
      app
      <Button {...button} />
      <h3>A - Input</h3>
      <Input {...input} />
    </div>
  );
};

export default App;
