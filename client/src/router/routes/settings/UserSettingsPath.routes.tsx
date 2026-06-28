import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import AllUsers from "../../../components/blocks/settings/users/AllUsers/AllUsers";
import CreateUser from "../../../components/blocks/settings/users/CreateUser/CreateUser";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import UpdateUser from "../../../components/blocks/settings/users/UpdateUser/UpdateUser";

const modalBase: ModalTypes = {
  options: {
    initialOpen: true,
    returnBack: true,
  },
};

export const userSubRoutes = [
  {
    fullPath: "/settings/user",
    path: "user",
    element: <AllUsers />,
  },
  {
    fullPath: "/settings/user/add",
    path: "user/add",
    element: (
      <Modal {...modalBase}>
        <CreateUser />,
      </Modal>
    ),
  },

  {
    fullPath: "/settings/user/edit/:id",
    path: "user/edit/:id",
    element: (
      <Modal {...modalBase}>
        <UpdateUser />,
      </Modal>
    ),
  },
];
