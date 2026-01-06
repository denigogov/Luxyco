import { Route } from "react-router";
import { allowedPaths } from "../../../utils/brands";
import Customers from "../../../components/blocks/customers/All/Customers";
import CustomerDetails from "../../../components/blocks/customers/Details/CustomerDetails";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import EditAddresses from "../../../components/blocks/customers/Addresses/EditAddress/EditAddresses";
import NewCustomerAddress from "../../../components/blocks/customers/Addresses/NewAddress/NewCustomerAddress";
import NewNote from "../../../components/blocks/customers/Notes/NewNote";
import EditNote from "../../../components/blocks/customers/Notes/EditNote";
import AddCustomer from "../../../components/blocks/customers/AddCustomer/AddCustomer";

// test component here i don't create new components !

const modalBase = {
  modalOpen: true,
  modalBackgroundScroll: "hidden" as const,
  modalClose: { top: false, bottom: true, outSide: false },
};

const orderSubRoutes = [
  {
    fullPath: "/customers/new",
    path: "new",
    element: <AddCustomer />,
  },
  {
    fullPath: "/customers/:customerId/addresses/new",
    path: ":customerId/addresses/new",
    element: <NewCustomerAddress />,
  },
];

const customerDetailsSubRoutee = [
  {
    fullPath: "/customers/:customerId/addresses/:addressId/edit",
    path: "addresses/:addressId/edit",
    element: (
      <Modal
        modalData={{
          ...modalBase,
          modalName: { name: "Edit address", button: true, classes: "" },
        }}
      >
        <EditAddresses />
      </Modal>
    ),
  },
  {
    fullPath: "/customers/:customerId/notes/:noteId/edit",
    path: "notes/:noteId/edit",
    element: (
      <Modal
        modalData={{
          ...modalBase,
          modalName: { name: "Edit note", button: true, classes: "" },
        }}
      >
        <EditNote />
      </Modal>
    ),
  },
  {
    fullPath: "/customers/:customerId/notes/add",
    path: "notes/add",
    element: (
      <Modal
        modalData={{
          ...modalBase,
          modalName: { name: "Add note", button: true, classes: "" },
        }}
      >
        <NewNote />
      </Modal>
    ),
  },
];

export const CustomersRoutes = (
  <Route path="customers">
    <Route index element={<Customers />} />

    {orderSubRoutes
      .filter((r) => allowedPaths.includes(r.fullPath))
      .map((r) => (
        <Route key={r.path} path={r.path} element={r.element} />
      ))}

    <Route path=":customerId" element={<CustomerDetails />}>
      {customerDetailsSubRoutee
        .filter((r) => allowedPaths.includes(r.fullPath))
        .map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
    </Route>
  </Route>
);
