import { useLocation, useNavigate, useParams } from "react-router";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import {
  priceConfigurationEditPageData,
  productEditMessages,
} from "./priceConfigurationEdit.data";
import type { EditProductFormValues } from "./priceConfigurationEdit.types";
import { useEffect, useMemo, useRef } from "react";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import { useProductUpdate } from "../../../../../features/price/price.queries";
const priceModelValueMap: Record<string, string> = {
  "По М2": "1",
  "По Парче": "2",
};
const PriceConfigurationEdit: React.FC = () => {
  const { id } = useParams();
  const productID = Number(id);

  const warnedRef = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isValidIdProductNUmber = Number.isFinite(productID) && productID > 0;
  const updateProductMutation = useProductUpdate(productID);

  const productFromState = location.state;

  const initialForm = useMemo<Partial<EditProductFormValues>>(
    () => ({
      basePrice: productFromState.price ?? "",
      name: productFromState?.product ?? "",
      priceModelId: priceModelValueMap[productFromState?.priceModel] ?? "",
      isActive: productFromState?.status === "Активен" ? true : false, // state dont send boolean send text base table value
    }),
    [productFromState],
  );

  useEffect(() => {
    if (warnedRef.current) return;

    if (!isValidIdProductNUmber) {
      warnedRef.current = true;
      notificationAlert.warning({
        title: productEditMessages.invalidateLinkMessage.title,
        text: productEditMessages.invalidateLinkMessage.text,
      });
      navigate("/settings/price", { replace: true });
      return;
    }

    if (!productFromState) {
      warnedRef.current = true;
      notificationAlert.warning({
        title: productEditMessages.invalidateLinkMessage.title,
        text: productEditMessages.invalidateLinkMessage.text,
      });

      navigate("/settings/price");
    }
  }, [isValidIdProductNUmber, productFromState, productID, navigate]);

  const fields = useMemo(() => {
    return (
      priceConfigurationEditPageData.filedsData as RHFInputProps<EditProductFormValues>[]
    ).map((field) => ({
      ...field,
      defaultValue: initialForm[field.name],
    }));
  }, [initialForm]);

  const onSubmit = async (values: EditProductFormValues) => {
    if (!isValidIdProductNUmber) return;

    try {
      await updateProductMutation.mutateAsync(values);

      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<EditProductFormValues>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...priceConfigurationEditPageData.submitButton,
          // loading: createMut.isPending,
          // disabled: createMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default PriceConfigurationEdit;
