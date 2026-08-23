import { useNavigate, useParams } from "react-router";
import {
  useCreateAdditionalPiece,
  useOrderReferencesList,
} from "../../../../features/orders/orders.queries";
import OrderItemsList from "../CreateOrder/OrderItemsList";
import { useForm } from "react-hook-form";
import type { CreateOrderQueryType } from "../CreateOrder/createOrder.types";
import { notificationAlert } from "../../../../utils/hooks/notify";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import { notificationMessage } from "./AdditionalPieces.data";

const AdditionalPieces: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const createAdditionalPieceMut = useCreateAdditionalPiece(Number(id));

  const { data: referencesData } = useOrderReferencesList();

  const productTypesData = referencesData?.productTypes || [];

  const {
    control,
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateOrderQueryType>({
    shouldFocusError: true,
    criteriaMode: "all",
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const watchedItems = watch("items");
  const defaultValues = {
    items: [{ productTypeId: "", quantity: 1, pieceNote: "" }],
  };

  const onSubmit = async (formData: any) => {
    try {
      await createAdditionalPieceMut.mutateAsync(formData);
      notificationAlert.success(notificationMessage.apiSuccess);
      navigate("../");
      reset({
        ...defaultValues,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        notificationMessage.apiError.text;

      notificationAlert.error({
        title: notificationMessage.apiError.title,
        text: message,
      });
    }
  };

  return (
    <form className="uk-padding" onSubmit={handleSubmit(onSubmit)}>
      <OrderItemsList
        control={control}
        register={register}
        productTypesData={productTypesData}
        errors={errors}
      />
      <div className="uk-padding-small uk-padding-remove-horizontal uk-flex uk-flex-right">
        <Button
          style="secondary"
          label="додади парчиња"
          type="submit"
          disabled={watchedItems?.length === 0}
        />
      </div>
    </form>
  );
};

export default AdditionalPieces;
