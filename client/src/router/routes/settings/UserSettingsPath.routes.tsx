// import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";

const User = () => {
  return <h1>All USER VVVS</h1>;
};

// const modalBase: ModalTypes = {
//   options: {
//     initialOpen: true,
//     returnBack: true,
//   },
// };

export const userSubRoutes = [
  {
    fullPath: "/settings/user",
    path: "user",
    element: <User />,
  },
];
