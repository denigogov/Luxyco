import { useNavigate, useParams } from "react-router";
import type { ModalTypes } from "../../../whitelabel/src/organisms/Modal/modal.types";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import OrderPieces from "../../../components/blocks/orders/OrderPieces/OrderPieces";

const OrderPiecesModal = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const modalBase: ModalTypes = {
    options: {
      initialOpen: true,
      returnBack: false,
    },
    onAfterClose: () => {
      navigate(id ? `/orders/${id}` : "/orders", { replace: true });
    },
  };

  return (
    <Modal {...modalBase}>
      <OrderPieces />
    </Modal>
  );
};

export default OrderPiecesModal;
