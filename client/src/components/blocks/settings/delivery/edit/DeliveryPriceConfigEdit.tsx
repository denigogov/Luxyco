import { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";

const DeliveryPriceConfigEdit: React.FC = () => {
  const { id } = useParams();
  const productID = Number(id);

  const warnedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  console.log(location);
  return <div>DeliveryPriceEdit Componentsss </div>;
};

export default DeliveryPriceConfigEdit;
