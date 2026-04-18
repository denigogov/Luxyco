// CreateOrder.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import SidebarSummary from "../../../../whitelabel/src/organisms/SidebarSummary/SidebarSummary";
import { useCustomersOrderList } from "../../../../features/customers/customers.queries";
import { type Customer } from "../../../../features/customers/customers.types";
import { useDebouncer } from "../../../../utils/helpers/debouncer";
import AddCustomer from "../../customers/AddCustomer/AddCustomer";
import Autocomplete from "../../../../whitelabel/src/atoms/аutocomplete/Autocomplete";
import CustomerSelectionPanel from "../../../organisms/customerSelectionPanel/CustomerSelectionPanel";
import NewCustomerAddress from "../../customers/Addresses/NewAddress/NewCustomerAddress";
import ASelect from "../../../../whitelabel/src/atoms/formComponents/select/A-select";
import {
  useCreateOrder,
  useOrderReferencesList,
} from "../../../../features/orders/orders.queries";
import ScheduledDatePicker from "../../../organisms/scheduledDatePicker/ScheduledDatePicker";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import ATextarea from "../../../../whitelabel/src/atoms/formComponents/textarea/A-textarea";
import OrderItemsList from "./OrderItemsList";
import {
  buildOrderPayload,
  calculateTotalPieces,
  calculateTotalPrice,
  createOrderDefaultValues,
  customerContentMapper,
  getCustomerDefaultAddress,
} from "./createOrder.helpers";
import { createOrderData } from "./CreateOrder.data";
import "./createOrder.styles.scss";
import type { CreateOrderQueryType } from "./createOrder.types";
import { useReactToPrint } from "react-to-print";
import { OrderPrintTemplate } from "../../../organisms/orderPrintTemplates/OrderPrintTemplates";
import { brandConfig } from "../../../../utils/brands";
import { notificationAlert } from "../../../../utils/hooks/notify";
import OrderItemsPrintTemplate from "../../../organisms/orderPrintTemplates/orderItemsPrint/OrderItemsPrintTemplate";
import type { OrderPostResponse } from "../../../../features/orders/orders.types";
import PrintActionGroup from "../../../../whitelabel/src/molecules/printActionGroup/PrintActionGroup";

