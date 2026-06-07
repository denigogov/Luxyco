import { useCreateDeliveryType } from "../../../../../features/deliveryType/deliveryType.queries";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import { deliveryTypeNewPageData } from "./deliveryPriceConfigCreate.data";
import type { CreateDeliveryTypeFormValues } from "./deliveryPriceConfigCreate.types";

const DeliveryPriceConfigCreate: React.FC = () => {
  const createMut = useCreateDeliveryType();

  const onSubmit = async (values: CreateDeliveryTypeFormValues) => {
    try {
      await createMut.mutateAsync({
        ...values,
        price: Number(values.price),
      });
      notificationAlert.success(deliveryTypeNewPageData.notification.success);
    } catch (err) {
      notificationAlert.error(deliveryTypeNewPageData.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<CreateDeliveryTypeFormValues>
        fields={deliveryTypeNewPageData.filedsData}
        onSubmit={onSubmit}
        submitButton={{
          ...deliveryTypeNewPageData.submitButton,
          loading: createMut.isPending,
          disabled: createMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default DeliveryPriceConfigCreate;
