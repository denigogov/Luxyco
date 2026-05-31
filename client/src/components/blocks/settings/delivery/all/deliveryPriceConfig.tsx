import Table from "../../../../../whitelabel/src/molecules/table/M-table";
import { deliveryPriceConfigData } from "./deliveryPriceConfig.data";

const DeliveryPriceConfig: React.FC = () => {
  return (
    <div>
      <Table {...deliveryPriceConfigData.table} />
    </div>
  );
};

export default DeliveryPriceConfig;
