// createOrder.helpers.ts
import { type Customer } from "../../../../features/customers/customers.types";

export const calculateTotalPieces = (items: any[]) => {
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
};

export const calculateTotalPrice = (
  items: any[],
  productTypesData: any[],
  deliveryPrice: number,
) => {
  const itemsTotal = items.reduce((sum, item) => {
    const product = productTypesData
      .filter((type) => type.priceModelId === 2)
      .find((p) => String(p.id) === item.productTypeId);

    const basePrice = parseFloat(product?.basePrice ?? "0");
    return sum + basePrice * (Number(item.quantity) || 0);
  }, 0);

  return itemsTotal + Number(deliveryPrice);
};

export const getCustomerDefaultAddress = (customer: Customer) => {
  const defaultAddr = customer.customerAddresses.find((a) => a.isDefault);
  return defaultAddr?.id ?? customer.customerAddresses[0]?.id ?? null;
};
