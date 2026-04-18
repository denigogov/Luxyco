import { useLocation, useNavigate, useParams } from "react-router";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { detailsOrderData } from "./detailsOrder.data";

const DetailsOrder: React.FC = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(id);

  return (
    <div>
      <h1>Order Details</h1>
      <Table {...detailsOrderData.table} />
    </div>
  );
};

export default DetailsOrder;
