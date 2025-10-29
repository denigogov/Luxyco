import type { ButtonTypes } from "./whitelabel/src/atoms/button/a-button.types";
import type { InputTypes } from "./whitelabel/src/atoms/input/a-input.types";
import Input from "./whitelabel/src/atoms/input/a-input";
import Button from "./whitelabel/src/atoms/button/A-Button";
import Navbar from "./whitelabel/src/organisms/navbar/O-Navbar";
import { o_navbarData } from "./whitelabel/src/organisms/navbar/o-navbar.data";
import { useUIState } from "./utils/hooks/useUIState";

const App = () => {
  const button: ButtonTypes = {
    label: "Преглед",
    size: "medium",
    type: "button",
    style: "nav",
    disabled: false,
    loading: false,
    icon: {
      name: "grid",
      position: "left",
    },
  };

  const button1: ButtonTypes = {
    label: "Налози",
    size: "medium",
    type: "button",
    style: "nav",
    disabled: false,
    loading: false,
    icon: {
      name: "file-text",
      position: "left",
    },
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
      <Button {...button1} />
      <h3>A - Input </h3>
      <Input {...input} />
      <Navbar {...o_navbarData} />
    </div>
  );
};

export default App;