const CreateOrder = () => {
  const BRAND_PRINT_MODE = brandConfig.printMode;

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const isManuallyCleared = useRef(false);
  const customerIdNum = Number(searchParams.get("customerId"));
  const validPreselectedCustomer =
    Number.isFinite(customerIdNum) && customerIdNum > 0;
  const [lastCreatedOrder, setLastCreatedOrder] = useState<any>(null);

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const navigate = useNavigate();
  // --- React Hook Form Setup ---
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateOrderQueryType>({
    defaultValues: createOrderDefaultValues,

    shouldFocusError: true,
    criteriaMode: "all",
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const watchedItems = watch("items");
  const watchedDeliveryTypeId = watch("deliveryTypeId");
  const watchedServiceTypeId = watch("serviceTypeId");
  const watchedScheduledDate = watch("scheduledDate");
  const watchedAddressId = watch("deliveryAddressId");

  // --- API Queries ---
  const debouncedSearch = useDebouncer<string>(searchInput);

  const shouldSearch =
    !isManuallyCleared.current &&
    !selectedCustomer &&
    ((validPreselectedCustomer && !searchInput) ||
      debouncedSearch.trim().length >= 2);

  const { data: customersData, isFetching: isSearching } =
    useCustomersOrderList(
      shouldSearch
        ? {
            id:
              validPreselectedCustomer && !searchInput
                ? String(customerIdNum)
                : undefined,
            search: debouncedSearch.trim(),
            limit: 8,
          }
        : {},
    );

  const { data: referencesData, isLoading: referencesLoading } =
    useOrderReferencesList();
  const createMut = useCreateOrder();

  // separate query when new customer address is added the list to be updated !
  const { data: selectedCustomerFreshData } = useCustomersOrderList(
    selectedCustomer ? { id: String(selectedCustomer.id), limit: 1 } : {},
    !!selectedCustomer,
  );
  useEffect(() => {
    if (
      selectedCustomer &&
      selectedCustomerFreshData?.data?.length &&
      selectedCustomerFreshData.data[0].id === selectedCustomer.id
    ) {
      setSelectedCustomer(selectedCustomerFreshData.data[0]);
    }
  }, [selectedCustomerFreshData]);

  const deliveryTypesData = referencesData?.deliveryTypes ?? [];
  const serviceTypesData = referencesData?.serviceTypes ?? [];
  const productTypesData = referencesData?.productTypes ?? [];

  // --- RESTORED: Effect for URL Preselection ---
  useEffect(() => {
    if (
      !isManuallyCleared.current &&
      validPreselectedCustomer &&
      !selectedCustomer &&
      customersData?.data?.length &&
      customersData.data[0].id === customerIdNum
    ) {
      const customer = customersData.data[0];
      handleSelectCustomer(customer);
    }
  }, [
    customersData,
    validPreselectedCustomer,
    selectedCustomer,
    customerIdNum,
  ]);

  // --- Search & Customer Handlers ---
  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (!value) {
      isManuallyCleared.current = true;
      setSelectedCustomer(null);
      setValue("customerId", null);
      setValue("deliveryAddressId", null);
      setShowDropdown(false);
      // Clear the URL
      setSearchParams(new URLSearchParams());
      return;
    }

    isManuallyCleared.current = false;
    // Show dropdown if user is typing
    setShowDropdown(value.trim().length >= 2);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchInput(`${customer.firstName} ${customer.lastName}`);
    setShowDropdown(false);
    setSearchParams({ customerId: String(customer.id) });

    // Update Hook Form
    setValue("customerId", customer.id);
    setValue("deliveryAddressId", getCustomerDefaultAddress(customer));
  };

  // --- Calculations ---
  const totalPieces = calculateTotalPieces(watchedItems);
  const deliveryPrice =
    deliveryTypesData.find((d) => String(d.id) === watchedDeliveryTypeId)
      ?.price ?? 0;

  const totalPrice = calculateTotalPrice(
    watchedItems,
    productTypesData,
    Number(deliveryPrice),
  );

  const onSubmit = async (formData: any) => {
    try {
      const payload = buildOrderPayload(formData);
      const response = (await createMut.mutateAsync(
        payload,
      )) as OrderPostResponse;
      setLastCreatedOrder(response);

      if (BRAND_PRINT_MODE === "manual") {
        setTimeout(() => {
          handlePrint();

          setTimeout(() => {
            reset({
              ...createOrderDefaultValues,
            });
            setSelectedCustomer(null);
            setSearchInput("");
            setSearchParams(new URLSearchParams());
            isManuallyCleared.current = false;
          }, 800);
        }, 500);
      } else {
        reset({
          ...createOrderDefaultValues,
        });
        setSelectedCustomer(null);
        setSearchInput("");
        setSearchParams(new URLSearchParams());
        isManuallyCleared.current = false;
      }

      notificationAlert.success({
        title: "Нарачката е креирана",
        text: `Нарачка за ${response?.customers?.firstName ?? ""} ${response?.customers?.lastName ?? ""} е успешно внесена во системот.`,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        error?.message ??
        "Се случи грешка. Обидете се повторно.";

      notificationAlert.error({
        title: "Грешка при креирање",
        text: message,
      });
    }
  };

  const mainTicketRef = useRef<HTMLDivElement>(null);
  const itemLabelsRef = useRef<HTMLDivElement>(null);

  const handlePrintMainTicket = useReactToPrint({
    contentRef: mainTicketRef,
  });

  const handlePrintItemLabels = useReactToPrint({
    contentRef: itemLabelsRef,
  });

  const navigateToAllOrders = () => navigate(0);

  return (
    <>
      {" "}
      {!lastCreatedOrder && (
        <form className="b-createOrder" onSubmit={handleSubmit(onSubmit)}>
          {/* 1. CUSTOMER SECTION */}

          <>
            <div>
              {!selectedCustomer ? (
                <Autocomplete
                  searchInput={searchInput}
                  onSearchChange={handleSearchChange}
                  results={customersData?.data ?? []}
                  isSearching={isSearching}
                  showDropdown={showDropdown}
                  onShowDropdown={setShowDropdown}
                  onSelectItem={handleSelectCustomer}
                  showNotFound={
                    !isSearching &&
                    shouldSearch &&
                    (customersData?.data ?? []).length === 0
                  }
                  notFoundMessage="Корисникот не е пронајден"
                  contentMapper={customerContentMapper}
                  notFoundActionModal={{
                    ...createOrderData.createCustomerModal,
                    children: <AddCustomer noFormTag={true} />,
                  }}
                />
              ) : (
                <CustomerSelectionPanel
                  customer={selectedCustomer}
                  selectedAddressId={watchedAddressId}
                  onAddressChange={(id) => setValue("deliveryAddressId", id)}
                  onRemoveCustomer={() => handleSearchChange("")}
                  createCustomer={{
                    ...createOrderData.createCustomerAddressModal,
                    children: (
                      <NewCustomerAddress
                        customerId={selectedCustomer?.id}
                        noFormTag={true}
                      />
                    ),
                  }}
                />
              )}
            </div>

            {selectedCustomer && (
              <>
                {/* 2. ORDER DETAILS CARD */}
                <div className="b-createOrder__card">
                  <div className="b-createOrder__sectionLabel">
                    Детали за Нарачката
                  </div>
                  {referencesLoading ? (
                    <p>Вчитување...</p>
                  ) : (
                    <div className="b-createOrder__optionsGrid">
                      <div>
                        <Controller
                          name="serviceTypeId"
                          control={control}
                          render={({ field }) => (
                            <ASelect
                              {...createOrderData.selectServiceTypeOpt}
                              {...field}
                              options={serviceTypesData.map((s) => ({
                                label: s.serviceName,
                                value: String(s.id),
                              }))}
                            />
                          )}
                        />
                        {errors.serviceTypeId && (
                          <span className="uk-text-danger uk-text-small">
                            {errors.serviceTypeId.message as string}
                          </span>
                        )}
                      </div>

                      <div>
                        <Controller
                          name="deliveryTypeId"
                          control={control}
                          rules={{ required: "Изберете тип на достава" }}
                          render={({ field }) => (
                            <ASelect
                              {...createOrderData.selecetDeliveryOpt}
                              {...field}
                              options={deliveryTypesData.map((d) => ({
                                label: d.typeName,
                                value: String(d.id),
                              }))}
                            />
                          )}
                        />
                        {errors.deliveryTypeId && (
                          <span className="uk-text-danger uk-text-small">
                            {errors.deliveryTypeId.message as string}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. ORDER NOTE CARD */}
                <div className="b-createOrder__card">
                  <div className="b-createOrder__sectionLabel">
                    Забелешка за Нарачката
                  </div>
                  <Controller
                    name="orderNote"
                    control={control}
                    render={({ field: { onChange, value, name } }) => (
                      <ATextarea
                        name={name}
                        value={value || ""}
                        onChange={onChange}
                        placeholder="напишете забелжка поврзена со нарачката"
                      />
                    )}
                  />
                </div>

                {/* 4. ITEMS LIST CARD */}
                <div className="b-createOrder__card">
                  <div className="b-createOrder__sectionLabel">Ставки</div>
                  <OrderItemsList
                    control={control}
                    register={register}
                    productTypesData={productTypesData}
                    errors={errors}
                  />

                  <div className="b-createOrder__scheduleDate">
                    <Controller
                      name="scheduledDate"
                      control={control}
                      rules={{ required: "Изберете датум" }}
                      render={({ field }) => (
                        <>
                          <ScheduledDatePicker
                            value={field.value}
                            onChange={field.onChange}
                          />
                          {errors.scheduledDate && (
                            <span className="uk-text-danger uk-text-small">
                              {errors.scheduledDate.message as string}
                            </span>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="b-createOrder__summary">
                    <div className="b-createOrder__summary-row">
                      Вкупно парчиња: <strong>{totalPieces}</strong>
                    </div>
                    <div className="b-createOrder__summary-row is-total">
                      Вкупна цена: <strong>{totalPrice} ден</strong>{" "}
                      <sup style={{ color: "#1e87f0" }}>*</sup>
                    </div>
                  </div>

                  <Button
                    style="secondary"
                    label="креирај нарачка"
                    type="submit"
                  />
                </div>
              </>
            )}

            {/* 5. SIDEBAR SUMMARY */}
            <SidebarSummary
              totalPrice={totalPrice}
              customerName={
                selectedCustomer
                  ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                  : undefined
              }
              serviceType={
                serviceTypesData.find(
                  (s) => String(s.id) === watchedServiceTypeId,
                )?.serviceName
              }
              deliveryTypeName={
                deliveryTypesData.find(
                  (d) => String(d.id) === watchedDeliveryTypeId,
                )?.typeName
              }
              deliveryAddress={
                selectedCustomer?.customerAddresses.find(
                  (a) => a.id === watchedAddressId,
                )?.formattedAddress
              }
              customerPhone={selectedCustomer?.phoneNumber}
              pieces={watchedItems.map((item) => ({
                productTypeName:
                  productTypesData.find(
                    (p) => String(p.id) === item.productTypeId,
                  )?.name ?? "",
                quantity: Number(item.quantity) || 0,
              }))}
              scheduledDate={new Date(
                watchedScheduledDate + "T00:00:00",
              ).toLocaleDateString("mk-MK")}
            />
          </>

          {/* Hidden print templates */}
        </form>
      )}
      {lastCreatedOrder && BRAND_PRINT_MODE === "manual" && (
        <div className="b-createOrder__printButtons">
          {createOrderData.printActionGroup && (
            <PrintActionGroup
              {...createOrderData.printActionGroup}
              closeButton={{
                ...createOrderData.printActionGroup.closeButton!,
                onClick: () => navigateToAllOrders(),
              }}
              buttons={createOrderData.printActionGroup?.buttons?.map(
                (btn) => ({
                  ...btn,

                  onClick: () =>
                    btn.role === "print"
                      ? handlePrintMainTicket()
                      : handlePrintItemLabels(),
                }),
              )}
            />
          )}

          {BRAND_PRINT_MODE === "manual" && (
            <>
              <div style={{ display: "none" }}>
                <OrderPrintTemplate
                  ref={mainTicketRef}
                  order={lastCreatedOrder}
                />
              </div>
              <div style={{ display: "none" }}>
                <OrderItemsPrintTemplate
                  ref={itemLabelsRef}
                  order={lastCreatedOrder}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CreateOrder;
