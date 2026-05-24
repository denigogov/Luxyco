import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { notificationAlert } from "../../../../utils/hooks/notify";
import { RHFInput } from "../../../organisms/CustomizableForm/RHFInput";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import { calcM2 } from "../../../../utils/helpers/calcm2";
import { OrderPieceUpdate } from "./orderPieces.data";
import "./orderPieces.styles.scss";
import type {
  OrderPieceFormValues,
  OrderPieceState,
} from "./orderPieces.types";
import {
  useOrderDetail,
  useUpdateOrderPiece,
} from "../../../../features/orders/orders.queries";
import ErrorWrapper from "../../ErrorWrapper";

// import { useUpdateOrderPiece } from "../../../../features/orders/orders.queries";

const OrderPieces: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { id, qr } = useParams<{
    id: string;
    qr: string;
  }>();

  const pieceFromState = state as OrderPieceState | undefined;

  const shouldFetchOrder = !pieceFromState;

  const { data, isPending, error } = useOrderDetail(id, shouldFetchOrder);
  const updatePieceMutation = useUpdateOrderPiece(id!, qr!);

  const pieceFromApi = useMemo<OrderPieceState | undefined>(() => {
    if (!data?.orderPieces?.length || !qr) return undefined;

    const foundPiece = data.orderPieces.find(
      (piece: any) => piece.labelCode === qr,
    );
    const customer = `${data?.customers?.firstName} ${data?.customers?.lastName}`;

    if (!foundPiece) return undefined;

    const hasDimension = Boolean(foundPiece.width && foundPiece.height);
    const priceModel = foundPiece.productTypes?.priceModel?.name;
    const needsMeasurement = priceModel === "PER_M2" && !hasDimension;

    return {
      id: foundPiece.id,
      qrCode: foundPiece.labelCode,
      product: foundPiece.productTypes?.name ?? "/",
      dimension: hasDimension
        ? `${foundPiece.width} * ${foundPiece.height}`
        : "-",
      price: `${foundPiece.price ?? 0}`,
      note: foundPiece.pieceNote ?? "",
      measuredBy: foundPiece.users
        ? `${foundPiece.users.firstName ?? ""} ${
            foundPiece.users.lastName ?? ""
          }`.trim()
        : "",
      index: `${foundPiece.pieceIndex}/${data.totalPieces ?? 0}`,
      isReady: !needsMeasurement,
      needsMeasurement,
      width: foundPiece.width,
      height: foundPiece.height,
      customer,
    };
  }, [data, qr]);

  const piece = pieceFromState ?? pieceFromApi;

  // const updatePieceMutation = useUpdateOrderPiece(Number(data?.id), Number(piece?.id));

  const initialForm = useMemo<OrderPieceFormValues>(
    () => ({
      width: piece?.width ? String(piece.width) : "",
      height: piece?.height ? String(piece.height) : "",
      pieceNote: piece?.note ?? "",
    }),
    [piece],
  );

  const methods = useForm<OrderPieceFormValues>({
    defaultValues: initialForm,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    methods.reset(initialForm);
  }, [initialForm, methods]);

  const fields = useMemo(
    () =>
      OrderPieceUpdate.filedsData.map((field) => ({
        ...field,
        defaultValue: initialForm[field.name],
      })),
    [initialForm],
  );

  const {
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = methods;

  const width = watch("width");
  const height = watch("height");

  const m2 = calcM2(width, height);
  const formattedM2 = m2 > 0 ? m2.toFixed(2) : "0.00";

  const onSubmit = async (values: OrderPieceFormValues) => {
    if (!id || !qr || !piece) return;

    try {
      const dto = {
        width: Number(values.width),
        height: Number(values.height),
        pieceNote: values.pieceNote?.trim() || null,
      };

      await updatePieceMutation.mutateAsync(dto);

      notificationAlert.success(OrderPieceUpdate.notification.success);
      navigate(-1);
    } catch (err) {
      notificationAlert.error(OrderPieceUpdate.notification.error);
      console.error(err);
    }
  };

  if (shouldFetchOrder && isPending) {
    return <h1>Loading</h1>;
  }

  if (shouldFetchOrder && error) {
    return <ErrorWrapper />;
  }

  if (!piece) {
    return (
      <div className="b-newCustomerNote">
        <h3 className="uk-margin-remove">Парчето не е пронајдено</h3>
        <p className="uk-text-meta uk-margin-small-top">
          QR кодот <strong>{qr}</strong> не е пронајден во оваа нарачка.
        </p>
      </div>
    );
  }

  return (
    <div className="b-newCustomerNote">
      <div className="uk-margin-small-bottom">
        <h3 className="uk-margin-remove">Додади димензии</h3>
        <h4 className="uk-margin-small uk-text-meta order-piece-index-preview">
          Клиент: <b>{piece?.customer}</b>
        </h4>

        <p className="uk-text-meta uk-margin-small-top">
          Парче:{" "}
          <span className="order-piece-index-preview">
            {piece.index ?? "/"}
          </span>
          {" · "}
          QR: <span className="order-piece-index-preview">{qr}</span>
        </p>

        {piece.product && (
          <p className="uk-text-meta uk-margin-remove-top">
            Производ:{" "}
            <span className="order-piece-index-preview">{piece.product}</span>
          </p>
        )}
      </div>

      <FormProvider {...methods}>
        <form
          className="uk-grid-small uk-margin-small-top"
          data-uk-grid
          onSubmit={handleSubmit(onSubmit)}
        >
          {fields.map((field) => (
            <div
              key={String(field.name)}
              className={
                field.width ? `uk-width-1-${field.width}` : "uk-width-1-1"
              }
            >
              <RHFInput<OrderPieceFormValues> {...field} />
            </div>
          ))}

          <div className="uk-width-1-1">
            <div className="order-piece-m2-preview">
              <span className="order-piece-m2-preview__label">
                Вкупна површина:
              </span>

              <span className="order-piece-m2-preview__value">
                {formattedM2} m²
              </span>
            </div>
          </div>

          <div className="uk-width-1-1 uk-margin-medium-top uk-flex uk-flex-right">
            <Button
              {...OrderPieceUpdate.submitButton}
              type="submit"
              disabled={!isDirty || isSubmitting}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default OrderPieces;
