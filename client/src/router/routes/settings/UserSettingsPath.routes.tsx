// import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";

import AllUsers from "../../../components/blocks/settings/users/AllUsers/AllUsers";

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
    element: <AllUsers />,
  },
];
