import { useCreateProduct } from "../../../../../features/price/price.queries";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import { priceConfigurationNewPageData } from "./priceConfigurationNew.data";
import type { CreateProductFormValues } from "./priceConfigurationNew.types";

const PriceConfigurationNew: React.FC = () => {
  const createMut = useCreateProduct();

  const onSubmit = async (values: CreateProductFormValues) => {
    try {
      await createMut.mutateAsync({
        ...values,
      });
      notificationAlert.success(
        priceConfigurationNewPageData.notification.success,
      );
    } catch (err) {
      notificationAlert.error(priceConfigurationNewPageData.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<CreateProductFormValues>
        fields={priceConfigurationNewPageData.filedsData}
        onSubmit={onSubmit}
        submitButton={{
          ...priceConfigurationNewPageData.submitButton,
          loading: createMut.isPending,
          disabled: createMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default PriceConfigurationNew;
