import Button from "./whitelabel/src/atoms/button/a-button";

import type { ButtonTypes } from "./whitelabel/src/atoms/button/a-button.types";
import type { InputTypes } from "./whitelabel/src/atoms/input/a-button.types";
import Input from "./whitelabel/src/atoms/input/a-input";

const App = () => {
  const button: ButtonTypes = {
    label: "some text",
    size: "large",
    type: "button",
    style: "tertiary",
    disabled: true,
  };

  const input: InputTypes = {
    type: "text",
    label: "hoho",
    placeholder: "vmvmmv",
    icon: {
      name: "plus",
      position: "left",
    },
  };

  return (
    <div className="test">
      app
      <Button {...button} />
      <h3>input</h3>
      <Input {...input} />
    </div>
  );
};

export default App;
