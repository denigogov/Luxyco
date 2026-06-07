import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import type { EditDeliveryTypeFormValues } from "./deliveryPriceConfigEdit.types";
import { useDeliveryTypeUpdate } from "../../../../../features/deliveryType/deliveryType.queries";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import {
  deliveryPriceConfigEditData,
  deliveryTypeEditMessages,
} from "./deliveryPriceConfigEdit.data";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";

const DeliveryPriceConfigEdit: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const typeID = Number(id);
  const warnedRef = useRef(false);

  const isValidDeliveryTypeID = Number.isFinite(typeID) && typeID > 0;

  const deliveryTypeDataState = location.state as
    | EditDeliveryTypeFormValues
    | undefined;

  const updateMut = useDeliveryTypeUpdate(typeID);

  useEffect(() => {
    if (!deliveryTypeDataState && !warnedRef.current) {
      warnedRef.current = true;
      notificationAlert.warning(deliveryTypeEditMessages.invalidateState);
      navigate(`../delivery`, { replace: true });
    }
  }, [deliveryTypeDataState, navigate]);

  const priceFormat =
    deliveryTypeDataState?.price != null
      ? String(deliveryTypeDataState.price).replace(/[^\d.,-]/g, "")
      : undefined;

  const initialForm = useMemo<Partial<EditDeliveryTypeFormValues>>(
    () => ({
      isActive: deliveryTypeDataState?.status === "Активен" ? true : false,
      price: Number(priceFormat),
      typeName: deliveryTypeDataState?.type ?? undefined,
    }),
    [deliveryTypeDataState],
  );

  const fields = useMemo(() => {
    return (
      deliveryPriceConfigEditData.filedsData as RHFInputProps<EditDeliveryTypeFormValues>[]
    ).map((f) => ({
      ...f,
      defaultValue: initialForm[f.name],
    }));
  }, [initialForm]);

  const onSubmit = async (values: EditDeliveryTypeFormValues) => {
    if (!isValidDeliveryTypeID) return;

    try {
      await updateMut.mutateAsync({
        ...values,
        price: Number(values.price),
      });

      notificationAlert.success(deliveryTypeEditMessages.successUpdate);
      navigate(-1);
    } catch (err) {
      notificationAlert.error(deliveryTypeEditMessages.errorUpdate);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<EditDeliveryTypeFormValues>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...deliveryPriceConfigEditData.submitButton,
          loading: updateMut.isPending,
          disabled: updateMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default DeliveryPriceConfigEdit;
