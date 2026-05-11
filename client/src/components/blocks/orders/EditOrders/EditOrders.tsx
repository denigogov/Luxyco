import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import type { OrderPostResponse } from "../../../../features/orders/orders.types";
import {
  useOrderReferencesList,
  useUpdateOrder,
} from "../../../../features/orders/orders.queries";
import { notificationAlert } from "../../../../utils/hooks/notify";
import { FormBuilder } from "../../../organisms/CustomizableForm/FormBuilder";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import { OrderUpdate } from "./editOrders.data";
import type { EditOrderFormValues } from "./editOrders.types";
import type { UpdateOrderQueryType } from "../CreateOrder/createOrder.types";

const toDateInputValue = (date?: string | null) => date?.slice(0, 10) ?? "";

const getDeliveryTypeName = (deliveryType: any) =>
  deliveryType?.typeName ?? deliveryType?.type_name ?? "";

const buildUpdateOrderDto = (
  values: EditOrderFormValues,
  initial: EditOrderFormValues,
): UpdateOrderQueryType => {
  const dto: UpdateOrderQueryType = {};

  if (values.scheduledDate !== initial.scheduledDate) {
    dto.scheduledDate = values.scheduledDate;
  }

  if ((values.orderNote ?? "").trim() !== (initial.orderNote ?? "").trim()) {
    dto.orderNote = values.orderNote.trim();
  }

  if (Number(values.status) !== Number(initial.status)) {
    dto.orderStatusId = Number(values.status);
  }

  if (Number(values.deliveryType) !== Number(initial.deliveryType)) {
    dto.deliveryTypeId = Number(values.deliveryType);
  }

  return dto;
};

const EditOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const orderFromState = location.state as
    | Partial<OrderPostResponse>
    | undefined;

  const updateMut = useUpdateOrder(Number(id));

  const { data: referencesData, isLoading: referencesLoading } =
    useOrderReferencesList();

  const deliveryTypeOptions = useMemo(() => {
    return (
      referencesData?.deliveryTypes?.map((deliveryType: any) => ({
        label: deliveryType.typeName ?? deliveryType.type_name,
        value: deliveryType.id,
      })) ?? []
    );
  }, [referencesData]);

  const selectedDeliveryTypeId = useMemo(() => {
    const currentDeliveryTypeName = getDeliveryTypeName(
      orderFromState?.deliveryType,
    );

    if (!currentDeliveryTypeName) return "";

    const match = referencesData?.deliveryTypes?.find((deliveryType: any) => {
      return getDeliveryTypeName(deliveryType) === currentDeliveryTypeName;
    });

    return match?.id ?? "";
  }, [orderFromState?.deliveryType, referencesData]);

  const initialForm = useMemo<EditOrderFormValues>(
    () => ({
      scheduledDate: toDateInputValue(orderFromState?.scheduledDate),
      orderNote: orderFromState?.orderNote ?? "",
      status: orderFromState?.status?.id ?? "",
      deliveryType: selectedDeliveryTypeId,
      customerAddress:
        orderFromState?.customerAddresses?.formattedAddress ?? "Нема адреса",
    }),
    [orderFromState, selectedDeliveryTypeId],
  );

  const fields = useMemo(() => {
    return (OrderUpdate.filedsData as RHFInputProps<EditOrderFormValues>[]).map(
      (field) => {
        if (field.name === "deliveryType") {
          return {
            ...field,
            options: deliveryTypeOptions,
            disabled: referencesLoading,
            defaultValue: initialForm[field.name],
          };
        }

        return {
          ...field,
          defaultValue: initialForm[field.name],
        };
      },
    );
  }, [initialForm, deliveryTypeOptions, referencesLoading]);

  const warnedRef = useRef(false);

  useEffect(() => {
    if (!orderFromState && !warnedRef.current) {
      warnedRef.current = true;

      notificationAlert.warning({
        title: "Не може да се отвори преку споделен линк",
        text: "За да се зачуваат точни податоци, страницата за уредување мора да се отвори од листата на нарачки.",
      });

      navigate("/orders", { replace: true });
    }
  }, [orderFromState, navigate]);

  const onSubmit = async (values: EditOrderFormValues) => {
    try {
      const dto = buildUpdateOrderDto(values, initialForm);

      if (Object.keys(dto).length === 0) {
        notificationAlert.warning({
          title: "Нема промени",
          text: "Не направивте никаква промена за ажурирање.",
        });
        return;
      }

      await updateMut.mutateAsync(dto);

      navigate(-1);
      notificationAlert.success(OrderUpdate.notification.success);
    } catch (err) {
      notificationAlert.error(OrderUpdate.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<EditOrderFormValues>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...OrderUpdate.submitButton,
          disabled: updateMut.isPending || referencesLoading,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default EditOrders;
