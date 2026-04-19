const useCreateOrder = () => {
  const calculateTotalPrice = (
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

  return { calculateTotalPrice };
};

export default useCreateOrder;
