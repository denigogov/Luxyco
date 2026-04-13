// createOrder.helpers.ts
import { type Customer } from "../../../../features/customers/customers.types";
import type { CreateOrderQueryType } from "./createOrder.types";

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

export const customerContentMapper = (
  customer: Pick<
    Customer,
    "firstName" | "lastName" | "phoneNumber" | "customerAddresses"
  >,
) => ({
  title: `${customer.firstName} ${customer.lastName}`,
  subtitle: customer.phoneNumber,
  footer:
    customer.customerAddresses.find((a) => a.isDefault)?.formattedAddress ??
    customer.customerAddresses[0]?.formattedAddress,
});

export const createOrderDefaultValues: CreateOrderQueryType = {
  customerId: null,
  deliveryAddressId: null,
  deliveryTypeId: "",
  serviceTypeId: "",
  scheduledDate: new Date().toISOString().split("T")[0],
  orderNote: "",
  items: [{ productTypeId: "", quantity: 1, pieceNote: "" }],
};

export const buildOrderPayload = (formData: any) => ({
  ...formData,
  deliveryTypeId: formData.deliveryTypeId
    ? Number(formData.deliveryTypeId)
    : null,
  serviceTypeId: formData.serviceTypeId ? Number(formData.serviceTypeId) : null,
  customerId: Number(formData.customerId),
  deliveryAddressId: Number(formData.deliveryAddressId),
});
