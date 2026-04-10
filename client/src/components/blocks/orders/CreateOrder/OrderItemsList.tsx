import {
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  Controller,
} from "react-hook-form";

import ASelect from "../../../../whitelabel/src/atoms/formComponents/select/A-select";
import Input from "../../../../whitelabel/src/atoms/input/a-input";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import type { CreateOrderQueryType } from "./createOrder.types";

interface OrderItemsListProps {
  control: Control<CreateOrderQueryType>;
  register: UseFormRegister<CreateOrderQueryType>;
  productTypesData: any[];
  errors: FieldErrors<CreateOrderQueryType>;
}

const OrderItemsList = ({
  control,
  register,
  productTypesData,
  errors,
}: OrderItemsListProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <>
      <div className="b-createOrder__itemList">
        {fields.map((field, index) => {
          // Properly access the error for this specific row
          const itemError = errors.items?.[index];

          return (
            <div
              key={field.id}
              className="b-createOrder__itemRow-wrapper"
              style={{ marginBottom: "1rem" }}
            >
              <div className="b-createOrder__itemRow">
                {/* 1. Product Selection using Controller */}
                <div>
                  <Controller
                    control={control}
                    name={`items.${index}.productTypeId` as const}
                    rules={{ required: "Изберете производ" }}
                    render={({ field: { onChange, value, name } }) => (
                      <ASelect
                        label={index === 0 ? "Тип на производ" : undefined}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder="— Изберете —"
                        error={itemError?.productTypeId}
                        options={productTypesData.map((p) => ({
                          label: `${p.name} (${p.basePrice} ден)`,
                          value: String(p.id),
                        }))}
                      />
                    )}
                  />
                </div>

                {/* 2. Quantity */}
                <div>
                  {index === 0 && <label className="uk-form-label">Кол.</label>}
                  <input
                    className={`uk-input ${itemError?.quantity ? "uk-form-danger" : ""}`}
                    type="number"
                    {...register(`items.${index}.quantity` as const, {
                      required: "Внесете количина",
                      min: { value: 1, message: "Минимум 1" },
                      valueAsNumber: true,
                    })}
                  />
                  {itemError?.quantity && (
                    <div className="uk-text-danger uk-text-small">
                      {itemError.quantity.message}
                    </div>
                  )}
                </div>

                {/* 3. Piece Note */}
                <Input
                  type="text"
                  label={index === 0 ? "Забелешка" : undefined}
                  placeholder="опционално..."
                  {...register(`items.${index}.pieceNote` as const)}
                />

                <Button
                  label="deleteIcon"
                  icon={{ name: "trash" }}
                  onlyIcon={true}
                  style="danger"
                  className="b-createOrder__itemRow-deleteButton"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                  type="button"
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="b-createOrder__addButton uk-width-1-1 uk-margin-top@s"
        onClick={() =>
          append({ productTypeId: "", quantity: 1, pieceNote: "" })
        }
      >
        + Додај парче
      </button>
    </>
  );
};

export default OrderItemsList;
